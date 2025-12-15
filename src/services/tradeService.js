import apiClient from './apiClient';
import API_ROUTES from '../config/apiRoutes';

/**
 * Trade Service
 * Handles all trade-related API operations
 */

class TradeService {
  /**
   * Get all trades with optional filters
   */
  async getTrades(params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.trades.list, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get trades error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch trades',
      };
    }
  }

  /**
   * Get trade by ID
   */
  async getTradeById(id) {
    try {
      const response = await apiClient.get(API_ROUTES.trades.byId(id));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get trade error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch trade',
      };
    }
  }

  /**
   * Create new trade
   */
  async createTrade(tradeData) {
    try {
      const response = await apiClient.post(API_ROUTES.trades.create, tradeData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Trade created successfully',
      };
    } catch (error) {
      console.error('Create trade error:', error);
      // apiClient normalizes errors and returns { message, status, data, requestId }
      const details = error.data || error.response?.data || null;
      const message = details?.error || error.message || 'Failed to create trade';
      return {
        success: false,
        error: message,
        details,
      };
    }
  }

  /**
   * Update trade
   */
  async updateTrade(id, tradeData) {
    try {
      const response = await apiClient.put(API_ROUTES.trades.update(id), tradeData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Trade updated successfully',
      };
    } catch (error) {
      console.error('Update trade error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update trade',
      };
    }
  }

  /**
   * Delete trade
   */
  async deleteTrade(id) {
    try {
      const response = await apiClient.delete(API_ROUTES.trades.delete(id));
      return {
        success: true,
        message: response.data.message || 'Trade deleted successfully',
      };
    } catch (error) {
      console.error('Delete trade error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete trade',
      };
    }
  }

  /**
   * Get trade statistics
   */
  async getTradeStats() {
    try {
      const response = await apiClient.get(API_ROUTES.trades.stats);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get trade stats error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch trade statistics',
      };
    }
  }

  /**
   * Get recent trades
   */
  async getRecentTrades(limit = 10) {
    try {
      const response = await apiClient.get(API_ROUTES.trades.recent, {
        params: { limit },
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get recent trades error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch recent trades',
      };
    }
  }

  /**
   * Get trades by strategy
   */
  async getTradesByStrategy(strategyId, params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.trades.byStrategy(strategyId), {
        params,
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get trades by strategy error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch strategy trades',
      };
    }
  }

  /**
   * Export trades data
   */
  async exportTrades(format = 'csv', params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.trades.export, {
        params: { format, ...params },
        responseType: 'blob',
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Export trades error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to export trades',
      };
    }
  }
}

export const tradeService = new TradeService();
export default tradeService;
