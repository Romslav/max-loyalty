/**
 * Auth Store - управление аутентификацией
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { container } from '@/infrastructure';
import { isAppError } from '@/application';
import type { User } from '@/domain/entities';
import type { LoginCredentials, RegisterCredentials } from './types';

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

      // Save to localStorage
      localStorage.setItem('auth_token', result.accessToken);
      localStorage.setItem('auth_refresh_token', result.refreshToken);
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

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
  }

  function hydrate(token: string) {
    // Восстановить состояние из localStorage
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
