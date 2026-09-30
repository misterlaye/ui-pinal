<script setup>
import { ref, onMounted } from 'vue';
import { PhDownloadSimple, PhPlus } from '@phosphor-icons/vue';
import { getFinanceDashboard } from '../../../services/finance_service.js';

import FinanceKPIs from '../components/FinanceKPIs.vue';
import FinanceCharts from '../components/FinanceCharts.vue';
import FinanceRentabilityBar from '../components/FinanceRentabilityBar.vue';
import FinanceTransactions from '../components/FinanceTransactions.vue';
import CreateChargeModal from '../components/CreateChargeModal.vue';
import SetPrixVenteModal from '../components/SetPrixVenteModal.vue';

const financeData = ref(null);
const isLoading = ref(true);
const missingPriceError = ref(false);
const showChargeModal = ref(false);
const showPriceModal = ref(false);

const loadData = async () => {
  isLoading.value = true;
  missingPriceError.value = false;
  try {
    const data = await getFinanceDashboard();
    financeData.value = data;
  } catch (error) {
    if (error.response && error.response.status === 422) {
      missingPriceError.value = true;
    } else {
      console.error("Erreur de chargement des données financières", error);
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadData();
});

const exportReport = () => {
  if (!financeData.value) return;
  const rows = [
    ['Date', 'Description', 'Categorie', 'Type', 'Montant'],
    ...(financeData.value.transactions || []).map(t => [t.date, t.label, t.category, t.type, t.amount])
  ];
  const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(";")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `rapport_financier_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const newTransaction = () => {
  showChargeModal.value = true;
};

const openPriceModal = () => {
  showPriceModal.value = true;
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
        <button class="btn-secondary" @click="openPriceModal" title="Prix de vente du lait">
          Prix du lait
        </button>
        <button class="btn-secondary" @click="exportReport">
          <PhDownloadSimple :size="16" weight="bold" />
          Exporter CSV
        </button>
        <button class="btn-primary" @click="newTransaction">
          <PhPlus :size="16" weight="bold" />
          Nouvelle charge
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div v-if="isLoading" class="loading-state">
      Chargement du module financier...
    </div>
    
    <div v-else-if="missingPriceError" class="error-state">
      <div class="error-card">
        <h3>Configuration requise</h3>
        <p>Impossible de calculer le chiffre d'affaires et la rentabilité.</p>
        <p>Veuillez configurer un <strong>prix de vente du lait</strong> pour la période en cours.</p>
        <button class="btn-primary mt-4" @click="openPriceModal">Configurer le prix du lait</button>
      </div>
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

    <!-- Modals -->
    <CreateChargeModal 
      :show="showChargeModal" 
      @close="showChargeModal = false" 
      @charge-created="loadData" 
    />

    <SetPrixVenteModal
      :show="showPriceModal"
      @close="showPriceModal = false"
      @price-created="loadData"
    />

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

.error-state {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.error-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 32px;
  text-align: center;
  max-width: 400px;
}

.error-card h3 {
  color: #EF4444;
  margin-top: 0;
}

.error-card p {
  color: var(--text-muted);
  margin-bottom: 8px;
}

.mt-4 {
  margin-top: 16px;
  justify-content: center;
  width: 100%;
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
