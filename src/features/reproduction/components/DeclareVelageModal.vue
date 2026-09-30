<script setup>
import { ref, watch } from 'vue';
import { PhX, PhPlus, PhTrash } from '@phosphor-icons/vue';

const props = defineProps({
  isOpen: Boolean,
  animal: Object,
  cycle: Object
});

const emit = defineEmits(['close', 'submit']);

const dateReelle = ref(new Date().toISOString().split('T')[0]);
const veaux = ref([]);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    dateReelle.value = new Date().toISOString().split('T')[0];
    veaux.value = [];
  }
});

const addVeau = () => {
  veaux.value.push({
    identifiant: '',
    nom: '',
    sexe: 'FEMELLE',
    indexPortee: veaux.value.length + 1
  });
};

const removeVeau = (index) => {
  veaux.value.splice(index, 1);
  // Re-index
  veaux.value.forEach((v, idx) => v.indexPortee = idx + 1);
};

const close = () => emit('close');

const submit = () => {
  emit('submit', {
    cycleId: props.cycle.id,
    dateReelle: dateReelle.value,
    veaux: veaux.value.map(v => ({
      identifiant: v.identifiant ? v.identifiant : null,
      nom: v.nom ? v.nom : null,
      sexe: v.sexe,
      indexPortee: v.indexPortee
    }))
  });
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      
      <div class="modal-header">
        <h2>Déclarer un Vêlage</h2>
        <button class="btn-close" @click="close">
          <PhX :size="24" weight="bold" />
        </button>
      </div>

      <div class="modal-body" v-if="animal && cycle">
        <div class="animal-context">
          <strong>Mère :</strong> {{ animal.nom }} (#{{ animal.identifiant }})<br/>
          <strong>Date prévue (approximative) :</strong> {{ (cycle.datePrevueVelage || cycle.dateVelagePrevue) ? new Date(cycle.datePrevueVelage || cycle.dateVelagePrevue).toLocaleDateString('fr-FR') : 'Inconnue' }}
        </div>

        <div class="form-group">
          <label>Date réelle du vêlage</label>
          <input type="date" v-model="dateReelle" class="pn-input" required />
        </div>

        <div class="veaux-section">
          <div class="veaux-header">
            <label>Nouveau(x) né(s)</label>
            <button class="btn-add" @click="addVeau" title="Ajouter un veau">
              <PhPlus :size="16" weight="bold" /> Ajouter
            </button>
          </div>
          
          <div v-if="veaux.length === 0" class="empty-veaux">
            Aucun veau ajouté. (Vêlage sans enregistrement de veau)
          </div>

          <div v-for="(veau, idx) in veaux" :key="idx" class="veau-form-row">
            <div class="veau-inputs">
              <input type="text" v-model="veau.identifiant" class="pn-input" placeholder="ID (ex: V01)" />
              <input type="text" v-model="veau.nom" class="pn-input" placeholder="Nom (optionnel)" />
              <select v-model="veau.sexe" class="pn-input">
                <option value="FEMELLE">Femelle</option>
                <option value="MALE">Mâle</option>
                <option value="INCONNU">Inconnu</option>
              </select>
            </div>
            <button class="btn-remove" @click="removeVeau(idx)" title="Retirer">
              <PhTrash :size="18" weight="fill" />
            </button>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="close">Annuler</button>
        <button class="btn-submit" @click="submit">Enregistrer le vêlage</button>
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
  background: white; width: 100%; max-width: 550px; max-height: 90vh;
  border-radius: var(--radius-lg); display: flex; flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
}
.modal-header {
  padding: 24px; border-bottom: 1px solid var(--border-light);
  display: flex; justify-content: space-between; align-items: center;
}
.modal-header h2 { margin: 0; font-size: 18px; font-weight: 700; color: var(--text-dark); }
.btn-close { background: none; border: none; cursor: pointer; color: var(--text-muted); }
.btn-close:hover { color: var(--text-dark); }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
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

.veaux-section { display: flex; flex-direction: column; gap: 12px; border-top: 1px dashed var(--border-light); padding-top: 16px; margin-top: 8px; }
.veaux-header { display: flex; justify-content: space-between; align-items: center; }
.veaux-header label { font-size: 13px; font-weight: 600; color: var(--text-dark); }
.btn-add { display: flex; align-items: center; gap: 4px; padding: 6px 12px; background: #EEF2FF; color: #4F46E5; border: none; border-radius: 4px; font-weight: 600; font-size: 12px; cursor: pointer; transition: background 0.2s;}
.btn-add:hover { background: #E0E7FF; }
.empty-veaux { font-size: 13px; color: var(--text-muted); font-style: italic; background: #F9FAFB; padding: 12px; border-radius: 6px; text-align: center; }
.veau-form-row { display: flex; gap: 8px; align-items: center; background: #F8FAFC; padding: 8px; border-radius: 6px; }
.veau-inputs { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; flex: 1; }
.btn-remove { background: #FEE2E2; color: #DC2626; border: none; border-radius: 4px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;}
.btn-remove:hover { background: #FECACA; }

.modal-footer {
  padding: 16px 24px; border-top: 1px solid var(--border-light);
  display: flex; justify-content: flex-end; gap: 12px;
  background-color: var(--bg-page); border-bottom-left-radius: var(--radius-lg); border-bottom-right-radius: var(--radius-lg);
}
.btn-cancel { padding: 10px 16px; background: white; border: 1px solid var(--border-light); border-radius: var(--radius-md); color: var(--text-dark); font-weight: 600; cursor: pointer; }
.btn-submit { padding: 10px 16px; background: var(--primary); border: none; border-radius: var(--radius-md); color: white; font-weight: 600; cursor: pointer; }
.btn-submit:hover { background: var(--primary-dark, #A1592D); }
</style>
