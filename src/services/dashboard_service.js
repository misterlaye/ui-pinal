import { apiClient } from './api_client.js';

export async function getDashboardSummary() {
  const { data } = await apiClient.get('/dashboard/summary');
  return data;
}

export async function getDashboardAnomalies() {
  const { data } = await apiClient.get('/dashboard/anomalies');
  return data;
}
