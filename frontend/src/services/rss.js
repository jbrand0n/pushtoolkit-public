import api from '../lib/api';

export const rssService = {
  createFeed: async (siteId, data) => {
    const response = await api.post(`/sites/${siteId}/rss-feeds`, data);
    return response.data;
  },

  getFeeds: async (siteId) => {
    const response = await api.get(`/sites/${siteId}/rss-feeds`);
    return response.data;
  },

  getFeed: async (feedId) => {
    const response = await api.get(`/rss-feeds/${feedId}`);
    return response.data;
  },

  updateFeed: async (feedId, data) => {
    const response = await api.patch(`/rss-feeds/${feedId}`, data);
    return response.data;
  },

  deleteFeed: async (feedId) => {
    const response = await api.delete(`/rss-feeds/${feedId}`);
    return response.data;
  },

  toggleFeed: async (feedId, isActive) => {
    const response = await api.patch(`/rss-feeds/${feedId}`, { is_active: isActive });
    return response.data;
  },
};
