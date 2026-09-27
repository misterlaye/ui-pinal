import { apiClient } from './api_client.js';

/**
 * Service pour le module Nutrition.
 */

export const getNutritionDashboard = async () => {
  const { data } = await apiClient.get('/nutrition/dashboard');
  return data;
};

export const getAliments = async () => {
  const { data } = await apiClient.get('/aliments');
  return data;
};

export const createAliment = async (payload) => {
  const { data } = await apiClient.post('/aliments', payload);
  return data;
};

export const getAnimalRations = async (animalId, page = 0, size = 20) => {
  const { data } = await apiClient.get(`/animals/${animalId}/rations`, { params: { page, size } });
  return data;
};

export const createRation = async (animalId, payload) => {
  const { data } = await apiClient.post(`/animals/${animalId}/rations`, payload);
  return data;
};

export const addRationLine = async (animalId, rationId, payload) => {
  const { data } = await apiClient.post(`/animals/${animalId}/rations/${rationId}/lines`, payload);
  return data;
};

export const activateRation = async (animalId, rationId) => {
  const { data } = await apiClient.post(`/animals/${animalId}/rations/${rationId}/activate`);
  return data;
};

export const terminateRation = async (animalId, rationId, payload) => {
  const { data } = await apiClient.post(`/animals/${animalId}/rations/${rationId}/terminate`, payload);
  return data;
};

export const getRationCost = async (animalId, rationId, date) => {
  const { data } = await apiClient.get(`/animals/${animalId}/rations/${rationId}/cost`, { params: { date } });
  return data;
};

export const createAlimentPrice = async (alimentId, payload) => {
  const { data } = await apiClient.post(`/aliments/${alimentId}/prices`, payload);
  return data;
};

export const getAlimentPrices = async (alimentId) => {
  const { data } = await apiClient.get(`/aliments/${alimentId}/prices`);
  return data;
};
