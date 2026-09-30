<script setup>
import { computed } from 'vue';
import { PhSyringe, PhStethoscope, PhBaby, PhWarningCircle } from '@phosphor-icons/vue';

const props = defineProps({
  animals: {
    type: Array,
    required: true,
  },
  cycles: {
    type: Array,
    required: true,
  }
});

const emit = defineEmits(['action']);

// Combine animals and their latest cycle (if any)
const herdStatus = computed(() => {
  return props.animals.map(animal => {
    // Find the active cycle for this animal, or the most recent one
    const animalCycles = props.cycles.filter(c => c.animalId === animal.id);
    const activeCycle = animalCycles.find(c => ['EN_ATTENTE_CONSTAT', 'GESTANTE'].includes(c.statut));
    const lastCycle = animalCycles.sort((a, b) => new Date(b.dateInsemination) - new Date(a.dateInsemination))[0];
    
    return {
      animal,
      cycle: activeCycle || lastCycle || null
    };
  });
});

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'EN_ATTENTE_CONSTAT': return 'badge-attente';
    case 'GESTANTE': return 'badge-gestante';
    case 'TERMINEE_VELAGE': return 'badge-succes';
    case 'AVORTEE': return 'badge-avortement';
    case 'VIDE': return 'badge-default';
    default: return 'badge-default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'EN_ATTENTE_CONSTAT': return 'En Attente Constat';
    case 'GESTANTE': return 'Gestante';
    case 'TERMINEE_VELAGE': return 'Vêlage réussi';
    case 'AVORTEE': return 'Avortement';
    case 'VIDE': return 'Vide';
    default: return 'Inconnu';
  }
};
</script>

<template>
  <div class="cycles-list-container glass-panel">
    <div class="list-header">
      <h2>Statut Reproductif du Troupeau</h2>
    </div>

    <div class="table-responsive">
      <table class="pn-table">
        <thead>
          <tr>
            <th>Identifiant</th>
            <th>Nom</th>
            <th>Statut Actuel</th>
            <th>Dernier Événement</th>
            <th>Actions Rapides</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in herdStatus" :key="item.animal.id" class="table-row">
            <td>
              <span class="animal-id">#{{ item.animal.identifiant }}</span>
            </td>
            <td>
              <span class="animal-name">{{ item.animal.nom }}</span>
            </td>
            <td>
              <span v-if="item.cycle" :class="['status-badge', getStatusBadgeClass(item.cycle.statut)]">
                {{ getStatusLabel(item.cycle.statut) }}
              </span>
              <span v-else class="status-badge badge-default">Vide</span>
            </td>
            <td>
              <span class="date-text" v-if="item.cycle && item.cycle.dateInsemination">
                {{ new Date(item.cycle.dateInsemination).toLocaleDateString() }}
              </span>
              <span v-else class="text-muted">-</span>
            </td>
            <td>
              <div class="action-buttons">
                <!-- Action: Insémination -->
                <button 
                  v-if="!item.cycle || ['TERMINEE_VELAGE', 'AVORTEE', 'VIDE'].includes(item.cycle.statut)"
                  class="action-btn btn-insem" 
                  title="Déclarer Insémination"
                  @click="emit('action', { type: 'INSEMINATION', animal: item.animal })">
                  <PhSyringe :size="18" />
                </button>

                <!-- Action: Constat -->
                <button 
                  v-if="item.cycle && item.cycle.statut === 'EN_ATTENTE_CONSTAT'"
                  class="action-btn btn-constat" 
                  title="Enregistrer Constat"
                  @click="emit('action', { type: 'CONSTAT', animal: item.animal, cycle: item.cycle })">
                  <PhStethoscope :size="18" />
                </button>

                <!-- Action: Vêlage -->
                <button 
                  v-if="item.cycle && item.cycle.statut === 'GESTANTE'"
                  class="action-btn btn-velage" 
                  title="Déclarer Vêlage"
                  @click="emit('action', { type: 'VELAGE', animal: item.animal, cycle: item.cycle })">
                  <PhBaby :size="18" />
                </button>

                <!-- Action: Avortement -->
                <button 
                  v-if="item.cycle && ['GESTANTE', 'EN_ATTENTE_CONSTAT'].includes(item.cycle.statut)"
                  class="action-btn btn-avortement" 
                  title="Déclarer Avortement"
                  @click="emit('action', { type: 'AVORTEMENT', animal: item.animal, cycle: item.cycle })">
                  <PhWarningCircle :size="18" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="herdStatus.length === 0">
            <td colspan="5" class="empty-state">
              Aucune femelle active dans le troupeau.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.list-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
  background: rgba(255, 255, 255, 0.5);
}

.list-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-dark);
}

.table-responsive {
  overflow-x: auto;
}

.pn-table {
  width: 100%;
  border-collapse: collapse;
}

.pn-table th {
  text-align: left;
  padding: 16px 24px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-light);
  background: #f9fafb;
}

.pn-table td {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-light);
  vertical-align: middle;
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: rgba(249, 250, 251, 0.8);
}

.animal-id {
  font-family: monospace;
  font-weight: 600;
  color: var(--text-muted);
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
}

.animal-name {
  font-weight: 600;
  color: var(--text-dark);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.badge-attente { background: #E0F2FE; color: #0284C7; }
.badge-inseminee { background: #FEF3C7; color: #D97706; }
.badge-gestante { background: #D1FAE5; color: #059669; }
.badge-succes { background: #DBEAFE; color: #1D4ED8; }
.badge-avortement { background: #FEE2E2; color: #DC2626; }
.badge-default { background: #F3F4F6; color: #4B5563; }

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  background: #F1F5F9;
  color: #64748B;
}

.action-btn:hover {
  transform: scale(1.1);
}

.btn-insem:hover { background: #E0F2FE; color: #0284C7; }
.btn-constat:hover { background: #FEF3C7; color: #D97706; }
.btn-velage:hover { background: #D1FAE5; color: #059669; }
.btn-avortement:hover { background: #FEE2E2; color: #DC2626; }

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-style: italic;
}
</style>
