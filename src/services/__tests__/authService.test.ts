import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authService } from '../authService'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as any

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('login', () => {
    it('should login successfully and store token', async () => {
      const mockResponse = {
        data: {
          accessToken: 'mock-token-123',
          refreshToken: 'mock-refresh-456',
          user: {
            id: '1',
            email: 'user@example.com',
            name: 'John Doe',
            role: 'admin',
          },
        },
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await authService.login('user@example.com', 'password123')

      expect(result).toEqual(mockResponse.data.user)
      expect(localStorage.getItem('token')).toBe('mock-token-123')
      expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-456')
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'user@example.com',
        password: 'password123',
      })
    })

    it('should throw error on invalid credentials', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      }

      mockedAxios.post.mockRejectedValue(mockError)

      await expect(
        authService.login('wrong@example.com', 'wrongpass')
      ).rejects.toThrow()
    })

    it('should throw error on network failure', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'))

      await expect(
        authService.login('user@example.com', 'password123')
      ).rejects.toThrow('Network error')
    })
  })

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        data: {
          accessToken: 'mock-token-789',
          refreshToken: 'mock-refresh-999',
          user: {
            id: '2',
            email: 'newuser@example.com',
            name: 'Jane Doe',
            role: 'guest',
          },
        },
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await authService.register(
        'newuser@example.com',
        'password123',
        'Jane Doe'
      )

      expect(result).toEqual(mockResponse.data.user)
      expect(localStorage.getItem('token')).toBe('mock-token-789')
    })

    it('should throw error on duplicate email', async () => {
      const mockError = {
        response: {
          status: 409,
          data: { message: 'Email already exists' },
        },
      }

      mockedAxios.post.mockRejectedValue(mockError)

      await expect(
        authService.register('existing@example.com', 'password123', 'John')
      ).rejects.toThrow()
    })

    it('should throw error on validation failure', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Password too short' },
        },
      }

      mockedAxios.post.mockRejectedValue(mockError)

      await expect(
        authService.register('user@example.com', 'short', 'John')
      ).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('should logout and clear tokens', async () => {
      localStorage.setItem('token', 'mock-token-123')
      localStorage.setItem('refreshToken', 'mock-refresh-456')

      mockedAxios.post.mockResolvedValue({ data: { success: true } })

      await authService.logout()

      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('refreshToken')).toBeNull()
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/logout')
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      localStorage.setItem('refreshToken', 'mock-refresh-456')

      const mockResponse = {
        data: {
          accessToken: 'new-mock-token-789',
          refreshToken: 'new-mock-refresh-999',
        },
      }

      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await authService.refreshToken()

      expect(result).toBe('new-mock-token-789')
      expect(localStorage.getItem('token')).toBe('new-mock-token-789')
      expect(localStorage.getItem('refreshToken')).toBe('new-mock-refresh-999')
    })

    it('should throw error when no refresh token available', async () => {
      localStorage.clear()

      await expect(authService.refreshToken()).rejects.toThrow()
    })
  })

  describe('getMe', () => {
    it('should fetch current user', async () => {
      const mockResponse = {
        data: {
          id: '1',
          email: 'user@example.com',
          name: 'John Doe',
          role: 'admin',
          permissions: ['user:read', 'user:write'],
        },
      }

      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await authService.getMe()

      expect(result).toEqual(mockResponse.data)
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/auth/me')
    })

    it('should throw error on unauthorized', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      }

      mockedAxios.get.mockRejectedValue(mockError)

      await expect(authService.getMe()).rejects.toThrow()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'mock-token-123')
      expect(authService.isAuthenticated()).toBe(true)
    })

    it('should return false when token does not exist', () => {
      localStorage.clear()
      expect(authService.isAuthenticated()).toBe(false)
    })
  })

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('token', 'mock-token-123')
      expect(authService.getToken()).toBe('mock-token-123')
    })

    it('should return null when token does not exist', () => {
      localStorage.clear()
      expect(authService.getToken()).toBeNull()
    })
  })
})
