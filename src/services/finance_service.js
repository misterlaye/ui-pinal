import { apiClient } from './api_client.js';

/**
 * Service pour le module Finances.
 */
export const getFinanceDashboard = async () => {
  try {
    // 1. Fetch real latest rentability from backend
    const { data: rentabilite } = await apiClient.get('/finance/rentabilite/latest');
    
    // Fetch transactions
    const { data: transactions } = await apiClient.get('/finance/transactions');

    // 2. Map real backend data to frontend expected format
    return {
      kpis: {
        ca: rentabilite.chiffreAffaires,
        caTrend: 0, // Mock
        margin: rentabilite.marge,
        marginTrend: 0, // Mock
        unitCost: rentabilite.coutRevientParLitre,
        unitCostTrend: 0, // Mock
        rentability: rentabilite.chiffreAffaires ? (rentabilite.marge / rentabilite.chiffreAffaires) * 100 : 0,
        rentabilityTrend: 0, // Mock
      },
      charts: {
        // ENCORE MOCKÉ : Historique financier non disponible
        revenueLabels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
        revenueData: [120000, 150000, 130000, 180000],
        costData: [80000, 95000, 85000, 100000],
      },
      transactions: transactions,
      rentabilityAnalysis: {
        totalRevenue: rentabilite.chiffreAffaires,
        totalCosts: rentabilite.coutTotal,
        feedCosts: rentabilite.coutAlimentation,
        healthCosts: rentabilite.autresCharges, // Assuming autres charges = health/etc.
        otherCosts: 0,
        netProfit: rentabilite.marge
      }
    };
  } catch (error) {
    if (error.response?.status === 404) {
      // Pas de données de rentabilité, fallback sur des données vierges / mock initial
      return getMockFinanceDashboard();
    }
    throw error;
  }
};

const getMockFinanceDashboard = () => {
  return {
    kpis: { ca: 0, caTrend: 0, margin: 0, marginTrend: 0, unitCost: 0, unitCostTrend: 0, rentability: 0, rentabilityTrend: 0 },
    charts: { revenueLabels: [], revenueData: [], costData: [] },
    transactions: [],
    rentabilityAnalysis: { totalRevenue: 0, totalCosts: 0, feedCosts: 0, healthCosts: 0, otherCosts: 0, netProfit: 0 }
  };
};
