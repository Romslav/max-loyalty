/**
 * HttpClient - централизованный HTTP клиент для всех API запросов
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

export interface HttpClientConfig {
  baseURL: string;
  timeout: number;
}

// Проверка доступности браузерных API
const isBrowser = (): boolean => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export class HttpClient {
  private client: AxiosInstance;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  constructor(config: HttpClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Настройка interceptors
   */
  private setupInterceptors(): void {
    // Request Interceptor - надо отсылать token в каждом запросе
    this.client.interceptors.request.use((config) => {
      const token = this.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response Interceptor - обработка ошибок
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // 401 - старый token, требуется рефреш
        if (error.response?.status === 401) {
          await this.handleUnauthorized();
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * GET запрос
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data as T;
  }

  /**
   * POST запрос
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data as T;
  }

  /**
   * PUT запрос
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data as T;
  }

  /**
   * PATCH запрос
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch(url, data, config);
    return response.data as T;
  }

  /**
   * DELETE запрос
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data as T;
  }

  /**
   * Обновить access token
   */
  setAccessToken(token: string): void {
    if (isBrowser()) {
      localStorage.setItem('accessToken', token);
    }
  }

  /**
   * Получить access token
   */
  private getAccessToken(): string | null {
    if (!isBrowser()) {
      return null;
    }
    return localStorage.getItem('accessToken');
  }

  /**
   * Обновить refresh token
   */
  setRefreshToken(token: string): void {
    if (isBrowser()) {
      localStorage.setItem('refreshToken', token);
    }
  }

  /**
   * Обработка 401 ошибки
   */
  private async handleUnauthorized(): Promise<void> {
    if (!isBrowser()) {
      return;
    }
    
    // TODO: требуется реализация refresh логики
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }

  /**
   * Оформление ошибки
   */
  private formatError(error: AxiosError): any {
    return {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    };
  }
}

// синглтон инстанция
export const httpClient = new HttpClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
});
