import { describe, expect, it, vi } from 'vitest';
import { createCopilotService } from '../src/services/ai_copilot_service.js';
import { createApiCopilotAdapter } from '../src/services/copilot/api_copilot_adapter.js';
import { createDemoCopilotAdapter } from '../src/services/copilot/demo_copilot_adapter.js';

describe('Copilot frontend service', () => {
  it('reste désactivé et ne contacte aucun adaptateur sans feature flag UI', async () => {
    const apiAdapter = { getCapability: vi.fn() };
    const service = createCopilotService({ environment: {}, apiAdapter, demoAdapter: {} });

    await expect(service.getCapability()).resolves.toEqual({
      enabled: false,
      disclosure: null,
      scenarioOptions: [],
    });
    expect(apiAdapter.getCapability).not.toHaveBeenCalled();
  });

  it('sélectionne explicitement le mode démo avec ses deux flags', async () => {
    const apiAdapter = { getCapability: vi.fn(), pollingIntervalMs: 1500 };
    const demoAdapter = createDemoCopilotAdapter();
    const service = createCopilotService({
      environment: { VITE_COPILOT_UI_ENABLED: 'true', VITE_COPILOT_DEMO_MODE: 'true' },
      apiAdapter,
      demoAdapter,
    });

    const capability = await service.getCapability();
    expect(capability.enabled).toBe(true);
    expect(capability.disclosure.label).toBe('MODE DÉMONSTRATION');
    expect(capability.disclosure.description).toContain('Aucun fournisseur LLM réel');
    expect(apiAdapter.getCapability).not.toHaveBeenCalled();
  });

  it('reproduit PENDING, IN_PROGRESS puis COMPLETED avec des fixtures déterministes', async () => {
    const adapter = createDemoCopilotAdapter();
    const pending = await adapter.requestAnalysis('anomaly-1', { scenario: 'completed' });
    const inProgress = await adapter.getJob(pending.jobId);
    const completed = await adapter.getJob(pending.jobId);

    expect([pending.status, inProgress.status, completed.status]).toEqual([
      'PENDING',
      'IN_PROGRESS',
      'COMPLETED',
    ]);
    expect(completed.result.hypotheses).toHaveLength(2);
    expect(completed.result.suggestedActions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'REVIEW_RATION', label: 'Vérifier la ration' }),
      ])
    );
    expect(JSON.stringify(completed)).not.toMatch(/referencedEvidenceIds|rawOutput|prompt/i);
  });

  it.each([
    ['abstained', 'ABSTAINED'],
    ['failed', 'FAILED'],
    ['stale', 'STALE'],
  ])('expose le scénario %s comme état %s', async (scenario, expectedStatus) => {
    const adapter = createDemoCopilotAdapter();
    const pending = await adapter.requestAnalysis(`anomaly-${scenario}`, { scenario });
    await adapter.getJob(pending.jobId);
    const terminal = await adapter.getJob(pending.jobId);
    expect(terminal.status).toBe(expectedStatus);
  });

  it('actualise une analyse STALE vers une analyse COMPLETED', async () => {
    const adapter = createDemoCopilotAdapter();
    const staleRequest = await adapter.requestAnalysis('anomaly-stale-refresh', { scenario: 'stale' });
    await adapter.getJob(staleRequest.jobId);
    expect((await adapter.getJob(staleRequest.jobId)).status).toBe('STALE');

    const refreshRequest = await adapter.requestAnalysis('anomaly-stale-refresh', { scenario: 'stale' });
    await adapter.getJob(refreshRequest.jobId);
    expect((await adapter.getJob(refreshRequest.jobId)).status).toBe('COMPLETED');
  });

  it('normalise le contrat HTTP réel sans exposer les champs bruts inconnus', async () => {
    const client = {
      get: vi.fn(async (url) => {
        if (url.endsWith('/latest')) return { status: 204 };
        return {
          data: {
            jobId: 'job-api',
            anomalyId: 'anomaly/1',
            status: 'COMPLETED',
            provider: 'internal-provider-name',
            rawOutput: 'raw model output',
            result: {
              hypotheses: [{ description: 'Hypothèse validée', evidences: [] }],
              suggestedActions: [{ code: 'VET_CONSULT', label: 'Consulter un vétérinaire' }],
              limitation: 'Interprétation prudente.',
            },
          },
        };
      }),
      post: vi.fn(async () => ({ data: { jobId: 'job-api', status: 'PENDING' } })),
    };
    const adapter = createApiCopilotAdapter(client);

    const created = await adapter.requestAnalysis('anomaly/1');
    const latest = await adapter.getLatestAnalysis('anomaly/1');
    const completed = await adapter.getJob('job-api');

    expect(client.post).toHaveBeenCalledWith('/anomalies/anomaly%2F1/interpretations');
    expect(latest).toBeNull();
    expect(completed.result.disclaimer).toBe('Interprétation prudente.');
    expect(completed).not.toHaveProperty('provider');
    expect(completed).not.toHaveProperty('rawOutput');
    expect(created).toMatchObject({ anomalyId: 'anomaly/1', status: 'PENDING' });
  });
});

