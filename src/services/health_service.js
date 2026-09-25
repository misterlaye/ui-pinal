import { apiClient } from './api_client.js';

/**
 * Service pour le module Santé.
 */

export const getHealthDashboard = async () => {
  const { data } = await apiClient.get('/health/dashboard');
  return data;
};
