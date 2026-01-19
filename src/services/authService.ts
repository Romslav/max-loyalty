import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'restaurant' | 'cashier' | 'guest';
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'restaurant' | 'cashier' | 'guest';
  restaurantId?: string;
}

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
    });
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', payload);
    return response.data;
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', payload);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const response = await this.api.post<{ token: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data;
  }

  async getCurrentUser(token: string): Promise<User> {
    const response = await this.api.get<User>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.api.post<{ valid: boolean }>(
        '/auth/validate',
        { token }
      );
      return response.data.valid;
    } catch {
      return false;
    }
  }

  logout(): void {
    // Backend logout if needed
    console.log('User logged out');
  }
}

export const authService = new AuthService();
