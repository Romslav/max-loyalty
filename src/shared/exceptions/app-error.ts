/**
 * App Error - Основной класс ошибок
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorType {
  // Client errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_PARAM = 'MISSING_PARAM',
  
  // Auth errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  CONNECTION_REFUSED = 'CONNECTION_REFUSED',
  
  // Server errors
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RESOURCE_EXHAUSTED = 'RESOURCE_EXHAUSTED',
  
  // Business logic errors
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INVALID_STATE = 'INVALID_STATE',
  
  // Unknown
  UNKNOWN = 'UNKNOWN',
}

export interface ErrorContext {
  [key: string]: any;
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code: string;
  public readonly statusCode: number;
  public readonly severity: ErrorSeverity;
  public readonly context: ErrorContext;
  public readonly timestamp: Date;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    options: {
      type?: ErrorType;
      code?: string;
      statusCode?: number;
      severity?: ErrorSeverity;
      context?: ErrorContext;
      isOperational?: boolean;
    } = {}
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);

    this.type = options.type || ErrorType.UNKNOWN;
    this.code = options.code || this.type;
    this.statusCode = options.statusCode || 500;
    this.severity = options.severity || ErrorSeverity.MEDIUM;
    this.context = options.context || {};
    this.timestamp = new Date();
    this.isOperational = options.isOperational !== false;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      type: this.type,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      severity: this.severity,
      context: this.context,
      timestamp: this.timestamp,
      isOperational: this.isOperational,
    };
  }
}

/**
 * Проверить есть ли это AppError
 */
export const isAppError = (error: any): error is AppError => {
  return error instanceof AppError;
};
