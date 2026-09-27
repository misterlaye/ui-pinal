<script setup>
import { ref, onMounted, computed } from 'vue';
import { PhPlus, PhMagnifyingGlass, PhDotsThree, PhCurrencyCircleDollar } from '@phosphor-icons/vue';
import { getAliments, createAliment, getAlimentPrices, createAlimentPrice } from '../../../services/nutrition_service.js';

const aliments = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const isModalOpen = ref(false);
const isPriceModalOpen = ref(false);
const selectedAlimentForPrice = ref(null);

const newAliment = ref({
  code: '',
  nom: '',
  categorie: 'FOURRAGE',
  unite: 'KG'
});

const newPrice = ref({
  prixUnitaire: '',
  dateDebut: new Date().toISOString().split('T')[0]
});

const categories = ['FOURRAGE', 'CONCENTRE', 'MINERAL', 'LIQUIDE', 'AUTRE'];
const unites = ['KG', 'SAC', 'LITRE', 'AUTRE'];

const fetchAliments = async () => {
  try {
    isLoading.value = true;
    const data = await getAliments();
    const withPrices = await Promise.all(
      data.map(async (aliment) => {
        try {
          const prices = await getAlimentPrices(aliment.id);
          const current = prices && prices.length ? prices[0].prixUnitaire : null;
          return { ...aliment, currentPrice: current };
        } catch (e) {
          return { ...aliment, currentPrice: null };
        }
      })
    );
    aliments.value = withPrices;
  } catch (error) {
    console.error("Erreur de chargement des aliments", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAliments();
});

const filteredAliments = computed(() => {
  if (!searchQuery.value) return aliments.value;
  return aliments.value.filter(a => 
    a.nom.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    a.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const submitAliment = async () => {
  try {
    await createAliment(newAliment.value);
    isModalOpen.value = false;
    newAliment.value = { code: '', nom: '', categorie: 'FOURRAGE', unite: 'KG' };
    await fetchAliments();
  } catch (error) {
    console.error("Erreur lors de la création de l'aliment", error);
    alert("Erreur lors de la création de l'aliment.");
  }
};

const openPriceModal = (aliment) => {
  selectedAlimentForPrice.value = aliment;
  newPrice.value = {
    prixUnitaire: aliment.currentPrice || '',
    dateDebut: new Date().toISOString().split('T')[0]
  };
  isPriceModalOpen.value = true;
};

const submitPrice = async () => {
  if (!selectedAlimentForPrice.value || !newPrice.value.prixUnitaire) return;
  try {
    await createAlimentPrice(selectedAlimentForPrice.value.id, {
      prixUnitaire: parseFloat(newPrice.value.prixUnitaire),
      dateDebut: newPrice.value.dateDebut
    });
    isPriceModalOpen.value = false;
    await fetchAliments();
  } catch (error) {
    console.error("Erreur lors de la définition du prix", error);
    alert("Erreur lors de la définition du prix : " + (error.response?.data?.message || error.message));
  }
};
</script>

<template>
  <div class="catalogue-container">
    <div class="catalogue-header">
      <div class="search-bar">
        <PhMagnifyingGlass :size="16" class="search-icon" />
        <input v-model="searchQuery" type="text" placeholder="Rechercher un aliment (nom ou code)..." />
      </div>
      <button class="btn-primary" @click="isModalOpen = true">
        <PhPlus :size="16" weight="bold" />
        Ajouter un aliment
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
      Chargement du catalogue...
    </div>

    <div v-else class="catalogue-grid">
      <div class="aliment-card" v-for="aliment in filteredAliments" :key="aliment.id">
        <div class="card-header">
          <div class="category-badge">{{ aliment.categorie }}</div>
          <span class="status-indicator" :class="{ active: aliment.actif }">
            {{ aliment.actif ? 'Actif' : 'Inactif' }}
          </span>
        </div>
        <div class="card-body">
          <h3 class="aliment-name">{{ aliment.nom }}</h3>
          <p class="aliment-code">Code: {{ aliment.code }} • Unité: <strong>{{ aliment.unite }}</strong></p>
        </div>

        <div class="price-section">
          <div class="price-info">
            <span class="price-label">Prix unitaire</span>
            <span class="price-value" v-if="aliment.currentPrice">
              <strong>{{ aliment.currentPrice }}</strong> FCFA / {{ aliment.unite.toLowerCase() }}
            </span>
            <span class="price-missing" v-else>Non défini</span>
          </div>
          <button class="btn-price" @click="openPriceModal(aliment)">
            {{ aliment.currentPrice ? 'Modifier prix' : '+ Définir prix' }}
          </button>
        </div>
      </div>
      
      <div v-if="filteredAliments.length === 0" class="empty-state">
        Aucun aliment trouvé dans le catalogue.
      </div>
    </div>

    <!-- Modale d'ajout d'aliment -->
    <div class="modal-overlay" v-if="isModalOpen" @click.self="isModalOpen = false">
      <div class="modal-content">
        <h2>Ajouter un aliment</h2>
        
        <form @submit.prevent="submitAliment" class="aliment-form">
          <div class="form-group">
            <label>Code <span class="required">*</span></label>
            <input type="text" v-model="newAliment.code" required placeholder="Ex: FO-MAIS" />
          </div>
          
          <div class="form-group">
            <label>Nom <span class="required">*</span></label>
            <input type="text" v-model="newAliment.nom" required placeholder="Ex: Ensilage de maïs" />
          </div>

          <div class="form-group">
            <label>Catégorie</label>
            <select v-model="newAliment.categorie">
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>Unité de mesure</label>
            <select v-model="newAliment.unite">
              <option v-for="u in unites" :key="u" :value="u">{{ u }}</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="isModalOpen = false">Annuler</button>
            <button type="submit" class="btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modale de définition de prix -->
    <div class="modal-overlay" v-if="isPriceModalOpen" @click.self="isPriceModalOpen = false">
      <div class="modal-content">
        <h2>Définir le prix : {{ selectedAlimentForPrice?.nom }}</h2>
        
        <form @submit.prevent="submitPrice" class="aliment-form">
          <div class="form-group">
            <label>Prix unitaire (FCFA / {{ selectedAlimentForPrice?.unite?.toLowerCase() }}) <span class="required">*</span></label>
            <input type="number" step="0.5" v-model="newPrice.prixUnitaire" required placeholder="Ex: 150" />
          </div>

          <div class="form-group">
            <label>Date de début d'application <span class="required">*</span></label>
            <input type="date" v-model="newPrice.dateDebut" required />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="isPriceModalOpen = false">Annuler</button>
            <button type="submit" class="btn-primary">Appliquer le prix</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
.catalogue-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.catalogue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  width: 320px;
}

.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  font-family: var(--font-family);
  font-size: 14px;
  width: 100%;
}

.search-icon {
  color: var(--text-muted);
}

.catalogue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.aliment-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.aliment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-badge {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: #F4EAE1;
  color: #C87533;
  padding: 3px 8px;
  border-radius: 4px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.aliment-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.aliment-code {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
  margin-top: 4px;
}

.price-info {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.price-value {
  font-size: 13px;
  color: var(--text-dark);
}

.price-value strong {
  font-weight: 700;
  color: #C87533;
}

.price-missing {
  font-size: 12px;
  font-style: italic;
  color: #9CA3AF;
}

.btn-price {
  background: #FDF9F5;
  border: 1px solid #E4D5C7;
  color: #C87533;
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-price:hover {
  background: #C87533;
  color: white;
  border-color: #C87533;
}

.status-indicator {
  font-size: 11px;
  font-weight: 500;
  color: #9CA3AF;
}

.status-indicator.active {
  color: #10B981;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: var(--bg-white);
  padding: 24px;
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.modal-content h2 {
  margin: 0 0 20px 0;
  font-size: 17px;
  font-weight: 600;
  color: var(--text-dark);
}

.aliment-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-dark);
}

.required {
  color: #EF4444;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: 14px;
  background: var(--bg-white);
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #C87533;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.btn-cancel {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-dark);
  cursor: pointer;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #C87533;
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  background: #A85D23;
}
</style>
