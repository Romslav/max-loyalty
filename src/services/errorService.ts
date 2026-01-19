import * as Sentry from '@sentry/react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Centralized error handling service
 * Maps HTTP error codes to user-friendly messages
 */
export const errorService = {
  /**
   * Handle API errors with appropriate logging and user feedback
   */
  handleError(error: any): void {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 400:
          this.handleValidationError(error);
          break;
        case 401:
          this.handleAuthError(error);
          break;
        case 403:
          this.handlePermissionError(error);
          break;
        case 404:
          this.handleNotFoundError(error);
          break;
        case 500:
          this.handleServerError(error);
          break;
        default:
          this.handleGenericError(error);
      }
    } else {
      this.handleGenericError(error);
    }
  },

  /**
   * Handle 400 validation errors
   */
  private handleValidationError(error: ApiError): void {
    console.error('Validation error:', error.data);
    const message = error.data?.message || 'Please check your input and try again';
    toast.error(message);
    Sentry.captureMessage(`Validation error: ${message}`, 'warning');
  },

  /**
   * Handle 401 authentication errors
   */
  private handleAuthError(error: ApiError): void {
    console.error('Auth error:', error);
    toast.error('Your session has expired. Please login again.');
    // Trigger logout
    useAuthStore.getState().logout();
    window.location.href = '/auth/login';
    Sentry.captureMessage('Authentication error', 'info');
  },

  /**
   * Handle 403 permission errors
   */
  private handlePermissionError(error: ApiError): void {
    console.error('Permission error:', error);
    toast.error('You do not have permission to perform this action.');
    Sentry.captureMessage('Permission denied', 'warning');
  },

  /**
   * Handle 404 not found errors
   */
  private handleNotFoundError(error: ApiError): void {
    console.error('Not found error:', error);
    toast.error('The requested resource was not found.');
    Sentry.captureMessage('Resource not found', 'info');
  },

  /**
   * Handle 500 server errors
   */
  private handleServerError(error: ApiError): void {
    console.error('Server error:', error);
    toast.error('A server error occurred. Please try again later.');
    Sentry.captureException(error);
  },

  /**
   * Handle generic errors
   */
  private handleGenericError(error: any): void {
    console.error('Error:', error);
    const message = error?.message || 'An unexpected error occurred. Please try again.';
    toast.error(message);
    Sentry.captureException(error);
  },
};