<script setup>
import { ref, onMounted, computed } from 'vue';
import ProductionChart from '../components/ProductionChart.vue';
import {
  PhWarningCircle,
  PhWarning,
  PhTrendUp,
  PhTrendDown,
  PhArrowRight,
  PhSun,
  PhCow,
  PhChartLineUp,
  PhCurrencyCircleDollar,
} from '@phosphor-icons/vue';
import { getDashboardSummary, getDashboardAnomalies } from '../../../services/dashboard_service.js';


const userName = ref(localStorage.getItem('user_prenom') || 'M. Diallo');
const exploitationName = ref(localStorage.getItem('exploitation_name') || 'Mon exploitation');

const alerts = ref([]);
const summary = ref(null);
const isLoading = ref(true);
const error = ref(null);

const productionTotal = computed(() => summary.value?.production?.kgDerniers7Jours || 0);
const productionChange = ref('+0%'); // Missing from backend, mock or calculate
const productionLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const productionData = [95, 110, 105, 130, 125, 140, 142]; // No daily breakdown in backend summary

const topAnimals = ref([
  { rank: 1, name: 'Awa', race: 'Montbéliarde', litres: 18.5, trend: 'up' },
  { rank: 2, name: 'Nafi', race: 'Montbéliarde', litres: 16.2, trend: 'up' },
  { rank: 3, name: 'Diara', race: 'Gudali', litres: 14, trend: 'down' },
  { rank: 4, name: 'Fatou', race: 'Gudali', litres: 12.8, trend: 'up' },
]);

const kpis = computed(() => {
  if (!summary.value) return [];
  const fin = summary.value.finance;
  return [
    { label: 'Coût de revient moyen', value: fin?.coutMoyenRationParJour || '0', unit: 'FCFA / j', change: 'stable', changeDir: 'stable', note: 'Coût ration' },
    { label: 'Prix moyen de vente', value: fin?.prixMoyenLaitParKg || '0', unit: 'FCFA / Kg', change: 'stable', changeDir: 'stable', note: 'Moyen' },
    { label: 'CA estimé (30 jours)', value: fin?.chiffreAffairesEstimeLait30Jours || '0', unit: 'FCFA', change: 'stable', changeDir: 'stable', note: 'Estimé' },
    { label: 'Marge estimée (30 jours)', value: fin?.margeEstimeeSurCoutAlimentaire30Jours || '0', unit: 'FCFA', change: 'stable', changeDir: 'stable', note: 'Estimée' },
  ];
});

const herd = computed(() => {
  if (!summary.value) return { total: 0, enLactation: 0, taries: 0, pctLactation: 0, pctTaries: 0 };
  const t = summary.value.troupeau;
  const total = t.totalAnimaux || 1; // Prevent div by 0
  return {
    total: t.totalAnimaux,
    enLactation: t.vachesEnLactation,
    taries: t.vachesTaries,
    pctLactation: Math.round((t.vachesEnLactation / total) * 100),
    pctTaries: Math.round((t.vachesTaries / total) * 100),
  };
});

onMounted(async () => {
  try {
    isLoading.value = true;
    const [summaryData, anomaliesData] = await Promise.all([
      getDashboardSummary(),
      getDashboardAnomalies()
    ]);
    summary.value = summaryData;
    
    alerts.value = anomaliesData.map((ano, index) => ({
      id: index,
      severity: ano.niveauSeverite === 'HAUTE' ? 'critical' : ano.niveauSeverite === 'MOYENNE' ? 'warning' : 'info',
      title: `${ano.typeAnomalie} — ${ano.nomAnimal || 'Inconnu'}`,
      tag: ano.typeAnomalie,
      tagColor: ano.niveauSeverite === 'HAUTE' ? 'red' : 'yellow',
      description: ano.description,
      time: 'Récemment',
      animalName: ano.nomAnimal || 'Inconnu'
    }));

  } catch (e) {
    error.value = "Erreur de chargement du tableau de bord.";
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});

function getAlertIconColor(severity) {
  if (severity === 'critical') return '#EF4444';
  if (severity === 'warning') return '#F59E0B';
  return '#C87533';
}

function getTagClass(color) {
  return `alert-tag--${color}`;
}

function getAnimalInitials(name) {
  return name ? name.slice(0, 2).toUpperCase() : '??';
}

function getAnimalColor(rank) {
  const colors = ['#C87533', '#D4915A', '#B0865F', '#8C7053', '#A69278'];
  return colors[(rank - 1) % colors.length];
}
</script>

<template>
  <div class="dashboard animate-fade-in">
    <!-- Header -->
    <section class="dash-header">
      <div class="dash-header-left">
        <h1 class="dash-greeting">Bonjour, {{ userName }}</h1>
        <p class="dash-subtext">
          Thiès, Sénégal • Température moyenne : 31°C • Suivi IA de votre cheptel laitier en temps réel.
        </p>
      </div>
      <div class="dash-season-badge">
        <PhSun :size="22" weight="duotone" color="#C87533" />
        <div>
          <span class="dash-season-label">Saison Sèche</span>
          <span class="dash-season-sub">Vigilance stress thermique</span>
        </div>
      </div>
    </section>

    <!-- Section 01 — Alerts -->
    <section class="dash-section">
      <div class="dash-section-header">
        <span class="dash-section-num">01</span>
        <span class="dash-section-sep">—</span>
        <span class="dash-section-title-text">ATTENTION REQUISE</span>
        <span class="dash-alert-count">{{ alerts.length }}</span>
        <span class="dash-section-desc">
          — Événements détectés par l'IA méritant votre intervention immédiate
        </span>
      </div>

      <div class="alert-list">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="alert-card"
          :class="`alert-card--${alert.severity}`"
        >
          <div class="alert-card-icon">
            <PhWarningCircle
              v-if="alert.severity === 'critical'"
              :size="22"
              weight="fill"
              :color="getAlertIconColor(alert.severity)"
            />
            <PhWarning
              v-else
              :size="22"
              weight="fill"
              :color="getAlertIconColor(alert.severity)"
            />
          </div>

          <div class="alert-card-body">
            <div class="alert-card-title-row">
              <strong class="alert-card-title">{{ alert.title }}</strong>
              <span class="alert-tag" :class="getTagClass(alert.tagColor)">
                {{ alert.tag }}
              </span>
            </div>
            <p class="alert-card-desc">{{ alert.description }}</p>
          </div>

          <div class="alert-card-actions">
            <span class="alert-time">{{ alert.time }}</span>
            <div class="alert-btns">
              <button class="alert-btn alert-btn--accent">
                Voir {{ alert.animalName }}
              </button>
              <button class="alert-btn alert-btn--outline">Détails</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 02 — Production -->
    <section class="dash-section">
      <div class="dash-section-header">
        <span class="dash-section-num">02</span>
        <span class="dash-section-sep">—</span>
        <span class="dash-section-title-text">PRODUCTION</span>
      </div>

      <div class="production-grid">
        <!-- Chart Card -->
        <div class="card production-card">
          <div class="production-card-header">
            <div>
              <h3 class="production-card-title">Évolution de la production laitière</h3>
              <p class="production-card-subtitle">
                Production cumulée de l'exploitation (litres par jour)
              </p>
            </div>
            <div class="production-total">
              <span class="production-total-value">{{ productionTotal }}</span>
              <span class="production-total-unit">L</span>
              <span class="production-change positive">
                <PhTrendUp :size="14" weight="bold" />
                {{ productionChange }}
              </span>
              <span class="production-total-period">Total sur 7 jours</span>
            </div>
          </div>

          <ProductionChart
            :labels="productionLabels"
            :data-points="productionData"
          />
        </div>

        <!-- Rankings Card -->
        <div class="card rankings-card">
          <div class="rankings-header">
            <div>
              <h3 class="rankings-title">Performances individuelles</h3>
              <p class="rankings-subtitle">Meilleures productrices vs alertes</p>
            </div>
            <span class="rankings-badge">LACTATION</span>
          </div>

          <div class="rankings-list">
            <div
              v-for="animal in topAnimals"
              :key="animal.rank"
              class="ranking-item"
              :class="{ 'ranking-item--alert': animal.alert }"
            >
              <span class="ranking-num">#{{ animal.rank }}</span>
              <div
                class="ranking-avatar"
                :style="{ background: getAnimalColor(animal.rank) }"
              >
                {{ getAnimalInitials(animal.name) }}
              </div>
              <div class="ranking-info">
                <span class="ranking-name">{{ animal.name }}</span>
                <span class="ranking-race">{{ animal.race }}</span>
              </div>
              <div class="ranking-value">
                <span class="ranking-litres">{{ animal.litres }} L</span>
                <PhTrendUp
                  v-if="animal.trend === 'up'"
                  :size="14"
                  weight="bold"
                  color="#16A34A"
                />
                <PhTrendDown
                  v-else
                  :size="14"
                  weight="bold"
                  color="#EF4444"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 03 — Economic Indicators -->
    <section class="dash-section">
      <div class="dash-section-header">
        <span class="dash-section-num">03</span>
        <span class="dash-section-sep">—</span>
        <PhCurrencyCircleDollar :size="18" weight="regular" color="#C87533" />
        <span class="dash-section-title-text">Indicateurs économiques et rentabilité</span>
        <a href="#" class="dash-section-link">
          Voir le détail financier
          <PhArrowRight :size="14" weight="bold" />
        </a>
      </div>

      <div class="kpi-grid">
        <div v-for="kpi in kpis" :key="kpi.label" class="kpi-card card">
          <span class="kpi-label">{{ kpi.label }}</span>
          <div class="kpi-value-row">
            <span class="kpi-value">{{ kpi.value }}</span>
            <span class="kpi-unit">{{ kpi.unit }}</span>
          </div>
          <div class="kpi-footer">
            <span
              v-if="kpi.change !== 'stable'"
              class="kpi-change"
              :class="kpi.changeDir === 'up' ? 'positive' : 'negative'"
            >
              <PhTrendUp v-if="kpi.changeDir === 'up'" :size="12" weight="bold" />
              <PhTrendDown v-else :size="12" weight="bold" />
              {{ kpi.change }}
            </span>
            <span v-else class="kpi-change neutral">
              ↔ stable
            </span>
            <span class="kpi-note">{{ kpi.note }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Herd Status Bar -->
    <section class="herd-bar card">
      <div class="herd-bar-left">
        <div class="herd-bar-icon">
          <PhCow :size="24" weight="duotone" color="#C87533" />
        </div>
        <div>
          <h4 class="herd-bar-title">État du troupeau</h4>
          <p class="herd-bar-subtitle">
            {{ herd.total }} animaux enregistrés • {{ herd.enLactation }} en lactation • {{ herd.taries }} taries
          </p>
        </div>
      </div>

      <div class="herd-bar-center">
        <div class="herd-progress">
          <div
            class="herd-progress-fill herd-progress--active"
            :style="{ width: herd.pctLactation + '%' }"
          />
          <div
            class="herd-progress-fill herd-progress--taries"
            :style="{ width: herd.pctTaries + '%' }"
          />
        </div>
        <div class="herd-legend">
          <span class="herd-legend-item herd-legend--active">
            {{ herd.pctLactation }}% Lactation active
          </span>
          <span class="herd-legend-item herd-legend--taries">
            {{ herd.pctTaries }}% Taries (repos)
          </span>
        </div>
      </div>

      <button class="herd-bar-btn">
        Voir le troupeau
        <PhArrowRight :size="16" weight="bold" />
      </button>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-bottom: 40px;
}

/* --- Card base --- */
.card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
}

/* --- Header --- */
.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.dash-greeting {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.dash-subtext {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.dash-season-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--primary-light);
  border: 1px solid var(--primary-border);
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.dash-season-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-dark);
}

.dash-season-sub {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

/* --- Section Header --- */
.dash-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.dash-section-num {
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--primary);
}

.dash-section-sep {
  color: var(--text-placeholder);
  font-size: var(--font-size-xs);
}

.dash-section-title-text {
  font-size: var(--font-size-xs);
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--text-dark);
  text-transform: uppercase;
}

.dash-alert-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: var(--error);
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 50%;
}

.dash-section-desc {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.dash-section-link {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.dash-section-link:hover {
  opacity: 0.8;
}

/* --- Alert Cards --- */
.alert-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border-light);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.alert-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  background: var(--bg-white);
}

.alert-card--critical {
  border-left: 3px solid #EF4444;
}

.alert-card--warning {
  border-left: 3px solid #F59E0B;
}

.alert-card--info {
  border-left: 3px solid #C87533;
}

.alert-card-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-card-body {
  flex: 1;
  min-width: 0;
}

.alert-card-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.alert-card-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-dark);
}

.alert-tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-radius: var(--radius-full);
  text-transform: uppercase;
}

.alert-tag--red {
  background: rgba(239, 68, 68, 0.12);
  color: #DC2626;
}

.alert-tag--yellow {
  background: rgba(245, 158, 11, 0.12);
  color: #D97706;
}

.alert-tag--orange {
  background: rgba(200, 117, 51, 0.12);
  color: var(--primary);
}

.alert-card-desc {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  line-height: 1.5;
}

.alert-card-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.alert-time {
  font-size: var(--font-size-xs);
  color: var(--text-placeholder);
  white-space: nowrap;
}

.alert-btns {
  display: flex;
  gap: 6px;
}

.alert-btn {
  padding: 6px 14px;
  font-family: var(--font-family);
  font-size: var(--font-size-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.alert-btn--accent {
  background: var(--primary);
  color: white;
  border: none;
}

.alert-btn--accent:hover {
  background: var(--primary-hover);
}

.alert-btn--outline {
  background: var(--bg-white);
  color: var(--text-dark);
  border: 1px solid var(--border-input);
}

.alert-btn--outline:hover {
  background: var(--bg-page);
}

/* --- Production Grid --- */
.production-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
}

.production-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
}

.production-card-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 2px;
}

.production-card-subtitle {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.production-total {
  text-align: right;
  flex-shrink: 0;
}

.production-total-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-dark);
  letter-spacing: -1px;
}

.production-total-unit {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--text-muted);
  margin-left: 2px;
}

.production-change {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  margin-left: 8px;
}

.production-change.positive {
  background: rgba(22, 163, 74, 0.1);
  color: #16A34A;
}

.production-total-period {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: 2px;
}

/* --- Rankings --- */
.rankings-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.rankings-title {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 2px;
}

.rankings-subtitle {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.rankings-badge {
  padding: 3px 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: var(--radius-full);
  border: 1px solid var(--primary-border);
}

.rankings-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-light);
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-item--alert {
  background: rgba(239, 68, 68, 0.04);
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  margin: 0 -12px;
}

.ranking-num {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-muted);
  width: 24px;
}

.ranking-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.ranking-info {
  flex: 1;
  min-width: 0;
}

.ranking-name {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-dark);
}

.ranking-race {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.ranking-value {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.ranking-litres {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-dark);
}

/* --- KPI Grid --- */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.kpi-card {
  padding: 20px;
}

.kpi-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-bottom: 8px;
  line-height: 1.3;
}

.kpi-value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-dark);
  letter-spacing: -0.5px;
}

.kpi-unit {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  font-weight: 500;
}

.kpi-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.kpi-change {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 600;
}

.kpi-change.positive {
  color: #16A34A;
}

.kpi-change.negative {
  color: #EF4444;
}

.kpi-change.neutral {
  color: var(--text-muted);
}

.kpi-note {
  font-size: 11px;
  color: var(--text-placeholder);
}

/* --- Herd Status Bar --- */
.herd-bar {
  display: flex;
  align-items: center;
  gap: 24px;
}

.herd-bar-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.herd-bar-icon {
  width: 44px;
  height: 44px;
  background: var(--primary-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.herd-bar-title {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 2px;
}

.herd-bar-subtitle {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.herd-bar-center {
  flex: 1;
  min-width: 0;
}

.herd-progress {
  display: flex;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  background: var(--bg-page);
  margin-bottom: 6px;
}

.herd-progress-fill {
  height: 100%;
  transition: width var(--transition-base);
}

.herd-progress--active {
  background: var(--text-dark);
  border-radius: 5px 0 0 5px;
}

.herd-progress--taries {
  background: var(--text-placeholder);
  border-radius: 0 5px 5px 0;
}

.herd-legend {
  display: flex;
  gap: 20px;
}

.herd-legend-item {
  font-size: 11px;
  font-weight: 500;
}

.herd-legend--active {
  color: var(--text-dark);
}

.herd-legend--taries {
  color: var(--text-muted);
}

.herd-bar-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: var(--bg-white);
  border: 1px solid var(--border-input);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-dark);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  flex-shrink: 0;
}

.herd-bar-btn:hover {
  background: var(--bg-page);
  border-color: var(--text-muted);
}

/* --- Responsive --- */
@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .production-grid {
    grid-template-columns: 1fr;
  }

  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .herd-bar {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .dash-header {
    flex-direction: column;
    gap: 16px;
  }

  .dash-greeting {
    font-size: 22px;
  }

  .alert-card {
    flex-direction: column;
    gap: 10px;
  }

  .alert-card-actions {
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .herd-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .herd-bar-center {
    width: 100%;
  }

  .herd-bar-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
