<script setup>
import { PhNotebook } from '@phosphor-icons/vue';

const props = defineProps({
  groups: {
    type: Array,
    required: true
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value);
};
</script>

<template>
  <div class="ration-groups-section">
    
    <div class="section-header">
      <div class="title-group">
        <PhNotebook :size="20" weight="fill" color="#C87533" />
        <h3 class="section-title">Plans de ration par groupe</h3>
      </div>
    </div>

    <div class="groups-grid">
      <div v-for="group in groups" :key="group.id" class="group-card">
        
        <div class="group-header">
          <h4 class="group-name">{{ group.name }}</h4>
          <span class="group-badge">{{ group.cowsCount }} vaches</span>
        </div>

        <ul class="ingredients-list">
          <li v-for="(item, idx) in group.ingredients" :key="idx" class="ingredient-item">
            <span class="ingredient-name">
              <span class="leaf-icon">🌿</span> {{ item.name }}
            </span>
            <span class="ingredient-qty">
              <strong>{{ item.qty }}</strong> {{ item.unit }}
            </span>
          </li>
        </ul>

        <div class="group-footer">
          <span class="cost-label">Coût / jour / animal</span>
          <span class="cost-value">{{ formatCurrency(group.costPerCow) }}</span>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.ration-groups-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.group-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  min-height: 40px;
}

.group-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.group-badge {
  background-color: #FEF3C7;
  color: #D97706;
  font-size: 10px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 100px;
  white-space: nowrap;
  margin-left: 12px;
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.ingredient-name {
  color: var(--text-body);
  display: flex;
  align-items: center;
  gap: 6px;
}

.leaf-icon {
  font-size: 12px;
  opacity: 0.6;
}

.ingredient-qty {
  color: var(--text-muted);
}

.ingredient-qty strong {
  color: var(--text-dark);
}

.group-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px dashed var(--border-light);
}

.cost-label {
  font-size: 12px;
  color: var(--text-muted);
}

.cost-value {
  font-size: 14px;
  font-weight: 700;
  color: #C87533;
}

/* Responsive */
@media (max-width: 1024px) {
  .groups-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .groups-grid {
    grid-template-columns: 1fr;
  }
}
</style>
