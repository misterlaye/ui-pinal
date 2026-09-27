<script setup>
import { PhCoin, PhBowlFood, PhWarehouse, PhCheckCircle, PhTrendUp } from '@phosphor-icons/vue';

const props = defineProps({
  kpis: {
    type: Object,
    required: true
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value || 0);
};
</script>

<template>
  <div class="kpi-grid">
    
    <!-- Coût alimentaire -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">COÛT ALIMENTAIRE / JOUR</span>
        <div class="kpi-icon-wrapper bg-orange-light text-orange">
          <PhCoin :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ formatCurrency(kpis.dailyCost).replace('FCFA', '').trim() }} <span class="value-currency">FCFA</span></div>
        <div class="kpi-trend text-muted">
          <span>Troupeau actif en production</span>
        </div>
      </div>
    </div>

    <!-- Ration moyenne -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">RATION MOYENNE</span>
        <div class="kpi-icon-wrapper bg-green-light text-green">
          <PhBowlFood :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.averageRation }} <span class="value-unit">kg/j</span></div>
        <div class="kpi-trend text-muted">
          <span class="trend-label">{{ kpis.averageRationLabel || 'kg / vache alimentée' }}</span>
        </div>
      </div>
    </div>

    <!-- Aliments au catalogue -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">ALIMENTS AU CATALOGUE</span>
        <div class="kpi-icon-wrapper bg-yellow-light text-yellow">
          <PhWarehouse :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.stockRemaining }} <span class="value-unit">références</span></div>
        <div class="kpi-trend text-muted">
          <span class="trend-label">{{ kpis.stockRemainingLabel || 'Fourrages, concentrés & minéraux' }}</span>
        </div>
      </div>
    </div>

    <!-- Couverture du troupeau -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">COUVERTURE DU TROUPEAU</span>
        <div class="kpi-icon-wrapper bg-green-light text-green">
          <PhCheckCircle :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.efficiency }}<span class="value-unit">%</span></div>
        <div class="kpi-trend text-green">
          <span class="trend-label">{{ kpis.efficiencyLabel || 'Couverture des rations' }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.kpi-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.kpi-icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-orange-light { background: #FDF9F5; }
.text-orange { color: #C87533; }

.bg-green-light { background: #ECFDF5; }
.text-green { color: #10B981; }

.bg-yellow-light { background: #FEFCE8; }
.text-yellow { color: #F59E0B; }

.kpi-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-dark);
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.value-currency, .value-unit {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
}

.kpi-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.text-muted { color: var(--text-muted); }

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
