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
        <h3 class="card-title">Consommation Journalière des Aliments</h3>
      </div>
    </div>
    
    <div class="table-container" v-if="stocks && stocks.length">
      <table class="pn-table">
        <thead>
          <tr>
            <th>Aliment</th>
            <th>Consommation Journalière Troupeau</th>
            <th>Prix Unitaire en Vigueur</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stocks" :key="item.id">
            <!-- Aliment -->
            <td>
              <div class="aliment-info">
                <div class="aliment-icon">
                  <PhLeaf :size="16" weight="fill" color="#C87533" />
                </div>
                <span class="aliment-name">{{ item.name }}</span>
              </div>
            </td>
            
            <!-- Consommation -->
            <td class="font-bold">
              {{ item.consumptionRate || item.dailyCons || 0 }}
              <span class="unit">{{ item.unit || 'kg' }}/jour</span>
            </td>
            
            <!-- Prix Unitaire / Statut -->
            <td class="price-cell">
              {{ item.status }}
            </td>
            
            <!-- Status Badge -->
            <td>
              <span class="status-badge" 
                    :class="(item.consumptionRate > 0) ? 'badge-ok' : 'badge-idle'">
                {{ (item.consumptionRate > 0) ? 'En distribution' : 'Non distribué' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-stock">
      Aucun aliment référencé au catalogue.
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
  margin-bottom: 20px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.table-container {
  overflow-x: auto;
}

.pn-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.pn-table th {
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pn-table td {
  padding: 16px;
  font-size: 13px;
  color: var(--text-dark);
  border-bottom: 1px solid var(--border-light);
}

.pn-table tbody tr:last-child td {
  border-bottom: none;
}

.aliment-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.aliment-icon {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: #FDF9F5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.aliment-name {
  font-weight: 600;
}

.font-bold {
  font-weight: 600;
}

.unit {
  font-weight: 400;
  color: var(--text-muted);
  font-size: 12px;
}

.price-cell {
  font-weight: 500;
  color: #C87533;
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
}

.badge-ok {
  background: #ECFDF5;
  color: #10B981;
}

.badge-idle {
  background: #F3F4F6;
  color: #9CA3AF;
}

.empty-stock {
  text-align: center;
  padding: 30px;
  color: var(--text-muted);
  font-size: 13px;
}
</style>
