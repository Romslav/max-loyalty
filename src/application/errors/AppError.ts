/**
 * AppError - базовый класс для ошибок приложения
 * 
 * Все ошибки приложения должны наследоваться от этого класса
 * для единообразной обработки
 */

export enum ErrorCode {
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Authentication errors
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_INACTIVE = 'USER_INACTIVE',

  // Authorization errors
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // Business logic errors
  INSUFFICIENT_POINTS = 'INSUFFICIENT_POINTS',
  POINTS_EXPIRED = 'POINTS_EXPIRED',
  OPERATION_FAILED = 'OPERATION_FAILED',
  INVALID_OPERATION = 'INVALID_OPERATION',

  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

/**
 * Основной класс для ошибок приложения
 */
export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, any>,
    public readonly timestamp: Date = new Date()
  ) {
    super(message);
    this.name = this.constructor.name;

    // Для правильного наследования в TypeScript
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * Преобразовать в JSON для отправки клиенту
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
    };
  }

  /**
   * Получить HTTP статус код
   */
  getStatusCode(): number {
    return this.statusCode;
  }

  /**
   * Проверить, является ли это ошибка клиента (4xx)
   */
  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Проверить, является ли это ошибка сервера (5xx)
   */
  isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

/**
 * Helper для проверки является ли ошибка AppError
 */
export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}

/**
 * Трансформировать неизвестную ошибку в AppError
 */
export function transformToAppError(error: any): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      error.message,
      500,
      { originalError: error.name }
    );
  }

  return new AppError(
    ErrorCode.INTERNAL_SERVER_ERROR,
    'An unexpected error occurred',
    500,
    { originalError: String(error) }
  );
}
