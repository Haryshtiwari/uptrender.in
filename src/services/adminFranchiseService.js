import apiClient from './apiClient';

class AdminFranchiseService {
  /**
   * Get all franchises with pagination and filters
   */
  async getAllFranchises(params = {}) {
    try {
      const { page = 1, limit = 10, search = '', status = '' } = params;
      const response = await apiClient.get('/admin/franchise/franchises', {
        params: { page, limit, search, status }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get franchise by ID with full details and statistics
   */
  async getFranchiseById(id) {
    try {
      const response = await apiClient.get(`/admin/franchise/franchises/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Create new franchise
   */
  async createFranchise(franchiseData) {
    try {
      const response = await apiClient.post('/admin/franchise/franchises', franchiseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Update franchise details
   */
  async updateFranchise(id, franchiseData) {
    try {
      const response = await apiClient.put(`/admin/franchise/franchises/${id}`, franchiseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Delete franchise
   */
  async deleteFranchise(id) {
    try {
      const response = await apiClient.delete(`/admin/franchise/franchises/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Add user to franchise
   */
  async addUserToFranchise(franchiseId, userId) {
    try {
      const response = await apiClient.post('/admin/franchise/franchises/users', {
        franchiseId,
        userId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Remove user from franchise
   */
  async removeUserFromFranchise(franchiseId, userId) {
    try {
      const response = await apiClient.delete(
        `/admin/franchise/franchises/${franchiseId}/users/${userId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get franchise dashboard statistics (for franchise users)
   */
  async getFranchiseDashboardStats() {
    try {
      const response = await apiClient.get('/admin/franchise/franchise/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new AdminFranchiseService();
