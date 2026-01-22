/**
 * useAuth composable - управление аутентификацией
 */

import { ref, computed } from 'vue';
import { useAuthStore } from '@/presentation/stores';
import type { LoginCredentials, RegisterCredentials } from '@/presentation/stores/auth/types';

export function useAuth() {
  const authStore = useAuthStore();

  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const user = computed(() => authStore.user);
  const isLoading = computed(() => authStore.isLoading);
  const error = computed(() => authStore.error);
  const isAdmin = computed(() => authStore.isAdmin);
  const isRestaurant = computed(() => authStore.isRestaurant);

  async function login(credentials: LoginCredentials) {
    try {
      await authStore.login(credentials);
      return true;
    } catch (err) {
      return false;
    }
  }

  async function register(credentials: RegisterCredentials) {
    try {
      await authStore.register(credentials);
      return true;
    } catch (err) {
      return false;
    }
  }

  async function logout() {
    await authStore.logout();
  }

  function clearError() {
    authStore.clearError();
  }

  function hasPermission(role: string) {
    return authStore.hasPermission(role);
  }

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    isAdmin,
    isRestaurant,
    login,
    register,
    logout,
    clearError,
    hasPermission,
  };
}
