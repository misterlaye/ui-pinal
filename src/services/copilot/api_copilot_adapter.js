import { apiClient } from '../api_client.js';
import { disabledCapability, normalizeJob } from './copilot_contract.js';

export function createApiCopilotAdapter(client = apiClient) {
  return {
    pollingIntervalMs: 1500,

    async getCapability() {
      const { data } = await client.get('/anomalies/ai-capability');
      return data?.enabled === true
        ? { enabled: true, disclosure: null, scenarioOptions: [] }
        : disabledCapability();
    },

    async requestAnalysis(anomalyId) {
      const { data } = await client.post(
        `/anomalies/${encodeURIComponent(anomalyId)}/interpretations`
      );
      return normalizeJob(data, anomalyId);
    },

    async getLatestAnalysis(anomalyId) {
      const response = await client.get(
        `/anomalies/${encodeURIComponent(anomalyId)}/interpretations/latest`
      );
      return response.status === 204 ? null : normalizeJob(response.data, anomalyId);
    },

    async getJob(jobId) {
      const { data } = await client.get(
        `/anomalies/interpretations/jobs/${encodeURIComponent(jobId)}`
      );
      return normalizeJob(data);
    },
  };
}

