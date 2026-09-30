<script setup>
import { computed } from 'vue';
import { PhHeart, PhBaby, PhWarning, PhCalendarCheck } from '@phosphor-icons/vue';

const props = defineProps({
  cycles: {
    type: Array,
    required: true,
  }
});

// Compute KPIs based on cycles
const gestatingCount = computed(() => {
  return props.cycles.filter(c => c.statut === 'GESTANTE').length;
});

const inSeminationCount = computed(() => {
  return props.cycles.filter(c => c.statut === 'EN_ATTENTE_CONSTAT').length;
});

const velagesThisYear = computed(() => {
  const currentYear = new Date().getFullYear();
  return props.cycles.filter(c => c.statut === 'TERMINEE_VELAGE' && c.dateReelleVelage && new Date(c.dateReelleVelage).getFullYear() === currentYear).length;
});
</script>

<template>
  <div class="kpi-grid">
    <div class="kpi-card glass-effect">
      <div class="kpi-icon-wrapper gestante-icon">
        <PhBaby :size="24" weight="fill" />
      </div>
      <div class="kpi-content">
        <span class="kpi-label">Femelles Gestantes</span>
        <span class="kpi-value">{{ gestatingCount }}</span>
      </div>
    </div>

    <div class="kpi-card glass-effect">
      <div class="kpi-icon-wrapper inseminee-icon">
        <PhHeart :size="24" weight="fill" />
      </div>
      <div class="kpi-content">
        <span class="kpi-label">En attente de constat</span>
        <span class="kpi-value">{{ inSeminationCount }}</span>
      </div>
    </div>

    <div class="kpi-card glass-effect">
      <div class="kpi-icon-wrapper velage-icon">
        <PhCalendarCheck :size="24" weight="fill" />
      </div>
      <div class="kpi-content">
        <span class="kpi-label">Vêlages cette année</span>
        <span class="kpi-value">{{ velagesThisYear }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.kpi-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.gestante-icon {
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
}

.inseminee-icon {
  background: rgba(245, 158, 11, 0.15);
  color: #F59E0B;
}

.velage-icon {
  background: rgba(59, 130, 246, 0.15);
  color: #3B82F6;
}

.kpi-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kpi-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-dark);
  line-height: 1.2;
}
</style>
