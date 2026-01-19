import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authService, LoginCredentials, RegisterCredentials } from '../authService'

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Token Management', () => {
    it('should set and retrieve token', () => {
      const token = 'test-token-123'
      authService.setAuthToken(token)
      expect(authService.getToken()).toBe(token)
    })

    it('should remove token', () => {
      authService.setAuthToken('test-token')
      authService.removeAuthToken()
      expect(authService.getToken()).toBeNull()
    })

    it('should validate token expiration', () => {
      // Create a valid JWT token (mock)
      const validToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) + 3600 })
      expect(authService.isTokenValid(validToken)).toBe(true)

      // Create an expired JWT token (mock)
      const expiredToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) - 1000 })
      expect(authService.isTokenValid(expiredToken)).toBe(false)
    })

    it('should calculate token expiration time', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600
      const token = createMockJWT({ exp: futureExp })
      const timeRemaining = authService.getTokenExpirationTime(token)
      expect(timeRemaining).toBeGreaterThan(0)
      expect(timeRemaining).toBeLessThanOrEqual(3600000)
    })
  })

  describe('User Storage', () => {
    it('should store and retrieve user from localStorage', () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'guest' as const,
        permissions: [],
      }

      localStorage.setItem('maxLoyalty_user', JSON.stringify(mockUser))
      const retrievedUser = authService.getUserFromStorage()
      expect(retrievedUser).toEqual(mockUser)
    })

    it('should return null if no user in storage', () => {
      const user = authService.getUserFromStorage()
      expect(user).toBeNull()
    })
  })

  describe('Auth Initialization', () => {
    it('should initialize auth from storage', () => {
      const token = 'test-token'
      localStorage.setItem('maxLoyalty_token', token)
      authService.initializeAuth()
      expect(authService.getToken()).toBe(token)
    })

    it('should handle missing token on initialization', () => {
      authService.initializeAuth()
      expect(authService.getToken()).toBeNull()
    })
  })
})

// Helper function to create mock JWT token
function createMockJWT(payload: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  const signature = 'mock-signature'
  return `${header}.${body}.${signature}`
}
