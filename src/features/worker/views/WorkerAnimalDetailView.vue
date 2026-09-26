<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PhArrowLeft, PhDrop } from '@phosphor-icons/vue';
import WorkerMilkingModal from '../components/WorkerMilkingModal.vue';
import { getWorkerAnimalDetail, recordAnimalMilking } from '../../../services/worker_service.js';

const router = useRouter();
const route = useRoute();

const isMilkingModalOpen = ref(false);
const animal = ref(null);
const loading = ref(true);

onMounted(async () => {
  const animalId = route.params.id;
  try {
    animal.value = await getWorkerAnimalDetail(animalId);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

function goBack() {
  router.back();
}

async function handleMilkingSubmit(data) {
  try {
    await recordAnimalMilking(animal.value.id, {
      dateHeure: new Date().toISOString(),
      type: 'MATIN', // Assuming MATIN
      quantiteKg: data.quantity
    });
    isMilkingModalOpen.value = false;
    onMounted(); // Refresh data
  } catch(err) {
    console.error("Erreur", err);
    alert("Erreur lors de l'enregistrement");
  }
}
</script>

<template>
  <div class="worker-animal-detail">
    
    <!-- Milking Modal Overlay -->
    <WorkerMilkingModal 
      :is-open="isMilkingModalOpen" 
      @close="isMilkingModalOpen = false"
      @submit="handleMilkingSubmit"
    />

    <!-- Back button -->
    <button class="back-btn" @click="goBack">
      <PhArrowLeft :size="16" weight="bold" />
      <span>RETOUR</span>
    </button>

    <template v-if="animal">
      <!-- Header Box -->
      <div class="animal-header-box">
        <div class="animal-icon-large">
          <span style="font-weight:900;font-size:32px;">{{ animal.name ? animal.name.charAt(0) : '?' }}</span>
        </div>
        <div class="animal-titles">
          <div class="tag tag-outline">FICHE ANIMAL</div>
          <h1 class="animal-name">{{ animal.name }}</h1>
          <p class="animal-meta">#{{ animal.identifiant }} • {{ animal.race }}</p>
        </div>
      </div>

      <!-- 2x2 Grid -->
      <div class="info-grid">
        <div class="grid-cell top-left">
          <span class="cell-label">ÉTAT</span>
          <span class="cell-val">{{ animal.etat }}</span>
        </div>
        <div class="grid-cell top-right">
          <span class="cell-label">LOT</span>
          <span class="cell-val">{{ animal.lot }}</span>
        </div>
        <div class="grid-cell bottom-left">
          <span class="cell-label">DERNIÈRE TRAITE</span>
          <span class="cell-val">{{ animal.lastMilkingTime }} • {{ animal.lastMilkingVolume }}</span>
        </div>
        <div class="grid-cell bottom-right">
          <span class="cell-label">RATION</span>
          <span class="cell-val">{{ animal.ration }}</span>
        </div>
      </div>

      <!-- Main Action -->
      <button v-if="animal.isLactating" class="big-action-btn" @click="isMilkingModalOpen = true">
        <PhDrop :size="20" weight="fill" />
        ENREGISTRER SA TRAITE
      </button>
      <div v-else class="tarie-message">
        Cet animal est actuellement tari (aucune lactation en cours).
      </div>

      <!-- History -->
      <section class="detail-section">
        <div class="tag tag-outline">PRODUCTION</div>
        <h3 class="section-title">Dernières traites</h3>

        <div class="history-list" v-if="animal.recentMilkings && animal.recentMilkings.length > 0">
          <div v-for="item in animal.recentMilkings" :key="item.id" class="history-item">
            <span class="history-date">{{ item.date }} • {{ item.time }}</span>
            <span class="history-vol">{{ item.volume }}</span>
          </div>
        </div>
        <div v-else style="padding: 16px 0; font-size: 14px; color: var(--w-gray);">
          Aucune traite enregistrée
        </div>
      </section>
    </template>
    
    <div v-else style="padding: 24px; text-align: center;">Chargement...</div>

  </div>
</template>

<style scoped>
.worker-animal-detail {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Back Button */
.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  border-bottom: 2px solid var(--w-dark);
  padding: 0 0 4px 0;
  width: fit-content;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--w-dark);
  cursor: pointer;
  margin-bottom: 8px;
}

/* Header Box */
.animal-header-box {
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 2px solid var(--w-dark);
  padding-bottom: 20px;
}

.animal-icon-large {
  width: 72px;
  height: 72px;
  background-color: var(--w-yellow);
  border: var(--w-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.animal-titles {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.tag {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 4px 6px;
  border: 1px solid var(--w-dark);
}

.tag-outline {
  background-color: transparent;
}

.animal-name {
  font-size: 36px;
  font-weight: 400;
  line-height: 1;
}

.animal-meta {
  font-size: 12px;
  font-weight: 600;
  color: var(--w-gray);
  margin-top: 4px;
}

/* Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  border: var(--w-border);
  background: #FFFFFF;
}

.grid-cell {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.top-left {
  border-bottom: 1px solid var(--w-dark);
  border-right: 1px solid var(--w-dark);
}
.top-right {
  border-bottom: 1px solid var(--w-dark);
}
.bottom-left {
  border-right: 1px solid var(--w-dark);
}

.cell-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--w-gray);
}

.cell-val {
  font-size: 14px;
  font-weight: 700;
}

/* Big Action Btn */
.big-action-btn {
  background-color: var(--w-yellow);
  border: var(--w-border);
  box-shadow: var(--w-shadow);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: transform 0.1s;
}

.big-action-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--w-dark);
}

.tarie-message {
  background-color: #E5E7EB;
  border: 1px dashed var(--w-dark);
  padding: 16px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #4B5563;
}

/* Section */
.detail-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
}

.section-title {
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 8px;
}

/* History List */
.history-list {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--w-dark);
}

.history-date {
  font-size: 13px;
  font-weight: 600;
  color: var(--w-gray);
}

.history-vol {
  font-size: 14px;
  font-weight: 700;
}
</style>
