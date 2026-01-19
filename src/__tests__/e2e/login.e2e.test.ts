import { describe, it, expect, beforeEach } from 'vitest'

/**
 * E2E Tests for Login/Register Flow
 * Runs against real or mocked API
 */

describe('E2E: Authentication Flow', () => {
  const API_URL = process.env.VITE_API_URL || 'http://localhost:3000'
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = 'TestPassword123!'
  let accessToken: string
  let userId: string

  beforeEach(() => {
    localStorage.clear()
  })

  describe('Registration Flow', () => {
    it('should register new user successfully', async () => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          name: 'Test User',
        }),
      })

      expect(response.status).toBe(201)

      const data = await response.json()
      expect(data.accessToken).toBeDefined()
      expect(data.user.email).toBe(testEmail)
      expect(data.user.role).toBe('guest')

      // Store for next tests
      accessToken = data.accessToken
      userId = data.user.id
    })

    it('should reject duplicate email registration', async () => {
      // First registration
      await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'duplicate@example.com',
          password: testPassword,
          name: 'First User',
        }),
      })

      // Second registration with same email
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'duplicate@example.com',
          password: testPassword,
          name: 'Second User',
        }),
      })

      expect(response.status).toBe(409)
      const data = await response.json()
      expect(data.message).toContain('already exists')
    })

    it('should reject invalid password in registration', async () => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'weak',
          name: 'Test User',
        }),
      })

      expect(response.status).toBe(400)
    })
  })

  describe('Login Flow', () => {
    beforeEach(async () => {
      // Register user before login tests
      const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `login-test-${Date.now()}@example.com`,
          password: testPassword,
          name: 'Login Test User',
        }),
      })

      const data = await registerResponse.json()
      testEmail = data.user.email
    })

    it('should login successfully with valid credentials', async () => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.accessToken).toBeDefined()
      expect(data.refreshToken).toBeDefined()
      expect(data.user.email).toBe(testEmail)

      accessToken = data.accessToken
    })

    it('should reject login with invalid password', async () => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'WrongPassword123!',
        }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.message).toContain('Invalid credentials')
    })

    it('should reject login with non-existent email', async () => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: testPassword,
        }),
      })

      expect(response.status).toBe(401)
    })
  })

  describe('Token Management', () => {
    it('should refresh expired token', async () => {
      // Register and login
      const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `refresh-test-${Date.now()}@example.com`,
          password: testPassword,
          name: 'Refresh Test User',
        }),
      })

      const userData = await registerResponse.json()
      const refreshToken = userData.refreshToken

      // Refresh token
      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      expect(refreshResponse.status).toBe(200)

      const newData = await refreshResponse.json()
      expect(newData.accessToken).toBeDefined()
      expect(newData.accessToken).not.toBe(userData.accessToken)
    })
  })

  describe('User Profile', () => {
    beforeEach(async () => {
      // Register and get token
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `profile-test-${Date.now()}@example.com`,
          password: testPassword,
          name: 'Profile Test User',
        }),
      })

      const data = await response.json()
      accessToken = data.accessToken
    })

    it('should fetch current user profile', async () => {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      expect(response.status).toBe(200)

      const user = await response.json()
      expect(user.id).toBeDefined()
      expect(user.email).toBeDefined()
      expect(user.name).toBeDefined()
    })

    it('should reject request without token', async () => {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
      })

      expect(response.status).toBe(401)
    })

    it('should reject request with invalid token', async () => {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer invalid-token-123',
        },
      })

      expect(response.status).toBe(401)
    })
  })

  describe('Logout Flow', () => {
    beforeEach(async () => {
      // Register and get token
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `logout-test-${Date.now()}@example.com`,
          password: testPassword,
          name: 'Logout Test User',
        }),
      })

      const data = await response.json()
      accessToken = data.accessToken
    })

    it('should logout successfully', async () => {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      expect(response.status).toBe(200)
    })

    it('should not allow access after logout', async () => {
      // Logout
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Try to access protected resource
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      expect(response.status).toBe(401)
    })
  })
})
