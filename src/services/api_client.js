import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000, // Increased from 10s to 30s
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create a separate client for long-running operations (dashboard, complex aggregations)
export const apiClientLong = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 60000, // 60s for heavy operations
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - applies to both clients
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

// Response interceptor - applies to both clients
function createResponseInterceptor() {
  return {
    onFulfilled: (response) => response,
    onRejected: (error) => {
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
  };
}

// Apply interceptors to both clients
apiClient.interceptors.request.use(createRequestInterceptor());
const responseInterceptor = createResponseInterceptor();
apiClient.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);

apiClientLong.interceptors.request.use(createRequestInterceptor());
apiClientLong.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);