<script setup>
import { PhCalendarBlank } from '@phosphor-icons/vue';

const props = defineProps({
  vaccinations: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="calendar-card">
    <div class="card-header">
      <div class="title-group">
        <PhCalendarBlank :size="20" weight="bold" color="#C87533" />
        <h3 class="card-title">Calendrier de vaccination</h3>
      </div>
    </div>
    
    <div class="vaccines-list">
      <div v-for="item in vaccinations" :key="item.id" class="vaccine-item">
        
        <div class="vaccine-info-group">
          <img :src="item.avatar" :alt="item.name" class="avatar" />
          <div class="vaccine-details">
            <span class="animal-name">{{ item.name }}</span>
            <span class="vaccine-name">{{ item.vaccine }}</span>
          </div>
        </div>

        <div class="date-badge" :class="{ 'is-urgent': item.isUrgent }">
          {{ item.date }}
        </div>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  height: 100%; /* Fill the grid area */
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

.vaccines-list {
  display: flex;
  flex-direction: column;
}

.vaccine-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-light);
}

.vaccine-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.vaccine-info-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border-light);
}

.vaccine-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.animal-name {
  font-weight: 700;
  color: var(--text-dark);
  font-size: 14px;
}

.vaccine-name {
  font-size: 12px;
  color: var(--text-muted);
}

.date-badge {
  padding: 4px 10px;
  background-color: #ECFDF5;
  color: #059669;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
}

.date-badge.is-urgent {
  background-color: #FEE2E2;
  color: #EF4444;
}
</style>
