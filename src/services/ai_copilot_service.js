import { createApiCopilotAdapter } from './copilot/api_copilot_adapter.js';
import { disabledCapability } from './copilot/copilot_contract.js';
import { createDemoCopilotAdapter } from './copilot/demo_copilot_adapter.js';

function enabled(value) {
  return String(value).toLowerCase() === 'true';
}

export function createCopilotService({
  environment = {},
  apiAdapter = createApiCopilotAdapter(),
  demoAdapter = createDemoCopilotAdapter(),
} = {}) {
  const uiEnabled = enabled(environment.VITE_COPILOT_UI_ENABLED);
  const demoMode = uiEnabled && enabled(environment.VITE_COPILOT_DEMO_MODE);
  const adapter = demoMode ? demoAdapter : apiAdapter;

  return {
    pollingIntervalMs: adapter.pollingIntervalMs,

    async getCapability() {
      if (!uiEnabled) return disabledCapability();
      return adapter.getCapability();
    },

    requestAnalysis(anomalyId, options) {
      return adapter.requestAnalysis(anomalyId, options);
    },

    getLatestAnalysis(anomalyId) {
      return adapter.getLatestAnalysis(anomalyId);
    },

    getJob(jobId) {
      return adapter.getJob(jobId);
    },
  };
}

const runtimeEnvironment = import.meta.env ?? {};
export const aiCopilotService = createCopilotService({ environment: runtimeEnvironment });

export const getAICopilotCapability = () => aiCopilotService.getCapability();
export const requestAnomalyInterpretation = (anomalyId, options) =>
  aiCopilotService.requestAnalysis(anomalyId, options);
export const getLatestAnomalyInterpretation = (anomalyId) =>
  aiCopilotService.getLatestAnalysis(anomalyId);
export const getInterpretationJob = (jobId) => aiCopilotService.getJob(jobId);
