import { computed, inject, onScopeDispose, ref, unref, watch } from 'vue';
import { aiCopilotService } from '../../../services/ai_copilot_service.js';
import { COPILOT_STATES } from '../../../services/copilot/copilot_contract.js';
import { createCopilotPoller } from './copilotPolling.js';

export const COPILOT_SERVICE_KEY = Symbol('copilot-service');

export function useCopilot({ anomalyId, capability, service } = {}) {
  const resolvedService = service || inject(COPILOT_SERVICE_KEY, aiCopilotService);
  const job = ref(null);
  const loadingLatest = ref(false);
  const requesting = ref(false);
  const transientError = ref('');
  const selectedScenario = ref(null);
  let loadGeneration = 0;

  const available = computed(() => unref(capability)?.enabled === true);
  const scenarioOptions = computed(() => unref(capability)?.scenarioOptions || []);
  const disclosure = computed(() => unref(capability)?.disclosure || null);
  const state = computed(() => job.value?.status || 'IDLE');

  const poller = createCopilotPoller({
    fetchJob: (jobId) => resolvedService.getJob(jobId),
    onUpdate: (nextJob) => {
      job.value = nextJob;
      transientError.value = '';
    },
    onError: (error) => {
      if (error?.name === 'CopilotPollingTimeoutError') {
        job.value = { ...job.value, status: COPILOT_STATES.FAILED };
        transientError.value = 'L’analyse prend plus de temps que prévu. Vous pouvez la relancer.';
      } else {
        transientError.value = 'Connexion momentanément interrompue. Pinal poursuit la vérification.';
      }
    },
    intervalMs: resolvedService.pollingIntervalMs,
  });

  function syncScenario() {
    const options = scenarioOptions.value;
    if (!options.some(({ id }) => id === selectedScenario.value)) {
      selectedScenario.value = options[0]?.id || null;
    }
  }

  async function loadLatest() {
    const generation = ++loadGeneration;
    poller.stop();
    job.value = null;
    transientError.value = '';
    syncScenario();
    if (!available.value || !unref(anomalyId)) return;

    loadingLatest.value = true;
    try {
      const latest = await resolvedService.getLatestAnalysis(unref(anomalyId));
      if (generation !== loadGeneration) return;
      job.value = latest;
      if (latest && [COPILOT_STATES.PENDING, COPILOT_STATES.IN_PROGRESS].includes(latest.status)) {
        poller.start(latest.jobId);
      }
    } catch {
      if (generation === loadGeneration) {
        transientError.value = 'L’état de l’analyse IA est temporairement indisponible.';
      }
    } finally {
      if (generation === loadGeneration) loadingLatest.value = false;
    }
  }

  async function requestAnalysis() {
    if (
      requesting.value ||
      [COPILOT_STATES.PENDING, COPILOT_STATES.IN_PROGRESS].includes(job.value?.status)
    ) {
      return job.value;
    }

    requesting.value = true;
    transientError.value = '';
    try {
      const created = await resolvedService.requestAnalysis(unref(anomalyId), {
        scenario: selectedScenario.value,
      });
      job.value = created;
      poller.start(created.jobId);
      return created;
    } catch {
      job.value = { status: COPILOT_STATES.FAILED };
      return job.value;
    } finally {
      requesting.value = false;
    }
  }

  function selectScenario(scenarioId) {
    if (!scenarioOptions.value.some(({ id }) => id === scenarioId)) return;
    selectedScenario.value = scenarioId;
    loadGeneration += 1;
    poller.stop();
    job.value = null;
    transientError.value = '';
  }

  function cleanup() {
    loadGeneration += 1;
    poller.stop();
  }

  watch([() => unref(anomalyId), available], loadLatest, { immediate: true });
  watch(scenarioOptions, syncScenario);
  onScopeDispose(cleanup);

  return {
    job,
    state,
    available,
    disclosure,
    scenarioOptions,
    selectedScenario,
    loadingLatest,
    requesting,
    transientError,
    requestAnalysis,
    selectScenario,
    reload: loadLatest,
    cleanup,
  };
}

