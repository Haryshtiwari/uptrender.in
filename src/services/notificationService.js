import apiClient from './apiClient';
import API_ROUTES from '../config/apiRoutes';

/**
 * Notification Service
 * Handles all notification-related API operations
 */

class NotificationService {
  /**
   * Get all notifications
   */
  async getNotifications(params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.notifications.list, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get notifications error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch notifications',
      };
    }
  }

  /**
   * Get unread notifications
   */
  async getUnreadNotifications() {
    try {
      const response = await apiClient.get(API_ROUTES.notifications.unread);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get unread notifications error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch unread notifications',
      };
    }
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(id) {
    try {
      const response = await apiClient.get(API_ROUTES.notifications.byId(id));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get notification error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch notification',
      };
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id) {
    try {
      const response = await apiClient.put(API_ROUTES.notifications.markRead(id));
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Notification marked as read',
      };
    } catch (error) {
      console.error('Mark as read error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to mark notification as read',
      };
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      const response = await apiClient.put(API_ROUTES.notifications.markAllRead);
      return {
        success: true,
        message: response.data.message || 'All notifications marked as read',
      };
    } catch (error) {
      console.error('Mark all as read error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to mark all notifications as read',
      };
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(id) {
    try {
      const response = await apiClient.delete(API_ROUTES.notifications.delete(id));
      return {
        success: true,
        message: response.data.message || 'Notification deleted successfully',
      };
    } catch (error) {
      console.error('Delete notification error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete notification',
      };
    }
  }

  /**
   * Get notification preferences
   */
  async getPreferences() {
    try {
      const response = await apiClient.get(API_ROUTES.notifications.preferences);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get notification preferences error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch notification preferences',
      };
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences) {
    try {
      const response = await apiClient.put(API_ROUTES.notifications.preferences, preferences);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Preferences updated successfully',
      };
    } catch (error) {
      console.error('Update notification preferences error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update notification preferences',
      };
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
