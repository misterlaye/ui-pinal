<script setup>
import SkeletonText from './SkeletonText.vue';

defineProps({
  rows: { type: Number, default: 5 },
  cols: { type: Number, default: 4 },
});
</script>

<template>
  <div class="skeleton-table">
    <div class="skeleton-table-header">
      <SkeletonText 
        v-for="i in cols" 
        :key="'header-' + i" 
        width="80px" 
        height="12px" 
      />
    </div>
    <div class="skeleton-table-row" v-for="i in rows" :key="'row-' + i">
      <SkeletonText 
        v-for="j in cols" 
        :key="'cell-' + i + '-' + j" 
        width="60px" 
        height="10px" 
      />
    </div>
  </div>
</template>

<style scoped>
.skeleton-table {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.skeleton-table-header {
  display: flex;
  gap: var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--border-light);
}

.skeleton-table-row {
  display: flex;
  gap: var(--space-4);
}
</style>
