/**
 * ✅ FIXED: Promotion Errors - Code Audit Corrections
 * Fixed 1 error related to error codes and status codes
 */

/**
 * Base error class for promotion domain
 * ✅ FIX #15: Added proper error codes and statusCode
 */
export abstract class PromotionError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode
    };
  }
}

/**
 * Validation error
 */
export class ValidationError extends PromotionError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
}

/**
 * Operation failed error
 */
export class OperationFailedError extends PromotionError {
  readonly code = 'OPERATION_FAILED';
  readonly statusCode = 500;
}

/**
 * Promotion not found error
 */
export class PromotionNotFoundError extends PromotionError {
  readonly code = 'PROMOTION_NOT_FOUND';
  readonly statusCode = 404;
}

/**
 * Invalid promotion code error
 */
export class InvalidPromotionCodeError extends PromotionError {
  readonly code = 'INVALID_PROMOTION_CODE';
  readonly statusCode = 400;
}

/**
 * Promotion already exists error
 */
export class PromotionAlreadyExistsError extends PromotionError {
  readonly code = 'PROMOTION_ALREADY_EXISTS';
  readonly statusCode = 409;
}

/**
 * Guest ineligible error
 */
export class GuestIneligibleError extends PromotionError {
  readonly code = 'GUEST_INELIGIBLE';
  readonly statusCode = 403;
}

/**
 * Promotion expired error
 */
export class PromotionExpiredError extends PromotionError {
  readonly code = 'PROMOTION_EXPIRED';
  readonly statusCode = 410;
}

/**
 * Insufficient permissions error
 */
export class InsufficientPermissionsError extends PromotionError {
  readonly code = 'INSUFFICIENT_PERMISSIONS';
  readonly statusCode = 403;
}
