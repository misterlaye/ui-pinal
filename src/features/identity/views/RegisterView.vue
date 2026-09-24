<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboarding } from '../../../composables/useOnboarding.js';
import { requestOtp, registerUser } from '../../../services/auth_service.js';
import PnInput from '../../../components/ui/PnInput.vue';
import PnButton from '../../../components/ui/PnButton.vue';
import PnCheckbox from '../../../components/ui/PnCheckbox.vue';

const router = useRouter();
const { state, setStep } = useOnboarding();

const acceptedCGU = ref(false);
const loading = ref(false);
const errors = ref({});
const apiError = ref('');

const isValid = computed(() => {
  return state.nom.trim() &&
    state.prenom.trim() &&
    state.telephone.trim() &&
    acceptedCGU.value;
});

function validate() {
  const errs = {};

  if (!state.nom.trim()) {
    errs.nom = 'Le nom est obligatoire';
  }
  if (!state.prenom.trim()) {
    errs.prenom = 'Le prénom est obligatoire';
  }
  if (!state.telephone.trim()) {
    errs.telephone = 'Le numéro de téléphone est obligatoire';
  } else if (!/^[+]?[\d\s-]{8,20}$/.test(state.telephone.trim())) {
    errs.telephone = 'Numéro de téléphone invalide';
  }
  if (state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
    errs.email = 'Adresse email invalide';
  }
  if (!acceptedCGU.value) {
    errs.cgu = 'Vous devez accepter les conditions d\'utilisation';
  }

  errors.value = errs;
  return Object.keys(errs).length === 0;
}

async function handleSubmit() {
  apiError.value = '';

  if (!validate()) return;

  loading.value = true;

  try {
    // Request OTP first
    await requestOtp(state.telephone.trim());

    setStep(3);
    router.push({ name: 'onboarding-verify-otp' });
  } catch (err) {
    apiError.value = err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="register-view animate-fade-in-up">
    <div class="register-header">
      <h2 class="register-title">Votre inscription</h2>
      <p class="register-subtitle">
        Créez votre compte pour commencer à gérer votre exploitation.
      </p>
    </div>

    <div v-if="apiError" class="register-api-error">
      {{ apiError }}
    </div>

    <form class="register-form" @submit.prevent="handleSubmit">
      <PnInput
        id="register-nom"
        v-model="state.nom"
        label="Nom"
        placeholder="Votre nom de famille"
        :required="true"
        :error="errors.nom"
      />

      <PnInput
        id="register-prenom"
        v-model="state.prenom"
        label="Prénom"
        placeholder="Votre prénom"
        :required="true"
        :error="errors.prenom"
      />

      <PnInput
        id="register-telephone"
        v-model="state.telephone"
        label="Téléphone"
        type="tel"
        placeholder="+221 77 123 45 67"
        :required="true"
        :error="errors.telephone"
        hint="Vous recevrez un code de vérification par SMS"
      />

      <PnInput
        id="register-email"
        v-model="state.email"
        label="Email"
        type="email"
        placeholder="votre@email.com (optionnel)"
        :error="errors.email"
      />

      <PnCheckbox
        id="register-cgu"
        v-model="acceptedCGU"
        :error="errors.cgu"
      >
        J'accepte les <a href="#" @click.prevent>conditions générales d'utilisation</a>
        et la <a href="#" @click.prevent>politique de confidentialité</a>.
      </PnCheckbox>

      <PnButton
        type="submit"
        variant="primary"
        :full="true"
        :loading="loading"
        :disabled="!isValid"
      >
        Vérifier mon numéro
      </PnButton>
    </form>
  </div>
</template>

<style scoped>
.register-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.register-header {
  margin-bottom: 4px;
}

.register-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 6px;
}

.register-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.register-api-error {
  padding: 12px 16px;
  background: var(--error-light);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-md);
  color: var(--error);
  font-size: var(--font-size-sm);
}
</style>
