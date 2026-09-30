<script setup>
import { ref } from 'vue';
import { PhX, PhWarningCircle } from '@phosphor-icons/vue';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'submit']);

const selectedAlert = ref('Boiterie');
const customMessage = ref('');

const close = () => {
  emit('close');
  reset();
};

const reset = () => {
  selectedAlert.value = 'Boiterie';
  customMessage.value = '';
};

const submit = () => {
  const message = selectedAlert.value === 'Autre' 
    ? customMessage.value 
    : selectedAlert.value;
    
  if (!message) return;
  
  emit('submit', { description: 'Signalement Ouvrier : ' + message });
  reset();
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-bottom-sheet">
      
      <div class="modal-header">
        <div class="header-titles">
          <PhWarningCircle :size="24" color="#d9534f" weight="fill" />
          <h2>Signaler un problème</h2>
        </div>
        <button class="btn-close" @click="close">
          <PhX :size="20" weight="bold" />
        </button>
      </div>

      <div class="modal-body">
        <label class="radio-card" :class="{'active': selectedAlert === 'Boiterie'}">
          <input type="radio" v-model="selectedAlert" value="Boiterie" />
          <div class="card-content">
            <span class="card-title">Boiterie</span>
            <span class="card-desc">L'animal a du mal à se déplacer.</span>
          </div>
        </label>

        <label class="radio-card" :class="{'active': selectedAlert === 'Baisse appétit'}">
          <input type="radio" v-model="selectedAlert" value="Baisse appétit" />
          <div class="card-content">
            <span class="card-title">Baisse d'appétit</span>
            <span class="card-desc">Ne mange pas sa ration habituelle.</span>
          </div>
        </label>

        <label class="radio-card" :class="{'active': selectedAlert === 'Autre'}">
          <input type="radio" v-model="selectedAlert" value="Autre" />
          <div class="card-content">
            <span class="card-title">Autre anomalie</span>
            <span class="card-desc">Blessure, mammite, fatigue extrême...</span>
          </div>
        </label>

        <div v-if="selectedAlert === 'Autre'" class="custom-input-wrap">
          <textarea 
            v-model="customMessage" 
            placeholder="Décrivez brièvement le problème..." 
            rows="3"
            class="custom-textarea"
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button 
          class="btn-submit" 
          :disabled="selectedAlert === 'Autre' && !customMessage.trim()"
          @click="submit"
        >
          ENVOYER L'ALERTE
        </button>
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.modal-bottom-sheet {
  background: white;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--w-border-color, #E5E7EB);
}

.header-titles {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-titles h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--w-dark, #1A1A1A);
}

.btn-close {
  background: none;
  border: none;
  padding: 8px;
  color: #6B7280;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 60vh;
  overflow-y: auto;
}

.radio-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--w-border-color, #E5E7EB);
  border-radius: 8px;
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-card input {
  display: none;
}

.radio-card.active {
  background: #FEF2F2;
  border-color: #d9534f;
  box-shadow: 2px 2px 0px #d9534f;
  transform: translate(-2px, -2px);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--w-dark, #1A1A1A);
}

.card-desc {
  font-size: 12px;
  color: #6B7280;
}

.custom-input-wrap {
  margin-top: 8px;
}

.custom-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--w-border-color, #E5E7EB);
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
}

.custom-textarea:focus {
  outline: none;
  border-color: #d9534f;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid var(--w-border-color, #E5E7EB);
}

.btn-submit {
  width: 100%;
  background: #d9534f;
  color: white;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
}

.btn-submit:disabled {
  background: #FCA5A5;
  cursor: not-allowed;
}
</style>
