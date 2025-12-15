import apiClient from './apiClient';
import { API_ROUTES } from '../config/apiRoutes';

const adminApiKeyService = {
  // Get all API keys with pagination and filters
  getAllApiKeys: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ROUTES.admin.apiKeys.base, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  // Get API key by ID
  getApiKeyById: async (id) => {
    try {
      const response = await apiClient.get(API_ROUTES.admin.apiKeys.byId(id));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  // Update API key
  updateApiKey: async (id, data) => {
    try {
      const response = await apiClient.put(API_ROUTES.admin.apiKeys.update(id), data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  // Delete API key
  deleteApiKey: async (id) => {
    try {
      const response = await apiClient.delete(API_ROUTES.admin.apiKeys.delete(id));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  // Toggle API key status
  toggleApiKeyStatus: async (id, field) => {
    try {
      const response = await apiClient.post(API_ROUTES.admin.apiKeys.toggleStatus(id), { field });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  // Get API key statistics
  getApiKeyStats: async () => {
    try {
      const response = await apiClient.get(API_ROUTES.admin.apiKeys.stats);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }
};

export default adminApiKeyService;
