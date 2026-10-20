import { describe, it, expect, vi } from 'vitest';
import { createResponseInterceptor } from '../src/services/api_client.js';
import { apiErrorMessage } from '../src/utils/apiError.js';

function unauthorized(url = '/animals', extra = {}) {
  return { config: { url, headers: {}, ...extra }, response: { status: 401 } };
}

describe('rafraîchissement de session', () => {
  it('rafraîchit une seule fois pour des requêtes concurrentes puis les rejoue', async () => {
    const client = vi.fn(async (config) => ({ status: 200, config }));
    const refresh = vi.fn(async () => 'nouveau-jeton');
    const onSessionExpired = vi.fn();
    const { onRejected } = createResponseInterceptor(client, { refresh, onSessionExpired });

    const [r1, r2] = await Promise.all([onRejected(unauthorized('/a')), onRejected(unauthorized('/b'))]);

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(client).toHaveBeenCalledTimes(2);
    expect(r1.config.headers.Authorization).toBe('Bearer nouveau-jeton');
    expect(r2.config._retried).toBe(true);
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('ferme la session si le rafraîchissement échoue', async () => {
    const client = vi.fn();
    const onSessionExpired = vi.fn();
    const { onRejected } = createResponseInterceptor(client, {
      refresh: vi.fn(async () => { throw new Error('refusé'); }),
      onSessionExpired
    });

    await expect(onRejected(unauthorized())).rejects.toBeDefined();
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
    expect(client).not.toHaveBeenCalled();
  });

  it('ne rejoue pas indéfiniment une requête déjà rejouée', async () => {
    const refresh = vi.fn();
    const onSessionExpired = vi.fn();
    const { onRejected } = createResponseInterceptor(vi.fn(), { refresh, onSessionExpired });

    await expect(onRejected(unauthorized('/a', { _retried: true }))).rejects.toBeDefined();
    expect(refresh).not.toHaveBeenCalled();
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it("ne traite pas un refus d'identifiants comme une session expirée", async () => {
    const refresh = vi.fn();
    const onSessionExpired = vi.fn();
    const { onRejected } = createResponseInterceptor(vi.fn(), { refresh, onSessionExpired });

    await expect(onRejected(unauthorized('/auth/pin/verify'))).rejects.toBeDefined();
    expect(refresh).not.toHaveBeenCalled();
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('laisse passer les autres erreurs sans toucher à la session', async () => {
    const refresh = vi.fn();
    const { onRejected } = createResponseInterceptor(vi.fn(), { refresh, onSessionExpired: vi.fn() });
    await expect(onRejected({ config: { url: '/x' }, response: { status: 403 } })).rejects.toBeDefined();
    expect(refresh).not.toHaveBeenCalled();
  });
});

describe('message des erreurs API', () => {
  it('lit le detail ProblemDetail, puis message, puis le texte par défaut', () => {
    expect(apiErrorMessage({ response: { data: { detail: 'Animal introuvable.' } } })).toBe('Animal introuvable.');
    expect(apiErrorMessage({ response: { data: { message: 'Ancien format' } } })).toBe('Ancien format');
    expect(apiErrorMessage({ response: { data: {} } }, 'Défaut')).toBe('Défaut');
  });

  it("signale explicitement l'absence de réseau et les délais", () => {
    expect(apiErrorMessage({ request: {} })).toContain('injoignable');
    expect(apiErrorMessage({ code: 'ECONNABORTED' })).toContain('trop de temps');
  });
});
