<script setup>
import { apiErrorMessage } from '../../../utils/apiError.js';
import { ref, onMounted } from 'vue';
import { PhDrop } from '@phosphor-icons/vue';
import { getWorkerHomeData } from '../../../services/worker_service.js';
import { useExploitation } from '../../../composables/useExploitation.js';

const { getActiveExploitation } = useExploitation();
const historyItems = ref([]);
const summary = ref({ traites: 0, volume: 0, seance: 'MATIN' });
const loading = ref(true);
const loadError = ref('');

onMounted(async () => {
  try {
    const data = await getWorkerHomeData(getActiveExploitation());
    historyItems.value = data.recentActivities;
    summary.value = {
      traites: data.traitesSeance,
      volume: data.volumeSeance,
      seance: data.seance
    };
  } catch (err) {
    loadError.value = apiErrorMessage(err, "Impossible de charger l'historique.");
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="worker-history-view">
    
    <header class="page-header">
      <div class="tag tag-outline">JOURNAL</div>
      <h1 class="page-title">Historique</h1>
      <p class="page-subtitle">Séance en cours et dernières traites enregistrées sur l'exploitation</p>
    </header>

    <p v-if="loadError" class="load-error" role="alert">{{ loadError }}</p>

    <!-- Big Summary Banner -->
    <div class="summary-banner" v-if="!loading && !loadError">
      <div class="summary-left">
        <span class="summary-label">TRAITES ({{ summary.seance === 'SOIR' ? 'SOIR' : 'MATIN' }})</span>
        <span class="summary-val">{{ summary.traites }}</span>
      </div>
      <div class="summary-right">
        <span class="summary-label">VOLUME</span>
        <span class="summary-val">{{ summary.volume.toFixed(1) }} L</span>
      </div>
    </div>

    <!-- History List -->
    <div class="history-list" v-if="!loading">
      <div 
        v-for="item in historyItems" 
        :key="item.id"
        class="history-item"
      >
        <div class="item-icon">
          <PhDrop :size="24" weight="fill" color="#1A1A1A" />
        </div>
        
        <div class="item-info">
          <h4 class="item-title">Traite • {{ item.animalName }} #{{ item.animalId }}</h4>
          <p class="item-meta">Aujourd'hui à {{ item.time }}</p>
        </div>
        
        <div class="item-volume">
          {{ item.description }}
        </div>
      </div>
    </div>
    <div v-else style="padding: 24px; text-align: center;">Chargement...</div>

  </div>
</template>

<style scoped>
.load-error {
  margin: 0 16px;
  padding: 12px;
  border: 2px solid #B91C1C;
  background: #FEF2F2;
  color: #7F1D1D;
}

.worker-history-view {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header */
.page-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 4px 6px;
  border: 1px solid var(--w-dark);
}

.tag-outline {
  background-color: transparent;
}

.page-title {
  font-size: 32px;
  font-weight: 400;
  line-height: 1.1;
  margin-top: 4px;
}

.page-subtitle {
  font-size: 12px;
  font-weight: 600;
  color: var(--w-gray);
}

/* Summary Banner */
.summary-banner {
  display: flex;
  border: var(--w-border);
  box-shadow: var(--w-shadow);
  height: 80px;
}

.summary-left {
  flex: 1;
  background-color: var(--w-yellow);
  border-right: var(--w-border);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 16px;
}

.summary-right {
  flex: 2;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 16px;
}

.summary-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.summary-val {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* List */
.history-list {
  display: flex;
  flex-direction: column;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--w-dark);
}

.history-item:last-child {
  border-bottom: none;
}

.item-icon {
  width: 40px;
  height: 40px;
  border: 1px solid var(--w-dark);
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-info {
  flex: 1;
}

.item-title {
  font-size: 14px;
  font-weight: 700;
}

.item-meta {
  font-size: 11px;
  font-weight: 600;
  color: var(--w-gray);
  margin-top: 4px;
}

.item-volume {
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}
</style>
