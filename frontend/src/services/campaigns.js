import api from '../lib/api';

export const campaignsService = {
  createCampaign: async (siteId, data) => {
    const response = await api.post(`/sites/${siteId}/welcome-campaigns`, data);
    return response.data;
  },

  getCampaigns: async (siteId) => {
    const response = await api.get(`/sites/${siteId}/welcome-campaigns`);
    return response.data;
  },

  getCampaign: async (campaignId) => {
    const response = await api.get(`/welcome-campaigns/${campaignId}`);
    return response.data;
  },

  updateCampaign: async (campaignId, data) => {
    const response = await api.patch(`/welcome-campaigns/${campaignId}`, data);
    return response.data;
  },

  deleteCampaign: async (campaignId) => {
    const response = await api.delete(`/welcome-campaigns/${campaignId}`);
    return response.data;
  },

  toggleCampaign: async (campaignId, isActive) => {
    const response = await api.patch(`/welcome-campaigns/${campaignId}`, { is_active: isActive });
    return response.data;
  },
};
