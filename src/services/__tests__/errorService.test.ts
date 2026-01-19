import { describe, it, expect } from 'vitest'
import { errorService } from '../errorService'

describe('errorService', () => {
  describe('getErrorType', () => {
    it('should classify validation error (400)', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid input' },
        },
      }

      const type = errorService.getErrorType(error)
      expect(type).toBe('VALIDATION')
    })

    it('should classify authentication error (401)', () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      }

      const type = errorService.getErrorType(error)
      expect(type).toBe('AUTHENTICATION')
    })

    it('should classify authorization error (403)', () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Forbidden' },
        },
      }

      const type = errorService.getErrorType(error)
      expect(type).toBe('AUTHORIZATION')
    })

    it('should classify not found error (404)', () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      }

      const type = errorService.getErrorType(error)
      expect(type).toBe('NOT_FOUND')
    })

    it('should classify conflict error (409)', () => {
      const error = {
        response: {
          status: 409,
          data: { message: 'Conflict' },
        },
      }

      const type = errorService.getErrorType(error)
      expect(type).toBe('CONFLICT')
    })

    it('should classify rate limit error (429)', () => {
      const error = {
        response: {
          status: 429,
          data: { message: 'Too many requests' },
        },
      }

      const type = errorService.getErrorType(error)
      expect(type).toBe('RATE_LIMIT')
    })

    it('should classify server error (500+)', () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      }

      const type = errorService.getErrorType(error)
      expect(type).toBe('SERVER_ERROR')
    })

    it('should classify network error', () => {
      const error = new Error('Network error')

      const type = errorService.getErrorType(error)
      expect(type).toBe('NETWORK_ERROR')
    })

    it('should classify unknown error', () => {
      const error = { message: 'Unknown error' }

      const type = errorService.getErrorType(error)
      expect(type).toBe('UNKNOWN')
    })
  })

  describe('getErrorMessage', () => {
    it('should return friendly validation message', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid email format' },
        },
      }

      const message = errorService.getErrorMessage(error)
      expect(message).toContain('invalid')
      expect(message.length > 0).toBe(true)
    })

    it('should return friendly auth message', () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Token expired' },
        },
      }

      const message = errorService.getErrorMessage(error)
      expect(message.length > 0).toBe(true)
    })

    it('should return friendly permission message', () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Access denied' },
        },
      }

      const message = errorService.getErrorMessage(error)
      expect(message.length > 0).toBe(true)
    })

    it('should return default message for unknown error', () => {
      const error = new Error('Something went wrong')

      const message = errorService.getErrorMessage(error)
      expect(message.length > 0).toBe(true)
    })
  })

  describe('getValidationErrors', () => {
    it('should extract validation errors from 400 response', () => {
      const error = {
        response: {
          status: 400,
          data: {
            errors: {
              email: 'Invalid email',
              password: 'Password too short',
            },
          },
        },
      }

      const validationErrors = errorService.getValidationErrors(error)
      expect(validationErrors).toEqual({
        email: 'Invalid email',
        password: 'Password too short',
      })
    })

    it('should return empty object for non-validation errors', () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      }

      const validationErrors = errorService.getValidationErrors(error)
      expect(validationErrors).toEqual({})
    })

    it('should handle missing validation data', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Bad request' },
        },
      }

      const validationErrors = errorService.getValidationErrors(error)
      expect(validationErrors).toEqual({})
    })
  })

  describe('handleError', () => {
    it('should handle error and return structured response', () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      }

      const handled = errorService.handleError(error)

      expect(handled).toHaveProperty('type')
      expect(handled).toHaveProperty('message')
      expect(handled).toHaveProperty('status')
      expect(handled.type).toBe('AUTHENTICATION')
    })
  })

  describe('isRetryable', () => {
    it('should return true for network errors', () => {
      const error = new Error('Network error')
      expect(errorService.isRetryable(error)).toBe(true)
    })

    it('should return true for 429 rate limit', () => {
      const error = {
        response: { status: 429 },
      }

      expect(errorService.isRetryable(error)).toBe(true)
    })

    it('should return true for 5xx server errors', () => {
      const error = {
        response: { status: 503 },
      }

      expect(errorService.isRetryable(error)).toBe(true)
    })

    it('should return false for 4xx client errors', () => {
      const error = {
        response: { status: 401 },
      }

      expect(errorService.isRetryable(error)).toBe(false)
    })
  })
})
