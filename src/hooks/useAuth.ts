import { useCallback } from 'react';
import { useStore } from '@/stores/useStore';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
  role?: string;
}

export const useAuth = () => {
  const { user, isAuthenticated, setUser, setAuthenticated, logout: storeLogout } = useStore();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const response = await api.post('/auth/login', credentials);
        const { user, token } = response.data;

        // Save token to localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Update store
        setUser(user);
        setAuthenticated(true);

        toast.success(`Добро пожаловать, ${user.name}!`);
        return { success: true, user };
      } catch (error: any) {
        const message = error.response?.data?.message || 'Ошибка при входе';
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [setUser, setAuthenticated]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        const response = await api.post('/auth/register', credentials);
        const { user, token } = response.data;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
        setAuthenticated(true);

        toast.success('Аккаунт успешно создан!');
        return { success: true, user };
      } catch (error: any) {
        const message = error.response?.data?.message || 'Ошибка при регистрации';
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [setUser, setAuthenticated]
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      storeLogout();
      toast.success('Вы вышли из системы');
    }
  }, [storeLogout]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;

      localStorage.setItem('auth_token', token);
      return { success: true, token };
    } catch (error: any) {
      console.error('Token refresh error:', error);
      await logout();
      return { success: false, error: error.message };
    }
  }, [logout]);

  const updateProfile = useCallback(
    async (profileData: Record<string, any>) => {
      try {
        const response = await api.patch('/auth/profile', profileData);
        const updatedUser = response.data;

        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        toast.success('Профиль обновлен');
        return { success: true, user: updatedUser };
      } catch (error: any) {
        const message = error.response?.data?.message || 'Ошибка при обновлении профиля';
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [setUser]
  );

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    try {
      await api.patch('/auth/change-password', {
        oldPassword,
        newPassword,
      });

      toast.success('Пароль успешно изменен');
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка при изменении пароля';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    changePassword,
  };
};
