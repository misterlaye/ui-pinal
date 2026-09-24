<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: Object, // Phosphor Icon component
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  centerText1: {
    type: String,
    default: ''
  },
  centerText2: {
    type: String,
    default: ''
  }
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1A1A1A',
      titleFont: { family: 'Inter', size: 12, weight: '500' },
      bodyFont: { family: 'Inter', size: 13, weight: '600' },
      padding: { x: 12, y: 8 },
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label: (ctx) => ` ${ctx.label}: ${ctx.raw}`
      }
    }
  },
  layout: {
    padding: 10
  }
};
</script>

<template>
  <div class="donut-chart-card">
    <div class="chart-header">
      <component :is="icon" :size="20" weight="fill" color="#C87533" />
      <h3 class="chart-title">{{ title }}</h3>
    </div>
    <div class="chart-container">
      <Doughnut :data="data" :options="chartOptions" />
      <div class="chart-center-text" v-if="centerText1 || centerText2">
        <span class="center-val">{{ centerText1 }}</span>
        <span class="center-lbl">{{ centerText2 }}</span>
      </div>
      
      <!-- Custom overlay labels for donut segments (approximation based on mockup) -->
      <slot name="overlay-labels"></slot>
    </div>
  </div>
</template>

<style scoped>
.donut-chart-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chart-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.chart-title {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--text-dark);
}

.chart-container {
  position: relative;
  flex: 1;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.center-val {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-dark);
}

.center-lbl {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
