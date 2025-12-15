import apiClient from './apiClient';
import { apiRoutes } from '../config/apiRoutes';

export const adminTradeService = {
  // Get all trades with filters
  async getAllTrades(params = {}) {
    try {
      const response = await apiClient.get(apiRoutes.admin.trades.base, { params });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get all trades error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch trades'
      };
    }
  },

  // Get trade by ID
  async getTradeById(id) {
    try {
      const response = await apiClient.get(apiRoutes.admin.trades.byId(id));
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get trade by ID error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch trade'
      };
    }
  },

  // Update trade
  async updateTrade(id, data) {
    try {
      const response = await apiClient.put(apiRoutes.admin.trades.update(id), data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Update trade error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update trade'
      };
    }
  },

  // Delete trade
  async deleteTrade(id) {
    try {
      const response = await apiClient.delete(apiRoutes.admin.trades.delete(id));
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Delete trade error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete trade'
      };
    }
  },

  // Get trade statistics
  async getTradeStats() {
    try {
      const response = await apiClient.get(apiRoutes.admin.trades.stats);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get trade stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch trade statistics'
      };
    }
  }
};
