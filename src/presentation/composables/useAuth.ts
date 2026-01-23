/**
 * useAuth Composable - Полный поток аутентификации
 */

import { computed } from 'vue';
import { useRouter } from './useRouter';
import { useAuthStore } from '@/application/stores/useAuthStore';
import { useUIStore } from '@/application/stores/useUIStore';
import { useError } from './useError';
import { authService } from '@/infrastructure/services/auth.service';
import { ErrorType } from '@/shared/exceptions/app-error';

export const useAuth = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const uiStore = useUIStore();
  const error = useError();

  // Computed
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const user = computed(() => authStore.user);
  const isEmailVerified = computed(() => authStore.emailVerified);
  const isAdmin = computed(() => authStore.isAdmin);
  const isPremium = computed(() => authStore.isPremium);

  /**
   * Войти
   */
  const login = async (email: string, password: string) => {
    const [, err] = await error.wrap(
      async () => {
        authStore.setLoading(true);
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUser = {
          id: 'user-' + Date.now(),
          email,
          fullName: 'User ' + email.split('@')[0],
          phone: '+79991234567',
          role: 'user' as const,
          emailVerified: true,
          createdAt: new Date().toISOString(),
        };

        authStore.setUser(mockUser);
        authStore.setToken('token-' + Date.now());
        authStore.setRefreshToken('refresh-' + Date.now());
        
        uiStore.showSuccess('Вы успешно вошли');
        await router.push('/dashboard');
      },
      { showNotification: true }
    );

    authStore.setLoading(false);
    return !err;
  };

  /**
   * Регистрация
   */
  const register = async (email: string, password: string, fullName: string) => {
    const [, err] = await error.wrap(
      async () => {
        authStore.setLoading(true);
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockUser = {
          id: 'user-' + Date.now(),
          email,
          fullName,
          phone: '',
          role: 'user' as const,
          emailVerified: false,
          createdAt: new Date().toISOString(),
        };

        authStore.setUser(mockUser);
        authStore.setToken('token-' + Date.now());
        
        uiStore.showSuccess('Аккаунт осоздан. Поверьте email');
        await router.push('/verify-email');
      },
      { showNotification: true }
    );

    authStore.setLoading(false);
    return !err;
  };

  /**
   * Выйти
   */
  const logout = async () => {
    authStore.setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      authStore.setUser(null);
      authStore.setToken(null);
      authStore.setRefreshToken(null);
      uiStore.showSuccess('Вы вышли');
      await router.push('/login');
    } finally {
      authStore.setLoading(false);
    }
  };

  /**
   * Повторить токен
   */
  const refreshToken = async () => {
    if (!authStore.refreshToken) return false;
    
    try {
      const newToken = 'token-' + Date.now();
      authStore.setToken(newToken);
      return true;
    } catch {
      await logout();
      return false;
    }
  };

  /**
   * Отправить код верификации
   */
  const verifyEmail = async (code: string) => {
    const [, err] = await error.wrap(
      async () => {
        authStore.setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (authStore.user) {
          authStore.user.emailVerified = true;
        }
        
        uiStore.showSuccess('Электронная почта подтверждена');
        await router.push('/dashboard');
      },
      { showNotification: true }
    );

    authStore.setLoading(false);
    return !err;
  };

  /**
   * Отправить запрос на восстановление
   */
  const sendPasswordReset = async (email: string) => {
    const [, err] = await error.wrap(
      async () => {
        authStore.setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        uiStore.showSuccess('Проверьте email для восстановления');
      },
      { showNotification: true }
    );

    authStore.setLoading(false);
    return !err;
  };

  /**
   * Остановить пароль
   */
  const resetPassword = async (token: string, newPassword: string) => {
    const [, err] = await error.wrap(
      async () => {
        authStore.setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        uiStore.showSuccess('Пароль испольнен');
        await router.push('/login');
      },
      { showNotification: true }
    );

    authStore.setLoading(false);
    return !err;
  };

  /**
   * Обновить профиль
   */
  const updateProfile = async (data: any) => {
    const [, err] = await error.wrap(
      async () => {
        authStore.setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (authStore.user) {
          Object.assign(authStore.user, data);
        }
        
        uiStore.showSuccess('Профиль обновлен');
      },
      { showNotification: true }
    );

    authStore.setLoading(false);
    return !err;
  };

  return {
    // State
    isAuthenticated,
    user,
    isEmailVerified,
    isAdmin,
    isPremium,
    // Methods
    login,
    register,
    logout,
    refreshToken,
    verifyEmail,
    sendPasswordReset,
    resetPassword,
    updateProfile,
  };
};
