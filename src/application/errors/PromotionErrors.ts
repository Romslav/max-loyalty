/**
 * Promotion Domain Errors
 * 
 * Custom error classes for promotion-related errors.
 * Production-ready error handling.
 */

/**
 * Base error for validation failures
 */
export class ValidationError extends Error {
  constructor(
    public errors: Record<string, string>,
  ) {
    super('Validation failed')
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

/**
 * Error for operation failures
 */
export class OperationFailedError extends Error {
  constructor(
    public operation: string,
    public reason: string,
  ) {
    super(`Operation failed: ${operation} - ${reason}`)
    this.name = 'OperationFailedError'
    Object.setPrototypeOf(this, OperationFailedError.prototype)
  }
}

/**
 * Error for promotion not found
 */
export class PromotionNotFoundError extends Error {
  constructor(public identifier: string) {
    super(`Promotion not found: ${identifier}`)
    this.name = 'PromotionNotFoundError'
    Object.setPrototypeOf(this, PromotionNotFoundError.prototype)
  }
}

/**
 * Error for invalid promotion code
 */
export class InvalidPromotionCodeError extends Error {
  constructor(public code: string) {
    super(`Invalid promotion code: ${code}`)
    this.name = 'InvalidPromotionCodeError'
    Object.setPrototypeOf(this, InvalidPromotionCodeError.prototype)
  }
}

/**
 * Error for promotion already exists
 */
export class PromotionAlreadyExistsError extends Error {
  constructor(public code: string) {
    super(`Promotion with code "${code}" already exists`)
    this.name = 'PromotionAlreadyExistsError'
    Object.setPrototypeOf(this, PromotionAlreadyExistsError.prototype)
  }
}

/**
 * Error for guest ineligibility
 */
export class GuestIneligibleError extends Error {
  constructor(
    public guestId: string,
    public reason: string,
  ) {
    super(`Guest ${guestId} is ineligible: ${reason}`)
    this.name = 'GuestIneligibleError'
    Object.setPrototypeOf(this, GuestIneligibleError.prototype)
  }
}

/**
 * Error for expired promotion
 */
export class PromotionExpiredError extends Error {
  constructor(public promotionId: string) {
    super(`Promotion ${promotionId} has expired`)
    this.name = 'PromotionExpiredError'
    Object.setPrototypeOf(this, PromotionExpiredError.prototype)
  }
}

/**
 * Error for insufficient permissions
 */
export class InsufficientPermissionsError extends Error {
  constructor(
    public userId: string,
    public action: string,
  ) {
    super(`User ${userId} does not have permission to ${action}`)
    this.name = 'InsufficientPermissionsError'
    Object.setPrototypeOf(this, InsufficientPermissionsError.prototype)
  }
}

export default {
  ValidationError,
  OperationFailedError,
  PromotionNotFoundError,
  InvalidPromotionCodeError,
  PromotionAlreadyExistsError,
  GuestIneligibleError,
  PromotionExpiredError,
  InsufficientPermissionsError,
}
