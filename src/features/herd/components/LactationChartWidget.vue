<script setup>
import { ref, onMounted } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';
import { getLactationCurve } from '../../../services/production_service.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  lactationId: {
    type: String,
    required: true
  }
});

const chartData = ref({
  labels: [],
  datasets: []
});
const isLoaded = ref(false);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Production (kg)'
      }
    },
    x: {
      title: {
        display: false
      }
    }
  }
};

onMounted(async () => {
  try {
    const data = await getLactationCurve(props.lactationId);
    
    // Si pas de données, on affiche un graph vide ou mocké
    if (!data || data.length === 0) {
      chartData.value = {
        labels: ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7'],
        datasets: [{
          label: 'Production (L)',
          backgroundColor: '#C87533',
          borderColor: '#C87533',
          data: [12, 14, 15, 14, 16, 18, 17]
        }]
      };
    } else {
      chartData.value = {
        labels: data.map(d => new Date(d.date).toLocaleDateString()),
        datasets: [{
          label: 'Production (L)',
          backgroundColor: '#C87533',
          borderColor: '#C87533',
          data: data.map(d => d.quantiteKg),
          tension: 0.3
        }]
      };
    }
    isLoaded.value = true;
  } catch (err) {
    console.error("Erreur chart:", err);
  }
});
</script>

<template>
  <div class="chart-widget">
    <div class="widget-header">
      <span class="widget-title">COURBE DE LACTATION</span>
    </div>
    <div class="chart-container" v-if="isLoaded">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="loading">Chargement du graphique...</div>
  </div>
</template>

<style scoped>
.chart-widget {
  background: #FCFBF9;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
}

.widget-title {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.chart-container {
  position: relative;
  height: 250px;
}

.loading {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 14px;
}
</style>
