import api from '../lib/api';

export const sitesService = {
  createSite: async (data) => {
    const response = await api.post('/sites', data);
    return response.data;
  },

  getSites: async () => {
    const response = await api.get('/sites');
    return response.data;
  },

  getSite: async (siteId) => {
    const response = await api.get(`/sites/${siteId}`);
    return response.data;
  },

  updateSite: async (siteId, data) => {
    const response = await api.patch(`/sites/${siteId}`, data);
    return response.data;
  },

  deleteSite: async (siteId) => {
    const response = await api.delete(`/sites/${siteId}`);
    return response.data;
  },

  getInstallCode: async (siteId) => {
    const response = await api.get(`/sites/${siteId}/install-code`);
    return response.data;
  },
};
