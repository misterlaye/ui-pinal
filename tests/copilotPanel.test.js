import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import AICopilotPanel from '../src/features/dashboard/components/AICopilotPanel.vue';
import { COPILOT_SERVICE_KEY } from '../src/features/dashboard/composables/useCopilot.js';
import { createCopilotService } from '../src/services/ai_copilot_service.js';
import { createDemoCopilotAdapter } from '../src/services/copilot/demo_copilot_adapter.js';

const anomaly = { id: 'anomaly-demo', titre: 'Baisse de production' };
const capability = { enabled: true, disclosure: null, scenarioOptions: [] };

const completedResult = {
  hypotheses: [
    {
      description: 'Une modification de ration coïncide avec la variation.',
      evidences: [
        {
          domain: 'Nutrition',
          factType: 'MODIFICATION_RATION',
          observationDate: '2026-09-28T08:30:00Z',
          supportLevel: 'MODERATE',
          values: { information: 'Ration enregistrée' },
        },
      ],
    },
  ],
  suggestedActions: [
    { code: 'REVIEW_RATION', label: 'Vérifier la ration', availability: 'SUGGESTION_ONLY' },
  ],
  generatedAt: '2026-09-30T09:00:00Z',
  disclaimer: 'Analyse générée par IA à partir des données disponibles dans Pinal.',
};

function createService(latest) {
  return {
    pollingIntervalMs: 60000,
    getLatestAnalysis: vi.fn(async () => latest),
    getJob: vi.fn(() => new Promise(() => {})),
    requestAnalysis: vi.fn(),
  };
}

async function mountPanel(latest, overrides = {}) {
  const service = { ...createService(latest), ...overrides };
  const wrapper = mount(AICopilotPanel, {
    props: { anomaly, capability },
    global: { provide: { [COPILOT_SERVICE_KEY]: service } },
  });
  await flushPromises();
  return { wrapper, service };
}

describe('AICopilotPanel', () => {
  it('affiche IDLE avec le bénéfice et le CTA contextuel', async () => {
    const { wrapper } = await mountPanel(null);
    expect(wrapper.text()).toContain('rapprocher les faits enregistrés');
    expect(wrapper.get('button').text()).toBe('Analyser avec l’IA');
    wrapper.unmount();
  });

  it.each([
    ['PENDING', 'Demande enregistrée. L’analyse va commencer…'],
    ['IN_PROGRESS', 'Analyse en cours… Vous pouvez continuer à utiliser Pinal.'],
    ['ABSTAINED', 'Pinal ne dispose pas de suffisamment de données pour proposer une interprétation.'],
    ['FAILED', 'L’analyse IA est temporairement indisponible.'],
    ['STALE', 'De nouvelles données sont disponibles.'],
  ])('rend explicitement l’état %s', async (status, expectedText) => {
    const job = {
      jobId: `job-${status}`,
      anomalyId: anomaly.id,
      status,
      abstentionMessage: status === 'ABSTAINED' ? 'Signal insuffisant.' : null,
      result: null,
    };
    const { wrapper } = await mountPanel(job);
    expect(wrapper.text()).toContain(expectedText);
    if (status === 'STALE') expect(wrapper.get('button').text()).toBe('Actualiser l’analyse');
    wrapper.unmount();
  });

  it('rend le résultat validé selon la hiérarchie hypothèse, preuve, action et limitation', async () => {
    const { wrapper } = await mountPanel({
      jobId: 'job-completed',
      anomalyId: anomaly.id,
      status: 'COMPLETED',
      result: completedResult,
    });

    expect(wrapper.text()).toContain('Analyse IA');
    expect(wrapper.text()).toContain('Hypothèses possibles');
    expect(wrapper.text()).toContain('Pourquoi cette hypothèse ?');
    expect(wrapper.text()).toContain('Nutrition · modification ration');
    expect(wrapper.text()).toContain('Actions suggérées');
    expect(wrapper.text()).toContain('Vérifier la ration');
    expect(wrapper.text()).toContain('Suggestion uniquement');
    expect(wrapper.text()).toContain(completedResult.disclaimer);
    expect(wrapper.text()).not.toContain('referencedEvidenceIds');
    expect(wrapper.findAll('button')).toHaveLength(0);
    wrapper.unmount();
  });

  it('identifie visiblement les fixtures comme une démonstration sans LLM réel', async () => {
    const demoCapability = {
      enabled: true,
      disclosure: {
        label: 'MODE DÉMONSTRATION',
        description: 'Résultat fictif et déterministe. Aucun fournisseur LLM réel n’est appelé.',
      },
      scenarioOptions: [{ id: 'completed', label: 'Analyse disponible' }],
    };
    const service = createService(null);
    const wrapper = mount(AICopilotPanel, {
      props: { anomaly, capability: demoCapability },
      global: { provide: { [COPILOT_SERVICE_KEY]: service } },
    });
    await flushPromises();

    expect(wrapper.text()).toContain('MODE DÉMONSTRATION');
    expect(wrapper.text()).toContain('Résultat fictif et déterministe');
    expect(wrapper.get('label').text()).toBe('Scénario de démonstration');
    wrapper.unmount();
  });

  it('ignore un double déclenchement et poursuit vers l’état terminal', async () => {
    let resolveRequest;
    const requestPromise = new Promise((resolve) => { resolveRequest = resolve; });
    const service = createService(null);
    service.pollingIntervalMs = 0;
    service.requestAnalysis = vi.fn(() => requestPromise);
    service.getJob = vi.fn(async () => ({
      jobId: 'job-double',
      anomalyId: anomaly.id,
      status: 'COMPLETED',
      result: completedResult,
    }));

    const wrapper = mount(AICopilotPanel, {
      props: { anomaly, capability },
      global: { provide: { [COPILOT_SERVICE_KEY]: service } },
    });
    await flushPromises();
    const button = wrapper.get('button');
    await Promise.all([button.trigger('click'), button.trigger('click')]);
    expect(service.requestAnalysis).toHaveBeenCalledTimes(1);

    resolveRequest({ jobId: 'job-double', anomalyId: anomaly.id, status: 'PENDING', result: null });
    await flushPromises();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await flushPromises();
    expect(service.getJob).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('Hypothèses possibles');
    wrapper.unmount();
  });

  it('joue le parcours démo complet IDLE, PENDING, IN_PROGRESS puis COMPLETED', async () => {
    const demoAdapter = createDemoCopilotAdapter();
    demoAdapter.pollingIntervalMs = 40;
    const service = createCopilotService({
      environment: { VITE_COPILOT_UI_ENABLED: 'true', VITE_COPILOT_DEMO_MODE: 'true' },
      apiAdapter: {},
      demoAdapter,
    });
    const demoCapability = await service.getCapability();
    const wrapper = mount(AICopilotPanel, {
      props: { anomaly, capability: demoCapability },
      global: { provide: { [COPILOT_SERVICE_KEY]: service } },
    });
    await flushPromises();
    expect(wrapper.text()).toContain('Analyser avec l’IA');

    await wrapper.get('button').trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('Demande enregistrée');

    await new Promise((resolve) => setTimeout(resolve, 55));
    await flushPromises();
    expect(wrapper.text()).toContain('Analyse en cours');

    await new Promise((resolve) => setTimeout(resolve, 55));
    await flushPromises();
    expect(wrapper.text()).toContain('Hypothèses possibles');
    expect(wrapper.text()).toContain('Nouvelle ration enregistrée pour le lot en lactation');
    wrapper.unmount();
  });
});
