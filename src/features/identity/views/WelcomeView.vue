<script setup>
import { useRouter } from 'vue-router';
import { useOnboarding } from '../../../composables/useOnboarding.js';
import PnButton from '../../../components/ui/PnButton.vue';
import { PhHandshake } from '@phosphor-icons/vue';

const router = useRouter();
const { setStep } = useOnboarding();

function handleStart() {
  setStep(2);
  router.push({ name: 'onboarding-register' });
}
</script>

<template>
  <div class="welcome-view animate-fade-in-up">
    <div class="welcome-icon-wrapper">
      <div class="welcome-icon-circle">
        <PhHandshake :size="36" weight="duotone" color="#C87533" />
      </div>
    </div>

    <div class="welcome-content">
      <h2 class="welcome-title">Bienvenue sur Pinal</h2>
      <p class="welcome-description">
        La plateforme de gestion d'exploitation laitière pensée pour les éleveurs du Sahel.
        Suivez votre troupeau, votre production et vos finances en toute simplicité.
      </p>
    </div>

    <div class="welcome-features">
      <div class="welcome-feature">
        <span class="welcome-feature-icon">🐄</span>
        <div>
          <p class="welcome-feature-title">Suivi du troupeau</p>
          <p class="welcome-feature-desc">Gérez chaque animal de votre exploitation</p>
        </div>
      </div>
      <div class="welcome-feature">
        <span class="welcome-feature-icon">🥛</span>
        <div>
          <p class="welcome-feature-title">Production laitière</p>
          <p class="welcome-feature-desc">Enregistrez et analysez vos traites</p>
        </div>
      </div>
      <div class="welcome-feature">
        <span class="welcome-feature-icon">💰</span>
        <div>
          <p class="welcome-feature-title">Gestion financière</p>
          <p class="welcome-feature-desc">Suivez vos revenus et dépenses</p>
        </div>
      </div>
    </div>

    <PnButton
      variant="primary"
      :full="true"
      size="lg"
      @click="handleStart"
    >
      Commencer
    </PnButton>
  </div>
</template>

<style scoped>
.welcome-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.welcome-icon-wrapper {
  display: flex;
  justify-content: center;
}

.welcome-icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--primary-border);
}

.welcome-content {
  text-align: center;
}

.welcome-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.welcome-description {
  font-size: var(--font-size-base);
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 380px;
  margin: 0 auto;
}

.welcome-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
}

.welcome-feature {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.welcome-feature-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.welcome-feature-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 2px;
}

.welcome-feature-desc {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
</style>
