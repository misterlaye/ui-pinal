<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '12px' },
});
</script>

<template>
  <div class="skeleton-text" :style="{ width: width, height: height }" />
</template>

<style scoped>
.skeleton-text {
  background: linear-gradient(90deg, #E5E7EB 0%, #F3F4F6 50%, #E5E7EB 100%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
}

@keyframes skeleton-pulse {
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 100% 0%; }
}
</style>
