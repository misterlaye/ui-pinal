<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboarding } from '../../../composables/useOnboarding.js';
import { verifyOtp, requestOtp, registerUser } from '../../../services/auth_service.js';
import PnOtpInput from '../../../components/ui/PnOtpInput.vue';
import PnButton from '../../../components/ui/PnButton.vue';

const router = useRouter();
const { state, setStep, setAuthData } = useOnboarding();

const otpCode = ref('');
const loading = ref(false);
const resendLoading = ref(false);
const error = ref('');
const countdown = ref(60);
let countdownTimer = null;

function startCountdown() {
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }, 1000);
}

onMounted(() => {
  // Redirect to register if no telephone
  if (!state.telephone) {
    router.replace({ name: 'onboarding-register' });
    return;
  }
  startCountdown();
});

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
});

async function handleVerify(code) {
  error.value = '';
  const codeValue = code || otpCode.value;

  if (codeValue.length !== 6) {
    error.value = 'Veuillez entrer le code complet à 6 chiffres';
    return;
  }

  loading.value = true;

  try {
    // Verify OTP → get tokens
    const authData = await verifyOtp(state.telephone, codeValue);
    setAuthData(authData);

    // Register user profile
    await registerUser({
      telephone: state.telephone,
      nom: state.nom,
      prenom: state.prenom,
      email: state.email || null,
    });

    setStep(4);
    router.push({ name: 'onboarding-create-exploitation' });
  } catch (err) {
    error.value = err.response?.data?.message || 'Code OTP invalide. Veuillez réessayer.';
  } finally {
    loading.value = false;
  }
}

function handleComplete(code) {
  handleVerify(code);
}

async function handleResend() {
  if (countdown.value > 0) return;

  resendLoading.value = true;
  error.value = '';

  try {
    await requestOtp(state.telephone);
    startCountdown();
  } catch (err) {
    error.value = 'Impossible de renvoyer le code. Veuillez réessayer.';
  } finally {
    resendLoading.value = false;
  }
}

function formatPhone(phone) {
  if (!phone) return '';
  // Show partial phone: +221 77 *** ** 67
  if (phone.length > 6) {
    return phone.slice(0, 7) + ' ••• •• ' + phone.slice(-2);
  }
  return phone;
}
</script>

<template>
  <div class="otp-view animate-fade-in-up">
    <div class="otp-header">
      <h2 class="otp-title">Vérification</h2>
      <p class="otp-subtitle">
        Entrez le code à 6 chiffres envoyé au<br />
        <strong>{{ formatPhone(state.telephone) }}</strong>
      </p>
    </div>

    <PnOtpInput
      v-model="otpCode"
      :error="error"
      :disabled="loading"
      @complete="handleComplete"
    />

    <PnButton
      variant="primary"
      :full="true"
      :loading="loading"
      :disabled="otpCode.length !== 6"
      @click="handleVerify()"
    >
      Vérifier le code
    </PnButton>

    <div class="otp-resend">
      <template v-if="countdown > 0">
        <p class="otp-resend-text">
          Renvoyer le code dans
          <span class="otp-resend-timer">{{ countdown }}s</span>
        </p>
      </template>
      <template v-else>
        <button
          class="otp-resend-btn"
          :disabled="resendLoading"
          @click="handleResend"
        >
          {{ resendLoading ? 'Envoi en cours...' : 'Renvoyer le code' }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.otp-view {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.otp-header {
  text-align: center;
}

.otp-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.otp-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  line-height: 1.6;
}

.otp-subtitle strong {
  color: var(--text-dark);
}

.otp-resend {
  text-align: center;
}

.otp-resend-text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.otp-resend-timer {
  font-weight: 600;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
}

.otp-resend-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.otp-resend-btn:hover {
  background: var(--primary-light);
}

.otp-resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
