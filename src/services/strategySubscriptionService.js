import apiClient from './apiClient';
import API_ROUTES from '../config/apiRoutes';

/**
 * Strategy Subscription Service
 * Handles all strategy subscription-related API operations
 */

class StrategySubscriptionService {
  /**
   * Subscribe to a strategy
   */
  async subscribeToStrategy(strategyId, lots = 1) {
    try {
      const response = await apiClient.post(API_ROUTES.subscriptions.subscribe, {
        strategyId,
        lots
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Successfully subscribed to strategy',
      };
    } catch (error) {
      console.error('Subscribe to strategy error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to subscribe to strategy',
      };
    }
  }

  /**
   * Unsubscribe from a strategy
   */
  async unsubscribeFromStrategy(subscriptionId) {
    try {
      const response = await apiClient.delete(API_ROUTES.subscriptions.byId(subscriptionId));
      return {
        success: true,
        message: response.data.message || 'Successfully unsubscribed from strategy',
      };
    } catch (error) {
      console.error('Unsubscribe from strategy error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to unsubscribe from strategy',
      };
    }
  }

  /**
   * Update subscription (only lots)
   */
  async updateSubscription(subscriptionId, payload) {
    try {
      const response = await apiClient.put(API_ROUTES.subscriptions.byId(subscriptionId), payload);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Subscription updated successfully',
      };
    } catch (error) {
      console.error('Update subscription error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update subscription',
      };
    }
  }

  /**
   * Get user's subscriptions
   */
  async getUserSubscriptions(params = {}) {
    // Set default pagination parameters
    const defaultParams = {
      page: 1,
      limit: 12,
      ...params
    };

    try {
      const response = await apiClient.get(API_ROUTES.subscriptions.list, { params: defaultParams });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get user subscriptions error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch subscriptions',
      };
    }
  }

  /**
   * Get subscription by ID
   */
  async getSubscriptionById(subscriptionId) {
    try {
      const response = await apiClient.get(API_ROUTES.subscriptions.byId(subscriptionId));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get subscription error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch subscription',
      };
    }
  }

  /**
   * Get all subscribed strategies for the current user
   */
  async getSubscribedStrategies() {
    try {
      const response = await apiClient.get(API_ROUTES.subscriptions.list, { 
        params: { limit: 100 } // Backend validation allows max 100
      });
      return {
        success: true,
        data: response.data.data || response.data || [],
      };
    } catch (error) {
      console.error('Get subscribed strategies error:', error);
      return {
        success: false,
        data: [],
        error: error.response?.data?.error || 'Failed to fetch subscribed strategies',
      };
    }
  }
}

export default new StrategySubscriptionService();