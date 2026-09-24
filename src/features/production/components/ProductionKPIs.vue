<script setup>
import { PhDrop, PhChartLineUp, PhTrophy, PhTruck, PhTrendUp, PhTrendDown, PhCheck } from '@phosphor-icons/vue';

const props = defineProps({
  kpis: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="kpi-grid">
    
    <!-- Total Production -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">PRODUCTION TOTALE</span>
        <div class="kpi-icon-wrapper bg-primary-light text-primary">
          <PhDrop :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.totalProduction }} L</div>
        <div class="kpi-trend text-green">
          <PhTrendUp :size="12" weight="bold" />
          <span class="trend-value">+{{ kpis.totalProductionTrend }}%</span>
          <span class="trend-label">vs semaine dernière</span>
        </div>
      </div>
    </div>

    <!-- Moyenne par animal -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">MOYENNE PAR ANIMAL</span>
        <div class="kpi-icon-wrapper bg-green-light text-green">
          <PhChartLineUp :size="16" weight="bold" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.averagePerAnimal }} L</div>
        <div class="kpi-trend text-muted">
          <span class="trend-label">{{ kpis.averagePerAnimalLabel }}</span>
        </div>
      </div>
    </div>

    <!-- Meilleure productrice -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">MEILLEURE PRODUCTRICE</span>
        <div class="kpi-icon-wrapper bg-yellow-light text-yellow">
          <PhTrophy :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body best-producer">
        <img :src="kpis.bestProducer.avatar" alt="Avatar" class="best-producer-avatar" />
        <div class="best-producer-info">
          <span class="best-producer-name">{{ kpis.bestProducer.name }}</span>
          <span class="trend-label">{{ kpis.bestProducer.subtitle }}</span>
        </div>
      </div>
    </div>

    <!-- Taux de collecte -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">TAUX DE COLLECTE</span>
        <div class="kpi-icon-wrapper bg-green-light text-green">
          <PhTruck :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.collectionRate }}%</div>
        <div class="kpi-trend text-green">
          <PhCheck :size="12" weight="bold" />
          <span class="trend-label">{{ kpis.collectionRateLabel }}</span>
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

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.trend-value {
  font-weight: 700;
}

.trend-label {
  color: var(--text-muted);
  font-weight: 500;
}

/* Colors */
.bg-primary-light { background-color: #F8ECE2; } /* Ocre très clair */
.text-primary { color: #C87533; }

.bg-green-light { background-color: #ECFDF5; }
.text-green { color: #10B981; }

.bg-yellow-light { background-color: #FEF3C7; }
.text-yellow { color: #D97706; }

/* Best Producer special layout */
.best-producer {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.best-producer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border-light);
}

.best-producer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.best-producer-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-dark);
  line-height: 1.2;
}

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
