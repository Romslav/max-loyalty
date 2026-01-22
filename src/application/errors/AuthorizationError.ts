/**
 * AuthorizationError - ошибка авторизации (недостаточно прав)
 */

import { AppError, ErrorCode } from './AppError';

export class AuthorizationError extends AppError {
  constructor(
    message: string,
    public readonly requiredRole?: string,
    public readonly userRole?: string,
    details?: Record<string, any>
  ) {
    super(
      ErrorCode.FORBIDDEN,
      message,
      403,
      {
        requiredRole,
        userRole,
        ...details,
      }
    );

    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }

  /**
   * Недостаточно прав доступа
   */
  static insufficientPermissions(): AuthorizationError {
    return new AuthorizationError(
      'You do not have permission to access this resource',
      undefined,
      undefined,
      { code: ErrorCode.INSUFFICIENT_PERMISSIONS }
    );
  }

  /**
   * Требуется определенная роль
   */
  static requiresRole(requiredRole: string, userRole?: string): AuthorizationError {
    return new AuthorizationError(
      `This action requires ${requiredRole} role`,
      requiredRole,
      userRole,
      { code: ErrorCode.INSUFFICIENT_PERMISSIONS }
    );
  }

  /**
   * Доступ запрещен
   */
  static forbidden(): AuthorizationError {
    return new AuthorizationError(
      'Access forbidden',
      undefined,
      undefined,
      { code: ErrorCode.FORBIDDEN }
    );
  }
}
