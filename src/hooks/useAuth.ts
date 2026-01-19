import { useEffect } from 'react';
import { useAuthStore, AuthState } from '../stores/authStore';

type AuthStoreKeys = Exclude<keyof AuthState, 'login' | 'register' | 'logout' | 'refreshUserToken' | 'initializeAuth' | 'setUser' | 'setToken' | 'setRefreshToken' | 'setError' | 'clearAuth'>;

interface UseAuthReturn extends Omit<AuthState, AuthStoreKeys> {
  login: AuthState['login'];
  register: AuthState['register'];
  logout: AuthState['logout'];
}

export const useAuth = (): UseAuthReturn => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    initializeAuth,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};
