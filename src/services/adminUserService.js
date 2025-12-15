import apiClient from './apiClient';

/**
 * Admin User Service
 * Handles all admin-specific user management API operations
 */

class AdminUserService {
  /**
   * Get all users with pagination, search, and filters
   */
  async getAllUsers(params = {}) {
    try {
      console.log('[adminUserService] Fetching users with params:', params);
      const response = await apiClient.get('/admin/users', { params });
      console.log('[adminUserService] Users fetched successfully:', response.data);
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error('[adminUserService] Get all users error:', error);
      console.error('[adminUserService] Error details:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url
      });
      
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch users'
      };
    }
  }

  /**
   * Get user by ID with detailed information
   */
  async getUserById(id) {
    try {
      const response = await apiClient.get(`/admin/users/${id}`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Get user by ID error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch user details'
      };
    }
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    try {
      const response = await apiClient.post('/admin/users', userData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'User created successfully'
      };
    } catch (error) {
      console.error('Create user error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create user'
      };
    }
  }

  /**
   * Update user
   */
  async updateUser(id, userData) {
    try {
      const response = await apiClient.put(`/admin/users/${id}`, userData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'User updated successfully'
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update user'
      };
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    try {
      const response = await apiClient.delete(`/admin/users/${id}`);
      return {
        success: true,
        message: response.data.message || 'User deleted successfully'
      };
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete user'
      };
    }
  }

  /**
   * Toggle user status (activate/deactivate)
   */
  async toggleUserStatus(id) {
    try {
      const response = await apiClient.put(`/admin/users/${id}/toggle-status`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'User status updated successfully'
      };
    } catch (error) {
      console.error('Toggle user status error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update user status'
      };
    }
  }

  /**
   * Reset user password
   */
  async resetUserPassword(id, newPassword = null) {
    try {
      const response = await apiClient.post(`/admin/users/${id}/reset-password`, 
        newPassword ? { newPassword } : {}
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Password reset successfully'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to reset password'
      };
    }
  }

  /**
   * Get user activity logs
   */
  async getUserActivity(id, params = {}) {
    try {
      const response = await apiClient.get(`/admin/users/${id}/activity`, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.data?.pagination
      };
    } catch (error) {
      console.error('Get user activity error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch user activity'
      };
    }
  }

  /**
   * Get recent platform activity logs
   */
  async getRecentActivity(params = {}) {
    try {
      const response = await apiClient.get('/admin/users/activity/recent', { params });
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Get recent activity error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch recent activity'
      };
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    try {
      const response = await apiClient.get('/admin/users/stats');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch user statistics'
      };
    }
  }
}

export default new AdminUserService();
