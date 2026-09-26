import { apiClient } from './api_client.js';
import defaultCow from '../assets/images/default_cow.jpg';

const mapAnimal = (backendData) => {
  return {
    id: backendData.id,
    name: backendData.nom,
    identifiant: backendData.identifiant,
    raceId: backendData.raceId,
    status: backendData.statut,
    trend: null, // Sera implémenté dans la phase production/santé
    dateNaissance: backendData.dateNaissance,
    age: backendData.dateNaissance ? calculateAge(backendData.dateNaissance) : 'N/A',
    lastEvent: 'Aucun événement récent', // MOCK
    avatar: backendData.photoUrl || defaultCow,
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
  const payload = {
    exploitationId: localStorage.getItem('active_exploitation_id'),
    raceId: animalData.raceId,
    identifiant: animalData.identifiant,
    nom: animalData.nom || animalData.name,
    photoUrl: null,
    dateNaissance: animalData.dateNaissance || null,
    mereId: animalData.mereId || null,
    pereIdentifiant: animalData.pereIdentifiant || null
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
    raceId: animalData.raceId,
    identifiant: animalData.identifiant,
    nom: animalData.nom || animalData.name,
    photoUrl: null,
    dateNaissance: animalData.dateNaissance || null,
    mereId: animalData.mereId || null,
    pereIdentifiant: animalData.pereIdentifiant || null
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
 * Supprime un animal.
 */
export async function deleteAnimal(animalId) {
  const { data } = await apiClient.delete(`/animals/${animalId}`);
  return data;
}

/**
 * Déclare une sortie (Vente / Décès)
 */
export async function declareSortie(animalId, payload) {
  const { data } = await apiClient.post(`/animals/${animalId}/sortie`, payload);
  return data;
}
