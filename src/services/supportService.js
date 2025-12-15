import apiClient from './apiClient';
import API_ROUTES from '../config/apiRoutes';

/**
 * Support Service
 * Handles all support ticket-related API operations
 */

class SupportService {
  /**
   * Get all support tickets
   */
  async getTickets(params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.support.list, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get support tickets error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch support tickets',
      };
    }
  }

  /**
   * Get ticket by ID
   */
  async getTicketById(id) {
    try {
      const response = await apiClient.get(API_ROUTES.support.byId(id));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get support ticket error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch support ticket',
      };
    }
  }

  /**
   * Create new support ticket
   */
  async createTicket(ticketData) {
    try {
      const response = await apiClient.post(API_ROUTES.support.create, ticketData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Support ticket created successfully',
      };
    } catch (error) {
      console.error('Create support ticket error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create support ticket',
        details: error.response?.data?.details || [],
      };
    }
  }

  /**
   * Update support ticket
   */
  async updateTicket(id, ticketData) {
    try {
      const response = await apiClient.put(API_ROUTES.support.update(id), ticketData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Support ticket updated successfully',
      };
    } catch (error) {
      console.error('Update support ticket error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update support ticket',
      };
    }
  }

  /**
   * Close support ticket
   */
  async closeTicket(id) {
    try {
      const response = await apiClient.post(API_ROUTES.support.close(id));
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Support ticket closed successfully',
      };
    } catch (error) {
      console.error('Close support ticket error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to close support ticket',
      };
    }
  }

  /**
   * Reply to support ticket
   */
  async replyToTicket(id, message, attachments = []) {
    try {
      const response = await apiClient.post(API_ROUTES.support.reply(id), {
        message,
        attachments,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Reply sent successfully',
      };
    } catch (error) {
      console.error('Reply to support ticket error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send reply',
      };
    }
  }

  /**
   * Get support statistics
   */
  async getSupportStats() {
    try {
      const response = await apiClient.get(API_ROUTES.support.stats);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get support stats error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch support statistics',
      };
    }
  }
}

export const supportService = new SupportService();
export default supportService;
