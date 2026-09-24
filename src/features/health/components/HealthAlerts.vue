<script setup>
import { ref, computed } from 'vue';
import { PhWarning, PhEye, PhCheck } from '@phosphor-icons/vue';

const props = defineProps({
  alerts: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['view-animal', 'resolve-alert']);

const localAlerts = ref([...props.alerts]);
const resolvedIds = ref(new Set());

const activeAlerts = computed(() => {
  return localAlerts.value.filter(a => !resolvedIds.value.has(a.id));
});

const handleResolve = (id) => {
  resolvedIds.value.add(id);
  emit('resolve-alert', id);
};

const handleView = (animalId) => {
  emit('view-animal', animalId);
};
</script>

<template>
  <div class="alerts-section">
    
    <div class="section-header">
      <div class="title-group">
        <PhWarning :size="20" weight="fill" color="#EF4444" />
        <h3 class="section-title">Alertes santé actives</h3>
      </div>
      <div class="alerts-badge">
        {{ activeAlerts.length }} ACTIVE{{ activeAlerts.length > 1 ? 'S' : '' }}
      </div>
    </div>

    <div v-if="activeAlerts.length === 0" class="empty-state">
      <PhCheck :size="32" weight="bold" color="#10B981" />
      <p>Aucune alerte sanitaire en cours. Le troupeau se porte bien !</p>
    </div>

    <transition-group name="list" tag="div" class="alerts-list">
      <div v-for="alert in activeAlerts" :key="alert.id" class="alert-card">
        
        <!-- Left: Avatar -->
        <div class="alert-avatar-col">
          <img :src="alert.avatar" :alt="alert.name" class="alert-avatar" />
        </div>

        <!-- Middle: Content -->
        <div class="alert-content-col">
          <div class="alert-header">
            <span class="animal-name">{{ alert.name }}</span>
            <span class="risk-badge" :class="alert.level === 'RISQUE ÉLEVÉ' ? 'risk-high' : 'risk-medium'">
              {{ alert.level }}
            </span>
          </div>
          <p class="alert-description">{{ alert.description }}</p>
          <span class="alert-time">{{ alert.time }}</span>
        </div>

        <!-- Right: Actions -->
        <div class="alert-actions-col">
          <button class="btn-action btn-view" @click="handleView(alert.animalId)">
            <PhEye :size="16" weight="bold" />
            Voir l'animal
          </button>
          <button class="btn-action btn-resolve" @click="handleResolve(alert.id)">
            <PhCheck :size="16" weight="bold" />
            Marquer comme traité
          </button>
        </div>
        
      </div>
    </transition-group>

  </div>
</template>

<style scoped>
.alerts-section {
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

.alerts-badge {
  background-color: #FEE2E2;
  color: #EF4444;
  font-size: 10px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 100px;
  letter-spacing: 0.05em;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  background: var(--bg-white);
  border: 1px dashed var(--border-light);
  border-radius: var(--radius-lg);
  color: var(--text-muted);
  font-weight: 500;
}

/* List */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alert-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-left: 4px solid #EF4444;
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  gap: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  transition: all 0.3s ease;
}

/* Specific left border for medium risk */
.alert-card:has(.risk-medium) {
  border-left-color: #F59E0B;
}

.alert-avatar-col {
  flex-shrink: 0;
}

.alert-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-light);
}

.alert-content-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.animal-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-dark);
}

.risk-badge {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.risk-high {
  background-color: #FEE2E2;
  color: #EF4444;
}

.risk-medium {
  background-color: #FEF3C7;
  color: #D97706;
}

.alert-description {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-body);
  margin: 0;
}

.alert-time {
  font-size: 11px;
  color: var(--text-placeholder);
}

/* Actions */
.alert-actions-col {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  color: var(--text-dark);
}

.btn-view:hover {
  background: var(--bg-page);
  border-color: var(--text-muted);
}

.btn-resolve {
  background: var(--text-dark);
  border: 1px solid var(--text-dark);
  color: var(--text-white);
}

.btn-resolve:hover {
  background: #374151;
  border-color: #374151;
  transform: translateY(-1px);
}

/* Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Responsive */
@media (max-width: 768px) {
  .alert-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .alert-actions-col {
    width: 100%;
    justify-content: flex-end;
    margin-top: 8px;
  }
}
</style>
