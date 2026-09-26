<script setup>
import { ref, onMounted, computed } from 'vue';
import { PhBaby, PhSyringe, PhCalendarCheck, PhHeartbeat } from '@phosphor-icons/vue';
import PnButton from '../../../components/ui/PnButton.vue';
import PnInput from '../../../components/ui/PnInput.vue';
import { 
  getCycles, 
  declarerInsemination, 
  enregistrerConstat, 
  declarerVelage 
} from '../../../services/reproduction_service.js';
import { useExploitation } from '../../../composables/useExploitation.js';

const props = defineProps({
  animalId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['cycleUpdated']);

const cycles = ref([]);
const activeCycle = computed(() => cycles.value.length > 0 ? cycles.value[0] : null);
const isLoading = ref(true);
const { getActiveExploitation } = useExploitation();

// Modals state
const showInseminationModal = ref(false);
const showConstatModal = ref(false);
const showVelageModal = ref(false);

// Forms
const inseminationForm = ref({
  dateInsemination: new Date().toISOString().split('T')[0],
  methodeReproduction: 'INSEMINATION_ARTIFICIELLE',
  identifiantTaureau: ''
});

const constatForm = ref({
  dateConstat: new Date().toISOString().split('T')[0],
  resultat: 'POSITIF',
  veterinaire: ''
});

const velageForm = ref({
  dateReelle: new Date().toISOString().split('T')[0]
});

const loadCycles = async () => {
  isLoading.value = true;
  try {
    cycles.value = await getCycles(props.animalId);
  } catch (error) {
    console.error('Failed to load cycles', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadCycles();
});

const handleInsemination = async () => {
  try {
    const payload = {
      ...inseminationForm.value,
      animalId: props.animalId,
      exploitationId: getActiveExploitation()
    };
    await declarerInsemination(payload);
    showInseminationModal.value = false;
    await loadCycles();
    emit('cycleUpdated');
  } catch (e) {
    console.error(e);
  }
};

const handleConstat = async () => {
  try {
    if (!activeCycle.value) return;
    await enregistrerConstat(activeCycle.value.id, constatForm.value);
    showConstatModal.value = false;
    await loadCycles();
    emit('cycleUpdated');
  } catch (e) {
    console.error(e);
  }
};

const handleVelage = async () => {
  try {
    if (!activeCycle.value) return;
    await declarerVelage(activeCycle.value.id, velageForm.value);
    showVelageModal.value = false;
    await loadCycles();
    emit('cycleUpdated');
  } catch (e) {
    console.error(e);
  }
};

// UI Helpers
const getStatusLabel = (status) => {
  const map = {
    'EN_ATTENTE_CONSTAT': 'En attente de constat',
    'GESTANTE': 'Gestante',
    'VIDE': 'Vide',
    'AVORTEE': 'Avortée',
    'TERMINEE_VELAGE': 'Terminée (Vêlage)'
  };
  return map[status] || status;
};

const getStatusColor = (status) => {
  const map = {
    'EN_ATTENTE_CONSTAT': '#C87533', // Ocre
    'GESTANTE': '#849E73', // Vert
    'VIDE': '#E74C3C', // Rouge
    'AVORTEE': '#808080', // Gris
    'TERMINEE_VELAGE': '#3498DB' // Bleu
  };
  return map[status] || '#808080';
};
</script>

<template>
  <div class="cycle-widget">
    <div class="widget-header">
      <h3 class="widget-title">
        <PhHeartbeat :size="20" weight="bold" />
        Reproduction
      </h3>
      <div v-if="activeCycle" class="status-badge" :style="{ backgroundColor: getStatusColor(activeCycle.statut) }">
        {{ getStatusLabel(activeCycle.statut) }}
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      Chargement...
    </div>

    <div v-else-if="!activeCycle" class="empty-state">
      <p>Aucun cycle de reproduction actif.</p>
      <PnButton variant="primary" @click="showInseminationModal = true">
        <PhSyringe :size="16" weight="bold" class="btn-icon" />
        Déclarer une saillie / IA
      </PnButton>
    </div>

    <div v-else class="cycle-details">
      
      <div class="timeline">
        <!-- Insemination Step -->
        <div class="timeline-step completed">
          <div class="step-icon"><PhSyringe weight="bold"/></div>
          <div class="step-content">
            <h4>Insémination</h4>
            <p>{{ activeCycle.dateInsemination }}</p>
            <p class="meta">{{ activeCycle.methodeReproduction === 'SAILLIE_NATURELLE' ? 'Naturelle' : 'Artificielle' }} 
               <span v-if="activeCycle.identifiantTaureau">({{ activeCycle.identifiantTaureau }})</span>
            </p>
          </div>
        </div>

        <!-- Constat Step -->
        <div class="timeline-step" :class="{ 'completed': activeCycle.constatResultat }">
          <div class="step-icon"><PhCalendarCheck weight="bold"/></div>
          <div class="step-content">
            <h4>Constat de Gestation</h4>
            <div v-if="!activeCycle.constatResultat && activeCycle.statut === 'EN_ATTENTE_CONSTAT'">
              <PnButton variant="secondary" @click="showConstatModal = true" class="action-btn">
                Saisir le constat
              </PnButton>
            </div>
            <div v-else-if="activeCycle.constatResultat">
              <p>{{ activeCycle.constatDate }}</p>
              <p class="meta" :class="{'text-success': activeCycle.constatResultat === 'POSITIF', 'text-error': activeCycle.constatResultat === 'NEGATIF'}">
                Résultat: {{ activeCycle.constatResultat }}
              </p>
            </div>
          </div>
        </div>

        <!-- Velage Step -->
        <div v-if="activeCycle.statut === 'GESTANTE' || activeCycle.statut === 'TERMINEE_VELAGE'" 
             class="timeline-step" :class="{ 'completed': activeCycle.dateReelleVelage }">
          <div class="step-icon"><PhBaby weight="bold"/></div>
          <div class="step-content">
            <h4>Vêlage</h4>
            <div v-if="!activeCycle.dateReelleVelage">
              <p class="meta">Prévu le: <strong>{{ activeCycle.datePrevueVelage }}</strong></p>
              <PnButton variant="primary" @click="showVelageModal = true" class="action-btn">
                Déclarer le Vêlage
              </PnButton>
            </div>
            <div v-else>
              <p>{{ activeCycle.dateReelleVelage }}</p>
              <p class="meta text-success">Vêlage terminé</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- New Cycle button if previous is finished/failed -->
      <div v-if="['VIDE', 'AVORTEE', 'TERMINEE_VELAGE'].includes(activeCycle.statut)" class="new-cycle-action">
        <PnButton variant="primary" @click="showInseminationModal = true">
          Nouveau Cycle (Saillie / IA)
        </PnButton>
      </div>

    </div>

    <!-- Modals (Simplified as inline div overlays for this iteration to avoid full PnModal dep injection if missing) -->
    <!-- Insemination Modal -->
    <div v-if="showInseminationModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Déclarer une Saillie / IA</h3>
        <div class="form-group">
          <label>Date</label>
          <input type="date" v-model="inseminationForm.dateInsemination" class="pn-input">
        </div>
        <div class="form-group">
          <label>Méthode</label>
          <select v-model="inseminationForm.methodeReproduction" class="pn-input">
            <option value="INSEMINATION_ARTIFICIELLE">Insémination Artificielle</option>
            <option value="SAILLIE_NATURELLE">Saillie Naturelle</option>
          </select>
        </div>
        <div class="form-group">
          <label>Identifiant Taureau (Optionnel)</label>
          <input type="text" v-model="inseminationForm.identifiantTaureau" class="pn-input">
        </div>
        <div class="modal-actions">
          <PnButton variant="secondary" @click="showInseminationModal = false">Annuler</PnButton>
          <PnButton variant="primary" @click="handleInsemination">Valider</PnButton>
        </div>
      </div>
    </div>

    <!-- Constat Modal -->
    <div v-if="showConstatModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Constat de Gestation</h3>
        <div class="form-group">
          <label>Date du constat</label>
          <input type="date" v-model="constatForm.dateConstat" class="pn-input">
        </div>
        <div class="form-group">
          <label>Résultat</label>
          <select v-model="constatForm.resultat" class="pn-input">
            <option value="POSITIF">Positif (Gestante)</option>
            <option value="NEGATIF">Négatif (Vide)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Vétérinaire (Optionnel)</label>
          <input type="text" v-model="constatForm.veterinaire" class="pn-input">
        </div>
        <div class="modal-actions">
          <PnButton variant="secondary" @click="showConstatModal = false">Annuler</PnButton>
          <PnButton variant="primary" @click="handleConstat">Valider</PnButton>
        </div>
      </div>
    </div>

    <!-- Velage Modal -->
    <div v-if="showVelageModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Déclarer le Vêlage</h3>
        <div class="form-group">
          <label>Date réelle du vêlage</label>
          <input type="date" v-model="velageForm.dateReelle" class="pn-input">
        </div>
        <div class="modal-actions">
          <PnButton variant="secondary" @click="showVelageModal = false">Annuler</PnButton>
          <PnButton variant="primary" @click="handleVelage">Valider</PnButton>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.cycle-widget {
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  margin-top: 24px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.widget-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-dark);
  font-size: 1.25rem;
  font-weight: 600;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 32px 0;
  color: var(--text-muted);
}
.empty-state p {
  margin-bottom: 16px;
}

.btn-icon {
  margin-right: 8px;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 16px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 31px;
  top: 10px;
  bottom: 30px;
  width: 2px;
  background-color: var(--border-light);
  z-index: 1;
}

.timeline-step {
  display: flex;
  gap: 20px;
  position: relative;
  z-index: 2;
  margin-bottom: 24px;
  opacity: 0.6;
}

.timeline-step.completed {
  opacity: 1;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--bg-body);
  border: 2px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;
}

.timeline-step.completed .step-icon {
  background-color: var(--primary);
  border-color: var(--primary);
  color: white;
}

.step-content h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  color: var(--text-dark);
}

.step-content p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-dark);
}

.step-content .meta {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.text-success { color: var(--text-dark); font-weight: 600; }
.text-error { color: #E74C3C; font-weight: 600; }

.action-btn {
  margin-top: 8px;
}

.new-cycle-action {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: center;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  font-weight: 500;
}

.pn-input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-input);
  border-radius: 8px;
  font-family: inherit;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
