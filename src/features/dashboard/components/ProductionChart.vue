<script setup>
import { computed, shallowRef } from 'vue';
import { Line } from 'vue-chartjs';
import { PhChartLine } from '@phosphor-icons/vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const props = defineProps({
  labels: {
    type: Array,
    default: () => [],
  },
  dataPoints: {
    type: Array,
    default: () => [],
  },
});

const isEmpty = computed(() => props.dataPoints.length === 0 || props.dataPoints.every(val => val === 0));

const chartData = shallowRef({
  labels: props.labels,
  datasets: [
    {
      label: 'Production (L)',
      data: props.dataPoints,
      fill: true,
      borderColor: '#C87533',
      backgroundColor: (ctx) => {
        if (!ctx.chart?.ctx) return 'rgba(200, 117, 51, 0.1)';
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
        gradient.addColorStop(0, 'rgba(200, 117, 51, 0.18)');
        gradient.addColorStop(1, 'rgba(200, 117, 51, 0.02)');
        return gradient;
      },
      borderWidth: 2.5,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#C87533',
      pointHoverBorderColor: '#FFFFFF',
      pointHoverBorderWidth: 2.5,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    tooltip: {
      backgroundColor: '#1A1A1A',
      titleFont: { family: 'Inter', size: 12, weight: '500' },
      bodyFont: { family: 'Inter', size: 13, weight: '600' },
      padding: { x: 12, y: 8 },
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: (ctx) => `${ctx.parsed.y} L`,
      },
    },
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        font: { family: 'Inter', size: 12, weight: '400' },
        color: '#9CA3AF',
        padding: 8,
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.04)',
        drawBorder: false,
      },
      border: { display: false },
      ticks: {
        font: { family: 'Inter', size: 11, weight: '400' },
        color: '#9CA3AF',
        padding: 8,
        callback: (val) => val + ' L',
      },
      beginAtZero: false,
    },
  },
};
</script>

<template>
  <div class="production-chart">
    <div v-if="isEmpty" class="chart-empty-state">
      <PhChartLine :size="48" color="#D1D5DB" />
      <p>Aucune donnée de production disponible</p>
    </div>
    <Line v-else :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.production-chart {
  width: 100%;
  height: 240px;
  position: relative;
}

.chart-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
}

.chart-empty-state p {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  font-weight: 500;
}
</style>
