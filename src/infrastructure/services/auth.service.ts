/**
 * Auth Service - Сервис аутентификации
 */

import { httpClient } from '@/infrastructure/api/http-client';
import { endpoints } from '@/infrastructure/api/config';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    role: string;
    emailVerified: boolean;
    createdAt: string;
  };
}

interface VerifyEmailRequest {
  code: string;
}

class AuthService {
  /**
   * Отправить email на подтверждение в пэнэль
   */
  async sendVerificationEmail(email: string) {
    console.log('Sending verification email to:', email);
    // Mock implementation
    return {
      success: true,
      message: 'Verification email sent',
    };
  }

  /**
   * Отправить verification code
   */
  async verifyEmail(code: string) {
    console.log('Verifying email code:', code);
    // Mock implementation
    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  /**
   * Отправить запрос на восстановление пароля
   */
  async sendPasswordReset(email: string) {
    console.log('Sending password reset email to:', email);
    // Mock implementation
    return {
      success: true,
      message: 'Password reset email sent',
    };
  }

  /**
   * Восстановить пароль
   */
  async resetPassword(token: string, password: string) {
    console.log('Resetting password with token:', token);
    // Mock implementation
    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  /**
   * Обновить токен
   */
  async refreshToken(refreshToken: string): Promise<{ success: boolean; token?: string }> {
    console.log('Refreshing token...');
    // Mock implementation
    return {
      success: true,
      token: 'new-mock-token-' + Date.now(),
    };
  }

  /**
   * Отправить запрос на вынос эоа учетных данных
   */
  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    console.log('Deleting account...');
    // Mock implementation
    return {
      success: true,
      message: 'Account deleted successfully',
    };
  }
}

export const authService = new AuthService();
