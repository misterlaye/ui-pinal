<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  id: { type: String, default: 'checkbox' },
  error: { type: String, default: '' },
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="pn-checkbox-group">
    <label :for="id" class="pn-checkbox-label">
      <input
        :id="id"
        type="checkbox"
        :checked="modelValue"
        class="pn-checkbox-input"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span class="pn-checkbox-custom" :class="{ checked: modelValue }" />
      <span class="pn-checkbox-text">
        <slot />
      </span>
    </label>
    <p v-if="error" class="pn-checkbox-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.pn-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pn-checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.pn-checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.pn-checkbox-custom {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: 1.5px solid var(--border-input);
  border-radius: 4px;
  background: var(--bg-white);
  transition: all var(--transition-fast);
  position: relative;
  margin-top: 2px;
}

.pn-checkbox-custom.checked {
  background: var(--primary);
  border-color: var(--primary);
}

.pn-checkbox-custom.checked::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.pn-checkbox-input:focus-visible + .pn-checkbox-custom {
  box-shadow: var(--shadow-input-focus);
  border-color: var(--primary);
}

.pn-checkbox-text {
  font-size: var(--font-size-sm);
  color: var(--text-body);
  line-height: 1.5;
}

.pn-checkbox-text :deep(a) {
  color: var(--primary);
  text-decoration: underline;
}

.pn-checkbox-error {
  font-size: var(--font-size-xs);
  color: var(--error);
  margin: 0 0 0 30px;
}
</style>
