import { COPILOT_STATES, normalizeJob } from './copilot_contract.js';

export const DEMO_SCENARIOS = Object.freeze([
  { id: 'completed', label: 'Analyse disponible' },
  { id: 'abstained', label: 'Données insuffisantes' },
  { id: 'failed', label: 'Service indisponible' },
  { id: 'stale', label: 'Nouvelles données' },
]);

const DISCLAIMER =
  'Analyse générée par IA à partir des données disponibles dans Pinal. Elle ne constitue pas un diagnostic certain.';

const COMPLETED_RESULT = Object.freeze({
  hypotheses: [
    {
      description: 'Un changement récent de ration coïncide avec la période de baisse observée.',
      evidences: [
        {
          domain: 'Nutrition',
          factType: 'MODIFICATION_RATION',
          observationDate: '2026-09-28T08:30:00Z',
          values: { information: 'Nouvelle ration enregistrée pour le lot en lactation' },
          supportLevel: 'MODERATE',
        },
      ],
    },
    {
      description: 'Un événement sanitaire récent pourrait aussi être associé à cette variation.',
      evidences: [
        {
          domain: 'Santé',
          factType: 'EVENEMENT_SANITAIRE',
          observationDate: '2026-09-29T10:15:00Z',
          values: { information: 'Fièvre signalée lors du suivi sanitaire' },
          supportLevel: 'STRONG',
        },
      ],
    },
  ],
  suggestedActions: [
    { code: 'REVIEW_RATION', label: 'Vérifier la ration', availability: 'SUGGESTION_ONLY' },
    { code: 'MONITOR_NEXT_MILKING', label: 'Surveiller la prochaine traite', availability: 'SUGGESTION_ONLY' },
  ],
  generatedAt: '2026-09-30T09:00:00Z',
  isStale: false,
  disclaimer: DISCLAIMER,
});

function terminalPayload(scenario, refreshed) {
  if (scenario === 'abstained') {
    return {
      status: COPILOT_STATES.ABSTAINED,
      abstentionReason: 'LOW_SIGNAL',
      abstentionMessage: 'Les faits disponibles sont trop peu nombreux pour relier cette anomalie à une hypothèse fiable.',
    };
  }
  if (scenario === 'failed') return { status: COPILOT_STATES.FAILED };
  if (scenario === 'stale' && !refreshed) return { status: COPILOT_STATES.STALE };
  return { status: COPILOT_STATES.COMPLETED, generatedAt: COMPLETED_RESULT.generatedAt, result: COMPLETED_RESULT };
}

export function createDemoCopilotAdapter() {
  const jobs = new Map();
  const latestByAnomaly = new Map();
  const requestsByScenario = new Map();
  let sequence = 0;

  return {
    pollingIntervalMs: 450,

    async getCapability() {
      return {
        enabled: true,
        disclosure: {
          label: 'MODE DÉMONSTRATION',
          description: 'Résultat fictif et déterministe. Aucun fournisseur LLM réel n’est appelé.',
        },
        scenarioOptions: DEMO_SCENARIOS,
      };
    },

    async requestAnalysis(anomalyId, options = {}) {
      const scenario = DEMO_SCENARIOS.some(({ id }) => id === options.scenario)
        ? options.scenario
        : 'completed';
      const requestKey = `${anomalyId}:${scenario}`;
      const requestNumber = (requestsByScenario.get(requestKey) || 0) + 1;
      requestsByScenario.set(requestKey, requestNumber);

      const rawJob = {
        jobId: `demo-job-${++sequence}`,
        anomalyId,
        status: COPILOT_STATES.PENDING,
        scenario,
        refreshed: scenario === 'stale' && requestNumber > 1,
        pollCount: 0,
      };
      jobs.set(rawJob.jobId, rawJob);
      latestByAnomaly.set(anomalyId, rawJob.jobId);
      return normalizeJob(rawJob, anomalyId);
    },

    async getLatestAnalysis(anomalyId) {
      const jobId = latestByAnomaly.get(anomalyId);
      return jobId ? normalizeJob(jobs.get(jobId), anomalyId) : null;
    },

    async getJob(jobId) {
      const current = jobs.get(jobId);
      if (!current) throw new Error('DemoCopilotJobNotFound');

      current.pollCount += 1;
      if (current.pollCount === 1) {
        current.status = COPILOT_STATES.IN_PROGRESS;
      } else {
        Object.assign(current, terminalPayload(current.scenario, current.refreshed));
      }
      return normalizeJob(current, current.anomalyId);
    },
  };
}

