<script setup>
import { ref, onMounted, computed } from 'vue';
import { PhBowlFood, PhPlus, PhCheckCircle, PhXCircle, PhPlay, PhTrash } from '@phosphor-icons/vue';
import { 
  getAnimalRations, 
  createRation, 
  addRationLine, 
  activateRation, 
  terminateRation,
  getAliments,
  getRationCost
} from '../../../services/nutrition_service.js';

const props = defineProps({
  animalId: {
    type: String,
    required: true
  }
});

const rations = ref([]);
const aliments = ref([]);
const isLoading = ref(true);
const isCreating = ref(false);
const isAddingLine = ref(false);
const estimatedCost = ref(null);

const newRation = ref({
  dateDebut: new Date().toISOString().split('T')[0],
  origine: 'ACTUELLE'
});

const newLine = ref({
  alimentId: '',
  quantite: 1
});

const activeRation = computed(() => {
  return rations.value.find(r => r.statut === 'ACTIVE' || r.statut === 'BROUILLON');
});

const pastRations = computed(() => {
  return rations.value.filter(r => r.statut === 'TERMINEE').slice(0, 3);
});

const getAlimentName = (alimentId) => {
  const aliment = aliments.value.find(a => a.id === alimentId);
  return aliment ? aliment.nom : 'Aliment inconnu';
};

const getAlimentUnit = (alimentId) => {
  const aliment = aliments.value.find(a => a.id === alimentId);
  return aliment ? aliment.unite : '';
};

const fetchData = async () => {
  isLoading.value = true;
  try {
    const [rationsData, alimentsData] = await Promise.all([
      getAnimalRations(props.animalId),
      getAliments()
    ]);
    rations.value = rationsData.content || [];
    aliments.value = alimentsData;

    // Fetch cost if active ration exists
    const active = activeRation.value;
    if (active && active.statut === 'ACTIVE') {
      try {
        const costData = await getRationCost(props.animalId, active.id, new Date().toISOString().split('T')[0]);
        estimatedCost.value = costData.coutTotal;
      } catch (e) {
        estimatedCost.value = null;
      }
    } else {
      estimatedCost.value = null;
    }
  } catch (error) {
    console.error("Erreur chargement rations:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const handleCreateRation = async () => {
  if (activeRation.value) {
    alert("Une ration active ou en brouillon existe déjà. Veuillez la terminer d'abord.");
    return;
  }
  
  try {
    await createRation(props.animalId, newRation.value);
    isCreating.value = false;
    await fetchData();
  } catch (error) {
    alert("Erreur lors de la création de la ration.");
  }
};

const handleAddLine = async () => {
  if (!newLine.value.alimentId || newLine.value.quantite <= 0) return;
  
  try {
    await addRationLine(props.animalId, activeRation.value.id, newLine.value);
    newLine.value = { alimentId: '', quantite: 1 };
    isAddingLine.value = false;
    await fetchData();
  } catch (error) {
    alert("Erreur lors de l'ajout de l'aliment.");
  }
};

const handleActivate = async () => {
  try {
    await activateRation(props.animalId, activeRation.value.id);
    await fetchData();
  } catch (error) {
    alert("Erreur lors de l'activation de la ration.");
  }
};

const handleTerminate = async () => {
  const dateFin = prompt("Date de fin de la ration (YYYY-MM-DD) :", new Date().toISOString().split('T')[0]);
  if (!dateFin) return;
  
  try {
    await terminateRation(props.animalId, activeRation.value.id, { dateFin });
    await fetchData();
  } catch (error) {
    alert("Erreur lors de la terminaison de la ration.");
  }
};
</script>

<template>
  <div class="ration-widget">
    <div class="widget-header">
      <div class="header-left">
        <PhBowlFood :size="24" color="#10B981" />
        <h3 class="widget-title">Ration Alimentaire</h3>
      </div>
      <div class="header-actions">
        <button v-if="!activeRation && !isCreating" class="btn-outline" @click="isCreating = true">
          <PhPlus :size="16" /> Nouvelle Ration
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading">Chargement des rations...</div>

    <div v-else class="widget-body">
      
      <!-- Formulaire de création de ration -->
      <div v-if="isCreating" class="create-form">
        <h4>Nouvelle Ration</h4>
        <div class="form-row">
          <input type="date" v-model="newRation.dateDebut" class="input-field" />
          <select v-model="newRation.origine" class="input-field">
            <option value="ACTUELLE">Ration Actuelle</option>
            <option value="RECOMMANDEE">Ration Recommandée</option>
          </select>
        </div>
        <div class="form-actions">
          <button class="btn-cancel" @click="isCreating = false">Annuler</button>
          <button class="btn-primary" @click="handleCreateRation">Créer le brouillon</button>
        </div>
      </div>

      <!-- Ration Active ou Brouillon -->
      <div v-if="activeRation && !isCreating" class="active-ration-card" :class="activeRation.statut.toLowerCase()">
        
        <div class="ration-top">
          <div class="ration-info">
            <span class="status-badge" :class="activeRation.statut.toLowerCase()">{{ activeRation.statut }}</span>
            <span class="ration-date">Depuis le {{ activeRation.dateDebut }}</span>
          </div>
          <div class="ration-cost" v-if="estimatedCost !== null">
            Coût estimé: <strong>{{ estimatedCost }} FCFA/j</strong>
          </div>
        </div>

        <div class="ration-lines">
          <div v-for="ligne in activeRation.lignes" :key="ligne.id" class="ration-line">
            <div class="line-aliment">{{ getAlimentName(ligne.alimentId) }}</div>
            <div class="line-qty">
              <strong>{{ ligne.quantite }}</strong> {{ getAlimentUnit(ligne.alimentId) }}
            </div>
          </div>
          <div v-if="activeRation.lignes.length === 0" class="no-lines">
            Aucun aliment dans cette ration.
          </div>
        </div>

        <!-- Mode Brouillon: Ajouter Ligne -->
        <div v-if="activeRation.statut === 'BROUILLON'" class="brouillon-actions">
          
          <div v-if="isAddingLine" class="add-line-form">
            <select v-model="newLine.alimentId" class="input-field">
              <option value="" disabled>Choisir un aliment</option>
              <option v-for="al in aliments" :key="al.id" :value="al.id">{{ al.nom }}</option>
            </select>
            <input type="number" step="0.1" v-model="newLine.quantite" class="input-field qty-input" placeholder="Qté" />
            <button class="btn-icon add" @click="handleAddLine"><PhCheckCircle :size="20" weight="fill"/></button>
            <button class="btn-icon cancel" @click="isAddingLine = false"><PhXCircle :size="20" weight="fill"/></button>
          </div>
          
          <button v-else class="btn-add-line" @click="isAddingLine = true">
            <PhPlus :size="16" /> Ajouter un aliment
          </button>
          
          <button v-if="activeRation.lignes.length > 0" class="btn-primary" @click="handleActivate">
            <PhPlay :size="16" weight="fill" /> Activer la ration
          </button>
        </div>

        <!-- Mode Active: Terminer -->
        <div v-if="activeRation.statut === 'ACTIVE'" class="active-actions">
          <button class="btn-danger" @click="handleTerminate">
            Terminer cette ration
          </button>
        </div>

      </div>

      <div v-if="!activeRation && !isCreating" class="empty-state">
        Aucune ration en cours.
      </div>

    </div>
  </div>
</template>

<style scoped>
.ration-widget {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.widget-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-dark);
}

.btn-outline {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.loading {
  text-align: center;
  color: var(--text-muted);
  padding: 20px;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #F9FAFB;
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-light);
}

.create-form h4 {
  margin: 0;
  font-size: 14px;
}

.form-row {
  display: flex;
  gap: 12px;
}

.input-field {
  padding: 8px 12px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  background: white;
  font-family: inherit;
  font-size: 13px;
  flex: 1;
}

.qty-input {
  flex: 0 0 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--text-dark);
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
}

.btn-cancel {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-light);
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 12px;
}

.active-ration-card {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.active-ration-card.active {
  border-color: #10B981;
  background-color: #ECFDF5;
}

.active-ration-card.brouillon {
  border-color: #F59E0B;
  background-color: #FFFBEB;
}

.ration-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ration-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}
.status-badge.active { background: #10B981; color: white; }
.status-badge.brouillon { background: #F59E0B; color: white; }

.ration-date {
  font-size: 12px;
  color: var(--text-muted);
}

.ration-cost {
  font-size: 13px;
  color: var(--text-dark);
}

.ration-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  border-radius: var(--radius-sm);
  padding: 12px;
  border: 1px solid var(--border-light);
}

.ration-line {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  border-bottom: 1px solid var(--bg-page);
  padding-bottom: 4px;
}

.ration-line:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.line-aliment {
  font-weight: 500;
  color: var(--text-dark);
}

.line-qty {
  color: var(--text-muted);
}

.no-lines {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  font-style: italic;
}

.brouillon-actions, .active-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.btn-add-line {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--text-dark);
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
}

.add-line-form {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}
.btn-icon.add { color: #10B981; }
.btn-icon.cancel { color: #EF4444; }

.btn-danger {
  background: white;
  color: #EF4444;
  border: 1px solid #EF4444;
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: var(--text-muted);
  font-size: 13px;
  background: var(--bg-page);
  border-radius: var(--radius-md);
}
</style>
