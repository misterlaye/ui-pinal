import { apiClient } from './api_client.js';

const mapAnimal = (backendData) => {
  return {
    id: backendData.id,
    name: backendData.nom,
    identifiant: backendData.identifiant,
    race: backendData.raceId ? 'Race (ID)' : 'Inconnue', // MOCK race for now, as backend only returns raceId
    status: backendData.statut ? backendData.statut.toLowerCase() : 'inconnu',
    trend: 'up', // MOCK trend
    age: backendData.dateNaissance ? calculateAge(backendData.dateNaissance) : 'N/A',
    lastEvent: 'Aucun événement récent', // MOCK
    avatar: backendData.photoUrl || `https://loremflickr.com/150/150/cow?lock=${Math.floor(Math.random() * 100)}`,
  };
};

const calculateAge = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const ageDt = new Date(diffMs);
  const years = Math.abs(ageDt.getUTCFullYear() - 1970);
  return years > 0 ? `${years} ans` : 'Moins d\'1 an';
};

/**
 * Récupère la liste des animaux réels
 */
export async function getAnimalsList(exploitationId) {
  const { data } = await apiClient.get(`/animals?exploitationId=${exploitationId}`);
  return data.map(mapAnimal);
}

/**
 * Crée un nouvel animal dans l'exploitation.
 */
export async function createAnimal(animalData) {
  // Map frontend payload to backend request format
  const payload = {
    exploitationId: localStorage.getItem('active_exploitation_id'),
    raceId: animalData.raceId || "10000000-0000-0000-0000-000000000001", // Fallback to Holstein UUID
    identifiant: animalData.identifiant,
    nom: animalData.name,
    photoUrl: null,
    dateNaissance: "2020-01-01" // Fallback mock birthdate
  };
  const { data } = await apiClient.post('/animals', payload);
  return mapAnimal(data);
}

/**
 * Récupère un animal par son ID.
 */
export async function getAnimal(animalId) {
  const { data } = await apiClient.get(`/animals/${animalId}`);
  return mapAnimal(data);
}

/**
 * Met à jour un animal.
 */
export async function updateAnimal(animalId, animalData) {
  const payload = {
    raceId: animalData.raceId || "10000000-0000-0000-0000-000000000001",
    identifiant: animalData.identifiant,
    nom: animalData.name,
    photoUrl: null,
    dateNaissance: "2020-01-01"
  };
  const { data } = await apiClient.patch(`/animals/${animalId}`, payload);
  return mapAnimal(data);
}

/**
 * Change le statut d'un animal.
 */
export async function changeAnimalStatus(animalId, status) {
  const { data } = await apiClient.patch(`/animals/${animalId}/status?status=${status.toUpperCase()}`);
  return data;
}

/**
 * Supprime un animal. (Backend may not support hard delete yet, checking..)
 */
export async function deleteAnimal(animalId) {
  // Wait, let's look if there is a delete endpoint in AnimalController. No there is not.
  // I will throw an error for now if it's not supported, or just keep it as a placeholder.
  throw new Error("Delete animal non implémenté dans le backend.");
}
