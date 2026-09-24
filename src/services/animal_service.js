import { apiClient } from './api_client.js';

// ---- MOCK DATA FOR UX DEMO ----
let mockAnimals = [
  { id: '1', name: 'Awa', race: 'Montbéliarde', status: 'lactation', identifiant: 'SN-001', trend: 'up', age: '4 ans', lastEvent: 'Dernière Insémination : 12 avr. 2024', avatar: 'https://loremflickr.com/150/150/cow?lock=1' },
  { id: '2', name: 'Nafi', race: 'Montbéliarde', status: 'lactation', identifiant: 'SN-002', trend: 'up', age: '3 ans', lastEvent: 'Dernière Insémination : 02 mai 2024', avatar: 'https://loremflickr.com/150/150/cow?lock=2' },
  { id: '3', name: 'Diara', race: 'Gudali', status: 'lactation', identifiant: 'SN-003', trend: 'down', age: '5 ans', lastEvent: 'Dernière Insémination : 20 mars 2024', avatar: 'https://loremflickr.com/150/150/cow?lock=3' },
  { id: '4', name: 'Fatou', race: 'Gudali', status: 'lactation', identifiant: 'SN-004', trend: 'up', age: '3 ans', lastEvent: 'Dernière Insémination : 08 avr. 2024', avatar: 'https://loremflickr.com/150/150/cow?lock=4' },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Récupère la liste des animaux (MOCK)
 */
export async function getAnimalsList(exploitationId) {
  await delay(800); // Simulate network
  return [...mockAnimals];
}

/**
 * Crée un nouvel animal dans l'exploitation.
 */
export async function createAnimal(animalData) {
  await delay(800);
  const newAnimal = {
    id: Math.random().toString(36).substr(2, 9),
    ...animalData,
    trend: 'up',
    age: '0 an',
    avatar: `https://loremflickr.com/150/150/cow?lock=${Math.floor(Math.random() * 100)}`,
  };
  mockAnimals.unshift(newAnimal);
  return newAnimal;
}

/**
 * Récupère un animal par son ID.
 */
export async function getAnimal(animalId) {
  await delay(500);
  return mockAnimals.find(a => a.id === animalId);
}

/**
 * Met à jour un animal.
 */
export async function updateAnimal(animalId, animalData) {
  await delay(800);
  const index = mockAnimals.findIndex(a => a.id === animalId);
  if (index !== -1) {
    mockAnimals[index] = { ...mockAnimals[index], ...animalData };
    return mockAnimals[index];
  }
  throw new Error("Animal not found");
}

/**
 * Supprime un animal (MOCK)
 */
export async function deleteAnimal(animalId) {
  await delay(800);
  mockAnimals = mockAnimals.filter(a => a.id !== animalId);
  return true;
}
