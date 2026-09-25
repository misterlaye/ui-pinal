import { apiClient } from './api_client.js';

/**
 * Service pour le module Nutrition.
 */

export const getNutritionDashboard = async () => {
  const { data } = await apiClient.get('/nutrition/dashboard');
  return data;
};
