import { create } from 'zustand';
import { authService, LoginPayload, RegisterPayload, User } from '../services/authService';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;

  // Async actions
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUserToken: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const STORAGE_KEYS = {
  TOKEN: 'max_loyalty_token',
  REFRESH_TOKEN: 'max_loyalty_refresh_token',
  USER: 'max_loyalty_user',
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setRefreshToken: (refreshToken) => set({ refreshToken }),
  setError: (error) => set({ error }),

  clearAuth: () => {
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(payload);
      set({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(payload);
      set({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    get().clearAuth();
  },

  refreshUserToken: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return;

    try {
      const response = await authService.refreshToken(refreshToken);
      set({
        token: response.token,
        refreshToken: response.refreshToken,
      });
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      get().clearAuth();
    }
  },

  initializeAuth: async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);

    if (token && refreshToken && user) {
      set({
        token,
        refreshToken,
        user: JSON.parse(user),
        isAuthenticated: true,
      });
    }
  },
}));
