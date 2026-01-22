/**
 * Auth Store Types
 */

import type { User, AuthToken } from '@/domain/entities';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'restaurant' | 'cashier' | 'guest';
}
