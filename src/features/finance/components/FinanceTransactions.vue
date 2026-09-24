<script setup>
import { PhListDashes } from '@phosphor-icons/vue';

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  }
});

const formatCurrency = (value) => {
  const prefix = value > 0 ? '+' : '';
  return prefix + new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value);
};
</script>

<template>
  <div class="transactions-card">
    <div class="card-header">
      <div class="title-group">
        <PhListDashes :size="20" weight="bold" color="#C87533" />
        <h3 class="card-title">Transactions récentes</h3>
      </div>
      <button class="btn-link">Voir tout &rarr;</button>
    </div>
    
    <div class="table-container">
      <table class="pn-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Catégorie</th>
            <th>Type</th>
            <th class="text-right">Montant Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in transactions" :key="item.id">
            <td class="text-muted">{{ item.date }}</td>
            <td class="font-bold">{{ item.desc }}</td>
            <td class="text-muted">{{ item.category }}</td>
            <td>
              <span class="type-badge" :class="item.type === 'REVENU' ? 'badge-revenu' : 'badge-charge'">
                {{ item.type }}
              </span>
            </td>
            <td class="text-right font-bold" :class="item.amount > 0 ? 'text-green' : 'text-red'">
              {{ formatCurrency(item.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.transactions-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.btn-link {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
}

.btn-link:hover {
  color: var(--text-dark);
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

.pn-table th.text-right {
  text-align: right;
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

.text-right { text-align: right; }
.text-muted { color: var(--text-muted); }
.font-bold { font-weight: 600; color: var(--text-dark); }
.text-green { color: #10B981; }
.text-red { color: #EF4444; }

/* Status Badge */
.type-badge {
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

.badge-revenu {
  background-color: #ECFDF5;
  color: #059669;
}

.badge-charge {
  background-color: #FEE2E2;
  color: #EF4444;
}
</style>
