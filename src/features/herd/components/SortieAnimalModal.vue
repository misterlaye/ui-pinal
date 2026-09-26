<script setup>
import { ref, watch } from 'vue';
import PnModal from '../../../components/ui/PnModal.vue';
import PnInput from '../../../components/ui/PnInput.vue';
import PnButton from '../../../components/ui/PnButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  animalId: {
    type: String,
    required: true,
  }
});

const emit = defineEmits(['update:isOpen', 'submit']);

const form = ref({
  motif: 'VENTE',
  dateSortie: new Date().toISOString().split('T')[0],
  prixVente: ''
});

const isSubmitting = ref(false);

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      form.value = {
        motif: 'VENTE',
        dateSortie: new Date().toISOString().split('T')[0],
        prixVente: ''
      };
    }
  }
);

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
        dateSortie: form.value.dateSortie,
        motif: form.value.motif,
        prixVente: (form.value.motif === 'VENTE' && form.value.prixVente) ? parseFloat(form.value.prixVente) : null
    };
    emit('submit', payload);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <PnModal
    :model-value="isOpen"
    @update:model-value="emit('update:isOpen', $event)"
    title="Déclarer une sortie d'inventaire"
    width="450px"
  >
    <form @submit.prevent="handleSubmit" class="sortie-form">
      <p class="description">Veuillez indiquer le motif de sortie. Cette action changera le statut de l'animal et le retirera du troupeau actif.</p>
      
      <div class="form-group">
        <label class="pn-label">Motif de la sortie</label>
        <div class="select-wrapper">
          <select v-model="form.motif" class="pn-select">
            <option value="VENTE">Vente</option>
            <option value="DECES">Décès</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="pn-label">Date de sortie</label>
        <input type="date" v-model="form.dateSortie" class="pn-select" required />
      </div>

      <div class="form-group" v-if="form.motif === 'VENTE'">
        <PnInput
          id="prixVente"
          label="Prix de vente (Optionnel)"
          v-model="form.prixVente"
          type="number"
          placeholder="Ex: 850000"
        />
      </div>

      <div class="actions">
        <PnButton variant="secondary" @click="emit('update:isOpen', false)" :disabled="isSubmitting">
          Annuler
        </PnButton>
        <PnButton variant="primary" type="submit" :loading="isSubmitting">
          Confirmer la sortie
        </PnButton>
      </div>
    </form>
  </PnModal>
</template>

<style scoped>
.sortie-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.description {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
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
}
.pn-select:focus {
  border-color: var(--primary);
}
</style>
