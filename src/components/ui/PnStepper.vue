<script setup>
defineProps({
  currentStep: { type: Number, required: true },
  totalSteps: { type: Number, default: 6 },
});
</script>

<template>
  <div class="pn-stepper" role="progressbar" :aria-valuenow="currentStep" :aria-valuemax="totalSteps">
    <div
      v-for="step in totalSteps"
      :key="step"
      class="pn-stepper-dot"
      :class="{
        active: step === currentStep,
        completed: step < currentStep,
      }"
    >
      <span class="pn-stepper-dot-inner" />
    </div>
  </div>
</template>

<style scoped>
.pn-stepper {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.pn-stepper-dot {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pn-stepper-dot-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-input);
  transition: all var(--transition-base);
}

.pn-stepper-dot.active .pn-stepper-dot-inner {
  width: 12px;
  height: 12px;
  background: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-light);
}

.pn-stepper-dot.completed .pn-stepper-dot-inner {
  background: var(--primary);
}
</style>
