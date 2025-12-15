import apiClient from './apiClient';
import { apiRoutes } from '../config/apiRoutes';

export const adminStrategyService = {
  // Get all strategies with filters
  async getAllStrategies(params = {}) {
    try {
      const response = await apiClient.get(apiRoutes.admin.strategies.base, { params });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get all strategies error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch strategies'
      };
    }
  },

  // Get strategy by ID
  async getStrategyById(id) {
    try {
      const response = await apiClient.get(apiRoutes.admin.strategies.byId(id));
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get strategy by ID error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch strategy'
      };
    }
  },

  // Update strategy
  async updateStrategy(id, data) {
    try {
      const response = await apiClient.put(apiRoutes.admin.strategies.update(id), data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Update strategy error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update strategy'
      };
    }
  },

  // Delete strategy
  async deleteStrategy(id) {
    try {
      const response = await apiClient.delete(apiRoutes.admin.strategies.delete(id));
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Delete strategy error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete strategy'
      };
    }
  },

  // Toggle strategy status (isActive, isPublic, isRunning)
  async toggleStrategyStatus(id, field) {
    try {
      const response = await apiClient.post(apiRoutes.admin.strategies.toggleStatus(id), { field });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Toggle strategy status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to toggle strategy status'
      };
    }
  },

  // Get strategy statistics
  async getStrategyStats() {
    try {
      const response = await apiClient.get(apiRoutes.admin.strategies.stats);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get strategy stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch strategy statistics'
      };
    }
  }
};
