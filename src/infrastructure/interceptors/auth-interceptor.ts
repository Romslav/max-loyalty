/**
 * Auth Interceptor - Обработка token в запросах
 */

import { tokenManager } from '@/infrastructure/services/token-manager';
import { AppError, ErrorType } from '@/shared/exceptions';

interface ApiRequest {
  headers: Record<string, string>;
  [key: string]: any;
}

interface ApiResponse {
  status: number;
  data: any;
  [key: string]: any;
}

class AuthInterceptor {
  /**
   * Настроить interceptor для fetch
   */
  setupFetchInterceptor() {
    const originalFetch = window.fetch;

    window.fetch = async (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> => {
      const request = this.addAuthHeader(init || {});
      const response = await originalFetch(input, request);

      if (response.status === 401) {
        return this.handleUnauthorized(input, request, originalFetch);
      }

      return response;
    };
  }

  /**
   * Настроить interceptor для axios (if used)
   */
  setupAxiosInterceptor(axiosInstance: any) {
    // Request interceptor
    axiosInstance.interceptors.request.use(
      (config: any) => {
        const token = tokenManager.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor
    axiosInstance.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            axiosInstance.defaults.headers.common['Authorization'] =
              `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Добавить Authorization header
   */
  private addAuthHeader(config: RequestInit): RequestInit {
    const token = tokenManager.getAccessToken();
    if (!token) return config;

    return {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    };
  }

  /**
   * Обработать 401 Unauthorized
   */
  private async handleUnauthorized(
    input: RequestInfo | URL,
    init: RequestInit,
    originalFetch: typeof fetch
  ): Promise<Response> {
    try {
      const newToken = await this.refreshAccessToken();
      const updatedInit = {
        ...init,
        headers: {
          ...(init.headers || {}),
          Authorization: `Bearer ${newToken}`,
        },
      };
      return originalFetch(input, updatedInit);
    } catch (error) {
      this.emitAuthError();
      throw error;
    }
  }

  /**
   * Обновить access token
   */
  private async refreshAccessToken(): Promise<string> {
    const refreshToken = tokenManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new AppError('No refresh token available', {
        type: ErrorType.UNAUTHORIZED,
        statusCode: 401,
      });
    }

    // Mock API call
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newToken = `token-${Date.now()}`;
      tokenManager.updateAccessToken(newToken, 3600);
      return newToken;
    } catch (error) {
      throw new AppError('Failed to refresh token', {
        type: ErrorType.UNAUTHORIZED,
        statusCode: 401,
      });
    }
  }

  /**
   * Пустить событие auth error
   */
  private emitAuthError() {
    window.dispatchEvent(new CustomEvent('auth:error'));
  }
}

export const authInterceptor = new AuthInterceptor();
export { AuthInterceptor };
