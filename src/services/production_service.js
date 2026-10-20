import { apiClient, apiClientLong } from './api_client.js';

/**
 * Service pour le module Production.
 */

// Une erreur est propagée à l'écran appelant : elle ne doit jamais s'afficher comme une production nulle.
export const getProductionSummary = async () => {
  const { data } = await apiClientLong.get('/production/dashboard');
  return data;
};

export const recordBatchMilking = async (payload) => {
  const { data } = await apiClient.post('/milkings/batch', payload);
  return data;
};

export const getLactationCurve = async (lactationId) => {
  const { data } = await apiClient.get(`/lactations/${lactationId}/milkings/courbe`);
  return data;
};

export const recordMilkAnalysis = async (lactationId, payload) => {
  const { data } = await apiClient.post(`/lactations/${lactationId}/analyses`, payload);
  return data;
};

export const tarirLactation = async (animalId) => {
  const { data } = await apiClient.post(`/lactations/animals/${animalId}/tarir`);
  return data;
};

// 204 (aucune lactation en cours) -> null ; une véritable erreur est propagée.
export const getActiveLactation = async (animalId) => {
  const { data } = await apiClient.get(`/lactations/animals/${animalId}/active`);
  return data || null;
};

export const getMilkAnalyses = async (lactationId) => {
  const { data } = await apiClient.get(`/lactations/${lactationId}/analyses`);
  return data;
};

