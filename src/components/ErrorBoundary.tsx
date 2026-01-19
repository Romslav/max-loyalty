import React, { ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import toast from 'react-hot-toast';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component that catches errors in the component tree
 * and logs them to Sentry for monitoring
 */
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    // Show toast notification
    toast.error('Something went wrong. Please refresh the page.');

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">Oops!</h1>
            <p className="mb-4 text-gray-600">Something went wrong. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default Sentry.withErrorBoundary(ErrorBoundary, {
  fallback: (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Error</h1>
        <p className="text-gray-600">An error occurred. Please try again.</p>
      </div>
    </div>
  ),
});