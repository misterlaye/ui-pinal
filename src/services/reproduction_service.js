import { apiClient } from './api_client.js';

export async function getCycles(animalId) {
  const { data } = await apiClient.get(`/reproduction/animaux/${animalId}/cycles`);
  return data;
}

export async function declarerInsemination(payload) {
  // payload: { animalId, exploitationId, dateInsemination, methodeReproduction, identifiantTaureau }
  const { data } = await apiClient.post('/reproduction/inseminations', payload);
  return data;
}

export async function enregistrerConstat(cycleId, payload) {
  // payload: { dateConstat, resultat, veterinaire }
  const { data } = await apiClient.post(`/reproduction/cycles/${cycleId}/constat`, payload);
  return data;
}

export async function declarerVelage(cycleId, payload) {
  // payload: { dateReelle }
  const { data } = await apiClient.post(`/reproduction/cycles/${cycleId}/velage`, payload);
  return data;
}
