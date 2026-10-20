<script setup>
import { apiErrorMessage } from '../../../utils/apiError.js';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { PhArrowLeft, PhCheck, PhDrop } from '@phosphor-icons/vue';
import { getWorkerAnimals } from '../../../services/worker_service.js';
import { recordBatchMilking } from '../../../services/production_service.js';
import { useExploitation } from '../../../composables/useExploitation.js';

const router = useRouter();
const animals = ref([]);
const loading = ref(true);
const isSubmitting = ref(false);

const quantities = ref({});
const milkingType = ref(new Date().getHours() < 12 ? 'MATIN' : 'SOIR');
// Lignes refusées par le serveur (motif par animal) : affichées, la saisie correspondante est conservée.
const rejets = ref([]);
const errorMessage = ref('');

const { getActiveExploitation } = useExploitation();

onMounted(async () => {
  try {
    const expId = getActiveExploitation();
    const data = await getWorkerAnimals(expId);
    animals.value = data;
    
    // Initialize quantities object
    animals.value.forEach(a => {
      quantities.value[a.id] = '';
    });
  } catch (err) {
    errorMessage.value = apiErrorMessage(err, 'Impossible de charger les animaux.');
  } finally {
    loading.value = false;
  }
});

const totalKg = computed(() => {
  let sum = 0;
  for (const id in quantities.value) {
    const val = parseFloat(quantities.value[id]);
    if (!isNaN(val)) sum += val;
  }
  return sum.toFixed(1);
});

const activeInputs = computed(() => {
  let count = 0;
  for (const id in quantities.value) {
    const val = parseFloat(quantities.value[id]);
    if (!isNaN(val) && val > 0) count++;
  }
  return count;
});

async function submitBatch() {
  if (activeInputs.value === 0) return;
  
  isSubmitting.value = true;
  
  const items = [];
  for (const id in quantities.value) {
    const val = parseFloat(quantities.value[id]);
    if (!isNaN(val) && val > 0) {
      items.push({
        animalId: id,
        quantiteLitres: val
      });
    }
  }

  const payload = {
    dateHeure: new Date().toISOString(),
    type: milkingType.value,
    items
  };

  errorMessage.value = '';
  rejets.value = [];
  try {
    const result = await recordBatchMilking(payload);
    applyResult(result);
  } catch (err) {
    if (err.response?.status === 422 && err.response.data?.rejets) {
      // Aucune ligne enregistrée : chaque refus est expliqué.
      applyResult(err.response.data);
    } else {
      errorMessage.value = apiErrorMessage(err, "Erreur lors de l'enregistrement de la traite.");
    }
  } finally {
    isSubmitting.value = false;
  }
}

function applyResult(result) {
  const enregistrees = result?.enregistrees || [];
  rejets.value = (result?.rejets || []).map(r => ({
    ...r,
    animal: animals.value.find(a => a.id === r.animalId)
  }));
  // Les quantités enregistrées sont retirées du formulaire ; les refusées restent pour correction.
  const refuses = new Set(rejets.value.map(r => r.animalId));
  for (const id in quantities.value) {
    if (!refuses.has(id)) quantities.value[id] = '';
  }
  if (rejets.value.length === 0) {
    router.push({ name: 'worker-home' });
  } else if (enregistrees.length > 0) {
    errorMessage.value = `${enregistrees.length} traite(s) enregistrée(s). ${rejets.value.length} ligne(s) refusée(s) :`;
  } else {
    errorMessage.value = 'Aucune traite enregistrée :';
  }
}
</script>

<template>
  <div class="batch-milking">
    <header class="page-header">
      <button class="back-btn" @click="router.back()">
        <PhArrowLeft :size="24" weight="bold" />
      </button>
      <div class="header-titles">
        <span class="tag tag-black">PRODUCTION</span>
        <h1>Saisie par lot</h1>
      </div>
    </header>

    <div class="type-selector">
      <label class="radio-label" :class="{ active: milkingType === 'MATIN' }">
        <input type="radio" v-model="milkingType" value="MATIN" />
        MATIN
      </label>
      <label class="radio-label" :class="{ active: milkingType === 'SOIR' }">
        <input type="radio" v-model="milkingType" value="SOIR" />
        SOIR
      </label>
    </div>

    <div v-if="errorMessage" class="batch-feedback" role="alert">
      <p>{{ errorMessage }}</p>
      <ul v-if="rejets.length">
        <li v-for="rejet in rejets" :key="rejet.animalId || rejet.motif">
          <strong>{{ rejet.animal ? `#${rejet.animal.identifiant} ${rejet.animal.name}` : 'Animal' }}</strong> — {{ rejet.motif }}
        </li>
      </ul>
    </div>

    <div v-if="loading" class="loading">Chargement des animaux...</div>
    
    <div v-else class="animals-list">
      <div class="animal-row" v-for="animal in animals" :key="animal.id">
        <div class="animal-info">
          <span class="animal-id">#{{ animal.identifiant }}</span>
          <span class="animal-name">{{ animal.name }}</span>
        </div>
        <div class="input-wrapper" v-if="animal.isLactating">
          <input 
            type="number" 
            step="0.1" 
            min="0"
            v-model="quantities[animal.id]" 
            placeholder="0.0"
            class="kg-input"
          />
          <span class="unit">L</span>
        </div>
        <div v-else class="tarie-badge">
          TARIE
        </div>
      </div>
    </div>

    <!-- Fixed Bottom Bar -->
    <div class="bottom-bar">
      <div class="summary">
        <div class="summary-val">{{ totalKg }} <span class="summary-unit">L</span></div>
        <div class="summary-sub">{{ activeInputs }} vache(s)</div>
      </div>
      <button 
        class="submit-btn" 
        :disabled="activeInputs === 0 || isSubmitting"
        @click="submitBatch"
      >
        <span v-if="!isSubmitting">VALIDER</span>
        <span v-else>EN COURS...</span>
        <PhCheck v-if="!isSubmitting" :size="20" weight="bold" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.batch-feedback {
  margin: 0 16px 12px;
  padding: 12px;
  border: 2px solid #B91C1C;
  background: #FEF2F2;
  color: #7F1D1D;
  font-size: 14px;
}

.batch-feedback ul {
  margin: 8px 0 0;
  padding-left: 18px;
}

.batch-milking {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--w-bg);
  padding-bottom: 100px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 20px;
  background-color: #FFFFFF;
  border-bottom: var(--w-border);
}

.back-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tag-black {
  background-color: var(--w-dark);
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 4px 6px;
  border: 1px solid var(--w-dark);
  display: inline-block;
  align-self: flex-start;
}

h1 {
  font-size: 24px;
  font-weight: 400;
}

.type-selector {
  display: flex;
  padding: 16px 20px;
  gap: 12px;
}

.radio-label {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: var(--w-border);
  background-color: #FFFFFF;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-label input {
  display: none;
}

.radio-label.active {
  background-color: var(--w-yellow);
  box-shadow: 2px 2px 0px #1A1A1A;
  transform: translate(-2px, -2px);
}

.loading {
  padding: 32px 20px;
  text-align: center;
  font-weight: 600;
}

.animals-list {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.animal-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  border: var(--w-border);
  padding: 12px 16px;
  box-shadow: 1px 1px 0px rgba(0,0,0,0.1);
}

.animal-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.animal-id {
  font-size: 14px;
  font-weight: 700;
}

.animal-name {
  font-size: 12px;
  color: var(--w-gray);
  font-weight: 600;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: var(--w-border);
  background-color: var(--w-bg);
  padding-right: 12px;
}

.kg-input {
  width: 70px;
  border: none;
  background: transparent;
  padding: 12px;
  font-size: 16px;
  font-weight: 700;
  text-align: right;
  outline: none;
}

.unit {
  font-size: 12px;
  font-weight: 700;
  color: var(--w-gray);
}

.tarie-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 4px 8px;
  background-color: #E5E7EB;
  color: #4B5563;
  border-radius: 2px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  border-top: var(--w-border);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
}

.summary {
  display: flex;
  flex-direction: column;
}

.summary-val {
  font-size: 24px;
  font-weight: 700;
}

.summary-unit {
  font-size: 14px;
  color: var(--w-gray);
}

.summary-sub {
  font-size: 11px;
  font-weight: 600;
  color: var(--w-gray);
}

.submit-btn {
  background-color: #10B981;
  color: #FFFFFF;
  border: var(--w-border);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 2px 2px 0px #1A1A1A;
}

.submit-btn:disabled {
  background-color: #E5E5E5;
  color: #A3A3A3;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.submit-btn:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: none;
}
</style>
