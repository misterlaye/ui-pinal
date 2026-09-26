import { apiClient } from './api_client.js';

/**
 * Service pour le module Production.
 */

export const getProductionSummary = async () => {
  try {
    const { data } = await apiClient.get('/production/dashboard');
    return data;
  } catch (error) {
    console.error("Failed to fetch production summary", error);
    // Return empty mock if failed
    return {
      kpis: { totalProduction: 0, averagePerAnimal: 0 },
      chartData: { labels: [], currentWeek: [], previousWeek: [] },
      animalProduction: [],
      history: []
    };
  }
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
