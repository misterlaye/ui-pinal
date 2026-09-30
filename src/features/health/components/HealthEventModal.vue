<script setup>
import { ref } from 'vue';
import { PhX } from '@phosphor-icons/vue';

const props = defineProps({
  isOpen: Boolean,
  animalId: String
});

const emit = defineEmits(['update:isOpen', 'submit']);

// Formulaire
const eventType = ref('MALADIE');
const dateEvent = ref(new Date().toISOString().split('T')[0]);
const diagnostic = ref('');
const traitement = ref('');
const dateFin = ref(''); // Sert de date de fin ou date de rappel pour le vaccin

const closeModal = () => {
  emit('update:isOpen', false);
  resetForm();
};

const resetForm = () => {
  eventType.value = 'MALADIE';
  dateEvent.value = new Date().toISOString().split('T')[0];
  diagnostic.value = '';
  traitement.value = '';
  dateFin.value = '';
};

const submitForm = () => {
  if (!eventType.value) return;
  
  // Format the payload based on type
  const payload = {
    date: dateEvent.value,
    description: eventType.value === 'VACCIN' ? 'Vaccination' : 'Consultation'
  };

  if (eventType.value === 'VACCIN') {
    payload.traitement = traitement.value || 'Vaccin (non spécifié)';
    payload.dateFin = dateFin.value || null; // Date de rappel
  } else {
    payload.diagnostic = diagnostic.value;
    payload.traitement = traitement.value;
    payload.dateFin = dateFin.value || null;
  }

  emit('submit', payload);
  resetForm();
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      
      <div class="modal-header">
        <h2>Déclarer un événement sanitaire</h2>
        <button class="btn-close" @click="closeModal">
          <PhX :size="24" weight="bold" />
        </button>
      </div>

      <div class="modal-body">
        
        <div class="form-group">
          <label>Type d'événement</label>
          <select v-model="eventType" class="pn-input">
            <option value="MALADIE">Maladie / Consultation</option>
            <option value="VACCIN">Vaccination</option>
            <option value="SOIN">Soin préventif</option>
          </select>
        </div>

        <div class="form-group">
          <label>Date de l'événement</label>
          <input type="date" v-model="dateEvent" class="pn-input" required />
        </div>

        <template v-if="eventType === 'VACCIN'">
          <div class="form-group">
            <label>Nom du Vaccin</label>
            <input type="text" v-model="traitement" class="pn-input" placeholder="Ex: Vaccin Fièvre Aphteuse" required />
          </div>
          <div class="form-group">
            <label>Date de prochain rappel (Optionnel)</label>
            <input type="date" v-model="dateFin" class="pn-input" />
            <span class="help-text">Permet d'afficher ce rappel dans le calendrier vaccinal.</span>
          </div>
        </template>

        <template v-else>
          <div class="form-group">
            <label>Diagnostic / Symptômes</label>
            <textarea v-model="diagnostic" class="pn-input" rows="3" placeholder="Description des symptômes ou maladie diagnostiquée"></textarea>
          </div>
          
          <div class="form-group">
            <label>Traitement administré</label>
            <textarea v-model="traitement" class="pn-input" rows="2" placeholder="Médicaments, doses..."></textarea>
          </div>

          <div class="form-group">
            <label>Date de fin de traitement / guérison</label>
            <input type="date" v-model="dateFin" class="pn-input" />
          </div>
        </template>
        
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="closeModal">Annuler</button>
        <button class="btn-submit" @click="submitForm">Enregistrer l'événement</button>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-dark);
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  color: var(--text-dark);
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.help-text {
  font-size: 11px;
  color: var(--text-muted);
}

.pn-input {
  padding: 10px 12px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 14px;
  transition: border-color var(--transition-fast);
}

.pn-input:focus {
  outline: none;
  border-color: #C87533;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: var(--bg-page);
  border-bottom-left-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
}

.btn-cancel {
  padding: 10px 16px;
  background: white;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-dark);
  font-weight: 600;
  cursor: pointer;
}

.btn-submit {
  padding: 10px 16px;
  background: #C87533;
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.btn-submit:hover {
  background: #b5692d;
}
</style>
