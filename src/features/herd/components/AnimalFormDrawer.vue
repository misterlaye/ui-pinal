<script setup>
import { ref, watch } from 'vue';
import PnDrawer from '../../../components/ui/PnDrawer.vue';
import PnInput from '../../../components/ui/PnInput.vue';
import PnButton from '../../../components/ui/PnButton.vue';

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
  race: 'Montbéliarde',
  status: 'lactation',
  age: '', // Simple text field for age/dob for now
});

const errors = ref({});
const isSaving = ref(false);

const title = ref('Ajouter un animal');

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      if (props.animal) {
        title.value = 'Modifier l\'animal';
        form.value = {
          identifiant: props.animal.identifiant || '',
          name: props.animal.name || '',
          race: props.animal.race || 'Montbéliarde',
          status: props.animal.status || 'lactation',
          age: props.animal.age || '',
        };
      } else {
        title.value = 'Ajouter un animal';
        form.value = {
          identifiant: '',
          name: '',
          race: 'Montbéliarde',
          status: 'lactation',
          age: '',
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
            <select v-model="form.race" class="pn-select">
              <option value="Montbéliarde">Montbéliarde</option>
              <option value="Gudali">Gudali</option>
              <option value="Holstein">Holstein</option>
              <option value="Métisse">Métisse</option>
            </select>
          </div>
        </div>

        <div class="form-group flex-1">
          <label class="pn-label">Statut actuel</label>
          <div class="select-wrapper">
            <select v-model="form.status" class="pn-select">
              <option value="lactation">En Lactation</option>
              <option value="tarie">Tarie</option>
              <option value="alerte_sante">Alerte Santé</option>
              <option value="alerte_production">Alerte Production</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-group">
        <PnInput
          id="age"
          label="Âge ou Date de naissance"
          v-model="form.age"
          placeholder="Ex: 3 ans ou 12/05/2021"
        />
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
