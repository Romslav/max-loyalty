import { useCallback } from 'react'
import { useAuthStore } from '../stores/authStore'
import { LoginCredentials, RegisterCredentials } from '../services/authService'

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshTokens,
    initializeAuth,
    validateAuth,
    clearError,
  } = useAuthStore()

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      await login(credentials)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }, [login])

  const handleRegister = useCallback(async (credentials: RegisterCredentials) => {
    try {
      await register(credentials)
      return true
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }, [register])

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      return true
    } catch (error) {
      console.error('Logout error:', error)
      return false
    }
  }, [logout])

  const handleRefreshToken = useCallback(async () => {
    try {
      await refreshTokens()
      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  }, [refreshTokens])

  const handleValidateAuth = useCallback(async () => {
    return await validateAuth()
  }, [validateAuth])

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
    validateAuth: handleValidateAuth,
    initializeAuth,
    clearError,
  }
}
