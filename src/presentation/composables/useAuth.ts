/**
 * useAuth composable - управление аутентификацией
 */

import { ref, computed } from 'vue';
import { useAuthStore } from '@/presentation/stores';
import type { LoginCredentials, RegisterCredentials } from '@/presentation/stores/auth/types';

export function useAuth() {
  const authStore = useAuthStore();
  const localError = ref<string | null>(null);

  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const user = computed(() => authStore.user);
  const isLoading = computed(() => authStore.isLoading);
  const error = computed(() => authStore.error || localError.value);
  const isAdmin = computed(() => authStore.isAdmin);
  const isRestaurant = computed(() => authStore.isRestaurant);

  /**
   * Попытаться войти
   */
  async function login(credentials: LoginCredentials): Promise<boolean> {
    localError.value = null;
    try {
      await authStore.login(credentials);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        localError.value = err.message;
      } else {
        localError.value = 'Login failed';
      }
      return false;
    }
  }

  /**
   * Регистрироваться
   */
  async function register(credentials: RegisterCredentials): Promise<boolean> {
    localError.value = null;
    try {
      await authStore.register(credentials);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        localError.value = err.message;
      } else {
        localError.value = 'Registration failed';
      }
      return false;
    }
  }

  /**
   * Выйти
   */
  async function logout(): Promise<void> {
    localError.value = null;
    await authStore.logout();
  }

  /**
   * Очистить ошибки
   */
  function clearError(): void {
    localError.value = null;
    authStore.clearError();
  }

  /**
   * Проверить права доступа
   */
  function hasPermission(role: string): boolean {
    return authStore.hasPermission(role);
  }

  return {
    // State
    isAuthenticated,
    user,
    isLoading,
    error,
    isAdmin,
    isRestaurant,
    // Methods
    login,
    register,
    logout,
    clearError,
    hasPermission,
  };
}
