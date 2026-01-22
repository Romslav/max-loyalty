/**
 * BusinessLogicError - ошибка бизнес-логики
 */

import { AppError, ErrorCode } from './AppError';

export class BusinessLogicError extends AppError {
  constructor(
    code: ErrorCode,
    message: string,
    details?: Record<string, any>
  ) {
    super(
      code,
      message,
      400,
      details
    );

    Object.setPrototypeOf(this, BusinessLogicError.prototype);
  }

  /**
   * Недостаточно баллов для операции
   */
  static insufficientPoints(required: number, available: number): BusinessLogicError {
    return new BusinessLogicError(
      ErrorCode.INSUFFICIENT_POINTS,
      `Insufficient points. Required: ${required}, Available: ${available}`,
      { required, available }
    );
  }

  /**
   * Баллы истекли
   */
  static pointsExpired(): BusinessLogicError {
    return new BusinessLogicError(
      ErrorCode.POINTS_EXPIRED,
      'Points have expired',
      {}
    );
  }

  /**
   * Операция не прошла
   */
  static operationFailed(reason: string): BusinessLogicError {
    return new BusinessLogicError(
      ErrorCode.OPERATION_FAILED,
      `Operation failed: ${reason}`,
      { reason }
    );
  }

  /**
   * Некорректная операция
   */
  static invalidOperation(message: string): BusinessLogicError {
    return new BusinessLogicError(
      ErrorCode.INVALID_OPERATION,
      message,
      {}
    );
  }

  /**
   * Конфликт данных
   */
  static conflict(message: string, details?: Record<string, any>): BusinessLogicError {
    return new BusinessLogicError(
      ErrorCode.CONFLICT,
      message,
      details
    );
  }

  /**
   * Ресурс уже существует
   */
  static alreadyExists(resourceType: string, identifier: string): BusinessLogicError {
    return new BusinessLogicError(
      ErrorCode.ALREADY_EXISTS,
      `${resourceType} with ${identifier} already exists`,
      { resourceType, identifier }
    );
  }
}
