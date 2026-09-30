import { apiClient } from './api_client.js';

/**
 * Service pour le module Santé.
 */

export const getHealthDashboard = async () => {
  const { data } = await apiClient.get('/health/dashboard');
  return data;
};

export const getAnimalHealthEvents = async (animalId) => {
  const { data } = await apiClient.get(`/animals/${animalId}/health-events`);
  return data;
};

/**
 * Déclare un événement sanitaire complet (POST puis PATCH si informations complémentaires).
 */
export const recordHealthEvent = async (animalId, payload) => {
  // 1. Création de base
  const createPayload = {
    dateHeure: new Date().toISOString(),
    description: payload.description
  };
  
  if (payload.date) {
    createPayload.dateHeure = new Date(payload.date).toISOString();
  }
  
  const createRes = await apiClient.post(`/animals/${animalId}/health-events`, createPayload);
  const eventId = createRes.data.id;

  // 2. Mise à jour avec les infos complémentaires si existantes
  if (payload.diagnostic || payload.traitement || payload.dateFin) {
    const patchPayload = {
      description: payload.description,
      diagnostic: payload.diagnostic || null,
      traitement: payload.traitement || null,
      dateFin: payload.dateFin || null
    };
    await apiClient.patch(`/animals/${animalId}/health-events/${eventId}`, patchPayload);
  }

  return eventId;
};

/**
 * Clôture une alerte santé.
 */
export const resolveHealthAlert = async (animalId, eventId, payload) => {
  const { data } = await apiClient.patch(`/animals/${animalId}/health-events/${eventId}`, payload);
  return data;
};
