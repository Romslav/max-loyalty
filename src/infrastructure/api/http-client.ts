/**
 * HTTP Client с interceptors и retry logic
 */

import { apiConfig, HttpStatus } from './config';
import { useAuthStore } from '@/application/stores/useAuthStore';
import { useUIStore } from '@/application/stores/useUIStore';

interface RequestConfig extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  statusCode: number;
}

class HttpClient {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor() {
    this.baseURL = apiConfig.baseURL;
    this.timeout = apiConfig.timeout;
    this.retryAttempts = apiConfig.retryAttempts;
    this.retryDelay = apiConfig.retryDelay;
  }

  /**
   * Получить headers с токеном
   */
  private getHeaders(): Record<string, string> {
    const authStore = useAuthStore();
    const headers: Record<string, string> = {
      ...apiConfig.headers,
    };

    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`;
    }

    return headers;
  }

  /**
   * Построить URL с query параметрами
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
    let url = `${this.baseURL}${endpoint}`;

    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      url += `?${queryString}`;
    }

    return url;
  }

  /**
   * Обработать ошибки
   */
  private async handleError(response: Response, attempt: number): Promise<void> {
    const uiStore = useUIStore();
    const authStore = useAuthStore();

    switch (response.status) {
      case HttpStatus.UNAUTHORIZED:
        authStore.logout();
        uiStore.showError('Сеанс истёк. Пожалуйста, войдите заново');
        break;
      case HttpStatus.FORBIDDEN:
        uiStore.showError('У вас нет доступа к этому ресурсу');
        break;
      case HttpStatus.NOT_FOUND:
        uiStore.showError('Ресурс не найден');
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        uiStore.showError('Ошибка сервера. Попробуйте позже');
        break;
      case HttpStatus.SERVICE_UNAVAILABLE:
        if (attempt < this.retryAttempts) {
          uiStore.showWarning(`Сервис недоступен. Повторная попытка ${attempt + 1}...`);
        } else {
          uiStore.showError('Сервис недоступен. Попробуйте позже');
        }
        break;
      default:
        uiStore.showError('Произошла ошибка. Попробуйте позже');
    }
  }

  /**
   * Выполнить запрос с retry logic
   */
  private async fetchWithRetry(
    url: string,
    config: RequestConfig,
    attempt: number = 1
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(0);

      if (attempt < this.retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        return this.fetchWithRetry(url, config, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * GET запрос
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    const headers = this.getHeaders();

    try {
      const response = await this.fetchWithRetry(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        await this.handleError(response, 1);
        return {
          success: false,
          statusCode: response.status,
          error: { code: 'HTTP_ERROR', message: response.statusText },
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (error) {
      console.error('GET request failed:', error);
      return {
        success: false,
        statusCode: 0,
        error: {
          code: 'NETWORK_ERROR',
          message: (error as Error).message || 'Ошибка сети',
        },
      };
    }
  }

  /**
   * POST запрос
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    params?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    const headers = this.getHeaders();

    try {
      const response = await this.fetchWithRetry(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        await this.handleError(response, 1);
        return {
          success: false,
          statusCode: response.status,
          error: { code: 'HTTP_ERROR', message: response.statusText },
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (error) {
      console.error('POST request failed:', error);
      return {
        success: false,
        statusCode: 0,
        error: {
          code: 'NETWORK_ERROR',
          message: (error as Error).message || 'Ошибка сети',
        },
      };
    }
  }

  /**
   * PUT запрос
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    params?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    const headers = this.getHeaders();

    try {
      const response = await this.fetchWithRetry(url, {
        method: 'PUT',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        await this.handleError(response, 1);
        return {
          success: false,
          statusCode: response.status,
          error: { code: 'HTTP_ERROR', message: response.statusText },
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (error) {
      console.error('PUT request failed:', error);
      return {
        success: false,
        statusCode: 0,
        error: {
          code: 'NETWORK_ERROR',
          message: (error as Error).message || 'Ошибка сети',
        },
      };
    }
  }

  /**
   * DELETE запрос
   */
  async delete<T = any>(
    endpoint: string,
    params?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    const headers = this.getHeaders();

    try {
      const response = await this.fetchWithRetry(url, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        await this.handleError(response, 1);
        return {
          success: false,
          statusCode: response.status,
          error: { code: 'HTTP_ERROR', message: response.statusText },
        };
      }

      const data = await response.json().catch(() => null);
      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (error) {
      console.error('DELETE request failed:', error);
      return {
        success: false,
        statusCode: 0,
        error: {
          code: 'NETWORK_ERROR',
          message: (error as Error).message || 'Ошибка сети',
        },
      };
    }
  }
}

export const httpClient = new HttpClient();
export { ApiResponse };
