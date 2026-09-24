<script setup>
import { ref, onMounted, shallowRef } from 'vue';
import { Line } from 'vue-chartjs';
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
    default: () => ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  },
  dataPoints: {
    type: Array,
    default: () => [95, 110, 105, 130, 125, 140, 142],
  },
});

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
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.production-chart {
  width: 100%;
  height: 240px;
  position: relative;
}
</style>
