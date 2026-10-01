<script setup>
defineProps({
  height: { type: String, default: '240px' },
});
</script>

<template>
  <div class="skeleton-chart" :style="{ height: height }">
    <div class="skeleton-chart-bars">
      <div 
        v-for="i in 7" 
        :key="i" 
        class="skeleton-bar" 
        :style="{ height: (Math.random() * 40 + 40) + '%' }" 
      />
    </div>
  </div>
</template>

<style scoped>
.skeleton-chart {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  align-items: flex-end;
}

.skeleton-chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  gap: 8px;
}

.skeleton-bar {
  flex: 1;
  background: linear-gradient(90deg, #E5E7EB 0%, #F3F4F6 50%, #E5E7EB 100%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}

@keyframes skeleton-pulse {
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 100% 0%; }
}
</style>
