import { apiClient } from './api_client.js';

export async function getWorkerHomeData(exploitationId) {
  const { data } = await apiClient.get('/worker-hub/home', {
    params: { exploitationId }
  });
  return data;
}

export async function getWorkerAnimals(exploitationId) {
  const { data } = await apiClient.get('/worker-hub/animals', {
    params: { exploitationId }
  });
  return data;
}

export async function getWorkerAnimalDetail(animalId) {
  const { data } = await apiClient.get(`/worker-hub/animals/${animalId}`);
  return data;
}

export async function recordAnimalMilking(animalId, payload) {
  const { data } = await apiClient.post(`/animals/${animalId}/milkings`, payload);
  return data;
}
