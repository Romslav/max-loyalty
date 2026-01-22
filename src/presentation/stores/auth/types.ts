/**
 * Auth Store Types - Authentication related types
 */

import type { User, AuthToken } from '@/domain/entities';

/**
 * Auth Store State
 *
 * @interface AuthState
 * @property user - Authenticated user or null if not authenticated
 * @property accessToken - JWT access token for API requests
 * @property refreshToken - Refresh token for getting new access tokens
 * @property isLoading - Loading state during auth operations
 * @property error - Last error message or null
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Login Credentials
 *
 * @interface LoginCredentials
 * @property email - User email
 * @property password - User password
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Register Credentials
 *
 * @interface RegisterCredentials
 * @property email - User email
 * @property password - User password
 * @property name - User full name
 * @property role - User role (optional, default: 'guest')
 */
export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'restaurant' | 'cashier' | 'guest';
}
