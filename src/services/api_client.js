import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  const exploitationId = localStorage.getItem('active_exploitation_id');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (exploitationId) {
    config.headers['X-Exploitation-ID'] = exploitationId;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config.url;
      // Do not redirect if the error is from a login endpoint
      if (!url.includes('/auth/pin/verify') && !url.includes('/auth/otp/verify')) {
        // Session expired or invalid token
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('active_exploitation_id');
        localStorage.removeItem('active_role');
        window.location.href = '/onboarding/welcome';
      }
    }
    return Promise.reject(error);
  }
);