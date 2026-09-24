<script setup>
import { PhTruck } from '@phosphor-icons/vue';

const props = defineProps({
  deliveries: {
    type: Array,
    required: true
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value);
};
</script>

<template>
  <div class="deliveries-card">
    <div class="card-header">
      <div class="title-group">
        <PhTruck :size="20" weight="bold" color="#C87533" />
        <h3 class="card-title">Historique des livraisons</h3>
      </div>
    </div>
    
    <div class="deliveries-list">
      <div v-for="item in deliveries" :key="item.id" class="delivery-item">
        
        <div class="delivery-icon-col">
          <div class="delivery-icon">
            <PhTruck :size="16" weight="fill" color="#C87533" />
          </div>
        </div>

        <div class="delivery-content">
          <div class="supplier-info">
            <span class="supplier-name">{{ item.supplier }}</span>
            <span class="items-desc">{{ item.items }}</span>
            <span class="delivery-date">{{ item.date }}</span>
          </div>
          
          <div class="amount-info">
            {{ formatCurrency(item.amount) }}
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.deliveries-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  height: 100%;
}

.card-header {
  margin-bottom: 24px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.deliveries-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.delivery-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.delivery-icon-col {
  flex-shrink: 0;
}

.delivery-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #F8ECE2; /* Primary light */
  display: flex;
  align-items: center;
  justify-content: center;
}

.delivery-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-light);
}

.delivery-item:last-child .delivery-content {
  border-bottom: none;
  padding-bottom: 0;
}

.supplier-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.supplier-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-dark);
}

.items-desc {
  font-size: 13px;
  color: var(--text-body);
}

.delivery-date {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.amount-info {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-dark);
  white-space: nowrap;
}
</style>
