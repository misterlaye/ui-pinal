<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PhDownloadSimple } from '@phosphor-icons/vue';
import { getHealthDashboard } from '../../../services/health_service.js';

import HealthKPIs from '../components/HealthKPIs.vue';
import HealthAlerts from '../components/HealthAlerts.vue';
import HealthHistory from '../components/HealthHistory.vue';
import HealthVaccinationCalendar from '../components/HealthVaccinationCalendar.vue';
import HealthThermalStress from '../components/HealthThermalStress.vue';

const router = useRouter();
const healthData = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const data = await getHealthDashboard();
    healthData.value = data;
  } catch (error) {
    console.error("Erreur de chargement des données de santé", error);
  } finally {
    isLoading.value = false;
  }
});

const exportReport = () => {
  alert("Génération du rapport de suivi sanitaire en cours...");
};

const handleViewAnimal = (animalId) => {
  router.push(`/dashboard/troupeau/${animalId}`);
};

const handleResolveAlert = (alertId) => {
  // In a real app, this would call the API.
  // Here we just decrement the count visually for UX demonstration.
  if (healthData.value && healthData.value.kpis.alertsCount > 0) {
    healthData.value.kpis.alertsCount--;
  }
};
</script>

<template>
  <div class="health-view">
    
    <!-- Header Section -->
    <header class="page-header">
      <div class="header-titles">
        <h1 class="page-title">Suivi Sanitaire</h1>
        <p class="page-subtitle">Surveillance IA de la santé du cheptel</p>
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
      Chargement du suivi sanitaire...
    </div>

    <div v-else-if="healthData" class="dashboard-content">
      
      <!-- Top KPIs -->
      <section class="section">
        <HealthKPIs :kpis="healthData.kpis" />
      </section>

      <!-- Active Alerts -->
      <section class="section">
        <HealthAlerts 
          :alerts="healthData.alerts" 
          @view-animal="handleViewAnimal"
          @resolve-alert="handleResolveAlert"
        />
      </section>

      <!-- History & Vaccination Layout -->
      <section class="section split-layout">
        <div class="history-container">
          <HealthHistory :history="healthData.history" />
        </div>
        <div class="vaccination-container">
          <HealthVaccinationCalendar :vaccinations="healthData.vaccinations" />
        </div>
      </section>

      <!-- Thermal Stress -->
      <section class="section">
        <HealthThermalStress :thermalData="healthData.thermalStress" />
      </section>

    </div>

  </div>
</template>

<style scoped>
.health-view {
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

.split-layout {
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
  .split-layout {
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
