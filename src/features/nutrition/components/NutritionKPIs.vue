<script setup>
import { PhCoin, PhBowlFood, PhWarehouse, PhBatteryCharging, PhTrendUp, PhWarning } from '@phosphor-icons/vue';

const props = defineProps({
  kpis: {
    type: Object,
    required: true
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value);
};
</script>

<template>
  <div class="kpi-grid">
    
    <!-- Coût alimentaire -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">COÛT ALIMENTAIRE/JOUR</span>
        <div class="kpi-icon-wrapper bg-orange-light text-orange">
          <PhCoin :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ formatCurrency(kpis.dailyCost).replace('FCFA', '').trim() }} <span class="value-currency">FCFA</span></div>
        <div class="kpi-trend text-red">
          <PhTrendUp :size="12" weight="bold" />
          <span class="trend-label">+{{ kpis.dailyCostTrend }}% vs période précédente</span>
        </div>
      </div>
    </div>

    <!-- Ration moyenne -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">RATION MOYENNE PAR ANIMAL</span>
        <div class="kpi-icon-wrapper bg-green-light text-green">
          <PhBowlFood :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.averageRation }}<span class="value-unit">kg/j</span></div>
        <div class="kpi-trend text-muted">
          <span class="trend-label">{{ kpis.averageRationLabel }}</span>
        </div>
      </div>
    </div>

    <!-- Stock Fourrage -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">STOCK FOURRAGES RESTANT</span>
        <div class="kpi-icon-wrapper bg-yellow-light text-yellow">
          <PhWarehouse :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.stockRemaining }} <span class="value-unit">jours</span></div>
        <div class="kpi-trend text-yellow">
          <PhWarning :size="12" weight="bold" />
          <span class="trend-label">{{ kpis.stockRemainingLabel }}</span>
        </div>
      </div>
    </div>

    <!-- Efficience alimentaire -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">EFFICIENCE ALIMENTAIRE</span>
        <div class="kpi-icon-wrapper bg-green-light text-green">
          <PhBatteryCharging :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.efficiency }}<span class="value-unit">L/kg</span></div>
        <div class="kpi-trend text-green">
          <span class="trend-label">✓ {{ kpis.efficiencyLabel }}</span>
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

.value-currency {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-dark);
}

.value-unit {
  font-size: 16px;
  color: var(--text-muted);
  font-weight: 500;
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
.bg-orange-light { background-color: #FFEDD5; }
.text-orange { color: #F97316; }

.bg-green-light { background-color: #ECFDF5; }
.text-green { color: #10B981; }

.bg-yellow-light { background-color: #FEF3C7; }
.text-yellow { color: #D97706; }

.text-red { color: #EF4444; }
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
