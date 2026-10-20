<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PhDownloadSimple, PhListPlus } from '@phosphor-icons/vue';
import { getProductionSummary } from '../../../services/production_service.js';
import { apiErrorMessage } from '../../../utils/apiError.js';

import ProductionKPIs from '../components/ProductionKPIs.vue';
import ProductionChart from '../components/ProductionChart.vue';
import ProductionTable from '../components/ProductionTable.vue';
import ProductionHistory from '../components/ProductionHistory.vue';

const router = useRouter();
const productionData = ref(null);
const isLoading = ref(true);
const loadError = ref('');

async function loadProduction() {
  isLoading.value = true;
  loadError.value = '';
  try {
    productionData.value = await getProductionSummary();
  } catch (error) {
    productionData.value = null;
    loadError.value = apiErrorMessage(error, 'Impossible de charger les données de production.');
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadProduction);

const exportReport = () => {
  if (!productionData.value) return;
  const rows = [
    ['Animal', 'Race', 'Matin (L)', 'Soir (L)', 'Total (L)'],
    ...(productionData.value.animalProduction || []).map(a => [a.name, a.race, a.matin, a.soir, a.total])
  ];
  const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(";")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `production_laitiere_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <div class="production-view">
    
    <!-- Header Section -->
    <header class="page-header">
      <div class="header-titles">
        <h1 class="page-title">Production Laitière</h1>
        <p class="page-subtitle">Suivi détaillé de la production de l'exploitation</p>
      </div>
      
      <div class="header-actions">
        <!-- <button class="btn-saisie" @click="router.push({ name: 'worker-saisie-lot' })">
          <PhListPlus :size="16" weight="bold" />
          Saisie par lot
        </button> -->
        <button class="btn-export" @click="exportReport">
          <PhDownloadSimple :size="16" weight="bold" />
          Exporter CSV
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div v-if="isLoading" class="loading-state">
      Chargement du tableau de bord...
    </div>

    <div v-else-if="loadError" class="load-error" role="alert">
      <p>{{ loadError }}</p>
      <button type="button" class="retry-btn" @click="loadProduction">Réessayer</button>
    </div>

    <div v-else-if="productionData" class="dashboard-content">
      
      <!-- Top KPIs -->
      <section class="section">
        <ProductionKPIs :kpis="productionData.kpis" />
      </section>

      <!-- Main Chart -->
      <section class="section">
        <ProductionChart :chartData="productionData.chartData" />
      </section>

      <!-- Bottom Layout: Table + History -->
      <section class="section bottom-layout">
        <!-- Left: Table -->
        <div class="table-container">
          <ProductionTable :animals="productionData.animalProduction" />
        </div>
        
        <!-- Right: History -->
        <div class="history-container">
          <ProductionHistory :historyData="productionData.history" />
        </div>
      </section>

    </div>

  </div>
</template>

<style scoped>
.load-error {
  padding: 24px;
  border: 1px solid var(--error, #DC2626);
  border-radius: 8px;
  background: #FEF2F2;
  color: #7F1D1D;
}

.retry-btn {
  margin-top: 12px;
  padding: 8px 16px;
  cursor: pointer;
}

.production-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 40px;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

/* Button Export */
.btn-export {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dark);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.btn-export:hover {
  border-color: var(--text-muted);
  background: var(--bg-page);
}

.btn-saisie {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--w-yellow, #FBBF24);
  border: 1px solid var(--w-dark, #1A1A1A);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: 13px;
  font-weight: 700;
  color: var(--w-dark, #1A1A1A);
  cursor: pointer;
  transition: transform 0.1s ease;
  box-shadow: 2px 2px 0px var(--w-dark, #1A1A1A);
}

.btn-saisie:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

/* Layout */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.bottom-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 80px 0;
  color: var(--text-muted);
}

/* Responsive */
@media (max-width: 1024px) {
  .bottom-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
