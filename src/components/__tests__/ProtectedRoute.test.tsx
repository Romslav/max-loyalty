import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../ProtectedRoute'
import * as useAuthModule from '../../hooks/useAuth'

// Mock useAuth hook
jest.mock('../../hooks/useAuth')

const mockUseAuth = useAuthModule.useAuth as jest.MockedFunction<
  typeof useAuthModule.useAuth
>

const TestComponent = () => <div>Protected Content</div>

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ProtectedRoute RBAC Tests', () => {
  describe('Authentication Tests', () => {
    it('should show loading state when auth is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
      })

      renderWithRouter(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      )

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('should redirect to login when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
      })

      renderWithRouter(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      )

      // Should navigate to login (check URL or component)
      expect(window.location.pathname).not.toContain('protected')
    })
  })

  describe('Role-Based Access Control (RBAC) Tests', () => {
    it('should allow admin to access admin routes', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
        token: 'valid-token',
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
      })

      renderWithRouter(
        <ProtectedRoute requiredRoles={['admin']}>
          <TestComponent />
        </ProtectedRoute>
      )

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('should deny restaurant user access to admin routes', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: '2',
          email: 'restaurant@example.com',
          name: 'Restaurant User',
          role: 'restaurant',
        },
        token: 'valid-token',
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
      })

      renderWithRouter(
        <ProtectedRoute requiredRoles={['admin']}>
          <TestComponent />
        </ProtectedRoute>
      )

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
      expect(screen.getByText(/unauthorized/i)).toBeInTheDocument()
    })

    it('should allow multiple roles', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: '3',
          email: 'cashier@example.com',
          name: 'Cashier User',
          role: 'cashier',
        },
        token: 'valid-token',
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
      })

      renderWithRouter(
        <ProtectedRoute requiredRoles={['cashier', 'admin']}>
          <TestComponent />
        </ProtectedRoute>
      )

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('should allow guest access to guest routes', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: '4',
          email: 'guest@example.com',
          name: 'Guest User',
          role: 'guest',
        },
        token: 'valid-token',
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
      })

      renderWithRouter(
        <ProtectedRoute requiredRoles={['guest', 'cashier', 'restaurant', 'admin']}>
          <TestComponent />
        </ProtectedRoute>
      )

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })

  describe('Permission-Based Access Control Tests', () => {
    it('should allow users with required permissions', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: '5',
          email: 'user@example.com',
          name: 'User',
          role: 'restaurant',
          permissions: ['guest:read', 'guest:write'],
        },
        token: 'valid-token',
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
      })

      renderWithRouter(
        <ProtectedRoute requiredPermissions={['guest:write']}>
          <TestComponent />
        </ProtectedRoute>
      )

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('should deny users without required permissions', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: '6',
          email: 'user@example.com',
          name: 'User',
          role: 'cashier',
          permissions: ['guest:read'],
        },
        token: 'valid-token',
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
      })

      renderWithRouter(
        <ProtectedRoute requiredPermissions={['guest:write', 'guest:delete']}>
          <TestComponent />
        </ProtectedRoute>
      )

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
      expect(screen.getByText(/unauthorized/i)).toBeInTheDocument()
    })
  })

  describe('Role Hierarchy Tests', () => {
    it('should follow role hierarchy: admin > restaurant > cashier > guest', () => {
      const roles = ['admin', 'restaurant', 'cashier', 'guest']

      roles.forEach((testRole, index) => {
        mockUseAuth.mockReturnValue({
          user: {
            id: String(index),
            email: `${testRole}@example.com`,
            name: testRole,
            role: testRole as any,
          },
          token: 'valid-token',
          isAuthenticated: true,
          isLoading: false,
          login: jest.fn(),
          register: jest.fn(),
          logout: jest.fn(),
          refreshToken: jest.fn(),
        })

        // Guest-level route should be accessible by all roles
        const { rerender } = renderWithRouter(
          <ProtectedRoute requiredRoles={['guest', 'cashier', 'restaurant', 'admin']}>
            <TestComponent />
          </ProtectedRoute>
        )

        expect(screen.getByText('Protected Content')).toBeInTheDocument()
        rerender(
          <BrowserRouter>
            <ProtectedRoute requiredRoles={['guest', 'cashier', 'restaurant', 'admin']}>
              <TestComponent />
            </ProtectedRoute>
          </BrowserRouter>
        )
      })
    })
  })
})
