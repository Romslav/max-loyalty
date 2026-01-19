/**
 * Logger Service
 * Centralized logging for development and production
 * In development: logs to console
 * In production: sends to external service (Sentry/etc)
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  level: LogLevel
  timestamp: string
  message: string
  data?: Record<string, unknown>
  error?: {
    name: string
    message: string
    stack?: string
  }
}

class LoggerService {
  private isDevelopment = import.meta.env.MODE === 'development'
  private logs: LogEntry[] = []
  private maxLogs = 100 // Keep last 100 logs in memory

  /**
   * Create log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      level,
      timestamp: new Date().toISOString(),
      message,
      data,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    }
  }

  /**
   * Store log in memory
   */
  private storeLogs(entry: LogEntry): void {
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
  }

  /**
   * Format log for console
   */
  private formatConsoleLog(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
    error?: Error
  ): void {
    const styles: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: 'color: #666; font-weight: normal;',
      [LogLevel.INFO]: 'color: #0066cc; font-weight: bold;',
      [LogLevel.WARN]: 'color: #ff9900; font-weight: bold;',
      [LogLevel.ERROR]: 'color: #cc0000; font-weight: bold;',
    }

    const timestamp = new Date().toLocaleTimeString()
    const prefix = `%c[${timestamp}] [${level}]`

    console.log(prefix, styles[level], message)

    if (data && Object.keys(data).length > 0) {
      console.log('%cData:', 'color: #666; font-weight: bold;', data)
    }

    if (error) {
      console.error('%cError Details:', 'color: #cc0000; font-weight: bold;', error)
    }
  }

  /**
   * Send log to external service (Sentry, etc)
   * Implement based on your backend requirements
   */
  private async sendToExternalService(entry: LogEntry): Promise<void> {
    if (this.isDevelopment) return

    try {
      // TODO: Implement Sentry integration or custom backend logging
      // Example with Sentry:
      // import * as Sentry from '@sentry/react'
      // Sentry.captureMessage(entry.message, entry.level.toLowerCase() as any)

      // For now, just log to console in production
      if (entry.level === LogLevel.ERROR) {
        console.error('Log Entry (Production):', entry)
      }
    } catch (err) {
      console.error('Failed to send log to external service:', err)
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, data?: Record<string, unknown>): void {
    if (!this.isDevelopment) return

    const entry = this.createLogEntry(LogLevel.DEBUG, message, data)
    this.storeLogs(entry)
    this.formatConsoleLog(LogLevel.DEBUG, message, data)
  }

  /**
   * Info level logging
   */
  info(message: string, data?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, data)
    this.storeLogs(entry)
    this.formatConsoleLog(LogLevel.INFO, message, data)
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, data)
    this.storeLogs(entry)
    this.formatConsoleLog(LogLevel.WARN, message, data)
    this.sendToExternalService(entry)
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error, data?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, data, error)
    this.storeLogs(entry)
    this.formatConsoleLog(LogLevel.ERROR, message, data, error)
    this.sendToExternalService(entry)
  }

  /**
   * Log API call
   */
  logApiCall(
    method: string,
    url: string,
    status?: number,
    duration?: number,
    error?: Error
  ): void {
    const data: Record<string, unknown> = {
      method,
      url,
    }

    if (status) data.status = status
    if (duration) data.durationMs = duration

    const message = `API ${method} ${url}${status ? ` - ${status}` : ''}`

    if (error || (status && status >= 400)) {
      this.error(message, error, data)
    } else if (status) {
      this.debug(message, data)
    }
  }

  /**
   * Log user action
   */
  logUserAction(
    action: string,
    resource: string,
    details?: Record<string, unknown>
  ): void {
    const data = {
      action,
      resource,
      ...details,
    }
    this.info(`User action: ${action} on ${resource}`, data)
  }

  /**
   * Log authentication event
   */
  logAuthEvent(event: 'login' | 'logout' | 'register', data?: Record<string, unknown>): void {
    this.info(`Authentication event: ${event}`, data)
  }

  /**
   * Get all stored logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  /**
   * Clear stored logs
   */
  clearLogs(): void {
    this.logs = []
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

export const loggerService = new LoggerService()
export default loggerService
