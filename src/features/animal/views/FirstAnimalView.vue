<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboarding } from '../../../composables/useOnboarding.js';
import { createAnimal } from '../../../services/animal_service.js';
import PnInput from '../../../components/ui/PnInput.vue';
import PnButton from '../../../components/ui/PnButton.vue';
import { PhCow, PhCamera } from '@phosphor-icons/vue';

const router = useRouter();
const { state, setStep } = useOnboarding();

const loading = ref(false);
const errors = ref({});
const apiError = ref('');
const photoPreview = ref(null);

const isValid = computed(() => {
  return state.animalIdentifiant.trim() && state.animalNom.trim();
});

function validate() {
  const errs = {};
  if (!state.animalIdentifiant.trim()) {
    errs.identifiant = 'L\'identifiant est obligatoire';
  }
  if (!state.animalNom.trim()) {
    errs.nom = 'Le nom de l\'animal est obligatoire';
  }
  errors.value = errs;
  return Object.keys(errs).length === 0;
}

function handlePhotoSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
      // In a real scenario, upload to a storage service and get URL
      state.animalPhotoUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

async function handleSubmit() {
  apiError.value = '';

  if (!validate()) return;

  loading.value = true;

  try {
    // Use a default raceId for the first animal during onboarding
    // A proper race selection can be added later
    const defaultRaceId = '00000000-0000-0000-0000-000000000001';

    await createAnimal({
      exploitationId: state.exploitationId,
      raceId: state.animalRaceId || defaultRaceId,
      identifiant: state.animalIdentifiant.trim(),
      nom: state.animalNom.trim(),
      photoUrl: state.animalPhotoUrl || null,
      dateNaissance: state.animalDateNaissance || null,
    });

    setStep(6);
    router.push({ name: 'onboarding-success' });
  } catch (err) {
    apiError.value = err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.';
  } finally {
    loading.value = false;
  }
}

function handleSkip() {
  setStep(6);
  router.push({ name: 'onboarding-success' });
}
</script>

<template>
  <div class="animal-view animate-fade-in-up">
    <div class="animal-header">
      <h2 class="animal-title">Premier animal</h2>
      <p class="animal-subtitle">
        Enregistrez votre premier animal pour commencer le suivi de votre troupeau.
      </p>
    </div>

    <div v-if="apiError" class="animal-api-error">
      {{ apiError }}
    </div>

    <form class="animal-form" @submit.prevent="handleSubmit">
      <!-- Photo upload -->
      <div class="animal-photo-section">
        <label for="animal-photo" class="animal-photo-upload">
          <div v-if="photoPreview" class="animal-photo-preview">
            <img :src="photoPreview" alt="Photo de l'animal" />
          </div>
          <div v-else class="animal-photo-placeholder">
            <PhCamera :size="28" weight="regular" color="#9CA3AF" />
            <span>Ajouter une photo</span>
          </div>
          <input
            id="animal-photo"
            type="file"
            accept="image/*"
            class="animal-photo-input"
            @change="handlePhotoSelect"
          />
        </label>
      </div>

      <PnInput
        id="animal-identifiant"
        v-model="state.animalIdentifiant"
        label="Identifiant"
        placeholder="Ex : BOV-001"
        :required="true"
        :error="errors.identifiant"
        hint="Numéro ou code unique de l'animal"
      />

      <PnInput
        id="animal-nom"
        v-model="state.animalNom"
        label="Nom de l'animal"
        placeholder="Ex : Nana"
        :required="true"
        :error="errors.nom"
      />

      <PnInput
        id="animal-date-naissance"
        v-model="state.animalDateNaissance"
        label="Date de naissance"
        type="date"
        :error="errors.dateNaissance"
      />

      <div class="animal-actions">
        <PnButton
          type="submit"
          variant="primary"
          :full="true"
          :loading="loading"
          :disabled="!isValid"
        >
          <PhCow :size="20" weight="bold" />
          Enregistrer l'animal
        </PnButton>

        <button
          type="button"
          class="animal-skip-btn"
          @click="handleSkip"
        >
          Passer cette étape
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.animal-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.animal-header {
  margin-bottom: 4px;
}

.animal-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 6px;
}

.animal-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.animal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Photo Upload */
.animal-photo-section {
  display: flex;
  justify-content: center;
}

.animal-photo-upload {
  cursor: pointer;
  display: block;
}

.animal-photo-input {
  display: none;
}

.animal-photo-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px dashed var(--border-input);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.animal-photo-placeholder span {
  font-size: 10px;
  color: var(--text-muted);
  text-align: center;
}

.animal-photo-placeholder:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.animal-photo-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--primary);
}

.animal-photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Actions */
.animal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.animal-skip-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.animal-skip-btn:hover {
  color: var(--primary);
}

.animal-api-error {
  padding: 12px 16px;
  background: var(--error-light);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-md);
  color: var(--error);
  font-size: var(--font-size-sm);
}
</style>
