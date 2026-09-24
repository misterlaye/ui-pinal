<script setup>
import { useRouter } from 'vue-router';
import { useOnboarding } from '../../../composables/useOnboarding.js';
import PnButton from '../../../components/ui/PnButton.vue';
import { PhCheckCircle } from '@phosphor-icons/vue';

const router = useRouter();
const { state } = useOnboarding();

function handleGoToDashboard() {
  // Store user info for the dashboard greeting
  localStorage.setItem('user_prenom', state.prenom || '');
  localStorage.setItem('exploitation_name', state.exploitationNom || '');
  router.push({ name: 'dashboard' });
}
</script>

<template>
  <div class="success-view animate-fade-in-up">
    <div class="success-icon-wrapper">
      <div class="success-icon-circle">
        <PhCheckCircle :size="48" weight="fill" color="#16A34A" />
      </div>
    </div>

    <div class="success-content">
      <h2 class="success-title">Configuration réussie</h2>
      <p class="success-description">
        Félicitations {{ state.prenom }} ! Votre exploitation
        <strong>{{ state.exploitationNom }}</strong> est prête.
        Vous pouvez maintenant commencer à gérer votre troupeau.
      </p>
    </div>

    <div class="success-summary">
      <div class="success-summary-item">
        <span class="success-summary-label">Éleveur</span>
        <span class="success-summary-value">{{ state.prenom }} {{ state.nom }}</span>
      </div>
      <div class="success-summary-divider" />
      <div class="success-summary-item">
        <span class="success-summary-label">Exploitation</span>
        <span class="success-summary-value">{{ state.exploitationNom }}</span>
      </div>
      <div v-if="state.localite" class="success-summary-divider" />
      <div v-if="state.localite" class="success-summary-item">
        <span class="success-summary-label">Localité</span>
        <span class="success-summary-value">{{ state.localite }}</span>
      </div>
    </div>

    <PnButton
      variant="primary"
      :full="true"
      size="lg"
      @click="handleGoToDashboard"
    >
      Accéder au tableau de bord
    </PnButton>
  </div>
</template>

<style scoped>
.success-view {
  display: flex;
  flex-direction: column;
  gap: 28px;
  text-align: center;
}

.success-icon-wrapper {
  display: flex;
  justify-content: center;
}

.success-icon-circle {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: var(--success-light);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: successPop 0.5s ease-out;
}

@keyframes successPop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.success-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.success-description {
  font-size: var(--font-size-base);
  color: var(--text-muted);
  line-height: 1.6;
}

.success-description strong {
  color: var(--text-dark);
}

.success-summary {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  text-align: left;
}

.success-summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.success-summary-label {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.success-summary-value {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-dark);
}

.success-summary-divider {
  height: 1px;
  background: var(--border-light);
}
</style>
