/**
 * NotFoundError - ошибка когда ресурс не найден
 */

import { AppError, ErrorCode } from './AppError';

export class NotFoundError extends AppError {
  constructor(
    public readonly resourceType: string,
    public readonly resourceId?: string,
    details?: Record<string, any>
  ) {
    const message = resourceId
      ? `${resourceType} with id "${resourceId}" not found`
      : `${resourceType} not found`;

    super(
      ErrorCode.NOT_FOUND,
      message,
      404,
      {
        resourceType,
        resourceId,
        ...details,
      }
    );

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  /**
   * Пользователь не найден
   */
  static userNotFound(userId: string): NotFoundError {
    return new NotFoundError('User', userId);
  }

  /**
   * Гость не найден
   */
  static guestNotFound(guestId: string): NotFoundError {
    return new NotFoundError('Guest', guestId);
  }

  /**
   * Ресторан не найден
   */
  static restaurantNotFound(restaurantId: string): NotFoundError {
    return new NotFoundError('Restaurant', restaurantId);
  }

  /**
   * Операция не найдена
   */
  static operationNotFound(operationId: string): NotFoundError {
    return new NotFoundError('Operation', operationId);
  }
}
