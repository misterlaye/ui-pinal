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
