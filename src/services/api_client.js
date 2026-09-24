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