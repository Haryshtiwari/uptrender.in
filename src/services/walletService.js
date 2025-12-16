import apiClient from './apiClient';
import API_ROUTES from '../config/apiRoutes';

/**
 * Wallet Service
 * Handles all wallet and transaction-related API operations
 */

class WalletService {
  /**
   * Get wallet balance
   */
  async getBalance() {
    try {
      const response = await apiClient.get(API_ROUTES.wallet.balance);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get wallet balance error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch wallet balance',
      };
    }
  }

  /**
   * Get wallet transactions
   */
  async getTransactions(params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.wallet.transactions, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get wallet transactions error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch transactions',
      };
    }
  }

  /**
   * Deposit funds
   */
  async deposit(amount, paymentMethod) {
    try {
      const response = await apiClient.post(API_ROUTES.wallet.deposit, {
        amount,
        paymentMethod,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Deposit initiated successfully',
      };
    } catch (error) {
      console.error('Deposit error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to process deposit',
      };
    }
  }

  /**
   * Withdraw funds
   */
  async withdraw(amount, withdrawalMethod, details = {}) {
    try {
      const response = await apiClient.post(API_ROUTES.wallet.withdraw, {
        amount,
        withdrawalMethod,
        ...details,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Withdrawal initiated successfully',
      };
    } catch (error) {
      console.error('Withdrawal error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to process withdrawal',
      };
    }
  }

  /**
   * Get transaction history
   */
  async getHistory(params = {}) {
    try {
      const response = await apiClient.get(API_ROUTES.wallet.history, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get wallet history error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch wallet history',
      };
    }
  }

  /**
   * Get wallet info (balance + recent transactions)
   */
  async getWalletInfo() {
    try {
      const response = await apiClient.get(API_ROUTES.wallet.base);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Get wallet info error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch wallet information',
      };
    }
  }

  /**
   * Admin transfer funds to user
   */
  async adminTransferFunds(userId, amount, description = '') {
    try {
      const response = await apiClient.post(`/wallet/admin/${userId}/transfer`, {
        amount: parseFloat(amount),
        description
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Transfer completed successfully'
      };
    } catch (error) {
      console.error('Admin transfer funds error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to transfer funds',
      };
    }
  }
}

export const walletService = new WalletService();
export default walletService;
