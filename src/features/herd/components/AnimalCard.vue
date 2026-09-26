<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { PhTrendUp, PhTrendDown, PhWarningCircle, PhDotsThree, PhPencilSimple, PhTrash } from '@phosphor-icons/vue';

const props = defineProps({
  animal: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const emit = defineEmits(['edit', 'delete']);

const navigateToDetail = () => {
  router.push(`/dashboard/troupeau/${props.animal.id}`);
};

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleEdit = () => {
  closeMenu();
  emit('edit', props.animal);
};

const handleDelete = () => {
  closeMenu();
  emit('delete', props.animal);
};

const isActif = computed(() => props.animal.status === 'ACTIF');
const isVendu = computed(() => props.animal.status === 'VENDU');
const isDecede = computed(() => props.animal.status === 'DECEDE');
const isTarie = computed(() => props.animal.status === 'TARIE');

const isAlertSante = computed(() => props.animal.isAlertSante || false);
const isAlertProd = computed(() => props.animal.isAlertProd || false);

const cardClass = computed(() => {
  return {
    'animal-card': true,
    'animal-card--decede': isDecede.value,
  };
});

const badgeLabel = computed(() => {
  if (isVendu.value) return 'VENDU';
  if (isDecede.value) return 'DÉCÉDÉ';
  return 'ACTIF';
});

const badgeClass = computed(() => {
  if (isAlertSante.value) return 'badge--alert-sante';
  if (isAlertProd.value) return 'badge--alert-prod';
  if (isTarie.value) return 'badge--tarie';
  return 'badge--lactation';
});

const trendColor = computed(() => {
  return props.animal.trend === 'up' ? '#16A34A' : '#EF4444';
});
</script>

<template>
  <div :class="cardClass" class="hover-lift" @click="navigateToDetail" style="cursor: pointer;">
    <!-- Alert Icon Badge (Top Right) -->
    <div v-if="isAlertSante || isAlertProd" class="alert-icon-badge" :class="isAlertSante ? 'bg-red' : 'bg-yellow'">
      !
    </div>

    <div class="card-header">
      <div class="header-left">
        <img :src="animal.avatar" :alt="animal.name" class="animal-avatar" />
        <div class="animal-titles">
          <h3 class="animal-name">{{ animal.name }}</h3>
          <span class="animal-race">{{ animal.race }}</span>
        </div>
      </div>
      <div class="header-right">
        <span class="status-badge" :class="badgeClass">{{ badgeLabel }}</span>
        
        <div class="action-menu-container">
          <button class="action-btn" @click.stop="toggleMenu" @blur="setTimeout(closeMenu, 150)">
            <PhDotsThree :size="20" weight="bold" />
          </button>
          
          <div v-if="isMenuOpen" class="action-dropdown">
            <button class="dropdown-item" @click.stop="handleEdit">
              <PhPencilSimple :size="16" />
              Modifier
            </button>
            <button class="dropdown-item text-red" @click.stop="handleDelete">
              <PhTrash :size="16" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body">
      <div class="stat-row">
        <div class="stat-item">
          <span class="stat-label">{{ animal.stat1Label }}</span>
          <div class="stat-value-group">
            <span class="stat-value" :class="isAlertSante || isAlertProd ? 'text-red' : ''">{{ animal.stat1Value }}</span>
            <PhTrendUp v-if="animal.trend === 'up'" :size="14" weight="bold" :color="trendColor" />
            <PhTrendDown v-if="animal.trend === 'down'" :size="14" weight="bold" :color="trendColor" />
          </div>
        </div>
        <div class="stat-item text-right">
          <span class="stat-label">Âge</span>
          <span class="stat-value-sm">{{ animal.age }}</span>
        </div>
      </div>

      <div class="card-footer" :class="{'has-alert': isAlertSante || isAlertProd}">
        <span v-if="!isAlertSante && !isAlertProd" class="footer-text">{{ animal.lastEvent }}</span>
        <span v-else class="footer-text alert-text">{{ animal.alertMessage }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animal-card {
  position: relative;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: all var(--transition-base);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: var(--border-input);
}

.animal-card--alert-sante {
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.02);
}

.animal-card--alert-prod {
  border-color: rgba(245, 158, 11, 0.4);
  background: rgba(245, 158, 11, 0.02);
}

.alert-icon-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 2px solid white;
}
.bg-red { background-color: #EF4444; }
.bg-yellow { background-color: #D97706; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.animal-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background-color: var(--bg-page);
}

.animal-titles {
  display: flex;
  flex-direction: column;
}

.animal-name {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 2px;
}

.animal-race {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.status-badge {
  padding: 4px 8px;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge--lactation {
  background: rgba(22, 163, 74, 0.1);
  color: #16A34A;
}

.badge--tarie {
  background: var(--primary-light);
  color: var(--primary);
}

.badge--alert-sante {
  background: rgba(239, 68, 68, 0.1);
  color: #DC2626;
}

.badge--alert-prod {
  background: rgba(245, 158, 11, 0.15);
  color: #B45309;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.text-right {
  text-align: right;
  align-items: flex-end;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.stat-value-group {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-dark);
}

.stat-value.text-red {
  color: #EF4444;
}

.stat-value-sm {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-dark);
  margin-top: 2px;
}

.card-footer {
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.card-footer.has-alert {
  border-top-color: transparent;
  padding-top: 0;
}

.footer-text {
  font-size: 11px;
  color: var(--text-placeholder);
}

.alert-text {
  color: #DC2626;
  font-weight: 500;
}
.animal-card--alert-prod .alert-text {
  color: #D97706;
}

.action-menu-container {
  position: relative;
}

.action-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.action-btn:hover, .action-btn:focus {
  background: var(--bg-page);
  color: var(--text-dark);
}

.action-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 4px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-dark);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.dropdown-item:hover {
  background: var(--bg-page);
}

.dropdown-item.text-red {
  color: #DC2626;
}

.dropdown-item.text-red:hover {
  background: rgba(239, 68, 68, 0.05);
}
</style>
