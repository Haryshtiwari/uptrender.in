import apiClient from './apiClient';
import API_ROUTES from '../config/apiRoutes';

/**
 * Admin Plan Service
 * Handles all admin plan management API operations
 */

class AdminPlanService {
  /**
   * Get all plans (admin view)
   */
  async getPlans() {
    try {
      const response = await apiClient.get(API_ROUTES.admin.plans.list);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get admin plans error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch plans',
      };
    }
  }

  /**
   * Create a new plan
   */
  async createPlan(planData) {
    try {
      const response = await apiClient.post(API_ROUTES.admin.plans.create, planData);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Create plan error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create plan',
      };
    }
  }

  /**
   * Update an existing plan
   */
  async updatePlan(planId, planData) {
    try {
      const response = await apiClient.put(API_ROUTES.admin.plans.update(planId), planData);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Update plan error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update plan',
      };
    }
  }

  /**
   * Delete a plan
   */
  async deletePlan(planId) {
    try {
      const response = await apiClient.delete(API_ROUTES.admin.plans.delete(planId));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Delete plan error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete plan',
      };
    }
  }

  /**
   * Get plan by ID
   */
  async getPlanById(planId) {
    try {
      const response = await apiClient.get(API_ROUTES.admin.plans.byId(planId));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get plan by ID error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch plan details',
      };
    }
  }

  /**
   * Toggle plan status (active/inactive)
   */
  async togglePlanStatus(planId) {
    try {
      const response = await apiClient.patch(API_ROUTES.admin.plans.toggleStatus(planId));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Toggle plan status error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to toggle plan status',
      };
    }
  }

  /**
   * Get plan statistics
   */
  async getPlanStats() {
    try {
      const response = await apiClient.get(API_ROUTES.admin.plans.stats);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get plan stats error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch plan statistics',
      };
    }
  }

  /**
   * Bulk update plans
   */
  async bulkUpdatePlans(planUpdates) {
    try {
      const response = await apiClient.patch(API_ROUTES.admin.plans.base + '/bulk-update', {
        plans: planUpdates
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Bulk update plans error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to bulk update plans',
      };
    }
  }

  /**
   * Get plan subscribers
   */
  async getPlanSubscribers(planId, params = {}) {
    try {
      const response = await apiClient.get(
        API_ROUTES.admin.plans.byId(planId) + '/subscribers', 
        { params }
      );
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get plan subscribers error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch plan subscribers',
      };
    }
  }
}

// Export singleton instance
const adminPlanService = new AdminPlanService();
export default adminPlanService;