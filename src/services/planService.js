import apiClient from './apiClient';
import API_ROUTES from '../config/apiRoutes';

/**
 * Plan Service
 * Handles all subscription plan-related API operations
 */

class PlanService {
  /**
   * Get plan catalog (available plans from admin)
   */
  async getPlanCatalog() {
    try {
      // Fetch from admin plans public endpoint
      const response = await apiClient.get(API_ROUTES.plans.catalog);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get plan catalog error:', error);
      // Return empty array on error - let the UI fallback to default plans
      return {
        success: false,
        data: [],
        error: error.response?.data?.error || 'Failed to fetch plan catalog',
      };
    }
  }

  /**
   * Get all plans (alias for getPlanCatalog)
   */
  async getPlans() {
    return this.getPlanCatalog();
  }

  /**
   * Get current user plan
   */
  async getCurrentPlan() {
    try {
      const response = await apiClient.get(API_ROUTES.plans.current);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get current plan error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch current plan',
      };
    }
  }

  /**
   * Subscribe to a plan
   */
  async subscribe(planId, paymentMethod = 'card') {
    try {
      const response = await apiClient.post(API_ROUTES.plans.subscribe, {
        planId,
        paymentMethod,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Successfully subscribed to plan',
      };
    } catch (error) {
      console.error('Subscribe to plan error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to subscribe to plan',
      };
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription() {
    try {
      const response = await apiClient.post(API_ROUTES.plans.cancel);
      return {
        success: true,
        message: response.data.message || 'Subscription cancelled successfully',
      };
    } catch (error) {
      console.error('Cancel subscription error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to cancel subscription',
      };
    }
  }

  /**
   * Upgrade plan
   */
  async upgradePlan(planId) {
    try {
      const response = await apiClient.post(API_ROUTES.plans.upgrade, { planId });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Plan upgraded successfully',
      };
    } catch (error) {
      console.error('Upgrade plan error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to upgrade plan',
      };
    }
  }

  /**
   * Get subscription history
   */
  async getHistory(params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.plans.history, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get plan history error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch plan history',
      };
    }
  }

  /**
   * Get plan by ID
   */
  async getPlanById(id) {
    try {
      const response = await apiClient.get(API_ROUTES.plans.byId(id));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get plan error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch plan',
      };
    }
  }
}

export const planService = new PlanService();
export default planService;
