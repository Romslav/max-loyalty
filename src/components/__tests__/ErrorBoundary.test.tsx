import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '../ErrorBoundary'
import * as Sentry from '@sentry/react'

// Mock Sentry
vi.mock('@sentry/react', () => ({
  captureException: vi.fn(),
  withErrorBoundary: (component: any, options: any) => component,
}))

// Component that throws an error
const ThrowError = () => {
  throw new Error('Test error')
}

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Safe content')).toBeInTheDocument()
  })

  it('should catch and display error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument()
  })

  it('should report error to Sentry', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(Sentry.captureException).toHaveBeenCalled()
    const call = (Sentry.captureException as any).mock.calls[0]
    expect(call[0]).toEqual(expect.any(Error))
  })

  it('should show try again button', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    const tryAgainButton = screen.getByText('Try Again')
    expect(tryAgainButton).toBeInTheDocument()
  })

  it('should show go home button', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    const goHomeButton = screen.getByText('Go Home')
    expect(goHomeButton).toBeInTheDocument()
  })

  it('should reset error state when clicking try again', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()

    const tryAgainButton = screen.getByText('Try Again')
    fireEvent.click(tryAgainButton)

    rerender(
      <ErrorBoundary>
        <div>Safe content after reset</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Safe content after reset')).toBeInTheDocument()
  })

  it('should display error details in development mode', () => {
    const originalEnv = import.meta.env.MODE
    Object.defineProperty(import.meta.env, 'MODE', {
      value: 'development',
      writable: true,
    })

    try {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByText(/Test error/)).toBeInTheDocument()
    } finally {
      Object.defineProperty(import.meta.env, 'MODE', {
        value: originalEnv,
        writable: true,
      })
    }
  })

  it('should not display error details in production mode', () => {
    const originalEnv = import.meta.env.MODE
    Object.defineProperty(import.meta.env, 'MODE', {
      value: 'production',
      writable: true,
    })

    try {
      const { queryByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(queryByText(/Test error/)).not.toBeInTheDocument()
    } finally {
      Object.defineProperty(import.meta.env, 'MODE', {
        value: originalEnv,
        writable: true,
      })
    }
  })

  it('should have proper styling classes', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    const errorContainer = container.querySelector('.min-h-screen')
    expect(errorContainer).toBeInTheDocument()
    expect(errorContainer).toHaveClass('bg-gradient-to-br')
  })
})
