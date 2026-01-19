import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    onSuccess: (token: string) => void;
    onFailed: (error: AxiosError) => void;
  }> = [];

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add token to headers
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const { token } = useAuthStore.getState();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle token expiration
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized - token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request while token is refreshing
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                onSuccess: (token: string) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(this.api(originalRequest));
                },
                onFailed: (err) => reject(err),
              });
            });
          }

          this.isRefreshing = true;
          originalRequest._retry = true;

          try {
            const { refreshToken } = useAuthStore.getState();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            await useAuthStore.getState().refreshUserToken();
            const { token } = useAuthStore.getState();

            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              this.failedQueue.forEach((prom) => prom.onSuccess(token));
              this.failedQueue = [];
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.failedQueue.forEach((prom) => prom.onFailed(refreshError as AxiosError));
            this.failedQueue = [];
            useAuthStore.getState().logout();
            window.location.href = '/login';
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
          console.error('Access forbidden');
        }

        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string, config?: any) {
    return this.api.get<T>(url, config);
  }

  public post<T>(url: string, data?: any, config?: any) {
    return this.api.post<T>(url, data, config);
  }

  public put<T>(url: string, data?: any, config?: any) {
    return this.api.put<T>(url, data, config);
  }

  public delete<T>(url: string, config?: any) {
    return this.api.delete<T>(url, config);
  }

  public patch<T>(url: string, data?: any, config?: any) {
    return this.api.patch<T>(url, data, config);
  }
}

export const apiClient = new ApiClient();
