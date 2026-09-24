/**
 * Mock service for Production module data.
 * Simulates aggregated data that would eventually come from the backend.
 */

export const getProductionSummary = async () => {
  // Simuler un appel API
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    kpis: {
      totalProduction: 847,
      totalProductionTrend: 15.2,
      averagePerAnimal: 9.4,
      averagePerAnimalLabel: '9.4 L pour la semaine dernière',
      bestProducer: {
        name: 'Awa',
        avatar: 'https://loremflickr.com/150/150/cow?lock=1',
        subtitle: '19.5 L/jour • Montbéliarde'
      },
      collectionRate: 98,
      collectionRateLabel: 'Objectif atteint'
    },
    chartData: {
      labels: Array.from({length: 30}, (_, i) => String(i + 1).padStart(2, '0')), // Jours 01 à 30
      currentWeek: Array.from({length: 30}, () => 800 + Math.random() * 50),
      previousWeek: Array.from({length: 30}, () => 780 + Math.random() * 60)
    },
    animalProduction: [
      { id: 1, name: 'Awa', race: 'Montbéliarde', avatar: 'https://loremflickr.com/150/150/cow?lock=1', matin: 9.8, soir: 8.7, total: 18.5, trend: 4.1, status: 'NORMAL' },
      { id: 2, name: 'Nafi', race: 'Montbéliarde', avatar: 'https://loremflickr.com/150/150/cow?lock=2', matin: 8.5, soir: 7.7, total: 16.2, trend: 2.8, status: 'NORMAL' },
      { id: 3, name: 'Dioro', race: 'Gudali', avatar: 'https://loremflickr.com/150/150/cow?lock=3', matin: 7.5, soir: 6.5, total: 14.0, trend: -3.4, status: 'NORMAL' },
      { id: 4, name: 'Fatou', race: 'Gudal', avatar: 'https://loremflickr.com/150/150/cow?lock=4', matin: 6.8, soir: 6.0, total: 12.8, trend: 1.9, status: 'NORMAL' },
      { id: 5, name: 'Penda', race: 'Gudali', avatar: 'https://loremflickr.com/150/150/cow?lock=5', matin: 3.5, soir: 2.9, total: 6.4, trend: -32.0, status: 'ALERTE' },
      { id: 6, name: 'Sira', race: 'Gudal', avatar: 'https://loremflickr.com/150/150/cow?lock=6', matin: 0.0, soir: 8.5, total: 8.5, trend: -16.5, status: 'ALERTE' },
      { id: 7, name: 'Mariama', race: 'Montbéliarde', avatar: 'https://loremflickr.com/150/150/cow?lock=7', matin: 6.0, soir: 5.4, total: 11.4, trend: 3.2, status: 'NORMAL' },
      { id: 8, name: 'Khady', race: 'Gudal', avatar: 'https://loremflickr.com/150/150/cow?lock=8', matin: 5.7, soir: 5.2, total: 10.9, trend: 7.1, status: 'NORMAL' },
      { id: 9, name: 'Aissatou', race: 'Montbéliarde', avatar: 'https://loremflickr.com/150/150/cow?lock=9', matin: 5.2, soir: 4.6, total: 9.8, trend: 1.4, status: 'NORMAL' }
    ],
    history: [
      {
        dayLabel: "Aujourd'hui",
        date: "12 juin 2024",
        milkings: [
          { type: 'matin', time: '06:15 - 07:30', cowsCount: 12, volume: 62.7 },
          { type: 'soir', time: '17:30 - 18:45', cowsCount: 12, volume: 55.4 }
        ]
      },
      {
        dayLabel: "Hier",
        date: "11 juin 2024",
        milkings: [
          { type: 'matin', time: '06:10 - 07:25', cowsCount: 12, volume: 61.3 },
          { type: 'soir', time: '17:35 - 18:40', cowsCount: 12, volume: 53.6 }
        ]
      },
      {
        dayLabel: "Avant-hier",
        date: "10 juin 2024",
        milkings: [
          { type: 'matin', time: '06:20 - 07:35', cowsCount: 12, volume: 60.8 },
          { type: 'soir', time: '17:25 - 18:35', cowsCount: 12, volume: 54.9 }
        ]
      }
    ]
  };
};
