<script setup>
defineProps({
  label: { type: String, default: '' },
  modelValue: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  id: { type: String, default: '' },
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="pn-input-group" :class="{ 'has-error': !!error }">
    <label
      v-if="label"
      :for="id"
      class="pn-input-label"
    >
      {{ label }}
      <span v-if="required" class="pn-input-required">*</span>
    </label>

    <div class="pn-input-wrapper">
      <slot name="prefix" />
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="pn-input"
        :class="{ 'has-error': !!error }"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <slot name="suffix" />
    </div>

    <p v-if="error" class="pn-input-error">
      {{ error }}
    </p>
    <p v-else-if="hint" class="pn-input-hint">
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.pn-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pn-input-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-dark);
}

.pn-input-required {
  color: var(--error);
  margin-left: 2px;
}

.pn-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.pn-input {
  height: 48px;
  width: 100%;
  padding: 0 16px;
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--text-dark);
  background: var(--bg-white);
  border: 1.5px solid var(--border-input);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.pn-input::placeholder {
  color: var(--text-placeholder);
}

.pn-input:focus {
  border-color: var(--border-focus);
  box-shadow: var(--shadow-input-focus);
}

.pn-input.has-error {
  border-color: var(--border-error);
}

.pn-input.has-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
}

.pn-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--bg-page);
}

.pn-input-error {
  font-size: var(--font-size-xs);
  color: var(--error);
  margin: 0;
}

.pn-input-hint {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin: 0;
}
</style>
