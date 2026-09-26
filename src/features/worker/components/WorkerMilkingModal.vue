<script setup>
import { ref, computed, watch } from 'vue';
import { PhX, PhMagnifyingGlass, PhCheck, PhMinus, PhPlus, PhDrop, PhClock, PhCaretRight } from '@phosphor-icons/vue';
import { getWorkerAnimals } from '../../../services/worker_service.js';
import { useExploitation } from '../../../composables/useExploitation.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

const step = ref(1); // 1 = Select Animal, 2 = Enter Quantity
const selectedAnimal = ref(null);
const searchQuery = ref('');
const quantity = ref(10.0);
const presets = [8, 10, 12, 14];

const animals = ref([]);
const { getActiveExploitation } = useExploitation();

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    const exploitationId = getActiveExploitation();
    if (exploitationId) {
      animals.value = await getWorkerAnimals(exploitationId);
    }
  }
});

const filteredAnimals = computed(() => {
  let list = animals.value.filter(a => a.isLactating); // Only lactating animals can be milked
  if (!searchQuery.value) return list;
  return list.filter(a => 
    a.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    (a.identifiant && a.identifiant.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

function selectAnimal(animal) {
  selectedAnimal.value = animal;
  quantity.value = 10.0; // Reset or smart default based on history
  step.value = 2;
}

function adjustQuantity(delta) {
  let newVal = quantity.value + delta;
  if (newVal < 0) newVal = 0;
  quantity.value = parseFloat(newVal.toFixed(1));
}

function setQuantity(val) {
  quantity.value = parseFloat(val.toFixed(1));
}

function close() {
  step.value = 1;
  selectedAnimal.value = null;
  searchQuery.value = '';
  emit('close');
}

function submit() {
  emit('submit', {
    animal: selectedAnimal.value,
    quantity: quantity.value,
    time: new Date()
  });
  close();
}
</script>

<template>
  <div class="modal-overlay" v-if="isOpen">
    <div class="modal-container">
      
      <!-- Top Handle (Decorative) -->
      <div class="modal-handle"></div>

      <!-- Header -->
      <div class="modal-header">
        <div class="tag tag-outline">ÉTAPE {{ step }} / 2</div>
        <button class="close-btn" @click="close">
          <PhX :size="24" weight="bold" />
        </button>
      </div>

      <h2 class="modal-title">
        {{ step === 1 ? "Choisir l'animal" : "Quantité produite" }}
      </h2>

      <!-- STEP 1: SELECT ANIMAL -->
      <div v-if="step === 1" class="step-1">
        <div class="search-box">
          <PhMagnifyingGlass :size="20" weight="bold" class="search-icon" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Numéro ou nom de l'animal" 
            class="search-input"
          />
        </div>

        <div class="animal-list">
          <div 
            v-for="animal in filteredAnimals" 
            :key="animal.id"
            class="animal-card"
            @click="selectAnimal(animal)"
          >
            <div class="animal-icon">
              <!-- Mimic the meat/steak icon in mockup or use cow -->
              <span style="font-weight:900;font-size:18px;">{{ animal.name ? animal.name.charAt(0) : '?' }}</span>
            </div>
            <div class="animal-info">
              <h4 class="animal-name">{{ animal.name }} #{{ animal.identifiant }}</h4>
              <p class="animal-meta">{{ animal.race }} • {{ animal.status }}</p>
            </div>
            <PhCaretRight :size="20" weight="bold" />
          </div>
        </div>
      </div>

      <!-- STEP 2: ENTER QUANTITY -->
      <div v-if="step === 2" class="step-2">
        <!-- Selected Animal Header -->
        <div class="selected-animal-card">
          <div class="animal-icon">
            <span style="font-weight:900;font-size:18px;">{{ selectedAnimal.name ? selectedAnimal.name.charAt(0) : '?' }}</span>
          </div>
          <div class="animal-info">
            <span class="meta-label">ANIMAL</span>
            <h4 class="animal-name">{{ selectedAnimal.name }} #{{ selectedAnimal.identifiant }}</h4>
          </div>
          <button class="change-btn" @click="step = 1">CHANGER</button>
        </div>

        <!-- Quantity Input -->
        <div class="quantity-section">
          <span class="meta-label text-center">VOLUME DE LA TRAITE</span>
          
          <div class="quantity-stepper">
            <button class="step-btn" @click="adjustQuantity(-0.5)">
              <PhMinus :size="24" weight="bold" />
            </button>
            <div class="quantity-display">
              <span class="qty-number">{{ quantity.toFixed(1).replace('.', ',') }}</span>
              <span class="qty-unit">LITRES</span>
            </div>
            <button class="step-btn" @click="adjustQuantity(0.5)">
              <PhPlus :size="24" weight="bold" />
            </button>
          </div>

          <div class="preset-buttons">
            <button 
              v-for="preset in presets" 
              :key="preset"
              class="preset-btn"
              :class="{ active: quantity === preset }"
              @click="setQuantity(preset)"
            >
              {{ preset }} L
            </button>
          </div>
        </div>

        <!-- Submit -->
        <button class="submit-btn" @click="submit">
          <PhDrop :size="20" weight="fill" />
          ENREGISTRER {{ quantity.toFixed(1).replace('.', ',') }} L
        </button>

        <p class="auto-time">
          <PhClock :size="14" />
          Heure enregistrée automatiquement : {{ new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) }}
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.modal-container {
  background-color: #F4F1EA;
  border: 2px solid #1A1A1A;
  box-shadow: 6px 6px 0px #1A1A1A;
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  position: relative;
}

/* Handle */
.modal-handle {
  width: 48px;
  height: 4px;
  background-color: #1A1A1A;
  margin: 0 auto 20px auto;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 4px 6px;
  border: 1px solid #1A1A1A;
}
.tag-outline {
  background-color: transparent;
}

.close-btn {
  background: #FFFFFF;
  border: 1px solid #1A1A1A;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal-title {
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 24px;
}

/* STEP 1 */
.step-1 {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.search-box {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border: 1px solid #1A1A1A;
  padding: 0 12px;
  height: 48px;
}

.search-icon {
  margin-right: 8px;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  width: 100%;
}

.animal-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.animal-card {
  background: #FFFFFF;
  border: 1px solid #1A1A1A;
  box-shadow: 2px 2px 0px #1A1A1A;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.animal-card:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px #1A1A1A;
}

.animal-icon {
  background-color: #EBC137;
  width: 40px;
  height: 40px;
  border: 1px solid #1A1A1A;
  display: flex;
  align-items: center;
  justify-content: center;
}

.animal-info {
  flex: 1;
}

.animal-name {
  font-size: 14px;
  font-weight: 700;
}

.animal-meta {
  font-size: 11px;
  font-weight: 600;
  color: #737373;
}

/* STEP 2 */
.step-2 {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.selected-animal-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #1A1A1A;
}

.meta-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #737373;
  margin-bottom: 2px;
}

.text-center {
  text-align: center;
  display: block;
}

.change-btn {
  font-size: 10px;
  font-weight: 700;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quantity-stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-btn {
  width: 48px;
  height: 48px;
  background: #FFFFFF;
  border: 1px solid #1A1A1A;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 2px 0px #1A1A1A;
}
.step-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px #1A1A1A;
}

.quantity-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qty-number {
  font-size: 56px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
}

.qty-unit {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #EBC137;
  text-shadow: 0.5px 0.5px 0 #1A1A1A;
}

.preset-buttons {
  display: flex;
  gap: 8px;
}

.preset-btn {
  flex: 1;
  background: #FFFFFF;
  border: 1px solid #1A1A1A;
  padding: 12px 0;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.preset-btn.active {
  background: #EBC137;
}

.submit-btn {
  background: #EBC137;
  border: 2px solid #1A1A1A;
  box-shadow: 4px 4px 0px #1A1A1A;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
}
.submit-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1A1A1A;
}

.auto-time {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 600;
  color: #737373;
}
</style>
