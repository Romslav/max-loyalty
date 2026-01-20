import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PublicRoute } from '../PublicRoute'
import * as useAuthModule from '../../hooks/useAuth'

// Mock react-router-dom Navigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div>Redirected to {to}</div>,
  }
})

describe('PublicRoute Component', () => {
  const mockUseAuth = vi.spyOn(useAuthModule, 'useAuth')

  beforeEach(() => {
    mockUseAuth.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('should render children when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    } as any)

    renderWithRouter(
      <PublicRoute>
        <div>Login Page</div>
      </PublicRoute>
    )

    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('should redirect to dashboard when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', email: 'test@example.com' },
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    } as any)

    renderWithRouter(
      <PublicRoute>
        <div>Login Page</div>
      </PublicRoute>
    )

    expect(screen.getByText('Redirected to /dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })

  it('should show loading spinner while authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    } as any)

    renderWithRouter(
      <PublicRoute>
        <div>Login Page</div>
      </PublicRoute>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })

  it('should display loading spinner with proper styling', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    } as any)

    const { container } = renderWithRouter(
      <PublicRoute>
        <div>Login Page</div>
      </PublicRoute>
    )

    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('border-t-blue-600')
  })

  it('should render multiple children', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    } as any)

    renderWithRouter(
      <PublicRoute>
        <header>Header</header>
        <main>Main Content</main>
        <footer>Footer</footer>
      </PublicRoute>
    )

    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Main Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('should not call navigate until auth state is determined', () => {
    const { rerender } = renderWithRouter(
      <PublicRoute>
        <div>Login Page</div>
      </PublicRoute>
    )

    // Initially loading
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    } as any)

    rerender(
      <BrowserRouter>
        <PublicRoute>
          <div>Login Page</div>
        </PublicRoute>
      </BrowserRouter>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Then authenticated
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', email: 'test@example.com' },
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    } as any)

    rerender(
      <BrowserRouter>
        <PublicRoute>
          <div>Login Page</div>
        </PublicRoute>
      </BrowserRouter>
    )

    expect(screen.getByText('Redirected to /dashboard')).toBeInTheDocument()
  })
})
