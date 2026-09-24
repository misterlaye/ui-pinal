<script setup>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartData = {
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  datasets: [
    {
      label: 'Production (L)',
      data: [12.5, 13.0, 12.8, 13.5, 13.2, 12.9, 13.1],
      borderColor: '#C87533', // Ocre
      backgroundColor: 'rgba(200, 117, 51, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1E293B',
      padding: 10,
      titleFont: { family: 'Inter', size: 13 },
      bodyFont: { family: 'Inter', size: 13, weight: 'bold' },
      displayColors: false,
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { family: 'Inter', size: 12 }, color: '#64748B' }
    },
    y: {
      border: { display: false },
      grid: { color: '#F1F5F9', borderDash: [5, 5] },
      ticks: { font: { family: 'Inter', size: 12 }, color: '#64748B', stepSize: 2 }
    }
  }
};

const relevés = [
  { date: 'Aujourd\'hui', matin: '6.5 L', soir: '6.3 L', total: '12.8 L' },
  { date: 'Hier', matin: '6.7 L', soir: '6.4 L', total: '13.1 L' },
  { date: '21 Sept', matin: '6.5 L', soir: '6.4 L', total: '12.9 L' },
  { date: '20 Sept', matin: '6.8 L', soir: '6.7 L', total: '13.5 L' },
];
</script>

<template>
  <div class="tab-production">
    <!-- KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <span class="kpi-label">Production du jour (L)</span>
        <h3 class="kpi-value">12,8 L</h3>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Moyenne de lactation</span>
        <h3 class="kpi-value">13,1 L</h3>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total sur la lactation</span>
        <h3 class="kpi-value">2 751 L</h3>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Chart -->
      <div class="chart-card">
        <h3 class="card-title">Production de la semaine (7 derniers jours)</h3>
        <div class="chart-container">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Table -->
      <div class="table-card">
        <h3 class="card-title">Derniers relevés</h3>
        <table class="pn-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Matin</th>
              <th>Soir</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in relevés" :key="idx">
              <td>{{ row.date }}</td>
              <td>{{ row.matin }}</td>
              <td>{{ row.soir }}</td>
              <td class="font-bold">{{ row.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-production {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.kpi-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.kpi-label {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  font-weight: 500;
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-dark);
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.chart-card, .table-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 20px;
}

.chart-container {
  height: 250px;
}

/* Table Styles */
.pn-table {
  width: 100%;
  border-collapse: collapse;
}

.pn-table th {
  text-align: left;
  padding: 12px 8px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pn-table td {
  padding: 12px 8px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-dark);
  font-size: var(--font-size-sm);
}

.pn-table tr:last-child td {
  border-bottom: none;
}

.font-bold {
  font-weight: 600;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
