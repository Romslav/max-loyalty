import { create } from 'zustand'
import { User, AuthToken } from '@types/index'

interface AuthStore {
  user: User | null
  token: AuthToken | null
  loading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setToken: (token: AuthToken | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  isAuthenticated: () => boolean
  hasRole: (role: string | string[]) => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  },

  isAuthenticated: () => {
    const { token } = get()
    return !!token?.access
  },

  hasRole: (roles) => {
    const { user } = get()
    if (!user) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  },
}))
