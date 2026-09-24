<script setup>
import { PhArchiveBox, PhLeaf } from '@phosphor-icons/vue';

const props = defineProps({
  stocks: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="stock-card">
    <div class="card-header">
      <div class="title-group">
        <PhArchiveBox :size="20" weight="fill" color="#C87533" />
        <h3 class="card-title">Stock des aliments</h3>
      </div>
    </div>
    
    <div class="table-container">
      <table class="pn-table">
        <thead>
          <tr>
            <th>Aliment</th>
            <th>Stock Actuel</th>
            <th>Consommation Journalière</th>
            <th>Jours Restants</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stocks" :key="item.id">
            <!-- Aliment -->
            <td>
              <div class="aliment-info">
                <div class="aliment-icon" :style="{ color: item.iconColor }">
                  <PhLeaf :size="16" weight="fill" />
                </div>
                <span class="aliment-name">{{ item.name }}</span>
              </div>
            </td>
            
            <!-- Stock Actuel -->
            <td class="font-bold">{{ item.stock }} <span class="unit">{{ item.unit }}</span></td>
            
            <!-- Consommation -->
            <td class="text-muted">{{ item.dailyCons }} {{ item.unit }}/jour</td>
            
            <!-- Jours Restants -->
            <td class="font-medium">{{ item.daysLeft }} jours</td>
            
            <!-- Status Badge -->
            <td>
              <span class="status-badge" 
                    :class="{
                      'badge-ok': item.status === 'OK',
                      'badge-warning': item.status === 'STOCK BAS',
                      'badge-critical': item.status === 'CRITIQUE'
                    }">
                {{ item.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.stock-card {
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
  min-width: 600px;
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
  font-size: 13px;
  vertical-align: middle;
}

.pn-table tr:last-child td {
  border-bottom: none;
}

/* Aliment Cell */
.aliment-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.aliment-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-page);
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.aliment-name {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 14px;
}

/* Typography */
.text-muted { color: var(--text-muted); }
.font-medium { font-weight: 500; color: var(--text-dark); }
.font-bold { font-weight: 700; color: var(--text-dark); }
.unit { color: var(--text-muted); font-weight: 400; font-size: 12px; }

/* Status Badge */
.status-badge {
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  justify-content: center;
  min-width: 70px;
}

.badge-ok {
  background-color: #ECFDF5;
  color: #059669;
}

.badge-warning {
  background-color: #FEF3C7;
  color: #D97706;
}

.badge-critical {
  background-color: #FEE2E2;
  color: #EF4444;
}
</style>
