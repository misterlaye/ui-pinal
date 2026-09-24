/**
 * Mock service for Finance module data.
 * Based on the backend RentabiliteResponse schema.
 */

export const getFinanceDashboard = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    kpis: {
      coutRevient: 380,
      coutRevientTrend: -2.1,
      prixMoyenVente: 600,
      prixMoyenVenteTrend: 0,
      margeBrute: 220,
      margeBruteTrend: 5.8,
      chiffreAffaires: 285000,
      chiffreAffairesTrend: -4.2
    },
    rentability: {
      netProfit: 223200,
      netMarginPercentage: 43.9,
      trend: 11.4
    },
    chargesRepartition: {
      labels: ['Alimentation', 'Santé et Vétérinaire', 'Main d\'œuvre', 'Eau et Énergie', 'Autres'],
      data: [285000, 20000, 145000, 42000, 16000],
      colors: ['#C87533', '#EF4444', '#10B981', '#3B82F6', '#6B7280']
    },
    revenueVsCharges: {
      labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
      revenues: [450000, 480000, 490000, 470000, 510000, 530000],
      charges: [310000, 300000, 290000, 310000, 280000, 290000],
      margin: [140000, 180000, 200000, 160000, 230000, 240000]
    },
    transactions: [
      { id: 1, date: '18 juin 2024', desc: 'Vente Lait — Laiterie Sen Delta', category: 'Vente de lait', type: 'REVENU', amount: 84500 },
      { id: 2, date: '15 juin 2024', desc: 'Livraison Foin + Son de blé', category: 'Alimentation', type: 'CHARGE', amount: -145000 },
      { id: 3, date: '12 juin 2024', desc: 'Vente Lait — Marché local Thiès', category: 'Vente de lait', type: 'REVENU', amount: 56200 },
      { id: 4, date: '10 juin 2024', desc: 'Visite vétérinaire — Dr. Sarr', category: 'Santé vétérinaire', type: 'CHARGE', amount: -32000 },
      { id: 5, date: '8 juin 2024', desc: 'Livraison Tourteau d\'arachide', category: 'Alimentation', type: 'CHARGE', amount: -98500 },
      { id: 6, date: '5 juin 2024', desc: 'Salaires personnel de ferme', category: 'Main d\'œuvre', type: 'CHARGE', amount: -72500 },
      { id: 7, date: '2 juin 2024', desc: 'Vente Lait — Laiterie Sen Delta', category: 'Vente de lait', type: 'REVENU', amount: 89700 }
    ]
  };
};
