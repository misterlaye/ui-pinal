<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PhDownloadSimple } from '@phosphor-icons/vue';
import { getHealthDashboard, resolveHealthAlert } from '../../../services/health_service.js';

import HealthKPIs from '../components/HealthKPIs.vue';
import HealthAlerts from '../components/HealthAlerts.vue';
import HealthHistory from '../components/HealthHistory.vue';
import HealthVaccinationCalendar from '../components/HealthVaccinationCalendar.vue';
import HealthThermalStress from '../components/HealthThermalStress.vue';
import ResolveAlertModal from '../components/ResolveAlertModal.vue';

const router = useRouter();
const healthData = ref(null);
const isLoading = ref(true);
const isResolveModalOpen = ref(false);
const alertToResolve = ref(null);

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
  if (!healthData.value) return;
  const rows = [
    ['Type', 'Animal', 'Date', 'Description / Message', 'Statut / Severite'],
    ...(healthData.value.alerts || []).map(a => ['ALERTE', a.animalName, a.date, a.message, a.severity]),
    ...(healthData.value.history || []).map(h => ['HISTORIQUE', h.animalName, h.date, h.description, h.status])
  ];
  const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(";")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `suivi_sanitaire_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleViewAnimal = (animalId) => {
  router.push(`/dashboard/troupeau/${animalId}`);
};

const handleResolveAlertClick = (alert) => {
  alertToResolve.value = alert;
  isResolveModalOpen.value = true;
};

const handleResolveSubmit = async (payload) => {
  try {
    // payload: { eventId, animalId, description, diagnostic, traitement, dateFin }
    await resolveHealthAlert(payload.animalId, payload.eventId, {
      description: payload.description,
      diagnostic: payload.diagnostic,
      traitement: payload.traitement,
      dateFin: payload.dateFin
    });
    
    isResolveModalOpen.value = false;
    
    // Refresh the dashboard to get updated KPIs and History
    isLoading.value = true;
    healthData.value = await getHealthDashboard();
  } catch (error) {
    console.error("Erreur lors de la résolution de l'alerte", error);
    alert("Impossible de clôturer l'alerte.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="health-view">
    
    <!-- Resolve Alert Modal -->
    <ResolveAlertModal
      :is-open="isResolveModalOpen"
      :alert="alertToResolve"
      @close="isResolveModalOpen = false"
      @submit="handleResolveSubmit"
    />

    <!-- Header Section -->
    <header class="page-header">
      <div class="header-titles">
        <h1 class="page-title">Suivi Sanitaire</h1>
        <p class="page-subtitle">Surveillance IA de la santé du cheptel</p>
      </div>
      
      <div class="header-actions">
        <button class="btn-export" @click="exportReport">
          <PhDownloadSimple :size="16" weight="bold" />
          Exporter CSV
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
          @resolve-alert="handleResolveAlertClick"
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
