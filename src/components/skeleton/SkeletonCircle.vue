<script setup>
defineProps({
  size: { type: Number, default: 40 },
});
</script>

<template>
  <div class="skeleton-circle" :style="{ width: size + 'px', height: size + 'px' }" />
</template>

<style scoped>
.skeleton-circle {
  background: linear-gradient(90deg, #E5E7EB 0%, #F3F4F6 50%, #E5E7EB 100%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: 50%;
  flex-shrink: 0;
}

@keyframes skeleton-pulse {
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 100% 0%; }
}
</style>
