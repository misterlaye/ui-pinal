<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  length: { type: Number, default: 6 },
  modelValue: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'complete']);

const digits = ref(Array(props.length).fill(''));
const inputRefs = ref([]);

function setRef(el, i) {
  if (el) inputRefs.value[i] = el;
}

function handleInput(index, event) {
  const value = event.target.value.replace(/\D/g, '');

  if (value.length > 1) {
    // Paste or multi-char input
    const chars = value.split('').slice(0, props.length - index);
    chars.forEach((char, i) => {
      if (index + i < props.length) {
        digits.value[index + i] = char;
      }
    });
    const nextIndex = Math.min(index + chars.length, props.length - 1);
    nextTick(() => inputRefs.value[nextIndex]?.focus());
  } else {
    digits.value[index] = value;
    if (value && index < props.length - 1) {
      nextTick(() => inputRefs.value[index + 1]?.focus());
    }
  }

  emitValue();
}

function handleKeydown(index, event) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    digits.value[index - 1] = '';
    nextTick(() => inputRefs.value[index - 1]?.focus());
    emitValue();
  }
  if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus();
  }
  if (event.key === 'ArrowRight' && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus();
  }
}

function handlePaste(event) {
  event.preventDefault();
  const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, props.length);
  pasted.split('').forEach((char, i) => {
    digits.value[i] = char;
  });
  const focusIndex = Math.min(pasted.length, props.length - 1);
  nextTick(() => inputRefs.value[focusIndex]?.focus());
  emitValue();
}

function emitValue() {
  const code = digits.value.join('');
  emit('update:modelValue', code);
  if (code.length === props.length) {
    emit('complete', code);
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val !== digits.value.join('')) {
      const chars = (val || '').split('');
      for (let i = 0; i < props.length; i++) {
        digits.value[i] = chars[i] || '';
      }
    }
  }
);
</script>

<template>
  <div class="pn-otp" :class="{ 'has-error': !!error }">
    <div class="pn-otp-inputs">
      <input
        v-for="(_, i) in length"
        :key="i"
        :ref="(el) => setRef(el, i)"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        maxlength="6"
        :value="digits[i]"
        :disabled="disabled"
        class="pn-otp-digit"
        :class="{ filled: !!digits[i], 'has-error': !!error }"
        @input="handleInput(i, $event)"
        @keydown="handleKeydown(i, $event)"
        @paste="handlePaste"
        @focus="$event.target.select()"
      />
    </div>
    <p v-if="error" class="pn-otp-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.pn-otp-inputs {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.pn-otp-digit {
  width: 52px;
  height: 56px;
  text-align: center;
  font-family: var(--font-family);
  font-size: 24px;
  font-weight: 600;
  color: var(--text-dark);
  background: var(--bg-white);
  border: 1.5px solid var(--border-input);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
  caret-color: var(--primary);
}

.pn-otp-digit:focus {
  border-color: var(--primary);
  box-shadow: var(--shadow-input-focus);
}

.pn-otp-digit.filled {
  border-color: var(--primary);
  background: var(--primary-light);
}

.pn-otp-digit.has-error {
  border-color: var(--border-error);
}

.pn-otp-digit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pn-otp-error {
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--error);
  margin: 8px 0 0;
}

@media (max-width: 480px) {
  .pn-otp-digit {
    width: 44px;
    height: 48px;
    font-size: 20px;
  }

  .pn-otp-inputs {
    gap: 6px;
  }
}
</style>
