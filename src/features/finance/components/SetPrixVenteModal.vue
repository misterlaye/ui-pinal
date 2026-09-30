<script setup>
import { ref } from 'vue';
import { PhX, PhCheck } from '@phosphor-icons/vue';
import { createPrixVente } from '../../../services/finance_service.js';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'price-created']);

const prix = ref({
  prixParLitre: 500,
  dateDebut: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  dateFin: null
});

const isSubmitting = ref(false);
const error = ref('');

const submitPrice = async () => {
  if (!prix.value.prixParLitre || prix.value.prixParLitre <= 0) {
    error.value = "Le prix par litre doit être supérieur à zéro.";
    return;
  }
  if (!prix.value.dateDebut) {
    error.value = "La date de début d'application est obligatoire.";
    return;
  }

  isSubmitting.value = true;
  error.value = '';

  try {
    await createPrixVente({
      prixParLitre: parseFloat(prix.value.prixParLitre),
      dateDebut: prix.value.dateDebut,
      dateFin: prix.value.dateFin || null
    });
    emit('price-created');
    emit('close');
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || "Erreur lors de l'enregistrement du prix.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h2>Configurer le prix de vente du lait</h2>
        <button class="icon-btn" @click="emit('close')">
          <PhX :size="20" weight="bold" />
        </button>
      </header>

      <div class="modal-body">
        <div v-if="error" class="error-alert">{{ error }}</div>

        <p class="description">
          Définissez le prix auquel votre lait est vendu. Ce montant est indispensable pour calculer votre chiffre d'affaires et votre marge réelle.
        </p>

        <div class="form-group">
          <label>Prix de vente par litre (FCFA)</label>
          <input type="number" v-model="prix.prixParLitre" class="form-input" min="1" step="10" placeholder="Ex: 500" required />
        </div>

        <div class="form-group">
          <label>Date de début d'application</label>
          <input type="date" v-model="prix.dateDebut" class="form-input" required />
        </div>

        <div class="form-group">
          <label>Date de fin d'application (Optionnelle)</label>
          <input type="date" v-model="prix.dateFin" class="form-input" />
        </div>
      </div>

      <footer class="modal-footer">
        <button class="btn-secondary" @click="emit('close')" :disabled="isSubmitting">Annuler</button>
        <button class="btn-primary" @click="submitPrice" :disabled="isSubmitting">
          <span v-if="isSubmitting">Enregistrement...</span>
          <span v-else class="flex items-center gap-2">
            <PhCheck :size="16" weight="bold" />
            Enregistrer le prix
          </span>
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; padding: 16px;
}
.modal-content {
  background: var(--bg-white, #FFFFFF);
  border-radius: var(--radius-lg, 12px);
  width: 100%; max-width: 480px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  display: flex; flex-direction: column;
}
.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light, #E2E8F0);
  display: flex; align-items: center; justify-content: space-between;
}
.modal-header h2 { margin: 0; font-size: 18px; color: var(--text-dark, #1E293B); }
.icon-btn { background: none; border: none; cursor: pointer; color: #64748B; padding: 4px; }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.description { font-size: 13px; color: #64748B; margin: 0; line-height: 1.5; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 600; color: #1E293B; }
.form-input {
  padding: 10px 12px; border: 1px solid #CBD5E1; border-radius: 6px;
  font-family: inherit; font-size: 14px; color: #1E293B;
}
.form-input:focus { outline: none; border-color: #10B981; }
.error-alert { padding: 12px; background: #FEF2F2; border: 1px solid #FCA5A5; color: #DC2626; border-radius: 6px; font-size: 13px; }
.modal-footer {
  padding: 16px 24px; border-top: 1px solid var(--border-light, #E2E8F0);
  display: flex; justify-content: flex-end; gap: 12px;
}
.btn-secondary { padding: 8px 16px; background: transparent; border: 1px solid #CBD5E1; border-radius: 6px; font-weight: 600; cursor: pointer; }
.btn-primary { padding: 8px 16px; background: #1E293B; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; }
.flex { display: flex; }
.items-center { align-items: center; }
.gap-2 { gap: 8px; }
</style>
