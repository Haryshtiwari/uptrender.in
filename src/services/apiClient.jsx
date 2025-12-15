import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Generate unique request ID
const generateRequestId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Request interceptor to add auth token and request ID
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[apiClient] Token added to request:', { 
        url: config.url, 
        hasToken: !!token,
        tokenPreview: token.substring(0, 20) + '...'
      });
    } else {
      console.warn('[apiClient] No token found in localStorage for request:', config.url);
    }

    // Add request ID for tracing
    config.headers['X-Request-ID'] = generateRequestId();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors with retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await apiClient.post('/auth/refresh-token', {
            refreshToken,
          });

          if (response.data.success) {
            const newToken = response.data.token;
            localStorage.setItem('authToken', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, logout
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }

      // No refresh token, logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/auth/login';
    }

    // Handle network errors with retry (max 2 retries)
    if (!error.response && !originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    if (!error.response && originalRequest._retryCount < 2) {
      originalRequest._retryCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
      return apiClient(originalRequest);
    }

    // Normalize error format for consistent handling
    const normalizedError = {
      message: error.response?.data?.error || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
      requestId: error.config?.headers?.['X-Request-ID'],
      isNetworkError: !error.response,
    };

    return Promise.reject(normalizedError);
  }
);

export default apiClient;