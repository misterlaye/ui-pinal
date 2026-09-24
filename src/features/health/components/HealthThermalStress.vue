<script setup>
import { PhThermometer, PhWarning, PhDrop, PhWind } from '@phosphor-icons/vue';

const props = defineProps({
  thermalData: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="thermal-section">
    
    <div class="section-header">
      <div class="title-group">
        <PhThermometer :size="20" weight="fill" color="#C87533" />
        <h3 class="section-title">Stress thermique</h3>
      </div>
    </div>

    <div class="thermal-grid">
      
      <!-- Température -->
      <div class="thermal-card">
        <div class="card-top">
          <span class="card-label">TEMPÉRATURE MOYENNE</span>
          <div class="icon-wrapper bg-orange-light text-orange">
            <PhThermometer :size="16" weight="bold" />
          </div>
        </div>
        <div class="card-main">
          <div class="temp-value">{{ thermalData.averageTemp }}°C</div>
          <div class="temp-meta">
            <span class="season-badge">{{ thermalData.season }}</span>
            <span class="location">{{ thermalData.location }}</span>
          </div>
        </div>
      </div>

      <!-- Risque -->
      <div class="thermal-card">
        <div class="card-top">
          <span class="card-label">RISQUE DE STRESS THERMIQUE</span>
          <div class="icon-wrapper bg-yellow-light text-yellow">
            <PhWarning :size="16" weight="fill" />
          </div>
        </div>
        <div class="card-main">
          <div class="risk-header">
            <span class="risk-level">{{ thermalData.riskLevel }}</span>
            <span class="risk-score">{{ thermalData.riskScore }}/100</span>
          </div>
          
          <div class="gauge-container">
            <div class="gauge-bar">
              <div class="gauge-fill" :style="{ width: thermalData.riskScore + '%' }"></div>
            </div>
            <div class="gauge-labels">
              <span>Faible</span>
              <span>Élevé</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommandations -->
      <div class="thermal-card recommendations-card">
        <span class="card-label mb-3">RECOMMANDATIONS</span>
        <ul class="reco-list">
          <li v-for="(reco, index) in thermalData.recommendations" :key="index">
            <div class="reco-icon bg-green-light text-green">
              <!-- Alternating icons for visual variety based on index -->
              <PhDrop v-if="index % 2 !== 0" :size="14" weight="fill" />
              <PhWind v-else :size="14" weight="fill" />
            </div>
            <span class="reco-text">{{ reco }}</span>
          </li>
        </ul>
      </div>

    </div>

  </div>
</template>

<style scoped>
.thermal-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.thermal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.thermal-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.card-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mb-3 {
  margin-bottom: 16px;
  display: block;
}

.icon-wrapper {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-orange-light { background-color: #FFEDD5; }
.text-orange { color: #F97316; }

.bg-yellow-light { background-color: #FEF3C7; }
.text-yellow { color: #D97706; }

.bg-green-light { background-color: #ECFDF5; }
.text-green { color: #10B981; }

/* Temp Card */
.temp-value {
  font-size: 40px;
  font-weight: 700;
  color: var(--text-dark);
  line-height: 1;
  margin-bottom: 12px;
}

.temp-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.season-badge {
  background-color: #FFEDD5;
  color: #D97706;
  font-size: 10px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.location {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

/* Risk Card */
.risk-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 12px;
}

.risk-level {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-dark);
}

.risk-score {
  font-size: 14px;
  font-weight: 700;
  color: #D97706;
}

.gauge-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gauge-bar {
  height: 8px;
  background-color: var(--border-light);
  border-radius: 4px;
  overflow: hidden;
}

.gauge-fill {
  height: 100%;
  background: linear-gradient(90deg, #10B981 0%, #F59E0B 50%, #EF4444 100%);
  border-radius: 4px;
}

.gauge-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-placeholder);
}

/* Recommendations Card */
.recommendations-card {
  background-color: #FAFAFA; /* Slightly distinct background */
}

.reco-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reco-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.reco-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.reco-text {
  font-size: 13px;
  color: var(--text-body);
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 1024px) {
  .thermal-grid {
    grid-template-columns: 1fr;
  }
}
</style>
