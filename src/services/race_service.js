import { apiClient } from './api_client.js';

export async function getActiveRaces() {
  const { data } = await apiClient.get('/races');
  return data;
}
