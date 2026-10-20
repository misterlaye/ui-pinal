<script setup>
import { PhTrendDown, PhTag, PhChartLineUp, PhBank } from '@phosphor-icons/vue';
import { formatNumber } from '../../../utils/formatters.js';

// Résultat financier du mois en cours (API /finance/dashboard → moisEnCours).
// Une valeur null n'est jamais affichée comme 0 : « Non calculable ».
defineProps({
  resultat: {
    type: Object,
    required: true
  }
});

const valeur = (v) => (v == null ? 'Non calculable' : formatNumber(v));
</script>

<template>
  <div class="kpi-grid">

    <!-- Coût de revient -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">COÛT DE REVIENT</span>
        <div class="kpi-icon-wrapper bg-red-light text-red">
          <PhTrendDown :size="16" weight="bold" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ valeur(resultat.coutRevientParLitre) }} <span v-if="resultat.coutRevientParLitre != null" class="value-currency">FCFA / L</span></div>
        <div class="kpi-trend text-muted">
          <span class="trend-label">Coût total ÷ litres produits</span>
        </div>
      </div>
    </div>

    <!-- Prix moyen de vente -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">PRIX MOYEN DU LAIT</span>
        <div class="kpi-icon-wrapper bg-green-light text-green">
          <PhTag :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ valeur(resultat.prixMoyenParLitre) }} <span v-if="resultat.prixMoyenParLitre != null" class="value-currency">FCFA / L</span></div>
        <div class="kpi-trend text-muted">
          <span class="trend-label">{{ formatNumber(resultat.volumeLitres) }} L produits</span>
        </div>
      </div>
    </div>

    <!-- Marge -->
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-title">MARGE DU MOIS</span>
        <div class="kpi-icon-wrapper bg-orange-light text-orange">
          <PhChartLineUp :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ valeur(resultat.marge) }} <span v-if="resultat.marge != null" class="value-currency">FCFA</span></div>
        <div class="kpi-trend text-muted">
          <span class="trend-label">CA − alimentation − autres charges</span>
        </div>
      </div>
    </div>

    <!-- Chiffre d'affaires -->
    <div class="kpi-card highlight-card">
      <div class="kpi-header">
        <span class="kpi-title highlight-title">CHIFFRE D'AFFAIRES DU MOIS</span>
        <div class="kpi-icon-wrapper bg-white-opacity text-white">
          <PhBank :size="16" weight="fill" />
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value text-white">{{ valeur(resultat.chiffreAffaires) }} <span v-if="resultat.chiffreAffaires != null" class="value-currency-white">FCFA</span></div>
        <div class="kpi-trend text-white-muted">
          <span class="trend-label">Lait valorisé au prix applicable chaque jour</span>
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
