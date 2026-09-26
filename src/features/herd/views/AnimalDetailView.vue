<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PhArrowLeft, PhCow } from '@phosphor-icons/vue';
import { getAnimal, declareSortie } from '../../../services/animal_service.js';
import CycleReproductionWidget from '../components/CycleReproductionWidget.vue';
import SortieAnimalModal from '../components/SortieAnimalModal.vue';
import LactationChartWidget from '../components/LactationChartWidget.vue';
import QualiteLaitWidget from '../components/QualiteLaitWidget.vue';
import defaultCow from '../../../assets/images/default_cow.jpg';

const route = useRoute();
const router = useRouter();
const animal = ref(null);
const isLoading = ref(true);
const showSortieModal = ref(false);

// Nouvelles données simulées pour la fiche
const ficheData = ref(null);

onMounted(async () => {
  const animalId = route.params.id;
  try {
    const data = await getAnimal(animalId);
    if (data) {
      animal.value = data;
    } else {
      animal.value = {
        id: animalId,
        name: 'Bella',
        race: "Prim'Holstein",
        status: 'lactation',
        identifiant: 'FR-4471-0932',
        avatar: defaultCow
      };
    }

    // On initialise avec des données vides en attendant l'implémentation des phases 4 (Nutrition) et 5 (Santé)
    ficheData.value = {
      localisation: 'Non assigné',
      joursLactation: '--',
      productionJour: '--',
      poids: '--',
      events: []
    };

  } catch (error) {
    console.error("Erreur chargement animal:", error);
  } finally {
    isLoading.value = false;
  }
});

const goBack = () => {
  router.push('/dashboard/troupeau');
};

const handleSortieSubmit = async (payload) => {
  try {
    await declareSortie(animal.value.id, payload);
    showSortieModal.value = false;
    router.push('/dashboard/troupeau'); // Retour au troupeau après la sortie
  } catch (error) {
    console.error("Erreur déclaration de sortie:", error);
    alert("Erreur lors de la déclaration de sortie.");
  }
};

</script>

<template>
  <div class="animal-fiche-view" v-if="!isLoading && animal && ficheData">
    
    <!-- Top Navigation -->
    <div class="top-nav">
      <button class="back-button" @click="goBack">
        <PhArrowLeft :size="20" weight="bold" />
        Retour au troupeau
      </button>

      <button class="btn-sortie" @click="showSortieModal = true" v-if="animal.status !== 'VENDU' && animal.status !== 'DECEDE'">
        Déclarer une sortie
      </button>
    </div>

    <!-- Layout 2 colonnes -->
    <div class="fiche-layout">
      
      <!-- Colonne Gauche : Identité -->
      <div class="fiche-left">
        
        <!-- Carte ID -->
        <div class="id-card">
          <div class="id-badge">ÉTIQUETTE OREILLE</div>
          <div class="id-content">
            <div class="id-text">
              <h2>{{ animal.identifiant }}</h2>
              <span>N° D'IDENTIFICATION NATIONALE</span>
            </div>
            <div class="id-icon-wrapper">
              <PhCow :size="24" weight="fill" color="#C87533" />
            </div>
          </div>
        </div>

        <!-- Infos de base -->
        <div class="basic-info">
          <h1 class="animal-name">{{ animal.name }}</h1>
          <div class="tags-group">
            <span class="tag">{{ animal.race }}</span>
            <span class="tag">{{ ficheData.localisation }}</span>
          </div>
        </div>

        <!-- Grande photo -->
        <div class="photo-container">
          <img :src="animal.avatar" alt="Photo de l'animal" class="animal-photo" />
        </div>

      </div>

      <!-- Colonne Droite : Données & Événements -->
      <div class="fiche-right">
        
        <!-- KPIs -->
        <div class="kpi-grid">
          <div class="kpi-box">
            <span class="kpi-label">JOURS DE LACTATION</span>
            <div class="kpi-value">
              <strong>{{ ficheData.joursLactation }}</strong> <span class="unit">j</span>
            </div>
          </div>
          <div class="kpi-box">
            <span class="kpi-label">PRODUCTION DU JOUR</span>
            <div class="kpi-value">
              <strong>{{ ficheData.productionJour }}</strong> <span class="unit">L</span>
            </div>
          </div>
          <div class="kpi-box">
            <span class="kpi-label">POIDS</span>
            <div class="kpi-value">
              <strong>{{ ficheData.poids }}</strong> <span class="unit">kg</span>
            </div>
          </div>
        </div>

        <!-- Section Reproduction -->
        <CycleReproductionWidget :animalId="animal.id" />

        <!-- Production Avancée (Phase 3) -->
        <LactationChartWidget :lactationId="animal.id" />
        <QualiteLaitWidget :lactationId="animal.id" />

        <!-- Section Timeline -->
        <div class="timeline-section">
          <h3 class="section-title">DERNIERS ÉVÉNEMENTS</h3>
          
          <div class="timeline" v-if="ficheData.events.length > 0">
            <div class="timeline-item" v-for="event in ficheData.events" :key="event.id">
              <!-- Bullet -->
              <div class="timeline-bullet-col">
                <div 
                  class="timeline-bullet" 
                  :class="{'is-hollow': event.type === 'hollow'}"
                  :style="{ 
                    backgroundColor: event.type === 'hollow' ? '#FAF8F5' : event.color,
                    borderColor: event.color 
                  }"
                ></div>
              </div>
              <!-- Contenu -->
              <div class="timeline-content-col">
                <div class="event-datetime">
                  <span class="event-date">{{ event.date }}</span>
                  <span class="event-time">{{ event.time }}</span>
                </div>
                <div class="event-details" :class="{'recommendation-box': event.isRecommendation}">
                  <span v-if="event.isRecommendation" class="recommendation-label">RECOMMANDATION</span>
                  <p class="event-desc">{{ event.desc }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else style="color: var(--text-muted); font-size: 13px;">
            L'historique des événements sera disponible lors de l'intégration du module Santé (Phase 5).
          </div>
        </div>

      </div>

    </div>

    <!-- Modale de sortie -->
    <SortieAnimalModal
      v-model:isOpen="showSortieModal"
      :animalId="animal.id"
      @submit="handleSortieSubmit"
    />
  </div>
  
  <div v-else-if="isLoading" class="loading-state">
    Chargement de la fiche...
  </div>
</template>

<style scoped>
.animal-fiche-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: #FAF8F5; /* Fond très léger comme la maquette */
  min-height: calc(100vh - 100px);
  padding: 8px;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-sortie {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
  transition: opacity var(--transition-fast);
}

.btn-sortie:hover {
  opacity: 0.9;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color var(--transition-fast);
}

.back-button:hover {
  color: var(--text-dark);
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px;
  color: var(--text-muted);
}

/* Layout Split */
.fiche-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
  align-items: start;
}

/* -------------------------------------
   COLONNE GAUCHE
-------------------------------------- */
.fiche-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Carte ID */
.id-card {
  position: relative;
  background: transparent;
  border: 1px solid var(--border-dark, #1E293B); /* Bordure noire fine */
  border-radius: var(--radius-md);
  padding: 24px;
  margin-top: 10px; /* Pour laisser de la place au badge */
}

.id-badge {
  position: absolute;
  top: -10px;
  left: 20px;
  background-color: #C87533;
  color: white;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 4px 8px;
  border-radius: 2px;
}

.id-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.id-text h2 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark);
  letter-spacing: 0.02em;
}

.id-text span {
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.id-icon-wrapper {
  width: 48px;
  height: 48px;
  border: 2px solid #C87533;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white; /* Ou fond transparent si souhaité */
}

/* Infos Basiques */
.basic-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.animal-name {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-dark);
}

.tags-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  border: 1px solid var(--border-light);
  background-color: transparent;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

/* Photo */
.photo-container {
  width: 100%;
  height: 240px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.animal-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


/* -------------------------------------
   COLONNE DROITE
-------------------------------------- */
.fiche-right {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* KPIs */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.kpi-box {
  background: #FCFBF9; /* Un peu plus clair/chaud que blanc */
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.kpi-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: var(--text-dark);
}

.kpi-value strong {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.kpi-value .unit {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-muted);
}


/* Timeline Section */
.timeline-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  margin: 0;
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  gap: 16px;
  position: relative;
}

.timeline-bullet-col {
  width: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  /* Ligne verticale qui relie les puces */
}

.timeline-item:not(:last-child) .timeline-bullet-col::after {
  content: '';
  position: absolute;
  top: 12px;
  bottom: -24px; /* Dépasse jusqu'au prochain item */
  width: 1px;
  background-color: var(--border-light);
  z-index: 0;
}

.timeline-bullet {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px; /* Pour l'aligner avec le texte */
  z-index: 1;
  border: 2px solid; /* La couleur est dynamique via Vue */
}

/* Le texte de la timeline */
.timeline-content-col {
  flex: 1;
  display: flex;
  gap: 24px;
  padding-bottom: 24px; /* Espace entre les items */
}

.event-datetime {
  display: flex;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
  width: 100px;
  flex-shrink: 0;
}

.event-time {
  color: #9CA3AF;
}

.event-details {
  flex: 1;
  padding-right: 24px;
}

.event-desc {
  margin: 0;
  font-size: 14px;
  color: var(--text-dark);
  line-height: 1.5;
  font-weight: 500;
}

/* Boîte de Recommandation Spéciale */
.recommendation-box {
  background: repeating-linear-gradient(
    45deg,
    rgba(255,255,255, 0.5),
    rgba(255,255,255, 0.5) 10px,
    rgba(200, 117, 51, 0.05) 10px,
    rgba(200, 117, 51, 0.05) 20px
  );
  border: 1px dashed #C87533;
  border-radius: var(--radius-md);
  padding: 16px;
  margin-top: -8px; /* Ajustement d'alignement avec la puce */
}

.recommendation-label {
  display: block;
  font-size: 10px;
  color: #C87533;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  margin-bottom: 8px;
}

.recommendation-box .event-desc {
  color: var(--text-dark);
}

/* Responsive */
@media (max-width: 1024px) {
  .fiche-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .photo-container {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .timeline-content-col {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
