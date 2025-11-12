import api from '../lib/api';

export const notificationsService = {
  createNotification: async (siteId, data) => {
    const response = await api.post(`/sites/${siteId}/notifications`, data);
    return response.data;
  },

  getNotifications: async (siteId, params = {}) => {
    const response = await api.get(`/sites/${siteId}/notifications`, { params });
    return response.data;
  },

  getNotification: async (notificationId) => {
    const response = await api.get(`/notifications/${notificationId}`);
    return response.data;
  },

  updateNotification: async (notificationId, data) => {
    const response = await api.patch(`/notifications/${notificationId}`, data);
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  sendNotification: async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/send`);
    return response.data;
  },

  getNotificationPerformance: async (notificationId) => {
    const response = await api.get(`/notifications/${notificationId}/performance`);
    return response.data;
  },
};
