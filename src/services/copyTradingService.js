import apiClient from './apiClient';
import API_ROUTES from '../config/apiRoutes';

/**
 * Copy Trading Service
 * Handles all copy trading related API operations
 */

class CopyTradingService {
  /**
   * Get all copy trading accounts
   */
  async getAccounts(params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.copyTrading.list, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get copy trading accounts error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch copy trading accounts',
      };
    }
  }

  /**
   * Get a specific copy trading account by ID
   */
  async getAccount(accountId) {
    try {
      const response = await apiClient.get(API_ROUTES.copyTrading.detail.replace(':id', accountId));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get copy trading account error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch copy trading account',
      };
    }
  }

  /**
   * Create a new copy trading account
   */
  async createAccount(accountData) {
    try {
      const response = await apiClient.post(API_ROUTES.copyTrading.create, accountData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Copy trading account created successfully',
      };
    } catch (error) {
      console.error('Create copy trading account error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create copy trading account',
      };
    }
  }

  /**
   * Update an existing copy trading account
   */
  async updateAccount(accountId, accountData) {
    try {
      const response = await apiClient.put(
        API_ROUTES.copyTrading.update.replace(':id', accountId),
        accountData
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Copy trading account updated successfully',
      };
    } catch (error) {
      console.error('Update copy trading account error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update copy trading account',
      };
    }
  }

  /**
   * Delete a copy trading account
   */
  async deleteAccount(accountId) {
    try {
      const response = await apiClient.delete(
        API_ROUTES.copyTrading.delete.replace(':id', accountId)
      );
      return {
        success: true,
        message: response.data.message || 'Copy trading account deleted successfully',
      };
    } catch (error) {
      console.error('Delete copy trading account error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete copy trading account',
      };
    }
  }

  /**
   * Toggle account status (active/inactive)
   */
  async toggleAccountStatus(accountId, isActive) {
    try {
      const response = await apiClient.patch(
        API_ROUTES.copyTrading.toggleStatus.replace(':id', accountId),
        { isActive }
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Account status updated successfully',
      };
    } catch (error) {
      console.error('Toggle account status error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update account status',
      };
    }
  }

  /**
   * Link a child account to a master account
   */
  async linkAccounts(masterAccountId, childAccountId) {
    try {
      const response = await apiClient.post(API_ROUTES.copyTrading.linkAccounts, {
        masterAccountId,
        childAccountId,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Accounts linked successfully',
      };
    } catch (error) {
      console.error('Link accounts error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to link accounts',
      };
    }
  }

  /**
   * Unlink a child account from a master account
   */
  async unlinkAccounts(masterAccountId, childAccountId) {
    try {
      const response = await apiClient.post(API_ROUTES.copyTrading.unlinkAccounts, {
        masterAccountId,
        childAccountId,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Accounts unlinked successfully',
      };
    } catch (error) {
      console.error('Unlink accounts error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to unlink accounts',
      };
    }
  }

  /**
   * Test API connection for an account
   */
  async testConnection(accountData) {
    try {
      const response = await apiClient.post(API_ROUTES.copyTrading.testConnection, accountData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Connection test successful',
      };
    } catch (error) {
      console.error('Test connection error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Connection test failed',
      };
    }
  }

  /**
   * Get copy trading statistics
   */
  async getStatistics(params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.copyTrading.statistics, { params });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get copy trading statistics error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch copy trading statistics',
      };
    }
  }

  /**
   * Get copy trading logs
   */
  async getLogs(params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.copyTrading.logs, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get copy trading logs error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch copy trading logs',
      };
    }
  }
}

// Export singleton instance
export const copyTradingService = new CopyTradingService();
export default copyTradingService;