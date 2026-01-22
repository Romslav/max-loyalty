/**
 * AuthenticationError - ошибка аутентификации
 */

import { AppError, ErrorCode } from './AppError';

export class AuthenticationError extends AppError {
  constructor(
    message: string,
    details?: Record<string, any>
  ) {
    super(
      ErrorCode.AUTHENTICATION_REQUIRED,
      message,
      401,
      details
    );

    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }

  /**
   * Ошибка некорректных учетных данных
   */
  static invalidCredentials(): AuthenticationError {
    return new AuthenticationError(
      'Invalid email or password',
      { code: ErrorCode.INVALID_CREDENTIALS }
    );
  }

  /**
   * Ошибка истекшего токена
   */
  static tokenExpired(): AuthenticationError {
    return new AuthenticationError(
      'Token has expired',
      { code: ErrorCode.TOKEN_EXPIRED }
    );
  }

  /**
   * Ошибка некорректного токена
   */
  static invalidToken(): AuthenticationError {
    return new AuthenticationError(
      'Invalid token',
      { code: ErrorCode.TOKEN_INVALID }
    );
  }

  /**
   * Пользователь не найден
   */
  static userNotFound(): AuthenticationError {
    return new AuthenticationError(
      'User not found',
      { code: ErrorCode.USER_NOT_FOUND }
    );
  }

  /**
   * Пользователь неактивен
   */
  static userInactive(): AuthenticationError {
    return new AuthenticationError(
      'User account is inactive',
      { code: ErrorCode.USER_INACTIVE }
    );
  }

  /**
   * Требуется аутентификация
   */
  static required(): AuthenticationError {
    return new AuthenticationError(
      'Authentication required',
      { code: ErrorCode.AUTHENTICATION_REQUIRED }
    );
  }
}
