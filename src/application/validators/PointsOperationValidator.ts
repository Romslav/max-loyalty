/**
 * PointsOperationValidator
 * 
 * Validates input for points operations with comprehensive rule set.
 * Ensures data integrity and business rule compliance.
 */

export interface CreatePointsOperationInput {
  guestId: string
  restaurantId: string
  operationType: 'add' | 'redeem' | 'transfer'
  amount: number
  description: string
  recipientGuestId?: string
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export class PointsOperationValidator {
  /**
   * Validates create operation input
   * @returns Array of validation errors (empty if valid)
   */
  validate(input: CreatePointsOperationInput): ValidationError[] {
    const errors: ValidationError[] = []

    // Guest ID validation
    if (!input.guestId || input.guestId.trim().length === 0) {
      errors.push({
        field: 'guestId',
        message: 'Guest ID is required',
        code: 'GUEST_ID_REQUIRED',
      })
    } else if (!this.isValidId(input.guestId)) {
      errors.push({
        field: 'guestId',
        message: 'Guest ID format is invalid',
        code: 'GUEST_ID_INVALID',
      })
    }

    // Restaurant ID validation
    if (!input.restaurantId || input.restaurantId.trim().length === 0) {
      errors.push({
        field: 'restaurantId',
        message: 'Restaurant ID is required',
        code: 'RESTAURANT_ID_REQUIRED',
      })
    } else if (!this.isValidId(input.restaurantId)) {
      errors.push({
        field: 'restaurantId',
        message: 'Restaurant ID format is invalid',
        code: 'RESTAURANT_ID_INVALID',
      })
    }

    // Operation type validation
    if (!input.operationType) {
      errors.push({
        field: 'operationType',
        message: 'Operation type is required',
        code: 'OPERATION_TYPE_REQUIRED',
      })
    } else if (!['add', 'redeem', 'transfer'].includes(input.operationType)) {
      errors.push({
        field: 'operationType',
        message: 'Operation type must be one of: add, redeem, transfer',
        code: 'OPERATION_TYPE_INVALID',
      })
    }

    // Amount validation
    if (input.amount === undefined || input.amount === null) {
      errors.push({
        field: 'amount',
        message: 'Amount is required',
        code: 'AMOUNT_REQUIRED',
      })
    } else if (!Number.isFinite(input.amount)) {
      errors.push({
        field: 'amount',
        message: 'Amount must be a valid number',
        code: 'AMOUNT_INVALID',
      })
    } else if (input.amount <= 0) {
      errors.push({
        field: 'amount',
        message: 'Amount must be greater than 0',
        code: 'AMOUNT_POSITIVE',
      })
    } else if (input.amount > 1000000) {
      errors.push({
        field: 'amount',
        message: 'Amount exceeds maximum allowed value (1,000,000)',
        code: 'AMOUNT_MAX_EXCEEDED',
      })
    }

    // Description validation
    if (!input.description || input.description.trim().length === 0) {
      errors.push({
        field: 'description',
        message: 'Description is required',
        code: 'DESCRIPTION_REQUIRED',
      })
    } else if (input.description.length > 500) {
      errors.push({
        field: 'description',
        message: 'Description must not exceed 500 characters',
        code: 'DESCRIPTION_TOO_LONG',
      })
    }

    // Transfer-specific validation
    if (input.operationType === 'transfer') {
      if (!input.recipientGuestId || input.recipientGuestId.trim().length === 0) {
        errors.push({
          field: 'recipientGuestId',
          message: 'Recipient Guest ID is required for transfer operations',
          code: 'RECIPIENT_GUEST_ID_REQUIRED',
        })
      } else if (!this.isValidId(input.recipientGuestId)) {
        errors.push({
          field: 'recipientGuestId',
          message: 'Recipient Guest ID format is invalid',
          code: 'RECIPIENT_GUEST_ID_INVALID',
        })
      }

      if (input.guestId === input.recipientGuestId) {
        errors.push({
          field: 'recipientGuestId',
          message: 'Cannot transfer points to the same guest',
          code: 'TRANSFER_SAME_GUEST',
        })
      }
    }

    return errors
  }

  /**
   * Check if validation passed
   */
  isValid(input: CreatePointsOperationInput): boolean {
    return this.validate(input).length === 0
  }

  /**
   * Get validation errors as a map
   */
  getErrorsMap(input: CreatePointsOperationInput): Record<string, string> {
    const errors = this.validate(input)
    return errors.reduce(
      (map, error) => {
        map[error.field] = error.message
        return map
      },
      {} as Record<string, string>,
    )
  }

  /**
   * Validate ID format (UUID v4 or alphanumeric with hyphens)
   */
  private isValidId(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const alphanumericRegex = /^[a-zA-Z0-9_-]+$/
    return uuidRegex.test(id) || alphanumericRegex.test(id)
  }
}
