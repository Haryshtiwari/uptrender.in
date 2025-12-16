/**
 * API Route Constants
 * Centralized endpoint definitions for the entire application
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ROUTES = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    profile: '/auth/profile',
  },

  // Dashboard
  dashboard: {
    platform: '/dashboard/stats',
    user: '/dashboard/user',
    admin: '/dashboard/admin',
  },

  // Users Management
  users: {
    base: '/users',
    byId: (id) => `/users/${id}`,
    profile: '/users/profile',
    updateProfile: '/users/profile',
    changePassword: '/users/change-password',
    list: '/users',
    create: '/users',
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    stats: '/users/stats',
  },

  // Trades
  trades: {
    base: '/trades',
    byId: (id) => `/trades/${id}`,
    list: '/trades',
    create: '/trades',
    update: (id) => `/trades/${id}`,
    delete: (id) => `/trades/${id}`,
    stats: '/trades/stats',
    recent: '/trades/recent',
    byStrategy: (strategyId) => `/trades?strategyId=${strategyId}`,
    export: '/trades/export',
  },

  // Strategies
  strategies: {
    base: '/strategies',
    byId: (id) => `/strategies/${id}`,
    list: '/strategies',
    create: '/strategies',
    update: (id) => `/strategies/${id}`,
    delete: (id) => `/strategies/${id}`,
    activate: (id) => `/strategies/${id}/activate`,
    deactivate: (id) => `/strategies/${id}/deactivate`,
    start: (id) => `/strategies/${id}/start`,
    stop: (id) => `/strategies/${id}/stop`,
    stats: (id) => `/strategies/${id}/stats`,
    public: '/strategies/marketplace',
    clone: (id) => `/strategies/${id}/clone`,
    generateCode: '/strategies/generate-code',
  },

  // Strategy Subscriptions
  subscriptions: {
    base: '/strategies/subscriptions',
    list: '/strategies/subscriptions',
    byId: (id) => `/strategies/subscriptions/${id}`,
    subscribe: '/strategies/subscriptions/subscribe',
  },

  // API Keys
  apiKeys: {
    base: '/api-keys',
    byId: (id) => `/api-keys/${id}`,
    list: '/api-keys',
    create: '/api-keys',
    update: (id) => `/api-keys/${id}`,
    delete: (id) => `/api-keys/${id}`,
    validate: '/api-keys/validate',
    rotate: (id) => `/api-keys/${id}/rotate`,
  },

  // Plans & Subscriptions
  plans: {
    base: '/plans',
    catalog: '/admin/plans/public',
    byId: (id) => `/plans/${id}`,
    current: '/plans/current',
    subscribe: '/plans/subscribe',
    cancel: '/plans/cancel',
    upgrade: '/plans/upgrade',
    history: '/plans/history',
  },

  // Wallet
  wallet: {
    base: '/wallet',
    balance: '/wallet',
    transactions: '/wallet/transactions',
    deposit: '/wallet/add-funds',
    withdraw: '/wallet/withdraw',
    history: '/wallet/transactions',
    stats: '/wallet/stats',
  },

  // Support Tickets
  support: {
    base: '/support',
    byId: (id) => `/support/${id}`,
    list: '/support',
    create: '/support',
    update: (id) => `/support/${id}`,
    close: (id) => `/support/${id}/close`,
    reply: (id) => `/support/${id}/message`,
    stats: '/support/stats',
  },

  // Notifications
  notifications: {
    base: '/notifications',
    byId: (id) => `/notifications/${id}`,
    list: '/notifications',
    unreadCount: '/notifications/unread-count',
    markRead: (id) => `/notifications/${id}/read`,
    markAllRead: '/notifications/mark-all-read',
    delete: (id) => `/notifications/${id}`,
    // preferences endpoints are not implemented on backend currently
  },

  // Admin Routes
  admin: {
    users: {
      base: '/admin/users',
      byId: (id) => `/admin/users/${id}`,
      list: '/admin/users',
      create: '/admin/users',
      update: (id) => `/admin/users/${id}`,
      delete: (id) => `/admin/users/${id}`,
      toggleStatus: (id) => `/admin/users/${id}/toggle-status`,
      resetPassword: (id) => `/admin/users/${id}/reset-password`,
      activity: (id) => `/admin/users/${id}/activity`,
      stats: '/admin/users/stats',
    },
    strategies: {
      base: '/admin/strategies',
      byId: (id) => `/admin/strategies/${id}`,
      list: '/admin/strategies',
      update: (id) => `/admin/strategies/${id}`,
      delete: (id) => `/admin/strategies/${id}`,
      toggleStatus: (id) => `/admin/strategies/${id}/toggle-status`,
      stats: '/admin/strategies/stats',
    },
    trades: {
      base: '/admin/trades',
      byId: (id) => `/admin/trades/${id}`,
      list: '/admin/trades',
      update: (id) => `/admin/trades/${id}`,
      delete: (id) => `/admin/trades/${id}`,
      stats: '/admin/trades/stats',
    },
    apiKeys: {
      base: '/admin/api-keys',
      byId: (id) => `/admin/api-keys/${id}`,
      list: '/admin/api-keys',
      update: (id) => `/admin/api-keys/${id}`,
      delete: (id) => `/admin/api-keys/${id}`,
      toggleStatus: (id) => `/admin/api-keys/${id}/toggle-status`,
      stats: '/admin/api-keys/stats',
    },
    support: {
      base: '/admin/support',
      byId: (id) => `/admin/support/${id}`,
      list: '/admin/support',
      update: (id) => `/admin/support/${id}`,
      reply: (id) => `/admin/support/${id}/reply`,
      delete: (id) => `/admin/support/${id}`,
      stats: '/admin/support/stats',
    },
    plans: {
      base: '/admin/plans',
      byId: (id) => `/admin/plans/${id}`,
      list: '/admin/plans',
      create: '/admin/plans',
      update: (id) => `/admin/plans/${id}`,
      delete: (id) => `/admin/plans/${id}`,
      toggleStatus: (id) => `/admin/plans/${id}/toggle-status`,
      stats: '/admin/plans/stats',
    },
  },

  // Copy Trading
  copyTrading: {
    base: '/copy-trading',
    list: '/copy-trading',
    detail: '/copy-trading/:id',
    create: '/copy-trading',
    update: '/copy-trading/:id',
    delete: '/copy-trading/:id',
    toggleStatus: '/copy-trading/:id/toggle-status',
    linkAccounts: '/copy-trading/link-accounts',
    unlinkAccounts: '/copy-trading/unlink-accounts',
    testConnection: '/copy-trading/test-connection',
    statistics: '/copy-trading/statistics',
    logs: '/copy-trading/logs',
  },
};

// Helper to build full URL
export const buildUrl = (path) => {
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};

// Export base URL for direct access
export const API_BASE_URL = API_BASE;

// Named export for convenience
export const apiRoutes = API_ROUTES;

export default API_ROUTES;
