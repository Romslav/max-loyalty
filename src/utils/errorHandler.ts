import axios from 'axios';

export type ErrorType = 'network' | 'timeout' | 'auth' | 'validation' | 'server' | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string | number;
  statusCode?: number;
}

/**
 * Converts various error types to standardized AppError
 */
export const handleError = (error: unknown): AppError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (error.code === 'ECONNABORTED') {
      return {
        type: 'timeout',
        message: 'Request timeout. Please check your connection.',
        code: 'TIMEOUT',
        statusCode: status,
      };
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return {
        type: 'network',
        message: 'Network error. API server is unreachable.',
        code: error.code,
        statusCode: status,
      };
    }

    if (!error.response) {
      return {
        type: 'network',
        message: 'Network error. Please check your internet connection.',
        code: 'NO_RESPONSE',
      };
    }

    if (status === 401) {
      return {
        type: 'auth',
        message: 'Invalid email or password. Please try again.',
        code: 'INVALID_CREDENTIALS',
        statusCode: 401,
      };
    }

    if (status === 403) {
      return {
        type: 'auth',
        message: 'Access denied. You do not have permission.',
        code: 'FORBIDDEN',
        statusCode: 403,
      };
    }

    if (status === 422 || status === 400) {
      return {
        type: 'validation',
        message: message || 'Validation failed. Please check your input.',
        code: 'VALIDATION_ERROR',
        statusCode: status,
      };
    }

    if (status === 429) {
      return {
        type: 'server',
        message: 'Too many attempts. Please try again later.',
        code: 'RATE_LIMITED',
        statusCode: 429,
      };
    }

    if (status === 500 || status === 502 || status === 503) {
      return {
        type: 'server',
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR',
        statusCode: status,
      };
    }

    return {
      type: 'server',
      message: message || 'An error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
      statusCode: status,
    };
  }

  if (error instanceof Error) {
    return {
      type: 'unknown',
      message: error.message,
      code: 'ERROR',
    };
  }

  return {
    type: 'unknown',
    message: 'An unexpected error occurred.',
    code: 'UNKNOWN',
  };
};

/**
 * Gets user-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  const appError = handleError(error);
  return appError.message;
};

/**
 * Check if error is network-related
 */
export const isNetworkError = (error: unknown): boolean => {
  const appError = handleError(error);
  return appError.type === 'network' || appError.type === 'timeout';
};

/**
 * Check if error is auth-related
 */
export const isAuthError = (error: unknown): boolean => {
  const appError = handleError(error);
  return appError.type === 'auth';
};
