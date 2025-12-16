import apiClient from './apiClient';

const chargeService = {
  // Get all charges
  getAllCharges: async () => {
    try {
      const response = await apiClient.get('/admin/charges');
      return response.data;
    } catch (error) {
      console.error('Error fetching charges:', error);
      throw error;
    }
  },

  // Get charge by ID
  getChargeById: async (id) => {
    try {
      const response = await apiClient.get(`/admin/charges/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching charge:', error);
      throw error;
    }
  },

  // Get charge by type
  getChargeByType: async (type) => {
    try {
      const response = await apiClient.get(`/admin/charges/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching charge by type:', error);
      throw error;
    }
  },

  // Create or update charge (upsert)
  upsertCharge: async (chargeData) => {
    try {
      const response = await apiClient.post('/admin/charges', chargeData);
      return response.data;
    } catch (error) {
      console.error('Error upserting charge:', error);
      throw error;
    }
  },

  // Update charge
  updateCharge: async (id, chargeData) => {
    try {
      const response = await apiClient.put(`/admin/charges/${id}`, chargeData);
      return response.data;
    } catch (error) {
      console.error('Error updating charge:', error);
      throw error;
    }
  },

  // Delete charge
  deleteCharge: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/charges/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting charge:', error);
      throw error;
    }
  }
};

export default chargeService;
