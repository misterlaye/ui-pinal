import { apiClientLong } from './api_client.js';

export async function getDashboardSummary() {
  const { data } = await apiClientLong.get('/dashboard/summary');
  return data;
}

export async function getDashboardAnomalies() {
  const { data } = await apiClientLong.get('/dashboard/anomalies');
  return data;
}
