import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, User, LoginCredentials, RegisterCredentials, AuthResponse } from '../services/authService'

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>
  logout: () => Promise<void>
  refreshTokens: () => Promise<void>
  initializeAuth: () => void
  validateAuth: () => Promise<boolean>
  clearError: () => void
}

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const useAuthStore = create<AuthState>(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.login(credentials)
          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
          return response
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          })
          throw error
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.register(credentials)
          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
          return response
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.logout()
          set({
            ...initialState,
            isLoading: false,
          })
        } catch (error) {
          console.error('Logout error:', error)
          set({
            ...initialState,
            isLoading: false,
          })
        }
      },

      refreshTokens: async () => {
        try {
          const response = await authService.refreshToken()
          set({
            token: response.token,
            user: response.user,
          })
        } catch (error) {
          set({ isAuthenticated: false })
          throw error
        }
      },

      initializeAuth: () => {
        authService.initializeAuth()
        const user = authService.getUserFromStorage()
        const token = authService.getToken()
        
        if (user && token) {
          set({
            user,
            token,
            isAuthenticated: true,
          })
        }
      },

      validateAuth: async () => {
        try {
          const isValid = await authService.validateToken()
          if (!isValid) {
            set({ isAuthenticated: false })
          }
          return isValid
        } catch (error) {
          set({ isAuthenticated: false })
          return false
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
)
