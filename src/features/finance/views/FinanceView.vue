<script setup>
import { ref, onMounted } from 'vue';
import { PhDownloadSimple, PhPlus } from '@phosphor-icons/vue';
import { getFinanceDashboard } from '../../../services/finance_service.js';

import FinanceKPIs from '../components/FinanceKPIs.vue';
import FinanceCharts from '../components/FinanceCharts.vue';
import FinanceRentabilityBar from '../components/FinanceRentabilityBar.vue';
import FinanceTransactions from '../components/FinanceTransactions.vue';

const financeData = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const data = await getFinanceDashboard();
    financeData.value = data;
  } catch (error) {
    console.error("Erreur de chargement des données financières", error);
  } finally {
    isLoading.value = false;
  }
});

const exportReport = () => {
  alert("Génération du rapport financier en cours...");
};

const newTransaction = () => {
  alert("Ouverture du formulaire de transaction...");
};
</script>

<template>
  <div class="finance-view">
    
    <!-- Header Section -->
    <header class="page-header">
      <div class="header-titles">
        <h1 class="page-title">Finances de l'exploitation</h1>
        <p class="page-subtitle">Suivi de la rentabilité et des flux financiers</p>
      </div>
      
      <div class="header-actions">
        <button class="btn-secondary" @click="exportReport">
          <PhDownloadSimple :size="16" weight="bold" />
          Exporter le rapport
        </button>
        <button class="btn-primary" @click="newTransaction">
          <PhPlus :size="16" weight="bold" />
          Nouvelle transaction
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div v-if="isLoading" class="loading-state">
      Chargement du module financier...
    </div>

    <div v-else-if="financeData" class="dashboard-content">
      
      <!-- Top KPIs -->
      <section class="section">
        <FinanceKPIs :kpis="financeData.kpis" />
      </section>

      <!-- Charts (Bar & Pie) -->
      <section class="section">
        <FinanceCharts 
          :revenueData="financeData.revenueVsCharges" 
          :repartitionData="financeData.chargesRepartition" 
        />
      </section>

      <!-- Rentability Bar -->
      <section class="section">
        <FinanceRentabilityBar :rentability="financeData.rentability" />
      </section>

      <!-- Transactions Table -->
      <section class="section">
        <FinanceTransactions :transactions="financeData.transactions" />
      </section>

    </div>

  </div>
</template>

<style scoped>
.finance-view {
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

.header-actions {
  display: flex;
  gap: 12px;
}

/* Buttons */
.btn-secondary {
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

.btn-secondary:hover {
  border-color: var(--text-muted);
  background: var(--bg-page);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--text-dark);
  border: 1px solid var(--text-dark);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-white);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary:hover {
  background: #374151; /* Darker gray/black */
  transform: translateY(-1px);
}

/* Layout */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 80px 0;
  color: var(--text-muted);
}

/* Responsive */
@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
