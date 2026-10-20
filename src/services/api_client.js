import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Client pour les opérations longues (tableaux de bord, agrégations)
export const apiClientLong = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Client nu, sans intercepteur : sert uniquement au rafraîchissement de session (évite toute boucle).
const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const SESSION_KEYS = ['jwt_token', 'refresh_token', 'active_exploitation_id', 'active_role'];

// Endpoints d'authentification : un 401 y signifie « identifiants refusés », pas « session expirée ».
const AUTH_ENDPOINTS = ['/auth/pin/verify', '/auth/otp/verify', '/auth/otp/request', '/auth/refresh'];

function createRequestInterceptor() {
  return (config) => {
    const token = localStorage.getItem('jwt_token');
    const exploitationId = localStorage.getItem('active_exploitation_id');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (exploitationId) {
      config.headers['X-Exploitation-ID'] = exploitationId;
    }

    return config;
  };
}

async function refreshSession() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('Aucun jeton de rafraîchissement');
  }
  const { data } = await refreshClient.post('/auth/refresh', { refreshToken });
  localStorage.setItem('jwt_token', data.accessToken);
  localStorage.setItem('refresh_token', data.refreshToken);
  return data.accessToken;
}

function expireSession() {
  SESSION_KEYS.forEach(key => localStorage.removeItem(key));
  window.location.href = '/onboarding/welcome';
}

/**
 * Intercepteur de réponse : sur un 401 (jeton d'accès expiré), la session est rafraîchie une seule fois,
 * même si plusieurs requêtes échouent en même temps, puis chaque requête est rejouée. La saisie en cours
 * n'est donc pas perdue. Ce n'est qu'en cas d'échec du rafraîchissement que la session est fermée.
 */
export function createResponseInterceptor(client, { refresh = refreshSession, onSessionExpired = expireSession } = {}) {
  let pendingRefresh = null;

  return {
    onFulfilled: (response) => response,
    onRejected: async (error) => {
      const config = error.config || {};
      const url = config.url || '';
      const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => url.includes(endpoint));

      if (error.response?.status !== 401 || isAuthEndpoint) {
        return Promise.reject(error);
      }

      if (config._retried) {
        onSessionExpired();
        return Promise.reject(error);
      }

      try {
        if (!pendingRefresh) {
          pendingRefresh = refresh().finally(() => {
            pendingRefresh = null;
          });
        }
        const newToken = await pendingRefresh;
        config._retried = true;
        config.headers = { ...(config.headers || {}), Authorization: `Bearer ${newToken}` };
        return client(config);
      } catch (refreshError) {
        onSessionExpired();
        return Promise.reject(error);
      }
    }
  };
}

for (const client of [apiClient, apiClientLong]) {
  client.interceptors.request.use(createRequestInterceptor());
  const responseInterceptor = createResponseInterceptor(client);
  client.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);
}
