<script setup>
import { ref, watch, onMounted } from 'vue';
import PnDrawer from '../../../components/ui/PnDrawer.vue';
import PnInput from '../../../components/ui/PnInput.vue';
import PnButton from '../../../components/ui/PnButton.vue';
import { getActiveRaces } from '../../../services/race_service.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  animal: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:isOpen', 'save']);

const form = ref({
  identifiant: '',
  name: '',
  raceId: '',
  status: 'ACTIF',
  dateNaissance: '',
  mereId: '',
  pereIdentifiant: '',
});

const errors = ref({});
const isSaving = ref(false);
const races = ref([]);
const females = ref([]);

const title = ref('Ajouter un animal');

onMounted(async () => {
  try {
    races.value = await getActiveRaces();
    if (races.value.length > 0) {
      form.value.raceId = races.value[0].id;
    }
  } catch (err) {
    console.error("Failed to fetch races", err);
  }
  try {
    const exploitationId = localStorage.getItem('active_exploitation_id');
    if (exploitationId) {
        // Fetch females for "Mère" combo box (we load all animals for now)
        const { getAnimalsList } = await import('../../../services/animal_service.js');
        const animals = await getAnimalsList(exploitationId);
        // Exclude the current animal if we're editing
        females.value = animals.filter(a => a.id !== props.animal?.id);
    }
  } catch (err) {
    console.error("Failed to fetch females", err);
  }
});

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      if (props.animal) {
        title.value = 'Modifier l\'animal';
        form.value = {
          identifiant: props.animal.identifiant || '',
          name: props.animal.name || '',
          raceId: props.animal.raceId || (races.value.length > 0 ? races.value[0].id : ''),
          status: props.animal.status || 'ACTIF',
          dateNaissance: props.animal.dateNaissance || '',
          mereId: props.animal.mereId || '',
          pereIdentifiant: props.animal.pereIdentifiant || '',
        };
      } else {
        title.value = 'Ajouter un animal';
        form.value = {
          identifiant: '',
          name: '',
          raceId: races.value.length > 0 ? races.value[0].id : '',
          status: 'ACTIF',
          dateNaissance: '',
          mereId: '',
          pereIdentifiant: '',
        };
      }
      errors.value = {};
    }
  }
);

const validate = () => {
  errors.value = {};
  if (!form.value.identifiant) errors.value.identifiant = 'L\'identifiant est requis';
  if (!form.value.name) errors.value.name = 'Le nom est requis';
  return Object.keys(errors.value).length === 0;
};

const handleSave = async () => {
  if (!validate()) return;
  
  isSaving.value = true;
  try {
    // Simuler le temps de traitement dans le composant parent ou ici
    // On émet l'événement et on laisse le parent gérer le chargement/fermeture
    emit('save', { ...form.value });
  } finally {
    // isSaving will be managed by parent passing prop, or we can just keep it simple here
    // For this mock, we just reset it here.
    setTimeout(() => {
      isSaving.value = false;
    }, 1000); // Failsafe reset
  }
};
</script>

<template>
  <PnDrawer
    :model-value="isOpen"
    @update:model-value="emit('update:isOpen', $event)"
    :title="title"
    subtitle="Renseignez les informations de base de l'animal pour son suivi."
    width="480px"
  >
    <form @submit.prevent="handleSave" class="animal-form">
      
      <div class="form-group">
        <PnInput
          id="identifiant"
          label="Identifiant (Boucle)"
          v-model="form.identifiant"
          placeholder="Ex: SN-001"
          :error="errors.identifiant"
        />
      </div>

      <div class="form-group">
        <PnInput
          id="name"
          label="Nom de l'animal"
          v-model="form.name"
          placeholder="Ex: Penda"
          :error="errors.name"
        />
      </div>

      <div class="form-row">
        <div class="form-group flex-1">
          <label class="pn-label">Race</label>
          <div class="select-wrapper">
            <select v-model="form.raceId" class="pn-select">
              <option v-for="race in races" :key="race.id" :value="race.id">
                {{ race.libelle }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group flex-1">
          <label class="pn-label">Statut actuel</label>
          <div class="select-wrapper">
            <select v-model="form.status" class="pn-select">
              <option value="ACTIF">Actif</option>
              <option value="VENDU">Vendu</option>
              <option value="DECEDE">Décédé</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="pn-label">Date de naissance</label>
        <input
          type="date"
          id="dateNaissance"
          v-model="form.dateNaissance"
          class="pn-select"
        />
      </div>

      <div class="form-row">
        <div class="form-group flex-1">
          <label class="pn-label">Mère (Vache de l'exploitation)</label>
          <div class="select-wrapper">
            <select v-model="form.mereId" class="pn-select">
              <option value="">-- Inconnue --</option>
              <option v-for="cow in females" :key="cow.id" :value="cow.id">
                {{ cow.identifiant }} - {{ cow.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group flex-1">
          <PnInput
            id="pereIdentifiant"
            label="Identifiant du Père"
            v-model="form.pereIdentifiant"
            placeholder="Ex: Taureau IA"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <PnButton variant="secondary" @click="emit('update:isOpen', false)" :disabled="isSaving">
        Annuler
      </PnButton>
      <PnButton variant="primary" @click="handleSave" :loading="isSaving">
        {{ animal ? 'Enregistrer les modifications' : 'Ajouter l\'animal' }}
      </PnButton>
    </template>
  </PnDrawer>
</template>

<style scoped>
.animal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.flex-1 {
  flex: 1;
}

.pn-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-dark);
  margin-bottom: 6px;
}

.select-wrapper {
  position: relative;
}

.pn-select {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-white);
  border: 1px solid var(--border-input);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--text-dark);
  outline: none;
  transition: all var(--transition-fast);
  appearance: none;
}

.pn-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(200, 117, 51, 0.15);
}
</style>
