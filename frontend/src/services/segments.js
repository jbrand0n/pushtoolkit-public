import api from '../lib/api';

export const segmentsService = {
  createSegment: async (siteId, data) => {
    const response = await api.post(`/sites/${siteId}/segments`, data);
    return response.data;
  },

  getSegments: async (siteId) => {
    const response = await api.get(`/sites/${siteId}/segments`);
    return response.data;
  },

  getSegment: async (segmentId) => {
    const response = await api.get(`/segments/${segmentId}`);
    return response.data;
  },

  updateSegment: async (segmentId, data) => {
    const response = await api.patch(`/segments/${segmentId}`, data);
    return response.data;
  },

  deleteSegment: async (segmentId) => {
    const response = await api.delete(`/segments/${segmentId}`);
    return response.data;
  },

  estimateSegmentSize: async (segmentId) => {
    const response = await api.post(`/segments/${segmentId}/estimate`);
    return response.data;
  },
};
