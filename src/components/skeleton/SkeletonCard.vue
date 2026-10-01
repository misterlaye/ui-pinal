<script setup>
import SkeletonCircle from './SkeletonCircle.vue';
import SkeletonText from './SkeletonText.vue';

defineProps({
  height: { type: String, default: 'auto' },
  lines: { type: Number, default: 3 },
  showIcon: { type: Boolean, default: true },
});
</script>

<template>
  <div class="skeleton-card" :style="{ height: height }">
    <div class="skeleton-header" v-if="showIcon">
      <SkeletonCircle :size="48" />
      <div class="skeleton-title-group">
        <SkeletonText width="60%" height="14px" />
        <SkeletonText width="40%" height="12px" />
      </div>
    </div>
    <div class="skeleton-body">
      <SkeletonText 
        v-for="i in lines" 
        :key="i" 
        :width="i === lines ? '70%' : '100%'" 
        height="10px"
      />
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.skeleton-title-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.skeleton-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>
