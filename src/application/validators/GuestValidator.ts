/**
 * GuestValidator
 * 
 * Validates input for guest creation and updates.
 * Comprehensive validation rules for email, phone, name.
 */

export interface CreateGuestInput {
  email: string
  phone: string
  firstName: string
  lastName: string
  referredBy?: string
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export class GuestValidator {
  /**
   * Validate create guest input
   * @returns Array of validation errors (empty if valid)
   */
  validate(input: CreateGuestInput): ValidationError[] {
    const errors: ValidationError[] = []

    // Email validation
    if (!input.email || input.email.trim().length === 0) {
      errors.push({
        field: 'email',
        message: 'Email is required',
        code: 'EMAIL_REQUIRED',
      })
    } else if (!this.isValidEmail(input.email)) {
      errors.push({
        field: 'email',
        message: 'Email format is invalid',
        code: 'EMAIL_INVALID',
      })
    }

    // Phone validation
    if (!input.phone || input.phone.trim().length === 0) {
      errors.push({
        field: 'phone',
        message: 'Phone is required',
        code: 'PHONE_REQUIRED',
      })
    } else if (!this.isValidPhone(input.phone)) {
      errors.push({
        field: 'phone',
        message: 'Phone format is invalid (min 10 digits)',
        code: 'PHONE_INVALID',
      })
    }

    // First name validation
    if (!input.firstName || input.firstName.trim().length === 0) {
      errors.push({
        field: 'firstName',
        message: 'First name is required',
        code: 'FIRST_NAME_REQUIRED',
      })
    } else if (input.firstName.length > 100) {
      errors.push({
        field: 'firstName',
        message: 'First name must not exceed 100 characters',
        code: 'FIRST_NAME_TOO_LONG',
      })
    }

    // Last name validation
    if (!input.lastName || input.lastName.trim().length === 0) {
      errors.push({
        field: 'lastName',
        message: 'Last name is required',
        code: 'LAST_NAME_REQUIRED',
      })
    } else if (input.lastName.length > 100) {
      errors.push({
        field: 'lastName',
        message: 'Last name must not exceed 100 characters',
        code: 'LAST_NAME_TOO_LONG',
      })
    }

    // Referral code validation (optional but if provided, validate format)
    if (input.referredBy && input.referredBy.trim().length > 0) {
      if (!this.isValidId(input.referredBy)) {
        errors.push({
          field: 'referredBy',
          message: 'Referral code format is invalid',
          code: 'REFERRAL_CODE_INVALID',
        })
      }
    }

    return errors
  }

  /**
   * Check if validation passed
   */
  isValid(input: CreateGuestInput): boolean {
    return this.validate(input).length === 0
  }

  /**
   * Get validation errors as a map
   */
  getErrorsMap(input: CreateGuestInput): Record<string, string> {
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
   * Validate email format
   * RFC 5322 simplified
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 255
  }

  /**
   * Validate phone format (at least 10 digits)
   */
  private isValidPhone(phone: string): boolean {
    const digitsOnly = phone.replace(/\D/g, '')
    return digitsOnly.length >= 10
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
