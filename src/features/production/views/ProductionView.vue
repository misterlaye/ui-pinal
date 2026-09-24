<script setup>
import { ref, onMounted } from 'vue';
import { PhDownloadSimple } from '@phosphor-icons/vue';
import { getProductionSummary } from '../../../services/production_service.js';

import ProductionKPIs from '../components/ProductionKPIs.vue';
import ProductionChart from '../components/ProductionChart.vue';
import ProductionTable from '../components/ProductionTable.vue';
import ProductionHistory from '../components/ProductionHistory.vue';

const productionData = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const data = await getProductionSummary();
    productionData.value = data;
  } catch (error) {
    console.error("Erreur de chargement des données de production", error);
  } finally {
    isLoading.value = false;
  }
});

const exportReport = () => {
  alert("Génération du rapport PDF en cours...");
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
        <button class="btn-export" @click="exportReport">
          <PhDownloadSimple :size="16" weight="bold" />
          Exporter le rapport
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div v-if="isLoading" class="loading-state">
      Chargement du tableau de bord...
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
