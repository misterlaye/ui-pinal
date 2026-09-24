<script setup>
import { PhWarning, PhSyringe, PhStethoscope, PhHeartbeat, PhTrendUp } from '@phosphor-icons/vue';

const props = defineProps({
  kpis: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="kpi-grid">
    
    <!-- Animaux en alerte -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">ANIMAUX EN ALERTE</span>
        <div class="kpi-icon-wrapper bg-red-light text-red">
          <PhWarning :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value text-red">{{ kpis.alertsCount }}</div>
        <div class="kpi-trend text-muted">
          <span class="trend-label">{{ kpis.alertsSubtitle }}</span>
        </div>
      </div>
    </div>

    <!-- Vaccinations à jour -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">VACCINATIONS À JOUR</span>
        <div class="kpi-icon-wrapper bg-green-light text-green">
          <PhSyringe :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.vaccinationsRatio }}</div>
        <div class="kpi-trend text-muted">
          <span class="trend-label">{{ kpis.vaccinationsSubtitle }}</span>
        </div>
      </div>
    </div>

    <!-- Prochaine visite -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">PROCHAINE VISITE VÉTÉRINAIRE</span>
        <div class="kpi-icon-wrapper bg-orange-light text-orange">
          <PhStethoscope :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.nextVisit }}</div>
        <div class="kpi-trend text-muted">
          <span class="trend-label">{{ kpis.nextVisitSubtitle }}</span>
        </div>
      </div>
    </div>

    <!-- Score santé global -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">SCORE SANTÉ GLOBAL</span>
        <div class="kpi-icon-wrapper bg-green-light text-green">
          <PhHeartbeat :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.healthScore }}<span class="value-suffix">/100</span></div>
        <div class="kpi-trend text-green">
          <PhTrendUp :size="12" weight="bold" />
          <span class="trend-label">{{ kpis.healthScoreSubtitle }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.kpi-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-title {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.kpi-icon-wrapper {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-dark);
  line-height: 1;
}

.value-suffix {
  font-size: 18px;
  color: var(--text-muted);
  font-weight: 500;
  margin-left: 2px;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.trend-label {
  font-weight: 500;
}

/* Colors */
.bg-red-light { background-color: #FEE2E2; }
.text-red { color: #EF4444; }

.bg-green-light { background-color: #ECFDF5; }
.text-green { color: #10B981; }

.bg-orange-light { background-color: #FFEDD5; }
.text-orange { color: #F97316; }

.text-muted { color: var(--text-muted); }

/* Responsive */
@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
