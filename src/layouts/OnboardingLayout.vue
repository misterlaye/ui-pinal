<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PnLogo from '../components/ui/PnLogo.vue';
import PnStepper from '../components/ui/PnStepper.vue';
import sahelBg from '../assets/sahel-bg.jpg';

const route = useRoute();
const currentStep = computed(() => route.meta?.step || 1);
</script>

<template>
  <div class="onboarding-layout">
    <!-- Left Panel — Hero Image -->
    <aside class="onboarding-left">
      <div class="onboarding-left-bg" :style="{ backgroundImage: `url(${sahelBg})` }" />
      <div class="onboarding-left-overlay" />

      <div class="onboarding-left-content">
        <PnLogo variant="dark" size="md" />

        <div class="onboarding-left-hero">
          <h1 class="onboarding-left-title">
            Pilotez votre troupeau<br />
            au rythme du Sahel.
          </h1>
          <p class="onboarding-left-subtitle">
            La première plateforme intelligente de pilotage d'exploitation laitière adaptée aux réalités d'Afrique de l'Ouest. Suivez la production, surveillez la santé et optimisez vos rendements.
          </p>
        </div>

        <PnStepper v-if="currentStep > 1" :current-step="currentStep" :total-steps="6" />
        <div v-else class="onboarding-left-footer">
          PINAL SAAS — GESTION LAITIÈRE INTÉGRÉE
        </div>
      </div>
    </aside>

    <!-- Right Panel — Form content -->
    <main class="onboarding-right">
      <div class="onboarding-right-inner">
        <!-- Mobile header -->
        <div class="onboarding-mobile-header">
          <PnLogo variant="light" size="sm" />
          <PnStepper :current-step="currentStep" :total-steps="6" />
        </div>

        <router-view v-slot="{ Component }">
          <transition name="slide-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<style scoped>
.onboarding-layout {
  display: flex;
  min-height: 100vh;
}

/* --- Left Panel --- */
.onboarding-left {
  position: relative;
  width: 45%;
  min-height: 100vh;
  display: flex;
  overflow: hidden;
}

.onboarding-left-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.onboarding-left-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(26, 26, 26, 0.45) 0%,
    rgba(26, 26, 26, 0.65) 100%
  );
  z-index: 1;
}

.onboarding-left-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}

.onboarding-left-hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
}

.onboarding-left-title {
  font-size: 36px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.onboarding-left-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
  max-width: 380px;
}

.onboarding-left-footer {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
  font-weight: 500;
}

/* --- Right Panel --- */
.onboarding-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-page);
  padding: 40px;
  overflow-y: auto;
}

.onboarding-right-inner {
  width: 100%;
  max-width: 440px;
}

/* --- Mobile Header (hidden on desktop) --- */
.onboarding-mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

/* --- Transition --- */
.slide-fade-enter-active {
  transition: all 0.35s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* --- Responsive --- */
@media (max-width: 1024px) {
  .onboarding-left {
    width: 40%;
  }

  .onboarding-left-title {
    font-size: 28px;
  }

  .onboarding-left-content {
    padding: 32px;
  }
}

@media (max-width: 768px) {
  .onboarding-layout {
    flex-direction: column;
  }

  .onboarding-left {
    display: none;
  }

  .onboarding-right {
    padding: 24px 20px;
    min-height: 100vh;
    align-items: flex-start;
    padding-top: 20px;
  }

  .onboarding-right-inner {
    max-width: 100%;
  }

  .onboarding-mobile-header {
    display: flex;
  }
}
</style>
