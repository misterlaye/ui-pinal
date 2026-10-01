<script setup>
import { computed, toRef } from 'vue';
import { useCopilot } from '../composables/useCopilot.js';

const props = defineProps({
  anomaly: { type: Object, required: true },
  capability: { type: Object, required: true },
});

const anomalyId = computed(() => props.anomaly.id);
const {
  job,
  state,
  available,
  disclosure,
  scenarioOptions,
  selectedScenario,
  loadingLatest,
  requesting,
  transientError,
  requestAnalysis,
  selectScenario,
} = useCopilot({ anomalyId, capability: toRef(props, 'capability') });

const canRequest = computed(() => ['IDLE', 'FAILED', 'STALE'].includes(state.value));

function formatDate(value) {
  if (!value) return 'Date inconnue';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value));
}

function supportLabel(level) {
  return { STRONG: 'Élevé', MODERATE: 'Modéré', WEAK: 'Faible' }[level] || level;
}

function factLabel(value = '') {
  return value.replaceAll('_', ' ').toLocaleLowerCase('fr-FR');
}
</script>

<template>
  <section v-if="available" class="copilot-panel" aria-labelledby="copilot-title">
    <div v-if="disclosure" class="demo-disclosure" role="note">
      <strong>{{ disclosure.label }}</strong>
      <span>{{ disclosure.description }}</span>
    </div>

    <div class="copilot-heading">
      <div>
        <h4 id="copilot-title">Analyse assistée</h4>
        <p>Pinal peut rapprocher les faits enregistrés qui sont liés à cette anomalie.</p>
      </div>
      <button
        v-if="canRequest"
        type="button"
        class="copilot-action"
        :disabled="requesting || loadingLatest"
        @click="requestAnalysis"
      >
        {{ state === 'STALE' ? 'Actualiser l’analyse' : state === 'FAILED' ? 'Réessayer' : 'Analyser avec l’IA' }}
      </button>
    </div>

    <div v-if="scenarioOptions.length" class="demo-scenario">
      <label for="copilot-demo-scenario">Scénario de démonstration</label>
      <select
        id="copilot-demo-scenario"
        :value="selectedScenario"
        :disabled="requesting || ['PENDING', 'IN_PROGRESS'].includes(state)"
        @change="selectScenario($event.target.value)"
      >
        <option v-for="scenario in scenarioOptions" :key="scenario.id" :value="scenario.id">
          {{ scenario.label }}
        </option>
      </select>
    </div>

    <div class="copilot-live-region" aria-live="polite">
      <p v-if="loadingLatest" class="copilot-status" role="status">
        Vérification d’une analyse existante…
      </p>
      <p v-else-if="state === 'PENDING'" class="copilot-status" role="status">
        Demande enregistrée. L’analyse va commencer…
      </p>
      <p v-else-if="state === 'IN_PROGRESS'" class="copilot-status" role="status">
        <span class="copilot-spinner" aria-hidden="true"></span>
        Analyse en cours… Vous pouvez continuer à utiliser Pinal.
      </p>
      <p v-if="transientError" class="copilot-notice" role="status">{{ transientError }}</p>
    </div>

    <div v-if="state === 'ABSTAINED'" class="copilot-message">
      <strong>Pinal ne dispose pas de suffisamment de données pour proposer une interprétation.</strong>
      <p v-if="job.abstentionMessage">{{ job.abstentionMessage }}</p>
    </div>

    <div v-else-if="state === 'FAILED'" class="copilot-message copilot-message--error" role="alert">
      <strong>L’analyse IA est temporairement indisponible.</strong>
      <p>L’anomalie et le reste de Pinal restent utilisables.</p>
    </div>

    <div v-else-if="state === 'STALE'" class="copilot-message">
      <strong>De nouvelles données sont disponibles.</strong>
      <p>Actualisez l’analyse avant de consulter une interprétation.</p>
    </div>

    <div v-else-if="state === 'COMPLETED' && job.result" class="copilot-result">
      <div class="copilot-result-heading">
        <h5>Analyse IA</h5>
        <span v-if="job.result.generatedAt">Générée le {{ formatDate(job.result.generatedAt) }}</span>
      </div>

      <div class="copilot-section">
        <h6>Hypothèses possibles</h6>
        <article v-for="(hypothesis, index) in job.result.hypotheses" :key="index" class="hypothesis-card">
          <p>{{ hypothesis.description }}</p>
          <details v-if="hypothesis.evidences.length">
            <summary>Pourquoi cette hypothèse ?</summary>
            <ul class="evidence-list">
              <li v-for="(evidence, evidenceIndex) in hypothesis.evidences" :key="evidenceIndex">
                <strong>{{ evidence.domain }} · {{ factLabel(evidence.factType) }}</strong>
                <span>{{ formatDate(evidence.observationDate) }} · Support {{ supportLabel(evidence.supportLevel) }}</span>
                <dl>
                  <template v-for="(value, key) in evidence.values" :key="key">
                    <dt>{{ factLabel(key) }}</dt>
                    <dd>{{ value || 'Non renseigné' }}</dd>
                  </template>
                </dl>
              </li>
            </ul>
          </details>
        </article>
      </div>

      <div v-if="job.result.suggestedActions.length" class="copilot-section">
        <h6>Actions suggérées</h6>
        <ul class="action-list">
          <li v-for="action in job.result.suggestedActions" :key="action.code">
            <span>{{ action.label }}</span>
            <small>Suggestion uniquement</small>
          </li>
        </ul>
      </div>

      <p class="copilot-limitation">{{ job.result.disclaimer }}</p>
    </div>
  </section>
</template>

<style scoped>
.copilot-panel {
  padding: 18px 20px;
  background: #fffcf8;
  border-top: 1px solid var(--border-light);
}

.demo-disclosure {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 14px;
  padding: 9px 11px;
  border: 1px solid var(--primary-border);
  border-radius: var(--radius-sm);
  background: var(--primary-light);
  color: var(--text-dark);
  font-size: var(--font-size-xs);
}

.demo-disclosure strong {
  flex-shrink: 0;
  color: var(--primary-hover);
  letter-spacing: .04em;
}

.copilot-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.copilot-heading h4,
.copilot-result-heading h5,
.copilot-section h6 {
  margin: 0;
  color: var(--text-dark);
}

.copilot-heading h4 { margin-bottom: 4px; }
.copilot-heading p,
.copilot-message p { margin: 0; color: var(--text-muted); font-size: var(--font-size-xs); }

.copilot-action {
  flex-shrink: 0;
  padding: 8px 14px;
  border: 0;
  border-radius: var(--radius-sm);
  background: var(--primary);
  color: white;
  font-family: var(--font-family);
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.copilot-action:disabled { cursor: wait; opacity: .65; }
.copilot-action:focus-visible,
summary:focus-visible,
select:focus-visible { outline: 3px solid rgba(200, 117, 51, .35); outline-offset: 2px; }

.demo-scenario {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  color: var(--text-muted);
  font-size: var(--font-size-xs);
}

.demo-scenario select {
  max-width: 250px;
  padding: 7px 28px 7px 9px;
  border: 1px solid var(--border-input);
  border-radius: var(--radius-sm);
  background: var(--bg-white);
  color: var(--text-dark);
  font-family: var(--font-family);
}

.copilot-live-region:empty { display: none; }
.copilot-status,
.copilot-notice,
.copilot-message {
  margin: 14px 0 0;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--primary-light);
  color: var(--text-dark);
  font-size: var(--font-size-sm);
}

.copilot-status { display: flex; align-items: center; gap: 8px; }
.copilot-notice { background: var(--bg-page); }
.copilot-message--error { background: var(--error-light); }

.copilot-spinner {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  border: 2px solid var(--primary-border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: copilot-spin .8s linear infinite;
}

.copilot-result { display: grid; gap: 18px; margin-top: 18px; }
.copilot-result-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.copilot-result-heading span { color: var(--text-muted); font-size: 11px; }
.copilot-section { display: grid; gap: 8px; }
.copilot-section h6 { font-size: var(--font-size-xs); text-transform: uppercase; letter-spacing: .04em; }

.hypothesis-card {
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  background: white;
}

.hypothesis-card > p { margin: 0; color: var(--text-dark); line-height: 1.55; overflow-wrap: anywhere; }
details { margin-top: 10px; }
summary { color: var(--primary-hover); font-size: var(--font-size-xs); font-weight: 600; cursor: pointer; }
.evidence-list,
.action-list { display: grid; gap: 8px; margin: 10px 0 0; padding: 0; list-style: none; }
.evidence-list li { padding-left: 10px; border-left: 2px solid var(--primary-border); color: var(--text-dark); font-size: var(--font-size-xs); }
.evidence-list span { display: block; margin-top: 2px; color: var(--text-muted); }

dl { display: grid; grid-template-columns: minmax(90px, auto) 1fr; gap: 2px 10px; margin: 6px 0 0; }
dt { color: var(--text-muted); }
dd { margin: 0; overflow-wrap: anywhere; }

.action-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  background: var(--bg-white);
  color: var(--text-dark);
  font-size: var(--font-size-sm);
}

.action-list small { flex-shrink: 0; color: var(--text-muted); }
.copilot-limitation { margin: 0; color: var(--text-muted); font-size: var(--font-size-xs); line-height: 1.5; }

@keyframes copilot-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .copilot-spinner { animation: none; }
}

@media (max-width: 768px) {
  .copilot-heading,
  .demo-disclosure,
  .copilot-result-heading,
  .action-list li { align-items: stretch; flex-direction: column; }
  .copilot-action { width: 100%; }
  .demo-scenario { align-items: stretch; flex-direction: column; }
  .demo-scenario select { width: 100%; max-width: none; }
  dl { grid-template-columns: 1fr; }
}
</style>
