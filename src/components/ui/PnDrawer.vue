<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue';
import { PhX } from '@phosphor-icons/vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '450px',
  },
});

const emit = defineEmits(['update:modelValue', 'close']);

const closeDrawer = () => {
  emit('update:modelValue', false);
  emit('close');
};

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    closeDrawer();
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
);

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <transition name="drawer-fade">
      <div v-if="modelValue" class="drawer-backdrop" @click="closeDrawer"></div>
    </transition>

    <transition name="drawer-slide">
      <div v-if="modelValue" class="drawer-panel" :style="{ width: width }">
        <div class="drawer-header">
          <div>
            <h2 class="drawer-title">{{ title }}</h2>
            <p v-if="subtitle" class="drawer-subtitle">{{ subtitle }}</p>
          </div>
          <button class="drawer-close" @click="closeDrawer" aria-label="Fermer">
            <PhX :size="20" weight="bold" />
          </button>
        </div>

        <div class="drawer-content">
          <slot></slot>
        </div>

        <div class="drawer-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 1000;
}

.drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-white);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  max-width: 100vw;
}

.drawer-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.drawer-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.drawer-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.drawer-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.drawer-close:hover {
  background: var(--bg-page);
  color: var(--text-dark);
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.drawer-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-page);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Animations */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>
