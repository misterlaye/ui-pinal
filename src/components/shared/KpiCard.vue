<script setup>
import { computed } from 'vue';
import { PhTrendUp, PhTrendDown } from '@phosphor-icons/vue';

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  unit: { type: String, default: '' },
  change: { type: String, default: '' },
  changeDir: { type: String, default: 'stable' }, // 'up' | 'down' | 'stable'
  note: { type: String, default: '' },
});

const changeClass = computed(() => ({
  'positive': props.changeDir === 'up',
  'negative': props.changeDir === 'down',
  'neutral': props.changeDir === 'stable',
}));

const changeIcon = computed(() => {
  if (props.changeDir === 'up') return PhTrendUp;
  if (props.changeDir === 'down') return PhTrendDown;
  return null;
});
</script>

<template>
  <div class="kpi-card">
    <span class="kpi-label">{{ label }}</span>
    <div class="kpi-value-row">
      <span class="kpi-value">{{ value }}</span>
      <span class="kpi-unit" v-if="unit">{{ unit }}</span>
    </div>
    <div class="kpi-footer" v-if="change || note">
      <span class="kpi-change" :class="changeClass" v-if="change">
        <component :is="changeIcon" :size="12" weight="bold" v-if="changeIcon" />
        {{ change }}
      </span>
      <span class="kpi-note" v-if="note">{{ note }}</span>
    </div>
  </div>
</template>

<style scoped>
.kpi-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  transition: box-shadow var(--transition-fast);
}

.kpi-card:hover {
  box-shadow: var(--shadow-sm);
}

.kpi-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-muted);
  line-height: 1.4;
}

.kpi-value-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.kpi-value {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-dark);
  line-height: 1.2;
}

.kpi-unit {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-muted);
}

.kpi-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.kpi-change {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.kpi-change.positive {
  color: var(--success);
}

.kpi-change.negative {
  color: var(--error);
}

.kpi-change.neutral {
  color: var(--text-muted);
}

.kpi-note {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
</style>
