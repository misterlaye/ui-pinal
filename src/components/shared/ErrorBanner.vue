<script setup>
import { PhWarningCircle, PhX } from '@phosphor-icons/vue';
import PnButton from '../ui/PnButton.vue';

defineProps({
  modelValue: { type: Boolean, default: false },
  message: { type: String, required: true },
  retryable: { type: Boolean, default: true },
});

defineEmits(['update:modelValue', 'retry']);
</script>

<template>
  <div class="error-banner" v-if="modelValue">
    <div class="error-content">
      <PhWarningCircle :size="20" weight="fill" color="var(--error)" />
      <span class="error-message">{{ message }}</span>
    </div>
    <div class="error-actions">
      <PnButton variant="secondary" size="sm" @click="$emit('retry')" v-if="retryable">
        Réessayer
      </PnButton>
      <button class="error-close" @click="$emit('update:modelValue', false)" aria-label="Fermer">
        <PhX :size="16" weight="bold" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-banner {
  background: var(--error-light);
  border: 1px solid var(--border-error);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.error-message {
  font-size: var(--font-size-sm);
  color: var(--text-dark);
  font-weight: 500;
}

.error-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-close:hover {
  background: rgba(0,0,0,0.05);
  color: var(--text-dark);
}

@media (max-width: 640px) {
  .error-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .error-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
