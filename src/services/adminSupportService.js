import apiClient from './apiClient';
import { API_ROUTES } from '../config/apiRoutes';

const adminSupportService = {
  getAllTickets: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ROUTES.admin.support.base, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getTicketById: async (id) => {
    try {
      const response = await apiClient.get(API_ROUTES.admin.support.byId(id));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  updateTicket: async (id, data) => {
    try {
      const response = await apiClient.put(API_ROUTES.admin.support.update(id), data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  replyToTicket: async (id, message) => {
    try {
      const response = await apiClient.post(API_ROUTES.admin.support.reply(id), { message });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  deleteTicket: async (id) => {
    try {
      const response = await apiClient.delete(API_ROUTES.admin.support.delete(id));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getTicketStats: async () => {
    try {
      const response = await apiClient.get(API_ROUTES.admin.support.stats);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }
};

export default adminSupportService;
