import axios, { AxiosError } from 'axios'
import { logger } from './loggerService'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
    role: 'admin' | 'restaurant' | 'cashier' | 'guest'
    permissions: string[]
  }
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'auth_user'

/**
 * Authentication Service
 * Handles JWT-based authentication
 */
export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      logger.info('User login attempt', { email: credentials.email })

      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/login`,
        credentials
      )

      const { accessToken, refreshToken, user } = response.data

      // Store tokens and user
      this.setTokens(accessToken, refreshToken)
      this.setUser(user)

      logger.info('User login successful', { userId: user.id, email: user.email })

      return response.data
    } catch (error) {
      const message = this.getErrorMessage(error, 'Login failed')
      logger.error('Login error', { error: message })
      throw new Error(message)
    }
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      logger.info('User registration attempt', { email: data.email })

      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/register`,
        data
      )

      const { accessToken, refreshToken, user } = response.data

      // Store tokens and user
      this.setTokens(accessToken, refreshToken)
      this.setUser(user)

      logger.info('User registration successful', { userId: user.id })

      return response.data
    } catch (error) {
      const message = this.getErrorMessage(error, 'Registration failed')
      logger.error('Registration error', { error: message })
      throw new Error(message)
    }
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<RefreshResponse> {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      logger.info('Refreshing access token')

      const response = await axios.post<RefreshResponse>(
        `${API_URL}/auth/refresh`,
        { refreshToken }
      )

      const { accessToken, refreshToken: newRefreshToken } = response.data

      // Update tokens
      this.setTokens(accessToken, newRefreshToken)

      logger.info('Access token refreshed successfully')

      return response.data
    } catch (error) {
      const message = this.getErrorMessage(error, 'Token refresh failed')
      logger.error('Token refresh error', { error: message })
      // Clear auth data on refresh failure
      this.logout()
      throw new Error(message)
    }
  },

  /**
   * Get current user info from server
   */
  async getCurrentUser(): Promise<AuthResponse['user']> {
    try {
      logger.info('Fetching current user')

      const response = await axios.get<{ user: AuthResponse['user'] }>(
        `${API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        }
      )

      this.setUser(response.data.user)
      logger.info('Current user fetched', { userId: response.data.user.id })

      return response.data.user
    } catch (error) {
      const message = this.getErrorMessage(error, 'Failed to fetch user')
      logger.error('Get current user error', { error: message })
      throw new Error(message)
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const token = this.getToken()
      if (token) {
        logger.info('Logging out user')
        await axios.post(
          `${API_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      }
    } catch (error) {
      logger.error('Logout error', { error })
    } finally {
      this.clearAuth()
    }
  },

  /**
   * Store access and refresh tokens
   */
  setTokens(accessToken: string, refreshToken: string): void {
    try {
      // In production, use secure HttpOnly cookies instead
      // For now, using localStorage with a warning
      sessionStorage.setItem(TOKEN_KEY, accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      logger.debug('Tokens stored')
    } catch (error) {
      logger.error('Failed to store tokens', { error })
    }
  },

  /**
   * Get access token
   */
  getToken(): string | null {
    try {
      return sessionStorage.getItem(TOKEN_KEY)
    } catch (error) {
      logger.error('Failed to get token', { error })
      return null
    }
  },

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    } catch (error) {
      logger.error('Failed to get refresh token', { error })
      return null
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null
  },

  /**
   * Store user info
   */
  setUser(user: AuthResponse['user']): void {
    try {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user))
      logger.debug('User stored', { userId: user.id })
    } catch (error) {
      logger.error('Failed to store user', { error })
    }
  },

  /**
   * Get stored user info
   */
  getUser(): AuthResponse['user'] | null {
    try {
      const user = sessionStorage.getItem(USER_KEY)
      return user ? JSON.parse(user) : null
    } catch (error) {
      logger.error('Failed to get user', { error })
      return null
    }
  },

  /**
   * Clear all auth data
   */
  clearAuth(): void {
    try {
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      logger.debug('Auth data cleared')
    } catch (error) {
      logger.error('Failed to clear auth data', { error })
    }
  },

  /**
   * Extract error message from various error types
   */
  private getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message || defaultMessage
    }
    if (error instanceof Error) {
      return error.message || defaultMessage
    }
    return defaultMessage
  },
}

export default authService
