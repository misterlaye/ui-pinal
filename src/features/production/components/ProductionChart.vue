<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // We'll build a custom HTML legend for better styling
    },
    tooltip: {
      backgroundColor: '#1E293B',
      padding: 12,
      titleFont: { family: 'Inter', size: 13 },
      bodyFont: { family: 'Inter', size: 13, weight: 'bold' },
      displayColors: true,
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { 
        font: { family: 'Inter', size: 11 }, 
        color: '#9CA3AF',
        maxRotation: 0,
        autoSkipPadding: 20
      }
    },
    y: {
      border: { display: false },
      grid: { color: '#F1F5F9' },
      ticks: { 
        font: { family: 'Inter', size: 11 }, 
        color: '#9CA3AF',
        stepSize: 200 
      },
      min: 0,
      suggestedMax: 1000
    }
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
};

const formattedChartData = computed(() => {
  return {
    labels: props.chartData.labels,
    datasets: [
      {
        label: 'Semaine actuelle',
        data: props.chartData.currentWeek,
        borderColor: '#C87533', // Ocre
        backgroundColor: 'rgba(200, 117, 51, 0.08)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Semaine précédente',
        data: props.chartData.previousWeek,
        borderColor: '#9CA3AF', // Gris clair
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: false,
        tension: 0.3,
      }
    ]
  };
});
</script>

<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title-group">
        <div class="chart-icon text-primary">
          <!-- Using a simple SVG for the generic chart icon seen in mockup -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <h3 class="chart-title">Évolution de la production sur 30 jours</h3>
      </div>
      
      <!-- Custom Legend -->
      <div class="custom-legend">
        <div class="legend-item">
          <span class="legend-color legend-current"></span>
          <span class="legend-label">Semaine actuelle</span>
        </div>
        <div class="legend-item">
          <span class="legend-color legend-previous"></span>
          <span class="legend-label">Semaine précédente</span>
        </div>
      </div>
    </div>
    
    <div class="chart-container">
      <Line :data="formattedChartData" :options="chartOptions" />
      <div class="y-axis-label">Litres</div>
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chart-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-icon {
  color: #C87533;
  display: flex;
}

.chart-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

/* Custom Legend */
.custom-legend {
  display: flex;
  align-items: center;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color {
  width: 12px;
  height: 3px;
  border-radius: 2px;
}

.legend-current {
  background-color: #C87533;
}

.legend-previous {
  background-color: #9CA3AF;
  border-top: 1px dashed white; /* Simulate dash if needed, but solid color is fine for legend */
}

.legend-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
}

/* Chart Container */
.chart-container {
  height: 350px;
  position: relative;
}

.y-axis-label {
  position: absolute;
  top: 50%;
  left: -20px;
  transform: translateY(-50%) rotate(-90deg);
  font-size: 11px;
  color: var(--text-placeholder);
  letter-spacing: 0.05em;
  font-weight: 500;
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
