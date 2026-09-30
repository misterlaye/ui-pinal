<script setup>
import { ref, watch } from 'vue';
import { PhX } from '@phosphor-icons/vue';

const props = defineProps({
  isOpen: Boolean,
  alert: Object
});

const emit = defineEmits(['close', 'submit']);

const diagnostic = ref('');
const traitement = ref('');

watch(() => props.isOpen, (newVal) => {
  if (newVal && props.alert) {
    diagnostic.value = props.alert.message || props.alert.type || '';
    traitement.value = '';
  }
});

const close = () => {
  emit('close');
};

const submit = () => {
  emit('submit', {
    eventId: props.alert.id,
    animalId: props.alert.animalId,
    description: props.alert.type,
    diagnostic: diagnostic.value,
    traitement: traitement.value,
    dateFin: new Date().toISOString().split('T')[0]
  });
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      
      <div class="modal-header">
        <h2>Clôturer l'alerte santé</h2>
        <button class="btn-close" @click="close">
          <PhX :size="24" weight="bold" />
        </button>
      </div>

      <div class="modal-body" v-if="alert">
        
        <div class="alert-context">
          <strong>Animal :</strong> {{ alert.animalName }} (#{{ alert.animalIdentifier }})
          <br>
          <strong>Alerte :</strong> {{ alert.type }}
        </div>

        <div class="form-group">
          <label>Diagnostic posé</label>
          <textarea v-model="diagnostic" class="pn-input" rows="2"></textarea>
        </div>
        
        <div class="form-group">
          <label>Traitement administré (optionnel)</label>
          <textarea v-model="traitement" class="pn-input" rows="2" placeholder="Médicaments, soins apportés..."></textarea>
        </div>
        
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="close">Annuler</button>
        <button class="btn-submit" @click="submit">Confirmer la guérison</button>
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

.alert-context {
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #334155;
  line-height: 1.5;
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

.pn-input {
  padding: 10px 12px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 14px;
  transition: border-color var(--transition-fast);
  resize: vertical;
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
  background: #10B981;
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.btn-submit:hover {
  background: #059669;
}
</style>
