<script setup>
import { ref, watch } from 'vue';
import { PhX } from '@phosphor-icons/vue';

const props = defineProps({
  isOpen: Boolean,
  animal: Object,
  cycle: Object
});

const emit = defineEmits(['close', 'submit']);

const dateConstat = ref(new Date().toISOString().split('T')[0]);
const resultat = ref('POSITIF');
const veterinaire = ref('');

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    dateConstat.value = new Date().toISOString().split('T')[0];
    resultat.value = 'POSITIF';
    veterinaire.value = '';
  }
});

const close = () => emit('close');

const submit = () => {
  emit('submit', {
    cycleId: props.cycle.id,
    dateConstat: dateConstat.value,
    resultat: resultat.value,
    veterinaire: veterinaire.value ? veterinaire.value : null
  });
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      
      <div class="modal-header">
        <h2>Enregistrer Constat de Gestation</h2>
        <button class="btn-close" @click="close">
          <PhX :size="24" weight="bold" />
        </button>
      </div>

      <div class="modal-body" v-if="animal && cycle">
        <div class="animal-context">
          <strong>Femelle :</strong> {{ animal.nom }} (#{{ animal.identifiant }})<br/>
          <strong>Date insémination :</strong> {{ new Date(cycle.dateDebut).toLocaleDateString() }}
        </div>

        <div class="form-group">
          <label>Date du constat</label>
          <input type="date" v-model="dateConstat" class="pn-input" required />
        </div>

        <div class="form-group">
          <label>Résultat du constat</label>
          <select v-model="resultat" class="pn-input">
            <option value="POSITIF">Positif (Gestante)</option>
            <option value="NEGATIF">Négatif (Vide)</option>
            <option value="DOUTEUSE">Douteux (À recontrôler)</option>
          </select>
        </div>

        <div class="form-group">
          <label>Vétérinaire / Opérateur (Optionnel)</label>
          <input type="text" v-model="veterinaire" class="pn-input" placeholder="Nom du professionnel" />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="close">Annuler</button>
        <button class="btn-submit" @click="submit">Enregistrer</button>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white; width: 100%; max-width: 480px;
  border-radius: var(--radius-lg); display: flex; flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
}
.modal-header {
  padding: 24px; border-bottom: 1px solid var(--border-light);
  display: flex; justify-content: space-between; align-items: center;
}
.modal-header h2 { margin: 0; font-size: 18px; font-weight: 700; color: var(--text-dark); }
.btn-close { background: none; border: none; cursor: pointer; color: var(--text-muted); }
.btn-close:hover { color: var(--text-dark); }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.animal-context {
  background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px;
  border-radius: 6px; font-size: 14px; color: #334155; line-height: 1.5;
}
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 13px; font-weight: 600; color: var(--text-dark); }
.pn-input {
  padding: 10px 12px; border: 1px solid var(--border-light); border-radius: var(--radius-md);
  font-family: inherit; font-size: 14px; transition: border-color var(--transition-fast);
}
.pn-input:focus { outline: none; border-color: var(--primary); }
.modal-footer {
  padding: 16px 24px; border-top: 1px solid var(--border-light);
  display: flex; justify-content: flex-end; gap: 12px;
  background-color: var(--bg-page); border-bottom-left-radius: var(--radius-lg); border-bottom-right-radius: var(--radius-lg);
}
.btn-cancel { padding: 10px 16px; background: white; border: 1px solid var(--border-light); border-radius: var(--radius-md); color: var(--text-dark); font-weight: 600; cursor: pointer; }
.btn-submit { padding: 10px 16px; background: var(--primary); border: none; border-radius: var(--radius-md); color: white; font-weight: 600; cursor: pointer; }
.btn-submit:hover { background: var(--primary-dark, #A1592D); }
</style>
