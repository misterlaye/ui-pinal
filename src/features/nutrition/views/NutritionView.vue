<script setup>
import { ref, onMounted } from 'vue';
import { PhDownloadSimple, PhPlus } from '@phosphor-icons/vue';
import { getNutritionDashboard } from '../../../services/nutrition_service.js';

import NutritionKPIs from '../components/NutritionKPIs.vue';
import NutritionRationGroups from '../components/NutritionRationGroups.vue';
import NutritionStockTable from '../components/NutritionStockTable.vue';
import NutritionDeliveries from '../components/NutritionDeliveries.vue';
import NutritionCatalogue from '../components/NutritionCatalogue.vue';

const currentTab = ref('dashboard');
const nutritionData = ref(null);
const isLoading = ref(true);

const loadDashboardData = async () => {
  try {
    isLoading.value = true;
    const data = await getNutritionDashboard();
    nutritionData.value = data;
  } catch (error) {
    console.error("Erreur de chargement des données de nutrition", error);
  } finally {
    isLoading.value = false;
  }
};

const switchTab = (tab) => {
  currentTab.value = tab;
  if (tab === 'dashboard') {
    loadDashboardData();
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>

<template>
  <div class="nutrition-view">
    
    <!-- Header Section -->
    <header class="page-header">
      <div class="header-titles">
        <h1 class="page-title">Nutrition & Alimentation</h1>
        <p class="page-subtitle">Gestion des rations, du coût journalier et du catalogue d'aliments</p>
      </div>
      
      <div class="header-actions">
        <button class="btn-primary" @click="switchTab('catalogue')">
          <PhPlus :size="16" weight="bold" />
          Catalogue d'aliments
        </button>
      </div>
    </header>

    <div class="tabs-nav">
      <button class="tab-btn" :class="{ active: currentTab === 'dashboard' }" @click="switchTab('dashboard')">
        Tableau de bord
      </button>
      <button class="tab-btn" :class="{ active: currentTab === 'catalogue' }" @click="switchTab('catalogue')">
        Catalogue d'aliments & Prix
      </button>
    </div>

    <!-- Main Content -->
    <div v-if="isLoading && !nutritionData" class="loading-state">
      Chargement du module nutrition...
    </div>

    <div v-else-if="currentTab === 'dashboard' && nutritionData" class="dashboard-content">
      
      <!-- Top KPIs -->
      <section class="section">
        <NutritionKPIs :kpis="nutritionData.kpis" />
      </section>

      <!-- Ration Groups -->
      <section class="section">
        <NutritionRationGroups :groups="nutritionData.rationGroups" />
      </section>

      <!-- Stock & Daily Consumption Table -->
      <section class="section">
        <NutritionStockTable :stocks="nutritionData.stocks" />
      </section>

    </div>

    <div v-else-if="currentTab === 'catalogue'">
      <NutritionCatalogue />
    </div>

  </div>
</template>

<style scoped>
.nutrition-view {
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

/* Tabs */
.tabs-nav {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 8px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 12px 0;
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  position: relative;
  transition: color var(--transition-fast);
}

.tab-btn:hover {
  color: var(--text-dark);
}

.tab-btn.active {
  color: var(--text-dark);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--text-dark);
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
