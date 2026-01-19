import axios, { AxiosInstance } from 'axios'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'restaurant' | 'cashier' | 'guest'
  permissions: string[]
  restaurantId?: string
  locationId?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
  role?: 'restaurant' | 'guest'
}

export interface RefreshTokenRequest {
  refreshToken: string
}

class AuthService {
  private apiClient: AxiosInstance
  private readonly TOKEN_KEY = 'maxLoyalty_token'
  private readonly REFRESH_TOKEN_KEY = 'maxLoyalty_refreshToken'
  private readonly USER_KEY = 'maxLoyalty_user'

  constructor() {
    this.apiClient = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Set authorization token in API client
   */
  setAuthToken(token: string): void {
    if (token) {
      this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem(this.TOKEN_KEY, token)
    }
  }

  /**
   * Remove authorization token from API client
   */
  removeAuthToken(): void {
    delete this.apiClient.defaults.headers.common['Authorization']
    localStorage.removeItem(this.TOKEN_KEY)
  }

  /**
   * Get token from storage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  /**
   * Check if token is valid
   */
  isTokenValid(token: string): boolean {
    if (!token) return false

    try {
      const parts = token.split('.')
      if (parts.length !== 3) return false

      const payload = JSON.parse(atob(parts[1]))
      const expirationTime = payload.exp * 1000 // convert to milliseconds
      const currentTime = Date.now()

      return expirationTime > currentTime
    } catch {
      return false
    }
  }

  /**
   * Get token expiration time in milliseconds
   */
  getTokenExpirationTime(token: string): number | null {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null

      const payload = JSON.parse(atob(parts[1]))
      return (payload.exp * 1000) - Date.now() // time remaining in ms
    } catch {
      return null
    }
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>(
        '/auth/login',
        credentials
      )

      const { token, refreshToken, user } = response.data

      // Store tokens and user
      this.setAuthToken(token)
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>(
        '/auth/register',
        credentials
      )

      const { token, refreshToken, user } = response.data

      // Store tokens and user
      this.setAuthToken(token)
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await this.apiClient.post<AuthResponse>(
        '/auth/refresh',
        { refreshToken }
      )

      const { token, user } = response.data

      // Update token
      this.setAuthToken(token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))

      return response.data
    } catch (error) {
      this.logout()
      throw this.handleError(error)
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No token available')
      }

      const response = await this.apiClient.get<{ user: User }>('/auth/me')
      const user = response.data.user

      // Update user in storage
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))

      return user
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get user from storage
   */
  getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY)
    if (!userJson) return null

    try {
      return JSON.parse(userJson)
    } catch {
      return null
    }
  }

  /**
   * Validate current token
   */
  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken()
      if (!token) return false

      // Check if token is valid (not expired)
      if (!this.isTokenValid(token)) {
        // Try to refresh
        await this.refreshToken()
        return true
      }

      return true
    } catch {
      return false
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (optional)
      const token = this.getToken()
      if (token) {
        await this.apiClient.post('/auth/logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear storage
      this.removeAuthToken()
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      const status = error.response?.status

      if (status === 401) {
        this.logout()
        return new Error('Unauthorized: Please login again')
      }

      if (status === 403) {
        return new Error('Forbidden: You do not have permission to perform this action')
      }

      if (status === 400) {
        return new Error(message || 'Invalid credentials')
      }

      return new Error(message || 'An error occurred during authentication')
    }

    return error instanceof Error ? error : new Error('An unknown error occurred')
  }

  /**
   * Initialize auth from storage
   */
  initializeAuth(): void {
    const token = this.getToken()
    if (token) {
      this.setAuthToken(token)
    }
  }
}

export const authService = new AuthService()
