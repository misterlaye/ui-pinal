<script setup>
import { ref, onMounted } from 'vue';
import { 
  getExploitationCycles, 
  declarerInsemination, 
  enregistrerConstat, 
  declarerVelage, 
  declarerAvortement 
} from '../../../services/reproduction_service.js';

import ReproductionKPIs from '../components/ReproductionKPIs.vue';
import ActiveCyclesList from '../components/ActiveCyclesList.vue';
import DeclareInseminationModal from '../components/DeclareInseminationModal.vue';
import DeclareConstatModal from '../components/DeclareConstatModal.vue';
import DeclareVelageModal from '../components/DeclareVelageModal.vue';

const isLoading = ref(true);
const animals = ref([]);
const cycles = ref([]);

// Modals State
const isInsModalOpen = ref(false);
const isConstatModalOpen = ref(false);
const isVelageModalOpen = ref(false);

const selectedAnimal = ref(null);
const selectedCycle = ref(null);

const fetchData = async () => {
  isLoading.value = true;
  try {
    const exploitationId = localStorage.getItem('active_exploitation_id');
    const data = await getExploitationCycles(exploitationId);
    animals.value = data.animals;
    cycles.value = data.cycles;
  } catch (e) {
    console.error("Erreur chargement reproduction", e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchData);

// Handlers for List Actions
const handleAction = ({ type, animal, cycle }) => {
  selectedAnimal.value = animal;
  selectedCycle.value = cycle;

  if (type === 'INSEMINATION') isInsModalOpen.value = true;
  else if (type === 'CONSTAT') isConstatModalOpen.value = true;
  else if (type === 'VELAGE') isVelageModalOpen.value = true;
  else if (type === 'AVORTEMENT') confirmAvortement(cycle);
};

const confirmAvortement = async (cycle) => {
  if (confirm("Êtes-vous sûr de vouloir déclarer un avortement pour ce cycle ? Cette action est irréversible.")) {
    try {
      await declarerAvortement(cycle.id);
      alert("Avortement déclaré avec succès.");
      await fetchData();
    } catch(e) {
      alert("Erreur lors de la déclaration.");
    }
  }
};

// Modal Submits
const handleInseminationSubmit = async (payload) => {
  try {
    await declarerInsemination(payload);
    isInsModalOpen.value = false;
    await fetchData();
  } catch (e) {
    alert("Erreur: " + e.message);
  }
};

const handleConstatSubmit = async (payload) => {
  try {
    await enregistrerConstat(payload.cycleId, payload);
    isConstatModalOpen.value = false;
    await fetchData();
  } catch (e) {
    alert("Erreur: " + e.message);
  }
};

const handleVelageSubmit = async (payload) => {
  try {
    await declarerVelage(payload.cycleId, payload);
    isVelageModalOpen.value = false;
    await fetchData();
  } catch (e) {
    alert("Erreur: " + e.message);
  }
};

</script>

<template>
  <div class="reproduction-view">
    
    <!-- Modals -->
    <DeclareInseminationModal 
      :is-open="isInsModalOpen" 
      :animal="selectedAnimal"
      @close="isInsModalOpen = false"
      @submit="handleInseminationSubmit"
    />

    <DeclareConstatModal 
      :is-open="isConstatModalOpen" 
      :animal="selectedAnimal"
      :cycle="selectedCycle"
      @close="isConstatModalOpen = false"
      @submit="handleConstatSubmit"
    />

    <DeclareVelageModal 
      :is-open="isVelageModalOpen" 
      :animal="selectedAnimal"
      :cycle="selectedCycle"
      @close="isVelageModalOpen = false"
      @submit="handleVelageSubmit"
    />

    <!-- Header -->
    <header class="page-header">
      <div class="header-titles">
        <h1 class="page-title">Reproduction & Génétique</h1>
        <p class="page-subtitle">Suivi précis des cycles, IA, et gestations</p>
      </div>
    </header>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      Chargement du suivi de reproduction...
    </div>

    <div v-else class="dashboard-content">
      <!-- Top KPIs -->
      <section class="section fade-in">
        <ReproductionKPIs :cycles="cycles" />
      </section>

      <!-- Active Cycles List -->
      <section class="section fade-in delay-1">
        <ActiveCyclesList 
          :animals="animals" 
          :cycles="cycles" 
          @action="handleAction"
        />
      </section>
    </div>

  </div>
</template>

<style scoped>
.reproduction-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0 0 4px 0;
  background: linear-gradient(90deg, #1E293B, #334155);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
  font-weight: 500;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 0;
  color: var(--text-muted);
  font-weight: 500;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0,0,0,0.1);
  border-left-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-in {
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
}
.delay-1 { animation-delay: 0.1s; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
