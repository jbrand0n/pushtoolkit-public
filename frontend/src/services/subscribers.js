import api from '../lib/api';

export const subscribersService = {
  getSubscribers: async (siteId, params = {}) => {
    const response = await api.get(`/sites/${siteId}/subscribers`, { params });
    return response.data;
  },

  getSubscriber: async (siteId, subscriberId) => {
    const response = await api.get(`/sites/${siteId}/subscribers/${subscriberId}`);
    return response.data;
  },

  unsubscribe: async (subscriberId) => {
    const response = await api.delete(`/subscribers/${subscriberId}`);
    return response.data;
  },

  updateSubscriberTags: async (subscriberId, tags) => {
    const response = await api.patch(`/subscribers/${subscriberId}/tags`, { tags });
    return response.data;
  },
};
