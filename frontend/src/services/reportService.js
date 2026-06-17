import api from './api';

const reportService = {
  /**
   * List felt reports with pagination.
   * GET /reports?page=&limit=
   */
  getAll: async (params = {}) => {
    const response = await api.get('/reports', { params });
    return {
      data: response.data,
      pagination: response.meta,
    };
  },

  /**
   * Get a single report by ID.
   * GET /reports/:id
   */
  getById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  /**
   * Create a new felt report.
   * POST /reports
   */
  create: async (data) => {
    const response = await api.post('/reports', data);
    return response.data;
  },

  /**
   * Update a felt report (owner only).
   * PUT /reports/:id
   */
  update: async (id, data) => {
    const response = await api.put(`/reports/${id}`, data);
    return response.data;
  },

  /**
   * Delete a felt report (owner or admin).
   * DELETE /reports/:id
   */
  delete: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },

  /**
   * Get aggregation stats for a specific earthquake's reports.
   * GET /reports/earthquake/:earthquakeId/stats
   */
  getEarthquakeStats: async (earthquakeId) => {
    const response = await api.get(`/reports/earthquake/${earthquakeId}/stats`);
    return response.data;
  },
};

export default reportService;
