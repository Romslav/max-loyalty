import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, LoginRequest, RegisterRequest, AuthResponse } from '../services/authService'
import { logger } from '../services/loggerService'

export interface AuthState {
  user: AuthResponse['user'] | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

/**
 * Custom hook for authentication
 * Manages login, register, logout, and auth state
 */
export const useAuth = () => {
  const navigate = useNavigate()
  const [state, setState] = useState<AuthState>({
    user: authService.getUser(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: false,
    error: null,
  })

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken()
        if (token) {
          // Verify token is valid by fetching current user
          const user = await authService.getCurrentUser()
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          logger.info('Auth initialized', { userId: user.id })
        }
      } catch (error) {
        logger.error('Auth initialization failed', { error })
        authService.clearAuth()
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      }
    }

    initializeAuth()
  }, [])

  /**
   * Handle login
   */
  const login = useCallback(
    async (credentials: LoginRequest) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      try {
        const response = await authService.login(credentials)
        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
        logger.info('Login successful', { userId: response.user.id })
        // Redirect to dashboard
        navigate('/dashboard')
        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed'
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: errorMessage,
        })
        logger.error('Login failed', { error: errorMessage })
        throw error
      }
    },
    [navigate]
  )

  /**
   * Handle registration
   */
  const register = useCallback(
    async (data: RegisterRequest) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      try {
        const response = await authService.register(data)
        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
        logger.info('Registration successful', { userId: response.user.id })
        // Redirect to dashboard
        navigate('/dashboard')
        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed'
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: errorMessage,
        })
        logger.error('Registration failed', { error: errorMessage })
        throw error
      }
    },
    [navigate]
  )

  /**
   * Handle logout
   */
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      await authService.logout()
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
      logger.info('Logout successful')
      // Redirect to login
      navigate('/login')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed'
      logger.error('Logout failed', { error: errorMessage })
      // Still clear auth data even if logout API fails
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
      navigate('/login')
    }
  }, [navigate])

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    login,
    register,
    logout,
    clearError,
  }
}

export default useAuth
