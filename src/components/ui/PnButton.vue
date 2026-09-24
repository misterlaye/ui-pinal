<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  full: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
});

defineEmits(['click']);
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="pn-btn"
    :class="[
      `pn-btn--${variant}`,
      `pn-btn--${size}`,
      { 'pn-btn--full': full, 'pn-btn--loading': loading },
    ]"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="pn-btn-spinner" />
    <span v-if="!loading" class="pn-btn-content">
      <slot />
    </span>
    <span v-else class="pn-btn-loading-text">
      <slot name="loading">Chargement...</slot>
    </span>
  </button>
</template>

<style scoped>
.pn-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-family);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
  white-space: nowrap;
  user-select: none;
  text-decoration: none;
}

.pn-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.pn-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.pn-btn--sm {
  height: 36px;
  padding: 0 16px;
  font-size: var(--font-size-sm);
}

.pn-btn--md {
  height: 48px;
  padding: 0 32px;
  font-size: var(--font-size-base);
}

.pn-btn--lg {
  height: 52px;
  padding: 0 40px;
  font-size: var(--font-size-lg);
}

/* Variants */
.pn-btn--primary {
  background: var(--primary);
  color: var(--text-white);
}

.pn-btn--primary:hover:not(:disabled) {
  background: var(--primary-hover);
  box-shadow: var(--shadow-md);
}

.pn-btn--secondary {
  background: var(--bg-white);
  color: var(--text-dark);
  border: 1.5px solid var(--border-input);
}

.pn-btn--secondary:hover:not(:disabled) {
  background: var(--bg-page);
  border-color: var(--text-muted);
}

.pn-btn--ghost {
  background: transparent;
  color: var(--primary);
}

.pn-btn--ghost:hover:not(:disabled) {
  background: var(--primary-light);
}

/* Full width */
.pn-btn--full {
  width: 100%;
}

/* Content */
.pn-btn-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Spinner */
.pn-btn-spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid transparent;
  border-top-color: currentColor;
  border-right-color: currentColor;
  border-radius: 50%;
  animation: btn-spin 0.6s linear infinite;
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}

.pn-btn-loading-text {
  font-weight: 500;
}
</style>
