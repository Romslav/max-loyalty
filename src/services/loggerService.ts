import * as Sentry from '@sentry/react';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
}

/**
 * Centralized logging service
 * Logs to console in development, Sentry in production
 */
class LoggerService {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}${
      data ? ` ${JSON.stringify(data)}` : ''
    }`;
  }

  debug(message: string, data?: any, source?: string): void {
    this.log(LogLevel.DEBUG, message, data, source);
  }

  info(message: string, data?: any, source?: string): void {
    this.log(LogLevel.INFO, message, data, source);
  }

  warn(message: string, data?: any, source?: string): void {
    this.log(LogLevel.WARN, message, data, source);
  }

  error(message: string, data?: any, source?: string): void {
    this.log(LogLevel.ERROR, message, data, source);
  }

  private log(
    level: LogLevel,
    message: string,
    data?: any,
    source?: string
  ): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data: this.sanitizeData(data),
      source,
    };

    this.addToHistory(entry);

    // Log to console in development
    if (import.meta.env.DEV) {
      const formattedMessage = this.formatMessage(level, message, data);
      console[level as keyof typeof console](formattedMessage);
    }

    // Send to Sentry in production or if enabled
    if (
      import.meta.env.PROD ||
      (import.meta.env.VITE_LOG_TO_SENTRY === 'true')
    ) {
      this.sendToSentry(level, message, data);
    }
  }

  private sendToSentry(
    level: LogLevel,
    message: string,
    data?: any
  ): void {
    const sentryLevel = level === LogLevel.ERROR ? 'error' : 'info';
    Sentry.captureMessage(message, sentryLevel);

    if (data) {
      Sentry.setContext('additionalData', data);
    }
  }

  private sanitizeData(data: any): any {
    if (!data) return undefined;

    // Don't log sensitive data
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'apiKey',
      'authorization',
    ];

    if (typeof data === 'object') {
      const sanitized = { ...data };
      sensitiveKeys.forEach((key) => {
        if (sanitized[key]) {
          sanitized[key] = '***REDACTED***';
        }
      });
      return sanitized;
    }

    return data;
  }

  private addToHistory(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  getHistory(level?: LogLevel, limit = 50): LogEntry[] {
    let filtered = this.logs;
    if (level) {
      filtered = filtered.filter((log) => log.level === level);
    }
    return filtered.slice(-limit);
  }

  clearHistory(): void {
    this.logs = [];
  }
}

export const logger = new LoggerService();