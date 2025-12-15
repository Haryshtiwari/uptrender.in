import apiClient from './apiClient';
import API_ROUTES from '../config/apiRoutes';

/**
 * User Service
 * Handles all user management API operations
 */

class UserService {
  /**
   * Get all users (admin only)
   */
  async getUsers(params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.users.list, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get users error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch users',
      };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    try {
      const response = await apiClient.get(API_ROUTES.users.byId(id));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch user',
      };
    }
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    try {
      const response = await apiClient.get(API_ROUTES.users.profile);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch profile',
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put(API_ROUTES.users.updateProfile, profileData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Profile updated successfully',
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update profile',
      };
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.put(API_ROUTES.users.changePassword, {
        currentPassword,
        newPassword,
      });
      return {
        success: true,
        message: response.data.message || 'Password changed successfully',
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to change password',
      };
    }
  }

  /**
   * Create new user (admin only)
   */
  async createUser(userData) {
    try {
      const response = await apiClient.post(API_ROUTES.users.create, userData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'User created successfully',
      };
    } catch (error) {
      console.error('Create user error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create user',
      };
    }
  }

  /**
   * Update user (admin only)
   */
  async updateUser(id, userData) {
    try {
      const response = await apiClient.put(API_ROUTES.users.update(id), userData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'User updated successfully',
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update user',
      };
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(id) {
    try {
      const response = await apiClient.delete(API_ROUTES.users.delete(id));
      return {
        success: true,
        message: response.data.message || 'User deleted successfully',
      };
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete user',
      };
    }
  }

  /**
   * Get user statistics (admin only)
   */
  async getUserStats() {
    try {
      const response = await apiClient.get(API_ROUTES.users.stats);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch user statistics',
      };
    }
  }
}

export const userService = new UserService();
export default userService;
