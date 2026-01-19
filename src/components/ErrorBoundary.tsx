import React from 'react'
import { loggerService } from '../services/loggerService'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Error Boundary Component
 * Catches React component errors and displays fallback UI
 * Logs errors for debugging
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error
    this.setState({
      errorInfo,
    })

    // Send to logging service
    loggerService.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    })

    // In production, send to error tracking service (Sentry, etc)
    if (import.meta.env.PROD) {
      // TODO: Integrate with Sentry or similar
      // Sentry.captureException(error, { contexts: { react: { errorInfo } } })
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-2 border-red-300 bg-white">
            <div className="p-8 text-center">
              {/* Error Icon */}
              <div className="mb-4 text-5xl">⚠️</div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>

              {/* Error Message */}
              <p className="text-gray-600 mb-4">
                We encountered an unexpected error. Our team has been notified.
              </p>

              {/* Error Details (Development Only) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-6 text-left bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-xs font-mono text-red-900 mb-2 font-bold">
                    Error Details (Development Only)
                  </p>
                  <p className="text-xs font-mono text-red-800 mb-2">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-red-800 font-medium mb-2">
                        Component Stack
                      </summary>
                      <pre className="text-red-700 overflow-auto max-h-40 whitespace-pre-wrap break-words">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Error Reference */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Error Reference ID:</p>
                <p className="text-xs font-mono text-gray-900 font-semibold">
                  {new Date().getTime()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    window.location.href = '/'
                  }}
                  className="flex-1"
                >
                  Go Home
                </Button>
                <Button
                  onClick={this.handleReset}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>

              {/* Support Note */}
              <p className="text-xs text-gray-500 mt-4">
                If the problem persists, please contact{' '}
                <a
                  href="mailto:support@example.com"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  support@example.com
                </a>
              </p>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
