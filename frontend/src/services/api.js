import axios from 'axios';
import { getToken, clearAuth } from '../utils/storage';
import toast from 'react-hot-toast';

/**
 * Centralized Axios instance with interceptors for JWT auth and error handling.
 */
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// Request Interceptor – Attach JWT Token
// ============================================
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// Response Interceptor – Error Handling + Retry
// ============================================
let isRefreshing = false;

api.interceptors.response.use(
  (response) => {
    // Extract data from the API response envelope
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized – auto logout
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        clearAuth();
        window.location.href = '/login';
        isRefreshing = false;
      }
      return Promise.reject(error);
    }

    // Retry mechanism (1 retry on network error)
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        return await api(originalRequest);
      } catch (retryError) {
        toast.error('Network error. Please check your connection.');
        return Promise.reject(retryError);
      }
    }

    // Extract error message from backend response
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors ||
      error.message ||
      'An unexpected error occurred';

    // Show toast for non-401 errors (401 handled above)
    if (error.response?.status !== 401) {
      toast.error(typeof message === 'string' ? message : 'Request failed');
    }

    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
    });
  }
);

export default api;
