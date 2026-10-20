<script setup>
import { computed } from 'vue';
import { PhChartBar, PhChartPieSlice, PhChartLine } from '@phosphor-icons/vue';
import { Bar, Pie } from 'vue-chartjs';
import { formatCurrency, formatCurrencyCompact } from '../../../utils/formatters.js';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const props = defineProps({
  // { labels, chiffreAffaires, coutTotal } — une valeur null signifie « non calculable » (jamais 0)
  historique: {
    type: Object,
    required: true
  },
  // { labels, montants (FCFA), coutAlimentationPartiel }
  repartition: {
    type: Object,
    required: true
  }
});

const PALETTE = ['#C87533', '#374151', '#10B981', '#6366F1', '#F59E0B', '#EF4444', '#0EA5E9', '#A855F7'];

const isRevenueEmpty = computed(() => {
  const h = props.historique;
  if (!h || !h.labels?.length) return true;
  return [...(h.chiffreAffaires || []), ...(h.coutTotal || [])].every(v => v == null || Number(v) === 0);
});

// Mois dont au moins une valeur n'est pas calculable (prix manquant…) : signalés sous le graphique.
const moisIncomplets = computed(() => {
  const h = props.historique || {};
  return (h.labels || []).filter((_, i) => h.chiffreAffaires?.[i] == null || h.coutTotal?.[i] == null);
});

const isRepartitionEmpty = computed(() => {
  const montants = props.repartition?.montants || [];
  return montants.length === 0 || montants.every(v => Number(v) === 0);
});

const totalCharges = computed(() => (props.repartition?.montants || []).reduce((sum, val) => sum + Number(val), 0));

const formattedTotal = computed(() => formatCurrencyCompact(totalCharges.value));

const barChartData = computed(() => ({
  labels: props.historique.labels,
  datasets: [
    {
      label: "Chiffre d'affaires",
      backgroundColor: '#10B981',
      data: props.historique.chiffreAffaires,
      borderRadius: 4,
      barPercentage: 0.8,
      categoryPercentage: 0.8
    },
    {
      label: 'Coût total',
      backgroundColor: '#C87533',
      data: props.historique.coutTotal,
      borderRadius: 4,
      barPercentage: 0.8,
      categoryPercentage: 0.8
    }
  ]
}));

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        font: {
          size: 11,
          family: "'Inter', sans-serif"
        }
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += formatCurrency(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#F3F4F6',
        drawBorder: false,
      },
      ticks: {
        callback: function(value) {
          return value / 1000 + 'k';
        },
        font: {
          size: 10
        },
        color: '#9CA3AF'
      }
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        font: {
          size: 11
        },
        color: '#6B7280'
      }
    }
  }
};

// Pie Chart Configuration
const pieChartData = computed(() => ({
  labels: props.repartition.labels,
  datasets: [
    {
      backgroundColor: props.repartition.labels.map((_, i) => PALETTE[i % PALETTE.length]),
      data: props.repartition.montants,
      borderWidth: 0,
      hoverOffset: 4
    }
  ]
}));

const isMobile = computed(() => window.innerWidth < 768);

const pieChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: isMobile.value ? 'bottom' : 'right',
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        padding: 20,
        font: {
          size: 12,
          family: "'Inter', sans-serif"
        }
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed !== null) {
            label += formatCurrency(context.parsed);
          }
          return label;
        }
      }
    }
  },
  cutout: '60%' // Make it a donut chart
}));
</script>

<template>
  <div class="charts-section split-layout">
    
    <!-- Bar Chart Card -->
    <div class="chart-card main-chart">
      <div class="card-header">
        <div class="title-group">
          <PhChartBar :size="20" weight="bold" color="#C87533" />
          <h3 class="card-title">Chiffre d'affaires et coût total (3 derniers mois et mois en cours)</h3>
        </div>
      </div>
      <div class="chart-container bar-container">
        <!-- Empty State -->
        <div v-if="isRevenueEmpty" class="chart-empty-state">
          <PhChartLine :size="48" color="#D1D5DB" weight="light" />
          <p class="empty-message">Aucune donnée financière disponible</p>
        </div>
        <!-- Chart -->
        <Bar v-else :data="barChartData" :options="barChartOptions" />
      </div>
      <p v-if="moisIncomplets.length" class="chart-note">
        Valeurs non calculables (données manquantes) : {{ moisIncomplets.join(', ') }}.
      </p>
    </div>

    <!-- Pie Chart Card -->
    <div class="chart-card side-chart">
      <div class="card-header">
        <div class="title-group">
          <PhChartPieSlice :size="20" weight="bold" color="#C87533" />
          <h3 class="card-title">Répartition des charges</h3>
        </div>
      </div>
      <div class="chart-container pie-container">
        <!-- Empty State -->
        <div v-if="isRepartitionEmpty" class="chart-empty-state">
          <PhChartLine :size="48" color="#D1D5DB" weight="light" />
          <p class="empty-message">Aucune charge sur le mois en cours</p>
        </div>
        <!-- Chart -->
        <template v-else>
          <Pie :data="pieChartData" :options="pieChartOptions" />
          <!-- Custom Center Label -->
          <div class="donut-center-label">
            <span class="total-label">Total</span>
            <span class="total-value">{{ formattedTotal }}</span>
          </div>
        </template>
      </div>
      <p v-if="repartition.coutAlimentationPartiel" class="chart-note">
        Coût alimentaire partiel : certains aliments n'ont pas de prix sur la période.
      </p>
    </div>

  </div>
</template>

<style scoped>
.split-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.chart-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
}

.card-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.chart-container {
  position: relative;
  width: 100%;
}

.bar-container {
  height: clamp(200px, 40vh, 300px);
}

.pie-container {
  height: clamp(200px, 40vh, 300px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
}

.chart-note {
  margin: 12px 0 0;
  font-size: 12px;
  color: var(--text-muted);
}

.empty-message {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

.donut-center-label {
  position: absolute;
  top: 50%;
  left: 30%; /* Shifted left because legend is on the right */
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.donut-center-label .total-label {
  font-size: 12px;
  color: var(--text-muted);
}

.donut-center-label .total-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-dark);
}

/* Responsive */
@media (max-width: 1024px) {
  .split-layout {
    grid-template-columns: 1fr;
  }
  
  .donut-center-label {
    left: 50%;
  }
}

@media (max-width: 768px) {
  .bar-container,
  .pie-container {
    height: clamp(240px, 50vh, 300px);
  }
}
</style>
