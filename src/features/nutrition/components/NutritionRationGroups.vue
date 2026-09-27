<script setup>
import { PhNotebook, PhCow } from '@phosphor-icons/vue';

const props = defineProps({
  groups: {
    type: Array,
    required: true
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value || 0);
};
</script>

<template>
  <div class="ration-groups-section">
    
    <div class="section-header">
      <div class="title-group">
        <PhNotebook :size="20" weight="fill" color="#C87533" />
        <h3 class="section-title">Rations Actives du Troupeau</h3>
      </div>
      <span class="count-badge" v-if="groups && groups.length">
        {{ groups.length }} {{ groups.length > 1 ? 'plans actifs' : 'plan actif' }}
      </span>
    </div>

    <div v-if="groups && groups.length" class="groups-grid">
      <div v-for="group in groups" :key="group.id" class="group-card">
        
        <div class="group-header">
          <div class="group-title-row">
            <PhCow :size="18" weight="fill" color="#C87533" />
            <h4 class="group-name">{{ group.name }}</h4>
          </div>
          <span class="group-badge">{{ group.animalCount || group.cowsCount || 1 }} vache</span>
        </div>

        <div class="group-composition">
          <p class="composition-text">{{ group.composition }}</p>
        </div>

        <div class="group-footer">
          <span class="cost-label">Coût journalier estimé</span>
          <span class="cost-value">{{ formatCurrency(group.costPerHead || group.costPerCow || 0) }}</span>
        </div>

      </div>
    </div>

    <div v-else class="empty-groups">
      <p>Aucune ration active sur le troupeau actuellement.</p>
      <span>Assignez une ration à une vache depuis la fiche animal pour suivre sa distribution et son coût.</span>
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
  justify-content: space-between;
  align-items: center;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.count-badge {
  font-size: 12px;
  font-weight: 600;
  background: #FDF9F5;
  color: #C87533;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid #E4D5C7;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.group-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.group-badge {
  font-size: 11px;
  font-weight: 600;
  background: #ECFDF5;
  color: #10B981;
  padding: 3px 8px;
  border-radius: 4px;
}

.group-composition {
  background: #FAF8F5;
  border-radius: var(--radius-md);
  padding: 10px 12px;
}

.composition-text {
  font-size: 13px;
  color: var(--text-dark);
  margin: 0;
  line-height: 1.4;
}

.group-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}

.cost-label {
  font-size: 12px;
  color: var(--text-muted);
}

.cost-value {
  font-size: 15px;
  font-weight: 700;
  color: #C87533;
}

.empty-groups {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.empty-groups p {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.empty-groups span {
  font-size: 13px;
  color: var(--text-muted);
}
</style>
