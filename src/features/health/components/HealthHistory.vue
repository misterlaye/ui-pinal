<script setup>
import { PhFileText } from '@phosphor-icons/vue';

const props = defineProps({
  history: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="history-card">
    <div class="card-header">
      <div class="title-group">
        <PhFileText :size="20" weight="bold" color="#C87533" />
        <h3 class="card-title">Historique des traitements</h3>
      </div>
    </div>
    
    <div class="table-container">
      <table class="pn-table">
        <thead>
          <tr>
            <th>Animal</th>
            <th>Date</th>
            <th>Traitement</th>
            <th>Motif</th>
            <th>Vétérinaire</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in history" :key="item.id">
            <!-- Animal Info -->
            <td>
              <div class="animal-info">
                <img :src="item.avatar" :alt="item.name" class="avatar" />
                <span class="animal-name">{{ item.name }}</span>
              </div>
            </td>
            
            <td class="text-muted">{{ item.date }}</td>
            <td class="font-medium">{{ item.traitement }}</td>
            <td class="text-muted">{{ item.motif }}</td>
            <td class="text-muted">{{ item.veto }}</td>
            
            <!-- Status Badge -->
            <td>
              <span class="status-badge" :class="item.status === 'TERMINÉ' ? 'badge-done' : 'badge-progress'">
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
.history-card {
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
  font-size: 14px;
}

/* Typography */
.text-muted { color: var(--text-muted); }
.font-medium { font-weight: 500; color: var(--text-dark); }

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

.badge-done {
  background-color: #ECFDF5;
  color: #059669;
}

.badge-progress {
  background-color: #FFFBEB;
  color: #D97706;
}
</style>
