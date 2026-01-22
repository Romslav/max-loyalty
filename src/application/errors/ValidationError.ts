/**
 * ValidationError - ошибка валидации входных данных
 */

import { AppError, ErrorCode } from './AppError';

export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: any,
    details?: Record<string, any>
  ) {
    super(
      ErrorCode.VALIDATION_ERROR,
      message,
      400,
      {
        field,
        value,
        ...details,
      }
    );

    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  /**
   * Создать ошибку валидации для отсутствующего поля
   */
  static missingField(fieldName: string): ValidationError {
    return new ValidationError(
      `Field "${fieldName}" is required`,
      fieldName,
      undefined,
      { code: ErrorCode.MISSING_REQUIRED_FIELD }
    );
  }

  /**
   * Создать ошибку валидации для некорректного email
   */
  static invalidEmail(email: string): ValidationError {
    return new ValidationError(
      'Invalid email format',
      'email',
      email,
      { code: ErrorCode.INVALID_EMAIL }
    );
  }

  /**
   * Создать ошибку валидации для слабого пароля
   */
  static invalidPassword(reason?: string): ValidationError {
    return new ValidationError(
      reason || 'Password does not meet security requirements',
      'password',
      undefined,
      { code: ErrorCode.INVALID_PASSWORD }
    );
  }

  /**
   * Создать ошибку валидации для некорректного ввода
   */
  static invalidInput(message: string, field?: string): ValidationError {
    return new ValidationError(
      message,
      field,
      undefined,
      { code: ErrorCode.INVALID_INPUT }
    );
  }

  /**
   * Создать ошибку валидации с несколькими ошибками полей
   */
  static multipleErrors(errors: Array<{ field: string; message: string }>): ValidationError {
    const errorMap = Object.fromEntries(
      errors.map((e) => [e.field, e.message])
    );

    return new ValidationError(
      `Multiple validation errors: ${errors.length} field(s)`,
      undefined,
      undefined,
      { errors: errorMap }
    );
  }
}
