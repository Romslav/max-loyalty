import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';
import { errorService, ApiError } from './errorService';
import { logger } from './loggerService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

/**
 * Create axios instance with base config
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: Add auth token to headers
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
    });
    return config;
  },
  (error) => {
    logger.error('Request interceptor error', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle errors and token refresh
 */
axiosInstance.interceptors.response.use(
  (response) => {
    logger.debug('API Response', {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalConfig = error.config;

    logger.error('API Error', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const authStore = useAuthStore.getState();
      if (authStore.refreshToken && originalConfig) {
        try {
          // Try to refresh token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: authStore.refreshToken,
          });

          const { token, refreshToken } = response.data;
          authStore.setTokens(token, refreshToken);

          // Retry original request with new token
          originalConfig.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalConfig);
        } catch (refreshError) {
          logger.error('Token refresh failed', refreshError);
          authStore.logout();
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      } else {
        authStore.logout();
        window.location.href = '/auth/login';
      }
    }

    // Create ApiError instance
    const apiError = new ApiError(
      error.response?.status || 500,
      error.response?.data?.message || error.message,
      error.response?.data
    );

    // Handle error with error service
    errorService.handleError(apiError);

    return Promise.reject(apiError);
  }
);

export default axiosInstance;