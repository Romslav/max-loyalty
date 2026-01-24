/**
 * Points Operation Errors
 * 
 * Domain-specific errors for points operations.
 * Includes proper HTTP status codes and error codes for API responses.
 */

export interface ErrorResponse {
  code: string
  message: string
  details?: Record<string, any>
}

/**
 * Base application error
 */
export class ApplicationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly httpStatus: number = 400,
    public readonly details?: Record<string, any>,
  ) {
    super(message)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, ApplicationError.prototype)
  }

  toJSON(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    }
  }
}

/**
 * Insufficient points error
 */
export class InsufficientPointsError extends ApplicationError {
  constructor(currentBalance: number, requiredAmount: number) {
    super(
      'INSUFFICIENT_POINTS',
      `Insufficient points balance. Current: ${currentBalance}, Required: ${requiredAmount}`,
      400,
      {
        currentBalance,
        requiredAmount,
        shortage: requiredAmount - currentBalance,
      },
    )
    Object.setPrototypeOf(this, InsufficientPointsError.prototype)
  }
}

/**
 * Guest not found error
 */
export class GuestNotFoundError extends ApplicationError {
  constructor(guestId: string) {
    super(
      'GUEST_NOT_FOUND',
      `Guest with ID "${guestId}" not found`,
      404,
      { guestId },
    )
    Object.setPrototypeOf(this, GuestNotFoundError.prototype)
  }
}

/**
 * Restaurant not found error
 */
export class RestaurantNotFoundError extends ApplicationError {
  constructor(restaurantId: string) {
    super(
      'RESTAURANT_NOT_FOUND',
      `Restaurant with ID "${restaurantId}" not found`,
      404,
      { restaurantId },
    )
    Object.setPrototypeOf(this, RestaurantNotFoundError.prototype)
  }
}

/**
 * Validation error with field-level details
 */
export class ValidationError extends ApplicationError {
  constructor(public readonly errors: Record<string, string>) {
    super(
      'VALIDATION_ERROR',
      'Validation failed',
      422,
      { fieldErrors: errors },
    )
    Object.setPrototypeOf(this, ValidationError.prototype)
  }

  getFieldError(field: string): string | undefined {
    return this.errors[field]
  }

  hasFieldError(field: string): boolean {
    return field in this.errors
  }
}

/**
 * Operation already exists error
 */
export class OperationAlreadyExistsError extends ApplicationError {
  constructor(operationId: string) {
    super(
      'OPERATION_ALREADY_EXISTS',
      `Operation with ID "${operationId}" already exists`,
      409,
      { operationId },
    )
    Object.setPrototypeOf(this, OperationAlreadyExistsError.prototype)
  }
}

/**
 * Invalid operation state error
 */
export class InvalidOperationStateError extends ApplicationError {
  constructor(operationId: string, currentState: string, requestedAction: string) {
    super(
      'INVALID_OPERATION_STATE',
      `Cannot ${requestedAction} operation in state "${currentState}"`,
      409,
      { operationId, currentState, requestedAction },
    )
    Object.setPrototypeOf(this, InvalidOperationStateError.prototype)
  }
}

/**
 * Operation failed error
 */
export class OperationFailedError extends ApplicationError {
  constructor(operationId: string, reason: string) {
    super(
      'OPERATION_FAILED',
      `Operation failed: ${reason}`,
      500,
      { operationId, reason },
    )
    Object.setPrototypeOf(this, OperationFailedError.prototype)
  }
}

/**
 * Network/API error
 */
export class NetworkError extends ApplicationError {
  constructor(message: string, originalError?: Error) {
    super(
      'NETWORK_ERROR',
      message,
      503,
      originalError ? { originalMessage: originalError.message } : undefined,
    )
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

/**
 * Unauthorized error
 */
export class UnauthorizedError extends ApplicationError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', message, 401)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

/**
 * Forbidden error
 */
export class ForbiddenError extends ApplicationError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', message, 403)
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}
