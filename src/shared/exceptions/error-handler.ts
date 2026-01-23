/**
 * Error Handler - Обработка ошибок
 */

import { AppError, ErrorType, ErrorSeverity, isAppError } from './app-error';

type ErrorCallback = (error: AppError) => void | Promise<void>;

interface ErrorHandlerConfig {
  onError?: ErrorCallback;
  onWarning?: ErrorCallback;
  onCritical?: ErrorCallback;
  logErrors?: boolean;
  logStackTrace?: boolean;
}

class ErrorHandler {
  private config: ErrorHandlerConfig;
  private errorCallbacks: Map<ErrorSeverity, ErrorCallback[]> = new Map();

  constructor(config: ErrorHandlerConfig = {}) {
    this.config = {
      logErrors: true,
      logStackTrace: true,
      ...config,
    };

    if (config.onError) this.on(ErrorSeverity.MEDIUM, config.onError);
    if (config.onWarning) this.on(ErrorSeverity.LOW, config.onWarning);
    if (config.onCritical) this.on(ErrorSeverity.CRITICAL, config.onCritical);
  }

  /**
   * Регистрировать callback на уровень серьезности
   */
  on(severity: ErrorSeverity, callback: ErrorCallback) {
    if (!this.errorCallbacks.has(severity)) {
      this.errorCallbacks.set(severity, []);
    }
    this.errorCallbacks.get(severity)!.push(callback);
  }

  /**
   * Отправить ошибку
   */
  async handle(error: unknown): Promise<AppError> {
    const appError = this.normalize(error);
    
    this.log(appError);
    await this.notify(appError);
    
    return appError;
  }

  /**
   * Нормализировать любую ошибку в AppError
   */
  normalize(error: unknown): AppError {
    // Already AppError
    if (isAppError(error)) {
      return error;
    }

    // Error instance
    if (error instanceof Error) {
      return new AppError(error.message, {
        type: ErrorType.UNKNOWN,
        statusCode: 500,
        severity: ErrorSeverity.HIGH,
        context: { originalError: error.name },
      });
    }

    // String error
    if (typeof error === 'string') {
      return new AppError(error, {
        type: ErrorType.UNKNOWN,
        statusCode: 500,
        severity: ErrorSeverity.MEDIUM,
      });
    }

    // Object error
    if (typeof error === 'object' && error !== null) {
      const obj = error as any;
      return new AppError(obj.message || 'Unknown error', {
        type: ErrorType.UNKNOWN,
        code: obj.code,
        statusCode: obj.statusCode || 500,
        severity: ErrorSeverity.MEDIUM,
        context: obj,
      });
    }

    // Fallback
    return new AppError('Unknown error occurred', {
      type: ErrorType.UNKNOWN,
      statusCode: 500,
      severity: ErrorSeverity.HIGH,
    });
  }

  /**
   * Логировать ошибку
   */
  private log(error: AppError) {
    if (!this.config.logErrors) return;

    const message = `[${error.severity.toUpperCase()}] ${error.type}: ${error.message}`;
    
    const logMethod = this.getLogMethod(error.severity);
    logMethod(message);

    if (this.config.logStackTrace && error.stack) {
      console.debug(error.stack);
    }

    if (Object.keys(error.context).length > 0) {
      console.debug('Context:', error.context);
    }
  }

  /**
   * Нотифицировать обработчиков
   */
  private async notify(error: AppError) {
    const callbacks = this.errorCallbacks.get(error.severity) || [];
    await Promise.all(callbacks.map(cb => cb(error).catch(console.error)));
  }

  /**
   * Получить метод логирования
   */
  private getLogMethod(severity: ErrorSeverity) {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return console.error;
      case ErrorSeverity.HIGH:
        return console.error;
      case ErrorSeverity.MEDIUM:
        return console.warn;
      case ErrorSeverity.LOW:
        return console.info;
      default:
        return console.log;
    }
  }

  /**
   * Очистить все callbacks
   */
  clear() {
    this.errorCallbacks.clear();
  }
}

export const errorHandler = new ErrorHandler();
export { ErrorHandler };
