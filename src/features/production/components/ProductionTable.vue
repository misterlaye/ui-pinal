<script setup>
import { PhTrendUp, PhTrendDown, PhList } from '@phosphor-icons/vue';

const props = defineProps({
  animals: {
    type: Array,
    required: true
  }
});

const formatNumber = (num) => {
  return Number(num).toFixed(1);
};
</script>

<template>
  <div class="table-card">
    <div class="card-header">
      <div class="title-group">
        <PhList :size="20" weight="bold" color="#C87533" />
        <h3 class="card-title">Production par animal</h3>
      </div>
    </div>
    
    <div class="table-container">
      <table class="pn-table">
        <thead>
          <tr>
            <th>Animal</th>
            <th>Race</th>
            <th class="text-right">Matin (L)</th>
            <th class="text-right">Soir (L)</th>
            <th class="text-right">Total Jour (L)</th>
            <th>Tendance 7J</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="animal in animals" :key="animal.id">
            <!-- Animal Info -->
            <td>
              <div class="animal-info">
                <img :src="animal.avatar" :alt="animal.name" class="avatar" />
                <span class="animal-name">{{ animal.name }}</span>
              </div>
            </td>
            
            <!-- Race -->
            <td class="text-muted">{{ animal.race }}</td>
            
            <!-- Yields -->
            <td class="text-right font-medium">{{ formatNumber(animal.matin) }}</td>
            <td class="text-right font-medium">{{ formatNumber(animal.soir) }}</td>
            <td class="text-right font-bold">{{ formatNumber(animal.total) }}</td>
            
            <!-- Trend -->
            <td>
              <div class="trend-cell" :class="animal.trend >= 0 ? 'text-green' : 'text-red'">
                <PhTrendUp v-if="animal.trend >= 0" :size="14" weight="bold" />
                <PhTrendDown v-else :size="14" weight="bold" />
                <span>{{ animal.trend > 0 ? '+' : '' }}{{ formatNumber(animal.trend) }}%</span>
              </div>
            </td>
            
            <!-- Status Badge -->
            <td>
              <span class="status-badge" :class="animal.status === 'NORMAL' ? 'badge-normal' : 'badge-alert'">
                {{ animal.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
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

.table-container {
  overflow-x: auto;
}

.pn-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.pn-table th {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pn-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
  font-size: 14px;
  vertical-align: middle;
}

.pn-table tr:last-child td {
  border-bottom: none;
}

/* Animal Cell */
.animal-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border-light);
}

.animal-name {
  font-weight: 600;
  color: var(--text-dark);
}

/* Typography & Utils */
.text-muted { color: var(--text-muted); }
.text-right { text-align: right; }
.font-medium { font-weight: 500; color: var(--text-dark); }
.font-bold { font-weight: 700; color: var(--text-dark); }

/* Trend */
.trend-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}
.text-green { color: #10B981; }
.text-red { color: #EF4444; }

/* Status Badge */
.status-badge {
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  justify-content: center;
  min-width: 70px;
}

.badge-normal {
  background-color: #ECFDF5;
  color: #059669;
}

.badge-alert {
  background-color: #FFFBEB;
  color: #D97706;
}
</style>
