import apiClient from './apiClient';
import API_ROUTES from '../config/apiRoutes';

/**
 * Strategy Service
 * Handles all strategy-related API operations
 */

class StrategyService {
  /**
   * Get all strategies with optional filters
   */
  async getStrategies(params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.strategies.list, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get strategies error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch strategies',
      };
    }
  }

  /**
   * Generate strategy code from rules
   */
  async generateStrategyCode(rules, config) {
    try {
      const response = await apiClient.post(API_ROUTES.strategies.generateCode, { rules, config });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Code generated successfully',
      };
    } catch (error) {
      console.error('Generate code error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to generate code',
      };
    }
  }

  /**
   * Create new strategy
   */
  async createStrategy(strategyData) {
    try {
      const response = await apiClient.post(API_ROUTES.strategies.create, strategyData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Strategy created successfully',
      };
    } catch (error) {
      console.error('Create strategy error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create strategy',
      };
    }
  }

  /**
   * Update strategy
   */
  async updateStrategy(id, strategyData) {
    try {
      const response = await apiClient.put(API_ROUTES.strategies.update(id), strategyData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Strategy updated successfully',
      };
    } catch (error) {
      console.error('Update strategy error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update strategy',
      };
    }
  }

  /**
   * Delete strategy
   */
  async deleteStrategy(id) {
    try {
      const response = await apiClient.delete(API_ROUTES.strategies.delete(id));
      return {
        success: true,
        message: response.data.message || 'Strategy deleted successfully',
      };
    } catch (error) {
      console.error('Delete strategy error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete strategy',
      };
    }
  }

  /**
   * Activate strategy
   */
  async activateStrategy(id) {
    try {
      const response = await apiClient.post(API_ROUTES.strategies.activate(id));
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Strategy activated successfully',
      };
    } catch (error) {
      console.error('Activate strategy error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to activate strategy',
      };
    }
  }

  /**
   * Deactivate strategy
   */
  async deactivateStrategy(id) {
    try {
      const response = await apiClient.post(API_ROUTES.strategies.deactivate(id));
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Strategy deactivated successfully',
      };
    } catch (error) {
      console.error('Deactivate strategy error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to deactivate strategy',
      };
    }
  }

  /**
   * Start strategy execution
   */
  async startStrategy(id) {
    try {
      const response = await apiClient.post(API_ROUTES.strategies.start(id));
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Strategy started successfully',
      };
    } catch (error) {
      console.error('Start strategy error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to start strategy',
      };
    }
  }

  /**
   * Stop strategy execution
   */
  async stopStrategy(id) {
    try {
      const response = await apiClient.post(API_ROUTES.strategies.stop(id));
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Strategy stopped successfully',
      };
    } catch (error) {
      console.error('Stop strategy error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to stop strategy',
      };
    }
  }

  /**
   * Get strategy statistics
   */
  async getStrategyStats(id) {
    try {
      const response = await apiClient.get(API_ROUTES.strategies.stats(id));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get strategy stats error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch strategy statistics',
      };
    }
  }

  /**
   * Get public strategies
   */
  async getPublicStrategies(params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.strategies.public, { params });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get public strategies error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch public strategies',
      };
    }
  }

  /**
   * Clone strategy
   */
  async cloneStrategy(id, newName) {
    try {
      const response = await apiClient.post(API_ROUTES.strategies.clone(id), { name: newName });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Strategy cloned successfully',
      };
    } catch (error) {
      console.error('Clone strategy error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to clone strategy',
      };
    }
  }
}

export const strategyService = new StrategyService();
export default strategyService;
