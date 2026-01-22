/**
 * Auth Store - управление аутентификацией
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { container } from '@/infrastructure';
import { isAppError } from '@/application';
import type { User } from '@/domain/entities';
import type { LoginCredentials, RegisterCredentials } from './types';

/**
 * Безопасное сохранение в localStorage (SSR-compatible)
 */
function setAuthToken(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn(`Failed to save ${key} to localStorage:`, err);
    }
  }
}

/**
 * Безопасное удаление из localStorage (SSR-compatible)
 */
function removeAuthToken(key: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn(`Failed to remove ${key} from localStorage:`, err);
    }
  }
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const hasPermission = (role: string) => user.value?.role === role;
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isRestaurant = computed(() => user.value?.role === 'restaurant');

  // Actions
  async function login(credentials: LoginCredentials) {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await container.loginUseCase.execute(credentials);

      user.value = result.user;
      accessToken.value = result.accessToken;
      refreshToken.value = result.refreshToken;

      // Save to localStorage (SSR-safe)
      setAuthToken('auth_token', result.accessToken);
      if (result.refreshToken) {
        setAuthToken('auth_refresh_token', result.refreshToken);
      }
    } catch (err) {
      if (isAppError(err)) {
        error.value = err.message;
      } else {
        error.value = 'An unexpected error occurred';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(credentials: RegisterCredentials) {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await container.registerUseCase.execute(credentials);

      user.value = result.user;

      // Save tokens if provided (SSR-safe)
      if (result.accessToken) {
        accessToken.value = result.accessToken;
        setAuthToken('auth_token', result.accessToken);
      }

      if (result.refreshToken) {
        refreshToken.value = result.refreshToken;
        setAuthToken('auth_refresh_token', result.refreshToken);
      }

      return result;
    } catch (err) {
      if (isAppError(err)) {
        error.value = err.message;
      } else {
        error.value = 'An unexpected error occurred';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    error.value = null;

    // Remove from localStorage (SSR-safe)
    removeAuthToken('auth_token');
    removeAuthToken('auth_refresh_token');
  }

  /**
   * Восстановить состояние из localStorage (SSR-safe)
   */
  function hydrate(token: string) {
    accessToken.value = token;
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    hasPermission,
    isAdmin,
    isRestaurant,
    // Actions
    login,
    register,
    logout,
    hydrate,
    clearError,
  };
});
