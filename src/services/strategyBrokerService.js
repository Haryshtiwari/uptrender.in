import apiClient from './apiClient';

const strategyBrokerService = {
  // Get all brokers associated with a strategy
  getStrategyBrokers: async (strategyId) => {
    try {
      const response = await apiClient.get(`/strategy-brokers/${strategyId}/brokers`);
      return response.data;
    } catch (error) {
      console.error('Get strategy brokers error:', error);
      throw error.response?.data || { error: 'Failed to fetch strategy brokers' };
    }
  },

  // Add a single broker to a strategy
  addBrokerToStrategy: async (strategyId, apiKeyId) => {
    try {
      const response = await apiClient.post(`/strategy-brokers/${strategyId}/brokers`, {
        apiKeyId
      });
      return response.data;
    } catch (error) {
      console.error('Add broker to strategy error:', error);
      throw error.response?.data || { error: 'Failed to add broker to strategy' };
    }
  },

  // Add multiple brokers to a strategy (replaces existing)
  addMultipleBrokersToStrategy: async (strategyId, apiKeyIds) => {
    try {
      const response = await apiClient.post(`/strategy-brokers/${strategyId}/brokers/bulk`, {
        apiKeyIds
      });
      return response.data;
    } catch (error) {
      console.error('Add multiple brokers to strategy error:', error);
      throw error.response?.data || { error: 'Failed to add brokers to strategy' };
    }
  },

  // Remove a broker from a strategy
  removeBrokerFromStrategy: async (strategyId, strategyBrokerId) => {
    try {
      const response = await apiClient.delete(`/strategy-brokers/${strategyId}/brokers/${strategyBrokerId}`);
      return response.data;
    } catch (error) {
      console.error('Remove broker from strategy error:', error);
      throw error.response?.data || { error: 'Failed to remove broker from strategy' };
    }
  },

  // Toggle broker active status for a strategy
  toggleStrategyBrokerStatus: async (strategyId, strategyBrokerId) => {
    try {
      const response = await apiClient.patch(`/strategy-brokers/${strategyId}/brokers/${strategyBrokerId}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Toggle strategy broker status error:', error);
      throw error.response?.data || { error: 'Failed to toggle broker status' };
    }
  }
};

export default strategyBrokerService;
