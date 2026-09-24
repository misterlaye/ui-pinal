<script setup>
const rationLines = [
  { aliment: 'Foin de luzerne', qte: '6.0 kg', ms: '88%', prot: '180 g/kg' },
  { aliment: 'Ensilage de maïs', qte: '12.0 kg', ms: '35%', prot: '80 g/kg' },
  { aliment: 'Soja', qte: '2.5 kg', ms: '90%', prot: '480 g/kg' },
  { aliment: 'Complément minéral (CMV)', qte: '0.2 kg', ms: '98%', prot: '0 g/kg' },
];
</script>

<template>
  <div class="tab-ration">
    <div class="content-grid">
      
      <!-- Table Ration -->
      <div class="card table-card">
        <div class="card-header-flex">
          <h3 class="card-title">Ration en cours d'utilisation</h3>
          <span class="badge-active">Active</span>
        </div>
        
        <table class="pn-table">
          <thead>
            <tr>
              <th>Aliment</th>
              <th>Qté (Brut)</th>
              <th>Matière Sèche (MS)</th>
              <th>Protéines</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in rationLines" :key="idx">
              <td class="font-medium">{{ row.aliment }}</td>
              <td>{{ row.qte }}</td>
              <td>{{ row.ms }}</td>
              <td>{{ row.prot }}</td>
            </tr>
            <tr class="total-row">
              <td>Total estimé distribué</td>
              <td colspan="3" class="text-right font-bold">20.7 kg Brut</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Needs vs Intake -->
      <div class="card needs-card">
        <h3 class="card-title">Besoins vs Apports estimé</h3>
        
        <div class="metric-group">
          <div class="metric-header">
            <span>Matière Sèche (Ingestion)</span>
            <span>13.5 kg / 14 kg</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill bg-green" style="width: 96%"></div>
          </div>
        </div>

        <div class="metric-group">
          <div class="metric-header">
            <span>Énergie (UFL)</span>
            <span>12.1 / 12.5 UFL</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill bg-yellow" style="width: 92%"></div>
          </div>
        </div>

        <div class="metric-group">
          <div class="metric-header">
            <span>Protéines (PDI)</span>
            <span>1250 / 1200 g</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill bg-blue" style="width: 100%"></div>
          </div>
        </div>
        
        <div class="needs-footer">
          <p class="needs-status">✓ Ration équilibrée pour l'objectif de production actuel.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.tab-ration {
  display: flex;
  flex-direction: column;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.badge-active {
  background: #DCFCE7;
  color: #166534;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
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

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.text-right {
  text-align: right;
}

.total-row td {
  background: var(--bg-page);
  border-top: 2px solid var(--border-light);
  border-bottom: none;
  font-weight: 500;
}

/* Progress bars */
.metric-group {
  margin-bottom: 20px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--text-dark);
  margin-bottom: 8px;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--bg-page);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
}

.bg-green { background-color: #10B981; }
.bg-yellow { background-color: #F59E0B; }
.bg-blue { background-color: #3B82F6; }

.needs-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.needs-status {
  font-size: var(--font-size-sm);
  color: #059669;
  font-weight: 500;
  margin: 0;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
