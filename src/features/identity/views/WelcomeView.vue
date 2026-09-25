<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboarding } from '../../../composables/useOnboarding.js';
import PnButton from '../../../components/ui/PnButton.vue';
import { requestOtp } from '../../../services/auth_service.js';
import { PhLockKey } from '@phosphor-icons/vue';

const router = useRouter();
const { setStep, updateData } = useOnboarding();
const telephone = ref('');
const isLoading = ref(false);
const error = ref('');

async function handleRequestOtp() {
  if (!telephone.value || telephone.value.length < 8) {
    error.value = "Veuillez entrer un numéro valide";
    return;
  }
  
  isLoading.value = true;
  error.value = '';
  
  try {
    const formattedPhone = telephone.value.startsWith('+') ? telephone.value : '+221' + telephone.value.replace(/^0+/, '');
    await requestOtp(formattedPhone);
    updateData({ telephone: formattedPhone });
    setStep(3); // Verify OTP step
    router.push({ name: 'onboarding-verify-otp' });
  } catch (err) {
    error.value = "Erreur lors de l'envoi du code. Veuillez réessayer.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="login-view animate-fade-in-up">
    
    <div class="login-header">
      <h2 class="login-title">Connexion / Inscription</h2>
      <p class="login-subtitle">
        Entrez votre numéro de téléphone. Nous vous enverrons un code OTP de confirmation par SMS pour un accès sécurisé.
      </p>
    </div>

    <div class="login-form">
      <div class="form-group">
        <label for="telephone" class="form-label">NUMÉRO DE TÉLÉPHONE</label>
        <div class="input-with-prefix">
          <input 
            id="telephone"
            v-model="telephone" 
            type="tel" 
            class="form-input"
            placeholder="+221 77 ..."
            @keyup.enter="handleRequestOtp"
          />
        </div>
        <span v-if="error" class="error-msg">{{ error }}</span>
      </div>

      <PnButton
        variant="primary"
        :full="true"
        size="lg"
        class="btn-submit"
        :loading="isLoading"
        @click="handleRequestOtp"
      >
        Recevoir le code
      </PnButton>

      <div class="secure-badge">
        <PhLockKey :size="16" color="#6B7280" />
        <span>Connexion sécurisée par authentification unique OTP</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}

.login-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-dark);
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-with-prefix {
  display: flex;
  align-items: center;
  position: relative;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 16px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: var(--bg-white);
  color: var(--text-dark);
  transition: all var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(200, 117, 51, 0.1);
}

.error-msg {
  font-size: 12px;
  color: #EF4444;
}

.btn-submit {
  background-color: #C87533; /* The exact color from the mockup */
  color: white;
  font-size: 16px;
  padding: 16px;
  border-radius: var(--radius-md);
}

.btn-submit:hover {
  background-color: #B3682E;
}

.secure-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 12px;
  color: #6B7280;
}
</style>
