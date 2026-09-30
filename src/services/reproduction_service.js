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

export async function declarerAvortement(cycleId) {
  const { data } = await apiClient.post(`/reproduction/cycles/${cycleId}/avortement`);
  return data;
}

// V1 Helper: Fetch all reproduction cycles for an entire exploitation
export async function getExploitationCycles(exploitationId) {
  // 1. Get all animals for the exploitation
  const { data: animals } = await apiClient.get('/animals', { params: { exploitationId } });
  
  // Only consider active female animals for reproduction
  const females = animals
    .filter(a => a.sexe === 'FEMELLE' && (a.statut === 'ACTIF' || a.status === 'ACTIF'))
    .map(a => ({
      ...a,
      nom: a.nom || a.name,
      name: a.nom || a.name,
      statut: a.statut || a.status,
      status: a.statut || a.status
    }));
  
  // 2. Fetch cycles for each female
  const cyclePromises = females.map(async (animal) => {
    try {
      const cycles = await getCycles(animal.id);
      return cycles.map(c => ({ ...c, animal })); // attach animal info to cycle
    } catch (e) {
      console.error(`Failed to fetch cycles for animal ${animal.id}`, e);
      return [];
    }
  });

  const nestedCycles = await Promise.all(cyclePromises);
  const allCycles = nestedCycles.flat();

  return { animals: females, cycles: allCycles };
}
