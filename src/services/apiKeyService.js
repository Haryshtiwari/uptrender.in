import apiClient from './apiClient';
import API_ROUTES from '../config/apiRoutes';

/**
 * API Key Service
 * Handles all API key management operations
 */

class ApiKeyService {
  /**
   * Get all API keys for current user
   */
  async getApiKeys(params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.apiKeys.list, { params });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get API keys error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch API keys',
      };
    }
  }

  /**
   * Get API key by ID
   */
  async getApiKeyById(id) {
    try {
      const response = await apiClient.get(API_ROUTES.apiKeys.byId(id));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get API key error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch API key',
      };
    }
  }

  /**
   * Create new API key
   */
  async createApiKey(keyData) {
    try {
      const response = await apiClient.post(API_ROUTES.apiKeys.create, keyData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'API key created successfully',
      };
    } catch (error) {
      console.error('Create API key error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create API key',
      };
    }
  }

  /**
   * Update API key
   */
  async updateApiKey(id, keyData) {
    try {
      const response = await apiClient.put(API_ROUTES.apiKeys.update(id), keyData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'API key updated successfully',
      };
    } catch (error) {
      console.error('Update API key error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update API key',
      };
    }
  }

  /**
   * Delete API key
   */
  async deleteApiKey(id) {
    try {
      const response = await apiClient.delete(API_ROUTES.apiKeys.delete(id));
      return {
        success: true,
        message: response.data.message || 'API key deleted successfully',
      };
    } catch (error) {
      console.error('Delete API key error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete API key',
      };
    }
  }

  /**
   * Validate API key
   */
  async validateApiKey(apiKey) {
    try {
      const response = await apiClient.post(API_ROUTES.apiKeys.validate, { apiKey });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'API key is valid',
      };
    } catch (error) {
      console.error('Validate API key error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Invalid API key',
      };
    }
  }

  /**
   * Rotate API key
   */
  async rotateApiKey(id) {
    try {
      const response = await apiClient.post(API_ROUTES.apiKeys.rotate(id));
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'API key rotated successfully',
      };
    } catch (error) {
      console.error('Rotate API key error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to rotate API key',
      };
    }
  }
}

export const apiKeyService = new ApiKeyService();
export default apiKeyService;
