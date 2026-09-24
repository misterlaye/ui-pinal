/**
 * Mock service for Nutrition module data.
 */

export const getNutritionDashboard = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    kpis: {
      dailyCost: 285000,
      dailyCostTrend: 4.2,
      averageRation: 12.5,
      averageRationLabel: 'Toutes catégories confondues',
      stockRemaining: 18,
      stockRemainingLabel: 'Commande recommandée',
      efficiency: 2.1,
      efficiencyLabel: 'Bonne conversion alimentaire'
    },
    rationGroups: [
      {
        id: 1,
        name: 'Vaches lactation haute production',
        cowsCount: 15,
        ingredients: [
          { name: 'Fourrage', qty: 14, unit: 'kg' },
          { name: 'Concentré', qty: 6.5, unit: 'kg' },
          { name: 'Minéraux', qty: 0.3, unit: 'kg' },
          { name: 'Eau', qty: 95, unit: 'L' }
        ],
        costPerCow: 1850
      },
      {
        id: 2,
        name: 'Vaches en lactation standard',
        cowsCount: 22,
        ingredients: [
          { name: 'Fourrage', qty: 12, unit: 'kg' },
          { name: 'Concentré', qty: 4.2, unit: 'kg' },
          { name: 'Minéraux', qty: 0.2, unit: 'kg' },
          { name: 'Eau', qty: 70, unit: 'L' }
        ],
        costPerCow: 1320
      },
      {
        id: 3,
        name: 'Vaches taries',
        cowsCount: 8,
        ingredients: [
          { name: 'Fourrage', qty: 10, unit: 'kg' },
          { name: 'Concentré', qty: 1.5, unit: 'kg' },
          { name: 'Minéraux', qty: 0.15, unit: 'kg' },
          { name: 'Eau', qty: 55, unit: 'L' }
        ],
        costPerCow: 780
      }
    ],
    stocks: [
      { id: 1, name: 'Foin', stock: 2240, unit: 'kg', dailyCons: 150, daysLeft: 14, status: 'STOCK BAS', iconColor: '#10B981' },
      { id: 2, name: 'Tourteau d\'arachide', stock: 1200, unit: 'kg', dailyCons: 55, daysLeft: 21, status: 'OK', iconColor: '#C87533' },
      { id: 3, name: 'Son de blé', stock: 310, unit: 'kg', dailyCons: 70, daysLeft: 4, status: 'CRITIQUE', iconColor: '#EF4444' },
      { id: 4, name: 'Mélasse', stock: 640, unit: 'L', dailyCons: 14, daysLeft: 45, status: 'OK', iconColor: '#10B981' },
      { id: 5, name: 'Bloc minéral', stock: 85, unit: 'kg', dailyCons: 6, daysLeft: 14, status: 'STOCK BAS', iconColor: '#F59E0B' }
    ],
    deliveries: [
      { id: 1, supplier: 'Coopérative Agricole de Thiès', items: 'Foin (2 000 kg) + Son de blé (500 kg)', date: '18 juin 2024', amount: 145000 },
      { id: 2, supplier: 'SENEGRAINS Distribution', items: 'Tourteau d\'arachide (1 500 kg)', date: '5 juin 2024', amount: 98500 },
      { id: 3, supplier: 'Minoterie du Cayor', items: 'Mélasse (800 L) + Bloc minéral (100 kg)', date: '22 mai 2024', amount: 62000 },
      { id: 4, supplier: 'Coopérative Agricole de Thiès', items: 'Foin (1 500 kg)', date: '12 mai 2024', amount: 112000 }
    ]
  };
};
