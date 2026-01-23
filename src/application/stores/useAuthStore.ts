/**
 * Auth Store - Управление аутентификацией
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'premium' | 'admin';
  emailVerified: boolean;
  createdAt: string;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'));
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const emailVerified = computed(() => user.value?.emailVerified || false);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isPremium = computed(() => user.value?.role === 'premium');

  // Actions
  const setUser = (newUser: User | null) => {
    user.value = newUser;
  };

  const setToken = (newToken: string | null) => {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser: User = {
        id: 'user-123',
        email,
        fullName: 'Ivan Petrov',
        phone: '+79991234567',
        role: 'user',
        emailVerified: true,
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      setToken('mock-token-' + Date.now());
      return true;
    } catch (err) {
      error.value = (err as Error).message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      setToken(null);
      error.value = null;
      return true;
    } catch (err) {
      error.value = (err as Error).message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    emailVerified,
    isAdmin,
    isPremium,
    setUser,
    setToken,
    login,
    logout,
  };
});
