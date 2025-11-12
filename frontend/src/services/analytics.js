import api from '../lib/api';

export const analyticsService = {
  getDashboardMetrics: async (siteId, params = {}) => {
    const response = await api.get(`/sites/${siteId}/analytics/dashboard`, { params });
    return response.data;
  },

  getNotificationPerformance: async (notificationId) => {
    const response = await api.get(`/notifications/${notificationId}/performance`);
    return response.data;
  },

  getSubscriberGrowth: async (siteId, params = {}) => {
    const response = await api.get(`/sites/${siteId}/analytics/subscribers`, { params });
    return response.data;
  },

  getEngagementMetrics: async (siteId, params = {}) => {
    const response = await api.get(`/sites/${siteId}/analytics/engagement`, { params });
    return response.data;
  },
};
