import apiClient from '../../../services/apiClient';

/**
 * Admin Dashboard Service
 * Handles all admin dashboard data fetching with optimized caching
 */

class AdminDashboardService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 2 * 60 * 1000; // 2 minutes
  }

  /**
   * Get cached data or fetch new
   */
  async getCached(key, fetchFn) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await fetchFn();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  /**
   * Clear specific cache or all
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get admin dashboard stats
   */
  async getAdminStats() {
    return this.getCached('admin-stats', async () => {
      const response = await apiClient.get('/api/dashboard/admin/stats');
      return response.data;
    });
  }

  /**
   * Get user growth data
   */
  async getUserGrowth(period = '7d') {
    return this.getCached(`user-growth-${period}`, async () => {
      const response = await apiClient.get(`/api/dashboard/admin/user-growth?period=${period}`);
      return response.data;
    });
  }

  /**
   * Get revenue data
   */
  async getRevenueData(period = 'monthly') {
    return this.getCached(`revenue-${period}`, async () => {
      const response = await apiClient.get(`/api/dashboard/admin/revenue?period=${period}`);
      return response.data;
    });
  }

  /**
   * Get trade statistics
   */
  async getTradeStats() {
    return this.getCached('trade-stats', async () => {
      const response = await apiClient.get('/api/dashboard/admin/trade-stats');
      return response.data;
    });
  }

  /**
   * Get strategy statistics
   */
  async getStrategyStats() {
    return this.getCached('strategy-stats', async () => {
      const response = await apiClient.get('/api/dashboard/admin/strategy-stats');
      return response.data;
    });
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(limit = 10) {
    const response = await apiClient.get(`/api/dashboard/admin/activities?limit=${limit}`);
    return response.data;
  }

  /**
   * Get top performing strategies
   */
  async getTopStrategies(limit = 5) {
    return this.getCached('top-strategies', async () => {
      const response = await apiClient.get(`/api/strategies?limit=${limit}&sort=-performance`);
      return response.data;
    });
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions(limit = 10) {
    const response = await apiClient.get(`/api/wallet/transactions?limit=${limit}`);
    return response.data;
  }

  /**
   * Get system health
   */
  async getSystemHealth() {
    const response = await apiClient.get('/api/dashboard/admin/system-health');
    return response.data;
  }

  /**
   * Get active users count
   */
  async getActiveUsers() {
    return this.getCached('active-users', async () => {
      const response = await apiClient.get('/api/dashboard/admin/active-users');
      return response.data;
    });
  }
}

/**
 * User Dashboard Service
 */
class UserDashboardService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 1 * 60 * 1000; // 1 minute
  }

  async getCached(key, fetchFn) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await fetchFn();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get user dashboard stats
   */
  async getUserStats() {
    return this.getCached('user-stats', async () => {
      const response = await apiClient.get('/api/dashboard/user/stats');
      return response.data;
    });
  }

  /**
   * Get user's wallet balance
   */
  async getWalletBalance() {
    const response = await apiClient.get('/api/wallet/balance');
    return response.data;
  }

  /**
   * Get user's active strategies
   */
  async getActiveStrategies() {
    return this.getCached('active-strategies', async () => {
      const response = await apiClient.get('/api/strategies?status=Active');
      return response.data;
    });
  }

  /**
   * Get user's recent trades
   */
  async getRecentTrades(limit = 10) {
    const response = await apiClient.get(`/api/trades?limit=${limit}`);
    return response.data;
  }

  /**
   * Get user's portfolio performance
   */
  async getPortfolioPerformance() {
    return this.getCached('portfolio-performance', async () => {
      const response = await apiClient.get('/api/dashboard/user/portfolio');
      return response.data;
    });
  }

  /**
   * Get user's subscription info
   */
  async getSubscriptionInfo() {
    const response = await apiClient.get('/api/plans/my-subscription');
    return response.data;
  }
}

export const adminDashboardService = new AdminDashboardService();
export const userDashboardService = new UserDashboardService();
