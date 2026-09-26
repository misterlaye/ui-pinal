import { apiClient } from './api_client.js';

/**
 * Demande l'envoi d'un code OTP au numéro de téléphone.
 */
export async function requestOtp(telephone) {
  const { data } = await apiClient.post('/auth/otp/request', { telephone });
  return data;
}

/**
 * Vérifie le code OTP et récupère les tokens JWT.
 * Stocke automatiquement les tokens dans localStorage.
 */
export async function verifyOtp(telephone, code) {
  const { data } = await apiClient.post('/auth/otp/verify', { telephone, code });

  if (data.accessToken) {
    localStorage.setItem('jwt_token', data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem('refresh_token', data.refreshToken);
  }
  if (data.userId) {
    localStorage.setItem('user_id', data.userId);
  }

  return data;
}

/**
 * Vérifie le code PIN (Ouvrier/Gérant) et récupère les tokens JWT.
 */
export async function verifyPin(telephone, code) {
  const { data } = await apiClient.post('/auth/pin/verify', { telephone, code });

  if (data.accessToken) {
    localStorage.setItem('jwt_token', data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem('refresh_token', data.refreshToken);
  }
  if (data.userId) {
    localStorage.setItem('user_id', data.userId);
  }

  return data;
}

/**
 * Enregistre ou met à jour le profil utilisateur.
 */
export async function registerUser({ telephone, nom, prenom, email }) {
  const { data } = await apiClient.post('/identity/users/me', {
    telephone,
    nom,
    prenom,
    email: email || null,
  });
  return data;
}

/**
 * Récupère l'utilisateur courant.
 */
export async function getCurrentUser() {
  const { data } = await apiClient.get('/identity/users/me');
  return data;
}

/**
 * Rafraîchit les tokens.
 */
export async function refreshToken(refreshTokenValue) {
  const { data } = await apiClient.post('/auth/refresh', {
    refreshToken: refreshTokenValue,
  });

  if (data.accessToken) {
    localStorage.setItem('jwt_token', data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem('refresh_token', data.refreshToken);
  }

  return data;
}
