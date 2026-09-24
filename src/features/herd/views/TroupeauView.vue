<script setup>
import { ref, onMounted } from 'vue';
import AnimalCard from '../components/AnimalCard.vue';
import DonutChart from '../components/DonutChart.vue';
import AnimalFormDrawer from '../components/AnimalFormDrawer.vue';
import PnModal from '../../../components/ui/PnModal.vue';
import PnButton from '../../../components/ui/PnButton.vue';
import { getAnimalsList, createAnimal, updateAnimal, deleteAnimal } from '../../../services/animal_service.js';
import { 
  PhPlus, 
  PhMagnifyingGlass, 
  PhCaretDown, 
  PhChartPieSlice,
  PhWarningCircle
} from '@phosphor-icons/vue';

// Simulate loading state for UX
const isLoading = ref(true);
const animals = ref([]);

onMounted(async () => {
  try {
    animals.value = await getAnimalsList('demo-exploitation-id');
  } catch (err) {
    console.error("Failed to load animals", err);
  } finally {
    isLoading.value = false;
  }
});

// CRUD State
const isDrawerOpen = ref(false);
const selectedAnimal = ref(null);
const isDeleteModalOpen = ref(false);
const animalToDelete = ref(null);
const isDeleting = ref(false);

// CRUD Methods
const openCreateDrawer = () => {
  selectedAnimal.value = null;
  isDrawerOpen.value = true;
};

const openEditDrawer = (animal) => {
  selectedAnimal.value = animal;
  isDrawerOpen.value = true;
};

const handleSaveAnimal = async (animalData) => {
  try {
    if (selectedAnimal.value) {
      // Update
      const updated = await updateAnimal(selectedAnimal.value.id, animalData);
      const idx = animals.value.findIndex(a => a.id === updated.id);
      if (idx !== -1) animals.value[idx] = updated;
    } else {
      // Create
      const created = await createAnimal(animalData);
      animals.value.unshift(created);
    }
    isDrawerOpen.value = false;
  } catch (err) {
    console.error("Failed to save animal", err);
  }
};

const confirmDelete = (animal) => {
  animalToDelete.value = animal;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!animalToDelete.value) return;
  isDeleting.value = true;
  try {
    await deleteAnimal(animalToDelete.value.id);
    animals.value = animals.value.filter(a => a.id !== animalToDelete.value.id);
    isDeleteModalOpen.value = false;
    animalToDelete.value = null;
  } catch (err) {
    console.error("Failed to delete animal", err);
  } finally {
    isDeleting.value = false;
  }
};

// Chart Data
const raceData = {
  labels: ['Gudali', 'Montbéliarde'],
  datasets: [{
    data: [6, 6],
    backgroundColor: ['#475F51', '#C87533'],
    borderWidth: 0,
    hoverOffset: 4
  }]
};

const statusData = {
  labels: ['Lactation', 'Tarie', 'Alerte'],
  datasets: [{
    data: [7, 3, 2],
    backgroundColor: ['#475F51', '#C87533', '#B45309'],
    borderWidth: 0,
    hoverOffset: 4
  }]
};

const searchQuery = ref('');
const filterLactation = ref(false);
const filterTarie = ref(false);
const filterAlerte = ref(false);

</script>

<template>
  <div class="troupeau-view animate-fade-in">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Mon Troupeau</h1>
        <p class="page-subtitle">12 animaux enregistrés • 9 en lactation • 3 taries</p>
      </div>
      <button class="btn-primary" @click="openCreateDrawer">
        <PhPlus :size="16" weight="bold" />
        Ajouter un animal
      </button>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="search-box">
        <PhMagnifyingGlass :size="18" class="search-icon" color="#9CA3AF" />
        <input type="text" placeholder="Rechercher par nom..." v-model="searchQuery" class="search-input" />
      </div>

      <div class="filters">
        <div class="select-wrapper">
          <select class="filter-select">
            <option>Race : Toutes</option>
            <option>Gudali</option>
            <option>Montbéliarde</option>
          </select>
          <PhCaretDown :size="12" class="select-icon" />
        </div>

        <div class="select-wrapper">
          <select class="filter-select">
            <option>Statut : Tous</option>
            <option>En Lactation</option>
            <option>Tarie</option>
          </select>
          <PhCaretDown :size="12" class="select-icon" />
        </div>

        <div class="pill-filters">
          <button class="filter-pill" :class="{active: filterLactation}" @click="filterLactation = !filterLactation">
            <span class="dot dot-green"></span> Lactation
          </button>
          <button class="filter-pill" :class="{active: filterTarie}" @click="filterTarie = !filterTarie">
            <span class="dot dot-orange"></span> Tarie
          </button>
          <button class="filter-pill" :class="{active: filterAlerte}" @click="filterAlerte = !filterAlerte">
            <span class="dot dot-red"></span> Alerte
          </button>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid-container" v-if="!isLoading">
      <AnimalCard 
        v-for="animal in animals" 
        :key="animal.id" 
        :animal="animal.isWarning ? { ...animal, status: 'alerte_production' } : animal" 
        @edit="openEditDrawer"
        @delete="confirmDelete"
      />
    </div>
    
    <!-- Skeleton Loading -->
    <div class="grid-container" v-else>
      <div v-for="i in 12" :key="i" class="skeleton-card">
        <div class="skel-header">
          <div class="skel-avatar"></div>
          <div class="skel-titles">
            <div class="skel-line w-24"></div>
            <div class="skel-line w-16 mt-1"></div>
          </div>
          <div class="skel-badge"></div>
        </div>
        <div class="skel-body">
           <div class="skel-line w-full h-8 mt-4"></div>
           <div class="skel-line w-3/4 mt-4"></div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section">
      <DonutChart title="Répartition par race" :icon="PhChartPieSlice" :data="raceData" centerText1="12" centerText2="animaux" />
      <DonutChart title="Répartition par statut" :icon="PhChartPieSlice" :data="statusData" centerText1="12" centerText2="animaux" />
      
      <!-- Summary Card -->
      <div class="summary-card">
        <h3 class="summary-title">Résumé rapide</h3>
        <div class="summary-list">
          <div class="summary-item">
            <div class="item-label">
              <span class="dot dot-green"></span> En lactation
            </div>
            <span class="item-value">7</span>
          </div>
          <div class="summary-item">
            <div class="item-label">
              <span class="dot dot-orange"></span> Taries
            </div>
            <span class="item-value">3</span>
          </div>
          <div class="summary-item pb-4 border-b">
            <div class="item-label">
              <span class="dot dot-red"></span> Alertes actives
            </div>
            <span class="item-value">2</span>
          </div>
          <div class="summary-item pt-4 total-row">
            <span class="item-label-text">Production totale/jour</span>
            <span class="item-value">128.6 L</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals & Drawers -->
    <AnimalFormDrawer 
      v-model:isOpen="isDrawerOpen" 
      :animal="selectedAnimal"
      @save="handleSaveAnimal"
    />

    <PnModal
      v-model="isDeleteModalOpen"
      title="Supprimer l'animal"
    >
      <div class="delete-content">
        <PhWarningCircle :size="32" color="#EF4444" weight="duotone" />
        <p>
          Êtes-vous sûr de vouloir supprimer <strong>{{ animalToDelete?.name }}</strong> du troupeau ? 
          Cette action est irréversible et supprimera tout l'historique associé.
        </p>
      </div>
      <template #footer>
        <PnButton variant="secondary" @click="isDeleteModalOpen = false" :disabled="isDeleting">
          Annuler
        </PnButton>
        <PnButton variant="primary" style="background-color: #EF4444;" @click="handleDelete" :loading="isDeleting">
          Oui, supprimer
        </PnButton>
      </template>
    </PnModal>

  </div>
</template>

<style scoped>
.troupeau-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* --- Header --- */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #C87533;
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.btn-primary:hover {
  background: #B0652B;
}

/* --- Toolbar --- */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 12px 16px;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.search-input {
  width: 100%;
  padding: 10px 10px 10px 36px;
  border: 1px solid var(--border-input);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  color: var(--text-dark);
  outline: none;
  transition: border-color var(--transition-fast);
}

.search-input:focus {
  border-color: var(--primary);
}

.filters {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.select-wrapper {
  position: relative;
}

.filter-select {
  appearance: none;
  padding: 8px 28px 8px 12px;
  background: var(--bg-white);
  border: 1px solid var(--border-input);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  color: var(--text-dark);
  cursor: pointer;
  outline: none;
}

.select-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-muted);
}

.pill-filters {
  display: flex;
  gap: 8px;
  margin-left: 8px;
  border-left: 1px solid var(--border-light);
  padding-left: 16px;
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--bg-page);
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  font-family: var(--font-family);
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--text-dark);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-pill:hover, .filter-pill.active {
  background: rgba(200, 117, 51, 0.1);
  border-color: rgba(200, 117, 51, 0.3);
  color: var(--primary);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot-green { background-color: #16A34A; }
.dot-orange { background-color: #C87533; }
.dot-red { background-color: #EF4444; }

/* --- Grid --- */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* --- Skeleton --- */
.skeleton-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 16px;
}

.skel-header { display: flex; gap: 12px; align-items: flex-start; justify-content: space-between; }
.skel-avatar { width: 48px; height: 48px; border-radius: 50%; background: #E5E7EB; animation: pulse 1.5s infinite; }
.skel-titles { flex: 1; }
.skel-badge { width: 60px; height: 18px; border-radius: 12px; background: #E5E7EB; animation: pulse 1.5s infinite; }
.skel-line { height: 12px; border-radius: 4px; background: #E5E7EB; animation: pulse 1.5s infinite; }
.w-24 { width: 6rem; }
.w-16 { width: 4rem; }
.w-full { width: 100%; }
.w-3\/4 { width: 75%; }
.mt-1 { margin-top: 4px; }
.mt-4 { margin-top: 16px; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

/* --- Stats Section --- */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 16px;
}

.summary-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.summary-title {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 24px;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-sm);
  color: var(--text-dark);
}

.item-value {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--text-dark);
}

.border-b { border-bottom: 1px solid var(--border-light); }
.pb-4 { padding-bottom: 16px; }
.pt-4 { padding-top: 16px; }

.item-label-text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

/* Modals */
.delete-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 10px 0;
}
.delete-content p {
  color: var(--text-dark);
  font-size: var(--font-size-base);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-section {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .search-box {
    width: 100%;
  }
  .filters {
    justify-content: space-between;
  }
  .pill-filters {
    margin-left: 0;
    border-left: none;
    padding-left: 0;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
