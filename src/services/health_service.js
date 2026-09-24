/**
 * Mock service for Health (Santé) module data.
 */

export const getHealthDashboard = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    kpis: {
      alertsCount: 2,
      alertsSubtitle: 'Penda, Sira • surveillance requise',
      vaccinationsRatio: '10/12',
      vaccinationsSubtitle: '2 rappels à planifier',
      nextVisit: '5 jours',
      nextVisitSubtitle: 'Dr. Sarr • visite de routine',
      healthScore: 87,
      healthScoreSubtitle: 'Bon état sanitaire général'
    },
    alerts: [
      {
        id: 'al-1',
        animalId: 5,
        name: 'Penda',
        avatar: 'https://loremflickr.com/150/150/cow?lock=5',
        level: 'RISQUE ÉLEVÉ',
        description: 'Chute de production suspecte (-32.0% en 24h). Analyse IA : risque de mammite clinique ou stress thermique. Isolement conseillé et contrôle de la température corporelle.',
        time: 'Détecté aujourd\'hui à 07:45'
      },
      {
        id: 'al-2',
        animalId: 6,
        name: 'Sira',
        avatar: 'https://loremflickr.com/150/150/cow?lock=6',
        level: 'SURVEILLANCE',
        description: 'Absence de traite du matin constatée. Analyse IA : anomalie de comportement ou boiterie potentielle. Vérification physique recommandée avant la prochaine traite.',
        time: 'Détecté aujourd\'hui à 06:30'
      }
    ],
    history: [
      { id: 1, name: 'Penda', avatar: 'https://loremflickr.com/150/150/cow?lock=5', date: '12 juin', traitement: 'Antibiotique', motif: 'Suspicion mammite', veto: 'Dr. Sarr', status: 'EN COURS' },
      { id: 2, name: 'Nafi', avatar: 'https://loremflickr.com/150/150/cow?lock=2', date: '8 juin', traitement: 'Vermifuge', motif: 'Traitement de routine', veto: 'Dr. Sarr', status: 'TERMINÉ' },
      { id: 3, name: 'Diara', avatar: 'https://loremflickr.com/150/150/cow?lock=3', date: '3 juin', traitement: 'Vaccin FCO', motif: 'Rappel annuel', veto: 'Dr. Ndiaye', status: 'TERMINÉ' },
      { id: 4, name: 'Sira', avatar: 'https://loremflickr.com/150/150/cow?lock=6', date: '12 juin', traitement: 'Examen clinique', motif: 'Boiterie suspectée', veto: 'Dr. Sarr', status: 'EN COURS' },
      { id: 5, name: 'Mariama', avatar: 'https://loremflickr.com/150/150/cow?lock=7', date: '28 mai', traitement: 'Vitamines', motif: 'Complément post-vêlage', veto: 'Dr. Ndiaye', status: 'TERMINÉ' }
    ],
    vaccinations: [
      { id: 1, name: 'Awa', avatar: 'https://loremflickr.com/150/150/cow?lock=1', vaccine: 'Vaccin Charbon symptomatique', date: '18 juin', isUrgent: true },
      { id: 2, name: 'Fatou', avatar: 'https://loremflickr.com/150/150/cow?lock=4', vaccine: 'Vaccin Pasteurellose', date: '22 juin', isUrgent: false },
      { id: 3, name: 'Khady', avatar: 'https://loremflickr.com/150/150/cow?lock=8', vaccine: 'Rappel Fièvre aphteuse', date: '30 juin', isUrgent: false },
      { id: 4, name: 'Aissatou', avatar: 'https://loremflickr.com/150/150/cow?lock=9', vaccine: 'Vaccin Charbon symptomatique', date: '5 juil.', isUrgent: false }
    ],
    thermalStress: {
      averageTemp: 31,
      season: 'SAISON SÈCHE',
      location: 'Thiès, Sénégal',
      riskLevel: 'Modéré',
      riskScore: 64,
      recommendations: [
        'Assurer un accès permanent à l\'ombre entre 11h et 16h',
        'Augmenter la fréquence d\'hydratation et vérifier les abreuvoirs',
        'Renforcer la ventilation naturelle dans les enclos'
      ]
    }
  };
};
