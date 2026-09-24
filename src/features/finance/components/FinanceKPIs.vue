<script setup>
import { PhTrendDown, PhTrendUp, PhTag, PhChartLineUp, PhBank, PhCoins } from '@phosphor-icons/vue';

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
    
    <!-- Coût de revient -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">COÛT DE REVIENT MOYEN</span>
        <div class="kpi-icon-wrapper bg-red-light text-red">
          <PhTrendDown :size="16" weight="bold" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.coutRevient }} <span class="value-currency">FCFA / L</span></div>
        <div class="kpi-trend" :class="kpis.coutRevientTrend < 0 ? 'text-green' : 'text-red'">
          <PhTrendDown v-if="kpis.coutRevientTrend < 0" :size="12" weight="bold" />
          <PhTrendUp v-else :size="12" weight="bold" />
          <span class="trend-label">{{ kpis.coutRevientTrend }}% vs période préc.</span>
        </div>
      </div>
    </div>

    <!-- Prix moyen de vente -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">PRIX MOYEN DE VENTE</span>
        <div class="kpi-icon-wrapper bg-green-light text-green">
          <PhTag :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.prixMoyenVente }} <span class="value-currency">FCFA / L</span></div>
        <div class="kpi-trend text-muted">
          <span class="trend-label">Stable vs période préc.</span>
        </div>
      </div>
    </div>

    <!-- Marge brute unitaire -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">MARGE BRUTE UNITAIRE</span>
        <div class="kpi-icon-wrapper bg-orange-light text-orange">
          <PhChartLineUp :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ kpis.margeBrute }} <span class="value-currency">FCFA / L</span></div>
        <div class="kpi-trend text-green">
          <PhTrendUp :size="12" weight="bold" />
          <span class="trend-label">+{{ kpis.margeBruteTrend }}% vs période préc.</span>
        </div>
      </div>
    </div>

    <!-- Chiffre d'affaires -->
    <div class="kpi-card highlight-card">
      <div class="kpi-header">
        <span class="kpi-title highlight-title">CHIFFRE D'AFFAIRES DE LA PÉRIODE</span>
        <div class="kpi-icon-wrapper bg-white-opacity text-white">
          <PhBank :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value text-white">{{ formatCurrency(kpis.chiffreAffaires).replace('FCFA', '').trim() }} <span class="value-currency-white">FCFA</span></div>
        <div class="kpi-trend text-white-muted">
          <PhTrendDown :size="12" weight="bold" />
          <span class="trend-label">{{ kpis.chiffreAffairesTrend }}% vs période préc.</span>
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

.highlight-card {
  background: #111827; /* Dark background */
  border-color: #1F2937;
  color: white;
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

.highlight-title {
  color: #9CA3AF;
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

.text-white {
  color: white;
}

.value-currency {
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 500;
}

.value-currency-white {
  font-size: 14px;
  color: #D1D5DB;
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
.bg-red-light { background-color: #FEE2E2; }
.text-red { color: #EF4444; }

.bg-green-light { background-color: #ECFDF5; }
.text-green { color: #10B981; }

.bg-orange-light { background-color: #FFEDD5; }
.text-orange { color: #F97316; }

.bg-white-opacity { background-color: rgba(255,255,255,0.1); }
.text-white-muted { color: #9CA3AF; }

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
