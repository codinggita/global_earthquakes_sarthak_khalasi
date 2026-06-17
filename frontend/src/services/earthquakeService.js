import api from './api';

const earthquakeService = {
  /**
   * List earthquakes with pagination, filters, search, sort.
   * GET /earthquakes?page=&limit=&search=&sort=&minMag=&maxMag=&status=&alert=&tsunami=&startDate=&endDate=
   */
  getAll: async (params = {}) => {
    const response = await api.get('/earthquakes', { params });
    return {
      data: response.data,
      pagination: response.meta,
    };
  },

  /**
   * Get a single earthquake by ID (ObjectId or eventId).
   * GET /earthquakes/:id
   */
  getById: async (id) => {
    const response = await api.get(`/earthquakes/${id}`);
    return response.data;
  },

  /**
   * Get aggregation statistics.
   * GET /earthquakes/stats
   */
  getStats: async () => {
    const response = await api.get('/earthquakes/stats');
    return response.data;
  },

  /**
   * Create a new earthquake (Admin only).
   * POST /earthquakes
   */
  create: async (data) => {
    const response = await api.post('/earthquakes', data);
    return response.data;
  },

  /**
   * Update an earthquake (Admin only).
   * PUT /earthquakes/:id
   */
  update: async (id, data) => {
    const response = await api.put(`/earthquakes/${id}`, data);
    return response.data;
  },

  /**
   * Delete an earthquake (Admin only, soft-delete).
   * DELETE /earthquakes/:id
   */
  delete: async (id) => {
    const response = await api.delete(`/earthquakes/${id}`);
    return response.data;
  },
};

export default earthquakeService;
