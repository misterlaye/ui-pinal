<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { verifyPin } from '../../../services/auth_service.js';
import { PhDrop, PhLockKey } from '@phosphor-icons/vue';

const router = useRouter();

const telephone = ref('');
const pin = ref('');
const loading = ref(false);
const errorMsg = ref('');

async function handleLogin() {
  if (!telephone.value || !pin.value) {
    errorMsg.value = 'Veuillez saisir votre numéro et votre code PIN.';
    return;
  }
  
  if (pin.value.length !== 6) {
    errorMsg.value = 'Le code PIN doit comporter 6 chiffres.';
    return;
  }

  loading.value = true;
  errorMsg.value = '';

  try {
    const rawPhone = telephone.value.replace(/\s+/g, '');
    const formattedPhone = rawPhone.startsWith('+') ? rawPhone : '+221' + rawPhone.replace(/^0+/, '');
    
    await verifyPin(formattedPhone, pin.value);
    
    // Success, navigate to exploitation selection
    // Auto-redirect handles the case if they have exactly 1 exploitation
    router.push({ name: 'select-exploitation' });
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Identifiants incorrects. Veuillez réessayer.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="worker-login-layout animate-fade-in">
    <div class="login-card brutalist-card">
      <div class="logo-wrapper">
        <div class="logo-box">
          <PhDrop :size="32" weight="fill" color="#1A1A1A" />
        </div>
        <span class="app-name">PINAL TERRAIN</span>
      </div>

      <div class="header-text">
        <h1 class="title">CONNEXION OUVRIER</h1>
        <p class="subtitle">Entrez votre numéro et le code secret reçu par WhatsApp.</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group brutalist-group">
          <label class="form-label">NUMÉRO DE TÉLÉPHONE</label>
          <input
            v-model="telephone"
            type="tel"
            class="form-input brutalist-input"
            placeholder="Ex: 77 123 45 67"
            required
          />
        </div>

        <div class="form-group brutalist-group">
          <label class="form-label">CODE PIN (6 CHIFFRES)</label>
          <input
            v-model="pin"
            type="password"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            class="form-input brutalist-input pin-input"
            placeholder="••••••"
            required
          />
        </div>

        <div v-if="errorMsg" class="form-error brutalist-error">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          class="brutalist-btn-submit"
          :disabled="loading"
        >
          <span v-if="!loading">ACCÉDER À MON ESPACE</span>
          <span v-else>CONNEXION...</span>
        </button>
        
        <div class="secure-badge">
          <PhLockKey :size="16" color="#1A1A1A" />
          <span>Accès restreint aux données de terrain</span>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.worker-login-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F4F1EA; /* var(--w-bg) */
  padding: 24px;
  font-family: 'Inter', sans-serif;
  color: #1A1A1A; /* var(--w-dark) */
}

.brutalist-card {
  background: #FFFFFF;
  width: 100%;
  max-width: 400px;
  padding: 40px 32px;
  border: 2px solid #1A1A1A;
  box-shadow: 6px 6px 0px #1A1A1A;
}

.logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  gap: 12px;
}

.logo-box {
  background-color: #EBC137; /* var(--w-yellow) */
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  border: 2px solid #1A1A1A;
  box-shadow: 3px 3px 0px #1A1A1A;
}

.app-name {
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 0.1em;
  color: #1A1A1A;
}

.header-text {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 24px;
  font-weight: 900;
  color: #1A1A1A;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 14px;
  color: #737373;
  line-height: 1.5;
  font-weight: 500;
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
  font-size: 12px;
  font-weight: 800;
  color: #1A1A1A;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.brutalist-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #1A1A1A;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  background: #FFFFFF;
  transition: all 0.2s;
  box-sizing: border-box;
}

.brutalist-input:focus {
  outline: none;
  background: #FEF9E6;
  box-shadow: 3px 3px 0px #1A1A1A;
  transform: translate(-2px, -2px);
}

.pin-input {
  letter-spacing: 0.5em;
  text-align: center;
  font-size: 20px;
}

.brutalist-error {
  background: #FEE2E2;
  border: 2px solid #B91C1C;
  color: #B91C1C;
  font-weight: 700;
  padding: 12px;
  font-size: 13px;
  text-align: center;
  box-shadow: 2px 2px 0px #B91C1C;
}

.brutalist-btn-submit {
  width: 100%;
  padding: 18px;
  background-color: #EBC137;
  color: #1A1A1A;
  border: 2px solid #1A1A1A;
  font-weight: 900;
  font-size: 15px;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow: 4px 4px 0px #1A1A1A;
  transition: all 0.1s;
  text-transform: uppercase;
  margin-top: 8px;
}

.brutalist-btn-submit:hover:not(:disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #1A1A1A;
}

.brutalist-btn-submit:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1A1A1A;
}

.brutalist-btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: none;
  transform: translate(4px, 4px);
}

.secure-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #737373;
}
</style>
