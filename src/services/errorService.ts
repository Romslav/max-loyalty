import axios, { AxiosError } from 'axios'

/**
 * Standardized API Error Response
 */
export interface ApiError {
  statusCode: number
  message: string
  details?: Record<string, unknown>
  timestamp: string
}

/**
 * Error Classification
 */
export enum ErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  RATE_LIMIT = 'rate_limit',
  SERVER_ERROR = 'server_error',
  NETWORK_ERROR = 'network_error',
  UNKNOWN = 'unknown',
}

/**
 * Parse and classify API errors
 */
export const errorService = {
  /**
   * Get error type from HTTP status code
   */
  getErrorType(statusCode: number): ErrorType {
    switch (true) {
      case statusCode === 400:
        return ErrorType.VALIDATION
      case statusCode === 401:
        return ErrorType.AUTHENTICATION
      case statusCode === 403:
        return ErrorType.AUTHORIZATION
      case statusCode === 404:
        return ErrorType.NOT_FOUND
      case statusCode === 409:
        return ErrorType.CONFLICT
      case statusCode === 429:
        return ErrorType.RATE_LIMIT
      case statusCode >= 500:
        return ErrorType.SERVER_ERROR
      default:
        return ErrorType.UNKNOWN
    }
  },

  /**
   * Get user-friendly error message
   */
  getErrorMessage(error: unknown): string {
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>
      const status = axiosError.response?.status
      const data = axiosError.response?.data

      // Custom API error message
      if (data?.message) {
        return data.message
      }

      // Status-based fallback messages
      switch (status) {
        case 400:
          return 'Invalid request. Please check your input.'
        case 401:
          return 'Authentication failed. Please log in again.'
        case 403:
          return 'You do not have permission to perform this action.'
        case 404:
          return 'Resource not found.'
        case 409:
          return 'This resource already exists.'
        case 429:
          return 'Too many requests. Please try again later.'
        case 500:
          return 'Server error. Please try again later.'
        case 503:
          return 'Service unavailable. Please try again later.'
        default:
          return axiosError.message || 'An error occurred.'
      }
    }

    // Handle standard Error objects
    if (error instanceof Error) {
      return error.message
    }

    // Handle string errors
    if (typeof error === 'string') {
      return error
    }

    // Fallback
    return 'An unexpected error occurred.'
  },

  /**
   * Check if error is specific type
   */
  isValidationError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return error.response?.status === 400
    }
    return false
  },

  isAuthenticationError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return error.response?.status === 401
    }
    return false
  },

  isAuthorizationError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return error.response?.status === 403
    }
    return false
  },

  isNotFoundError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return error.response?.status === 404
    }
    return false
  },

  isServerError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      return status ? status >= 500 : false
    }
    return false
  },

  isNetworkError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return !error.response
    }
    return false
  },

  /**
   * Extract validation errors from response
   */
  getValidationErrors(error: unknown): Record<string, string> {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as any
      if (data?.details && typeof data.details === 'object') {
        return data.details as Record<string, string>
      }
    }
    return {}
  },

  /**
   * Format error for logging
   */
  formatErrorForLogging(error: unknown): Record<string, unknown> {
    const formatted: Record<string, unknown> = {
      message: this.getErrorMessage(error),
      type: 'unknown',
      timestamp: new Date().toISOString(),
    }

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>
      formatted.type = this.getErrorType(axiosError.response?.status || 0)
      formatted.statusCode = axiosError.response?.status
      formatted.url = axiosError.config?.url
      formatted.method = axiosError.config?.method?.toUpperCase()
    } else if (error instanceof Error) {
      formatted.stack = error.stack
    }

    return formatted
  },
}

export default errorService
