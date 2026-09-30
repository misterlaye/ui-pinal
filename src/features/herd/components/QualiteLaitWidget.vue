<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { PhDrop, PhWarning } from '@phosphor-icons/vue';
import { getMilkAnalyses } from '../../../services/production_service.js';

const props = defineProps({
  lactationId: {
    type: String,
    required: true
  }
});

const analyses = ref(null);
const isLoading = ref(true);

const loadAnalyses = async () => {
  if (!props.lactationId) return;
  isLoading.value = true;
  try {
    const list = await getMilkAnalyses(props.lactationId);
    if (list && list.length > 0) {
      analyses.value = {
        dateDerniereAnalyse: list[0].dateAnalyse,
        tauxButyreux: list[0].tauxButyreux != null ? list[0].tauxButyreux : '--',
        tauxProteique: list[0].tauxProteique != null ? list[0].tauxProteique : '--',
        cellulesSomatiques: list[0].cellulesSomatiques != null ? list[0].cellulesSomatiques : '--'
      };
    } else {
      analyses.value = null;
    }
  } catch (e) {
    analyses.value = null;
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.lactationId, loadAnalyses);
onMounted(loadAnalyses);

const isCCSWarning = computed(() => {
  return analyses.value && analyses.value.cellulesSomatiques !== '--' && analyses.value.cellulesSomatiques > 250;
});
</script>

<template>
  <div class="qualite-widget">
    <div class="widget-header">
      <span class="widget-title">QUALITÉ DU LAIT</span>
      <span class="analyse-date" v-if="analyses">Dernière analyse : {{ analyses.dateDerniereAnalyse }}</span>
    </div>

    <div class="metrics-grid" v-if="analyses">
      <div class="metric-item">
        <span class="metric-val">{{ analyses.tauxButyreux }}</span>
        <span class="metric-label">TB (g/L)</span>
      </div>
      <div class="metric-item">
        <span class="metric-val">{{ analyses.tauxProteique }}</span>
        <span class="metric-label">TP (g/L)</span>
      </div>
      <div class="metric-item ccs-box" :class="{ 'warning': isCCSWarning }">
        <div class="ccs-header">
          <span class="metric-val">{{ analyses.cellulesSomatiques }}</span>
          <PhWarning v-if="isCCSWarning" :size="20" weight="fill" color="#D9534F" />
          <PhDrop v-else :size="20" weight="fill" color="#10B981" />
        </div>
        <span class="metric-label">Cellules (x1000/mL)</span>
      </div>
    </div>
    <div v-else class="empty-state" style="font-size: 13px; color: var(--text-muted); padding: 8px 0;">
      Aucune analyse de lait enregistrée pour cette lactation.
    </div>
  </div>
</template>

<style scoped>
.qualite-widget {
  background: #FCFBF9;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.widget-title {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.analyse-date {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid var(--border-light);
  padding: 12px;
  border-radius: 4px;
}

.metric-val {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-dark);
}

.metric-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 4px;
}

.ccs-box {
  background: #F4FBF7;
  border-color: #10B981;
}
.ccs-box.warning {
  background: #FEF2F2;
  border-color: #F87171;
}

.ccs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
