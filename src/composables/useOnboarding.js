import { reactive } from 'vue';

/**
 * État partagé du flux d'onboarding.
 * Singleton réactif utilisé par toutes les étapes.
 */
const state = reactive({
  currentStep: 1,
  totalSteps: 6,

  // Étape 2 — Inscription
  telephone: '',
  nom: '',
  prenom: '',
  email: '',

  // Étape 3 — OTP
  otpCode: '',

  // Auth tokens
  accessToken: '',
  refreshToken: '',
  userId: '',

  // Étape 4 — Exploitation
  exploitationNom: '',
  localite: '',
  exploitationId: '',
  tenantId: '',

  // Étape 5 — Animal
  animalIdentifiant: '',
  animalNom: '',
  animalPhotoUrl: '',
  animalDateNaissance: '',
  animalRaceId: '',
});

export function useOnboarding() {

  function setStep(step) {
    state.currentStep = step;
  }

  function updateData(data) {
    Object.assign(state, data);
  }

  function setAuthData({ accessToken, refreshToken, userId }) {
    state.accessToken = accessToken || '';
    state.refreshToken = refreshToken || '';
    state.userId = userId || '';
  }

  function setExploitationData({ exploitationId, tenantId }) {
    state.exploitationId = exploitationId || '';
    state.tenantId = tenantId || '';
  }

  function reset() {
    Object.assign(state, {
      currentStep: 1,
      telephone: '',
      nom: '',
      prenom: '',
      email: '',
      otpCode: '',
      accessToken: '',
      refreshToken: '',
      userId: '',
      exploitationNom: '',
      localite: '',
      exploitationId: '',
      tenantId: '',
      animalIdentifiant: '',
      animalNom: '',
      animalPhotoUrl: '',
      animalDateNaissance: '',
      animalRaceId: '',
    });
  }

  return {
    state,
    setStep,
    updateData,
    setAuthData,
    setExploitationData,
    reset,
  };
}