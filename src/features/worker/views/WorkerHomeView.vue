<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PhDrop, PhCaretRight, PhKnife, PhCheck } from '@phosphor-icons/vue';
import WorkerMilkingModal from '../components/WorkerMilkingModal.vue';
import { getWorkerHomeData, recordAnimalMilking } from '../../../services/worker_service.js';
import { useExploitation } from '../../../composables/useExploitation.js';
import { getCurrentUser } from '../../../services/auth_service.js';

const router = useRouter();
const { getActiveExploitation } = useExploitation();
const isMilkingModalOpen = ref(false);
const homeData = ref(null);
const user = ref(null);

onMounted(async () => {
  const exploitationId = getActiveExploitation();
  if (exploitationId) {
    try {
      user.value = await getCurrentUser();
      homeData.value = await getWorkerHomeData(exploitationId);
    } catch (err) {
      console.error(err);
    }
  }
});

function go(route) {
  if (route === 'worker-milking') {
    isMilkingModalOpen.value = true;
    return;
  }
  router.push({ name: route });
}

async function handleMilkingSubmit(data) {
  try {
    // data.animal is the selected animal from the modal
    // we need its ID to post to the API
    await recordAnimalMilking(data.animal.id, {
      dateHeure: new Date().toISOString(),
      type: 'MATIN', // Assuming MATIN for now
      quantiteKg: data.quantity
    });
    
    // Refresh the home data
    isMilkingModalOpen.value = false;
    onMounted(); 
  } catch (err) {
    console.error("Erreur lors de l'enregistrement", err);
    alert("Erreur lors de l'enregistrement de la traite.");
  }
}
</script>

<template>
  <div class="worker-home">
    <!-- Milking Modal Overlay -->
    <WorkerMilkingModal 
      :is-open="isMilkingModalOpen" 
      @close="isMilkingModalOpen = false"
      @submit="handleMilkingSubmit"
    />
    
    <header class="home-header">
      <div class="header-top">
        <span class="tag tag-black">POSTE DU MATIN</span>
        <div class="status">
          <span class="status-dot"></span>
          EN LIGNE
        </div>
      </div>
      <h1 class="greeting">Bonjour{{ user?.prenom ? ', ' + user.prenom : '' }}.</h1>
      <p class="date">{{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) }}</p>
    </header>

    <!-- Main Action Card -->
    <div class="action-card-main" @click="go('worker-milking')">
      <div class="icon-box-dark">
        <PhDrop :size="32" weight="fill" color="#A3A3A3" />
      </div>
      <div class="action-info">
        <span class="action-sub">ACTION RAPIDE</span>
        <h2 class="action-title">TRAITE INDIVIDUELLE</h2>
        <p class="action-desc">Saisir pour une seule vache</p>
      </div>
      <PhCaretRight :size="24" weight="bold" class="caret" />
    </div>

    <!-- Secondary Action Card (Batch) -->
    <div class="action-card-secondary" @click="go('worker-saisie-lot')">
      <div class="icon-box-dark">
        <PhDrop :size="24" weight="fill" color="#A3A3A3" />
      </div>
      <div class="action-info">
        <span class="action-sub">OPTIMISATION</span>
        <h2 class="action-title">SAISIE PAR LOT</h2>
        <p class="action-desc">Tout le troupeau en une fois</p>
      </div>
      <PhCaretRight :size="20" weight="bold" class="caret" />
    </div>

    <template v-if="homeData">
      <!-- Progress Card -->
      <div class="progress-card">
        <span class="tag tag-outline">TRAITE DU MATIN</span>
        <h3 class="progress-title">{{ homeData.traitesDuMatin }} / {{ homeData.totalAnimaux }} animaux</h3>
        <span class="progress-pct">{{ Math.round((homeData.traitesDuMatin / homeData.totalAnimaux) * 100) || 0 }}%</span>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: ((homeData.traitesDuMatin / homeData.totalAnimaux) * 100) + '%' }"></div>
        </div>
        <div class="progress-footer">
          <span class="val">{{ homeData.volumeCollecteMatin.toFixed(1) }} L <span class="val-sub">collectés</span></span>
          <span class="val-sub">{{ homeData.totalAnimaux - homeData.traitesDuMatin }} restants</span>
        </div>
      </div>

      <!-- Todo Section -->
      <section class="section-block">
        <div class="section-header">
          <div class="tag tag-outline">À FAIRE</div>
          <div class="tag tag-yellow">{{ homeData.animauxASurveiller }} restantes</div>
        </div>
        <h3 class="section-title">Actions du poste</h3>
        
        <div class="list-card">
          <div class="list-item">
            <div class="item-icon-box">
              <PhKnife :size="24" weight="bold" />
            </div>
            <div class="item-info">
              <h4 class="item-title">Appliquer la ration B</h4>
              <p class="item-desc">Lot 2 • 24 animaux • avant 08:00</p>
            </div>
            <PhCaretRight :size="20" weight="bold" />
          </div>
        </div>
      </section>

      <!-- Recent Activity -->
      <section class="section-block">
        <div class="section-header">
          <div class="tag tag-outline">DERNIÈRES SAISIES</div>
          <a href="#" class="link-right" @click.prevent="router.push({name: 'worker-history'})">TOUT VOIR</a>
        </div>
        <h3 class="section-title">Activités récentes</h3>
        
        <div class="list-card" v-if="homeData.recentActivities.length > 0">
          <div class="list-item" v-for="act in homeData.recentActivities" :key="act.id">
            <div class="item-time">{{ act.time }}</div>
            <div class="item-info">
              <h4 class="item-title">Traite • {{ act.animalName }} #{{ act.animalId }}</h4>
              <p class="item-desc">{{ act.description }}</p>
            </div>
            <PhCheck :size="20" weight="bold" color="#1A1A1A" />
          </div>
        </div>
        <div v-else style="padding: 16px; font-size: 14px;">Aucune activité récente.</div>
      </section>
    </template>
    
    <div v-else style="padding: 24px; text-align: center;">Chargement...</div>

  </div>
</template>

<style scoped>
.worker-home {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header */
.home-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--w-gray);
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #10B981;
  border: 1px solid #1A1A1A;
}

.greeting {
  font-size: 32px;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.date {
  font-size: 12px;
  font-weight: 600;
  color: var(--w-gray);
}

/* Tags */
.tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 6px;
  border: 1px solid var(--w-dark);
}

.tag-black {
  background-color: var(--w-dark);
  color: #FFFFFF;
}

.tag-outline {
  background-color: transparent;
}

.tag-yellow {
  background-color: var(--w-yellow);
}

/* Main Action Card */
.action-card-main {
  background-color: var(--w-yellow);
  border: var(--w-border);
  box-shadow: var(--w-shadow);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
}

.action-card-main:active, .action-card-secondary:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1A1A1A;
}

.action-card-secondary {
  background-color: #FFFFFF;
  border: var(--w-border);
  box-shadow: var(--w-shadow);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  margin-top: -12px;
}

.action-card-secondary .icon-box-dark {
  width: 48px;
  height: 48px;
}

.icon-box-dark {
  background-color: var(--w-dark);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--w-border);
  flex-shrink: 0;
}

.action-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.action-sub {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: rgba(0,0,0,0.6);
}

.action-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.1;
}

.action-desc {
  font-size: 11px;
  font-weight: 600;
  color: rgba(0,0,0,0.7);
  margin-top: 4px;
}

/* Progress Card */
.progress-card {
  background-color: #FFFFFF;
  border: var(--w-border);
  box-shadow: var(--w-shadow);
  padding: 16px;
  position: relative;
}

.progress-title {
  font-size: 20px;
  font-weight: 400;
  margin-top: 12px;
  margin-bottom: 8px;
}

.progress-pct {
  position: absolute;
  top: 48px;
  right: 16px;
  font-size: 24px;
  font-weight: 700;
}

.progress-track {
  height: 12px;
  border: var(--w-border);
  background-color: var(--w-bg);
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  border-right: var(--w-border);
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.val {
  font-size: 12px;
  font-weight: 700;
}

.val-sub {
  font-size: 11px;
  font-weight: 600;
  color: var(--w-gray);
}

/* Sections */
.section-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.link-right {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--w-dark);
  text-decoration: underline;
}

.section-title {
  font-size: 20px;
  font-weight: 400;
}

/* List Card */
.list-card {
  background-color: #FFFFFF;
  border: var(--w-border);
  box-shadow: var(--w-shadow);
  display: flex;
  flex-direction: column;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--w-dark);
  cursor: pointer;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:active {
  background-color: var(--w-bg);
}

.item-icon-box {
  background-color: var(--w-yellow);
  width: 48px;
  height: 48px;
  border: var(--w-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-time {
  font-size: 12px;
  font-weight: 700;
  width: 48px;
}

.item-info {
  flex: 1;
}

.item-title {
  font-size: 14px;
  font-weight: 700;
}

.item-desc {
  font-size: 11px;
  font-weight: 600;
  color: var(--w-gray);
  margin-top: 4px;
}
</style>
