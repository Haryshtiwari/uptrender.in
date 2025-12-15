import apiClient from '../../../services/apiClient';

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { token, refreshToken, user } = response.data;

      // Store tokens
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);

      const { token, refreshToken, user } = response.data;

      // Store tokens
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post('/auth/refresh-token', {
        refreshToken,
      });

      const { token } = response.data;

      // Update access token
      localStorage.setItem('authToken', token);

      return {
        success: true,
        token,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Token refresh failed',
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless of API call success
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      // backend returns { success: true, data: profileData }
      return {
        success: true,
        user: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get profile',
      };
    }
  },
};