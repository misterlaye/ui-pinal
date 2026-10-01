import { describe, expect, it, vi } from 'vitest';
import { createCopilotPoller } from '../src/features/dashboard/composables/copilotPolling.js';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('createCopilotPoller', () => {
  it('interroge un seul job jusqu’à son état terminal', async () => {
    let calls = 0;
    const updates = [];
    const scheduled = [];
    const poller = createCopilotPoller({
      fetchJob: async () => (++calls === 1 ? { status: 'IN_PROGRESS' } : { status: 'COMPLETED' }),
      onUpdate: (job) => updates.push(job.status),
      onError: vi.fn(),
      schedule: (callback) => scheduled.push(callback),
      cancel: vi.fn(),
    });

    poller.start('job-1');
    poller.start('job-1');
    expect(scheduled).toHaveLength(1);
    scheduled.shift()();
    await flush();
    scheduled.shift()();
    await flush();

    expect(updates).toEqual(['IN_PROGRESS', 'COMPLETED']);
    expect(calls).toBe(2);
    expect(poller.isActive()).toBe(false);
  });

  it('arrête toute requête après le démontage de la vue', async () => {
    let calls = 0;
    const scheduled = [];
    const poller = createCopilotPoller({
      fetchJob: async () => {
        calls += 1;
        return { status: 'IN_PROGRESS' };
      },
      onUpdate: vi.fn(),
      onError: vi.fn(),
      schedule: (callback) => scheduled.push(callback),
      cancel: vi.fn(),
    });

    poller.start('job-2');
    poller.stop();
    const callsAtStop = calls;
    scheduled.shift()();
    await flush();

    expect(calls).toBe(callsAtStop);
    expect(poller.isActive()).toBe(false);
  });

  it('s’arrête au timeout sans créer de boucle infinie', async () => {
    let clock = 0;
    const errors = [];
    const scheduled = [];
    const poller = createCopilotPoller({
      fetchJob: async () => ({ status: 'IN_PROGRESS' }),
      onUpdate: vi.fn(),
      onError: (error) => errors.push(error.name),
      timeoutMs: 10,
      now: () => clock,
      schedule: (callback) => scheduled.push(callback),
      cancel: vi.fn(),
    });

    poller.start('job-3');
    await flush();
    clock = 11;
    scheduled.shift()();
    await flush();

    expect(errors).toEqual(['CopilotPollingTimeoutError']);
    expect(poller.isActive()).toBe(false);
  });

  it('signale une erreur réseau puis reprend le polling', async () => {
    let calls = 0;
    const errors = [];
    const updates = [];
    const scheduled = [];
    const poller = createCopilotPoller({
      fetchJob: async () => {
        calls += 1;
        if (calls === 1) throw new Error('network');
        return { status: 'COMPLETED' };
      },
      onUpdate: (job) => updates.push(job.status),
      onError: (error) => errors.push(error.message),
      schedule: (callback) => scheduled.push(callback),
      cancel: vi.fn(),
    });

    poller.start('job-4');
    scheduled.shift()();
    await flush();
    scheduled.shift()();
    await flush();

    expect(errors).toEqual(['network']);
    expect(updates).toEqual(['COMPLETED']);
    expect(poller.isActive()).toBe(false);
  });
});
