import apiClient from './apiClient';
import API_ROUTES from '../config/apiRoutes';

/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */

class DashboardService {
  /**
   * Get platform statistics (public)
   */
  async getPlatformStats() {
    try {
      const response = await apiClient.get(API_ROUTES.dashboard.platform);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Get platform stats error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch platform statistics',
      };
    }
  }

  /**
   * Get user dashboard data
   */
  async getUserDashboard() {
    try {
      const response = await apiClient.get(API_ROUTES.dashboard.user);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Get user dashboard error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch user dashboard',
      };
    }
  }

  /**
   * Get admin dashboard data
   */
  async getAdminDashboard() {
    try {
      const response = await apiClient.get(API_ROUTES.dashboard.admin);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Get admin dashboard error:', error);
      const errorMessage = error.response?.status === 403 
        ? 'Access denied. Admin privileges required.' 
        : error.response?.data?.error || error.response?.data?.message || 'Failed to fetch admin dashboard';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
