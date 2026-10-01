export const COPILOT_STATES = Object.freeze({
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ABSTAINED: 'ABSTAINED',
  FAILED: 'FAILED',
  STALE: 'STALE',
});

export const TERMINAL_COPILOT_STATES = new Set([
  COPILOT_STATES.COMPLETED,
  COPILOT_STATES.ABSTAINED,
  COPILOT_STATES.FAILED,
  COPILOT_STATES.STALE,
]);

const KNOWN_STATES = new Set(Object.values(COPILOT_STATES));

function text(value, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function normalizeValues(values) {
  if (!values || typeof values !== 'object' || Array.isArray(values)) return {};
  return Object.fromEntries(
    Object.entries(values)
      .filter(([key]) => typeof key === 'string')
      .map(([key, value]) => [key, value == null ? '' : String(value)])
  );
}

export function normalizeEvidence(raw = {}) {
  return {
    domain: text(raw.domain, 'Pinal'),
    factType: text(raw.factType, 'INFORMATION'),
    observationDate: text(raw.observationDate) || null,
    values: normalizeValues(raw.values),
    supportLevel: text(raw.supportLevel, 'MODERATE'),
  };
}

export function normalizeResult(raw = {}, generatedAt = null) {
  return {
    hypotheses: Array.isArray(raw.hypotheses)
      ? raw.hypotheses.map((hypothesis) => ({
          description: text(hypothesis?.description),
          evidences: Array.isArray(hypothesis?.evidences)
            ? hypothesis.evidences.map(normalizeEvidence)
            : [],
        }))
      : [],
    suggestedActions: Array.isArray(raw.suggestedActions)
      ? raw.suggestedActions
          .filter((action) => action && typeof action.code === 'string' && typeof action.label === 'string')
          .map((action) => ({
            code: action.code,
            label: action.label,
            availability: text(action.availability, 'SUGGESTION_ONLY'),
          }))
      : [],
    generatedAt: text(raw.generatedAt) || text(generatedAt) || null,
    isStale: raw.isStale === true,
    disclaimer: text(raw.disclaimer) || text(raw.limitation),
  };
}

export function normalizeJob(raw = {}, anomalyId = null) {
  const status = KNOWN_STATES.has(raw.status) ? raw.status : COPILOT_STATES.FAILED;
  return {
    jobId: raw.jobId == null ? null : String(raw.jobId),
    anomalyId: text(raw.anomalyId) || (anomalyId == null ? null : String(anomalyId)),
    status,
    abstentionReason: text(raw.abstentionReason) || null,
    abstentionMessage: text(raw.abstentionMessage) || null,
    generatedAt: text(raw.generatedAt) || null,
    result: raw.result ? normalizeResult(raw.result, raw.generatedAt) : null,
  };
}

export function disabledCapability() {
  return {
    enabled: false,
    disclosure: null,
    scenarioOptions: [],
  };
}

