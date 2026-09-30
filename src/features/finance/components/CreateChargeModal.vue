<script setup>
import { ref } from 'vue';
import { PhX, PhCheck } from '@phosphor-icons/vue';
import { apiClient } from '../../../services/api_client';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'charge-created']);

const charge = ref({
  libelle: '',
  categorie: 'SANTE',
  montant: null,
  date: new Date().toISOString().split('T')[0],
  description: ''
});

const isSubmitting = ref(false);
const error = ref('');

const categories = [
  { value: 'SANTE', label: 'Santé (Vaccins, Soins)' },
  { value: 'MAIN_OEUVRE', label: 'Main d\'œuvre (Salaires)' },
  { value: 'ENTRETIEN', label: 'Entretien & Matériel' },
  { value: 'AUTRES', label: 'Autres' }
];

const submitCharge = async () => {
  if (!charge.value.libelle || !charge.value.montant) {
    error.value = "Le libellé et le montant sont obligatoires.";
    return;
  }
  
  if (charge.value.montant <= 0) {
    error.value = "Le montant doit être supérieur à zéro.";
    return;
  }

  isSubmitting.value = true;
  error.value = '';

  try {
    await apiClient.post('/finance/charges', charge.value);
    
    // Reset form
    charge.value = {
      libelle: '',
      categorie: 'SANTE',
      montant: null,
      date: new Date().toISOString().split('T')[0],
      description: ''
    };
    
    emit('charge-created');
    emit('close');
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || "Une erreur est survenue lors de l'enregistrement de la charge.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h2>Saisir une nouvelle charge</h2>
        <button class="icon-btn" @click="emit('close')">
          <PhX :size="20" weight="bold" />
        </button>
      </header>

      <div class="modal-body">
        <div v-if="error" class="error-alert">{{ error }}</div>

        <div class="form-group">
          <label>Date</label>
          <input type="date" v-model="charge.date" class="form-input" />
        </div>

        <div class="form-group">
          <label>Libellé</label>
          <input type="text" v-model="charge.libelle" class="form-input" placeholder="Ex: Honoraires vétérinaire" />
        </div>

        <div class="form-group">
          <label>Catégorie</label>
          <select v-model="charge.categorie" class="form-input">
            <option v-for="cat in categories" :key="cat.value" :value="cat.value">
              {{ cat.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Montant (FCFA)</label>
          <input type="number" v-model="charge.montant" class="form-input" min="0" placeholder="0" />
        </div>
        
        <div class="form-group">
          <label>Description (Optionnelle)</label>
          <textarea v-model="charge.description" class="form-input" rows="3" placeholder="Détails supplémentaires..."></textarea>
        </div>
      </div>

      <footer class="modal-footer">
        <button class="btn-secondary" @click="emit('close')" :disabled="isSubmitting">Annuler</button>
        <button class="btn-primary" @click="submitCharge" :disabled="isSubmitting">
          <span v-if="isSubmitting">Enregistrement...</span>
          <span v-else class="flex items-center gap-2">
            <PhCheck :size="16" weight="bold" />
            Valider la charge
          </span>
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}

.modal-content {
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-dark);
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 4px;
}

.icon-btn:hover {
  background: var(--bg-page);
  color: var(--text-dark);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dark);
}

.form-input {
  padding: 10px 12px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 14px;
  color: var(--text-dark);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color, #10B981);
}

textarea.form-input {
  resize: vertical;
}

.error-alert {
  padding: 12px;
  background: #FEF2F2;
  border: 1px solid #FCA5A5;
  color: #DC2626;
  border-radius: var(--radius-md);
  font-size: 13px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-dark);
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  padding: 8px 16px;
  background: var(--text-dark);
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-white);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.btn-primary:disabled, .btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.gap-2 {
  gap: 8px;
}
</style>
