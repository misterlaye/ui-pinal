<script setup>
import { ref, computed, onMounted } from 'vue';
import { apiErrorMessage } from '../../../utils/apiError.js';
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
const isRefreshing = ref(false);
const loadError = ref('');
const showChargeModal = ref(false);
const showPriceModal = ref(false);

const loadData = async (isRefresh = false) => {
  if (isRefresh) {
    isRefreshing.value = true;
  } else {
    isLoading.value = true;
  }
  loadError.value = '';
  try {
    financeData.value = await getFinanceDashboard();
  } catch (error) {
    loadError.value = apiErrorMessage(error, 'Impossible de charger les données financières.');
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
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

// Avertissements du calcul (prix manquants, aucune traite) : affichés tels quels, jamais masqués.
const avertissements = computed(() => financeData.value?.moisEnCours?.avertissements || []);
const prixLaitManquant = computed(() => avertissements.value.some(a => a.code === 'PRIX_LAIT_MANQUANT'));

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
    
    <div v-else-if="loadError" class="error-state">
      <div class="error-card">
        <h3>Données financières indisponibles</h3>
        <p>{{ loadError }}</p>
        <button class="btn-primary mt-4" @click="loadData()">Réessayer</button>
      </div>
    </div>

    <div v-else-if="financeData" class="dashboard-content">
      
      <!-- Refreshing overlay -->
      <div v-if="isRefreshing" class="refresh-overlay">
        <div class="refresh-spinner"></div>
        <span>Actualisation des données...</span>
      </div>
      
      <!-- Données manquantes : chaque valeur non calculable est expliquée -->
      <section v-if="avertissements.length" class="section warnings" role="status">
        <p class="warnings-title">Certaines valeurs ne peuvent pas être calculées :</p>
        <ul>
          <li v-for="(a, i) in avertissements" :key="a.code + i">{{ a.message }}</li>
        </ul>
        <button v-if="prixLaitManquant" class="btn-primary" @click="openPriceModal">Configurer le prix du lait</button>
      </section>

      <!-- Top KPIs -->
      <section class="section">
        <FinanceKPIs :resultat="financeData.moisEnCours" />
      </section>

      <!-- Charts (Bar & Pie) -->
      <section class="section">
        <FinanceCharts
          :historique="financeData.historique"
          :repartition="financeData.chargesRepartition"
        />
      </section>

      <!-- Rentability Bar -->
      <section class="section">
        <FinanceRentabilityBar :resultat="financeData.moisEnCours" />
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
      @charge-created="() => loadData(true)" 
    />

    <SetPrixVenteModal
      :show="showPriceModal"
      @close="showPriceModal = false"
      @price-created="() => loadData(true)"
    />

  </div>
</template>

<style scoped>
.warnings {
  padding: 16px;
  border: 1px solid #F59E0B;
  border-radius: 8px;
  background: #FFFBEB;
  color: #78350F;
}

.warnings-title {
  font-weight: 600;
  margin: 0 0 8px;
}

.warnings ul {
  margin: 0 0 12px;
  padding-left: 18px;
}

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

/* Refresh Overlay */
.refresh-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(2px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 50;
  font-size: 14px;
  color: var(--text-dark);
  font-weight: 500;
}

.refresh-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-light);
  border-top-color: var(--text-dark);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
