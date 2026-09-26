<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PhMagnifyingGlass, PhCaretRight } from '@phosphor-icons/vue';
import { getWorkerAnimals } from '../../../services/worker_service.js';
import { useExploitation } from '../../../composables/useExploitation.js';

const router = useRouter();
const { getActiveExploitation } = useExploitation();
const searchQuery = ref('');
const animals = ref([]);
const loading = ref(true);

onMounted(async () => {
  const exploitationId = getActiveExploitation();
  if (exploitationId) {
    try {
      animals.value = await getWorkerAnimals(exploitationId);
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  }
});

const filteredAnimals = computed(() => {
  if (!searchQuery.value) return animals.value;
  return animals.value.filter(a => 
    a.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    (a.identifiant && a.identifiant.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

function goToAnimal(id) {
  router.push({ name: 'worker-animal-detail', params: { id } });
}
</script>

<template>
  <div class="worker-animals-view">
    
    <header class="page-header">
      <div class="tag tag-outline">CHEPTEL</div>
      <h1 class="page-title">Animaux</h1>
      <p class="page-subtitle">24 vaches en lactation</p>
    </header>

    <div class="search-container">
      <PhMagnifyingGlass :size="20" weight="bold" class="search-icon" />
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Nom ou numéro de boucle" 
        class="search-input"
      />
    </div>

    <div class="animal-list" v-if="!loading">
      <div 
        v-for="animal in filteredAnimals" 
        :key="animal.id"
        class="animal-card"
        @click="goToAnimal(animal.id)"
      >
        <div class="card-icon" :class="{ 'icon-done': animal.done }">
          <span style="font-weight:900;font-size:18px;">{{ animal.name ? animal.name.charAt(0) : '?' }}</span>
        </div>
        
        <div class="card-content">
          <h4 class="card-title">{{ animal.name }} #{{ animal.identifiant }}</h4>
          <p class="card-meta">{{ animal.race }} • {{ animal.lastMilkingTime }} • {{ animal.lastMilkingVolume }}</p>
        </div>
        
        <div class="card-status">
          <span class="status-tag" :class="animal.done ? 'tag-green' : 'tag-yellow'">
            {{ animal.status }}
          </span>
          <PhCaretRight :size="20" weight="bold" />
        </div>
      </div>
    </div>
    <div v-else style="padding: 24px; text-align: center;">Chargement...</div>

  </div>
</template>

<style scoped>
.worker-animals-view {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

/* Search */
.search-container {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border: var(--w-border);
  height: 48px;
  padding: 0 12px;
}

.search-icon {
  margin-right: 8px;
  color: var(--w-dark);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  color: var(--w-dark);
}

/* List */
.animal-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.animal-card {
  background: #FFFFFF;
  border: var(--w-border);
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 12px;
  cursor: pointer;
  /* Very subtle shadow for cards in list to separate them */
  box-shadow: 2px 2px 0px var(--w-dark);
}

.animal-card:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px var(--w-dark);
}

.card-icon {
  width: 48px;
  height: 48px;
  background-color: var(--w-yellow);
  border: 1px solid var(--w-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon.icon-done {
  background-color: #D1FAE5; /* Light green */
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
}

.card-meta {
  font-size: 11px;
  font-weight: 600;
  color: var(--w-gray);
  margin-top: 4px;
}

.card-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-tag {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 6px;
  border: 1px solid var(--w-dark);
}

.tag-yellow {
  background-color: var(--w-yellow);
}

.tag-green {
  background-color: #D1FAE5;
}
</style>
