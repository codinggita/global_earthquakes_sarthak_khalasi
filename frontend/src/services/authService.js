import api from './api';

const authService = {
  /**
   * Login with email and password.
   * POST /auth/login
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // { user, token }
  },

  /**
   * Register a new user.
   * POST /auth/register
   */
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data; // { user, token }
  },

  /**
   * Logout the current user.
   * POST /auth/logout
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response;
  },

  /**
   * Get the current user's profile.
   * GET /auth/profile
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data; // { user }
  },
};

export default authService;
