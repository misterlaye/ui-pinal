import { TERMINAL_COPILOT_STATES } from '../../../services/copilot/copilot_contract.js';

export class CopilotPollingTimeoutError extends Error {
  constructor() {
    super('Le délai maximal de l’analyse IA est dépassé.');
    this.name = 'CopilotPollingTimeoutError';
  }
}

export function createCopilotPoller({
  fetchJob,
  onUpdate,
  onError,
  intervalMs = 1500,
  timeoutMs = 60000,
  schedule = setTimeout,
  cancel = clearTimeout,
  now = Date.now,
}) {
  let timer = null;
  let currentJobId = null;
  let startedAt = 0;
  let stopped = true;
  let requestInFlight = false;
  let generation = 0;

  async function tick(runGeneration) {
    if (stopped || runGeneration !== generation || requestInFlight) return;
    if (now() - startedAt >= timeoutMs) {
      stopped = true;
      onError(new CopilotPollingTimeoutError());
      return;
    }

    requestInFlight = true;
    try {
      const job = await fetchJob(currentJobId);
      if (stopped || runGeneration !== generation) return;
      onUpdate(job);
      if (TERMINAL_COPILOT_STATES.has(job.status)) {
        stopped = true;
        return;
      }
    } catch (error) {
      if (stopped || runGeneration !== generation) return;
      onError(error);
    } finally {
      requestInFlight = false;
    }

    if (!stopped && runGeneration === generation) {
      timer = schedule(() => tick(runGeneration), intervalMs);
    }
  }

  function start(jobId) {
    if (!stopped && currentJobId === jobId) return;
    stop();
    currentJobId = jobId;
    startedAt = now();
    stopped = false;
    generation += 1;
    const runGeneration = generation;
    timer = schedule(() => tick(runGeneration), intervalMs);
  }

  function stop() {
    stopped = true;
    generation += 1;
    if (timer !== null) cancel(timer);
    timer = null;
    currentJobId = null;
  }

  return {
    start,
    stop,
    isActive: () => !stopped,
  };
}
