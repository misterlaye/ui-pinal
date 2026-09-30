import { apiClient } from './api_client.js';

/**
 * Service pour le module Finances.
 */
export const getFinanceDashboard = async () => {
  const { data } = await apiClient.get('/finance/dashboard');
  return data;
};

export const createCharge = async (payload) => {
  const { data } = await apiClient.post('/finance/charges', payload);
  return data;
};

export const createPrixVente = async (payload) => {
  const { data } = await apiClient.post('/finance/prix-vente', payload);
  return data;
};

export const getPrixVenteHistory = async () => {
  const { data } = await apiClient.get('/finance/prix-vente');
  return data;
};

