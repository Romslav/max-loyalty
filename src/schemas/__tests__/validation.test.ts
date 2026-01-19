import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  guestSchema,
  operationSchema,
} from '../index'

describe('Form Validation - Zod Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'user@example.com',
        password: 'Password123!',
      }

      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123!',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_string')
      }
    })

    it('should reject missing password', () => {
      const invalidData = {
        email: 'user@example.com',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
        password: 'Password123!',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'newuser@example.com',
        name: 'John Doe',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        email: 'newuser@example.com',
        name: 'John Doe',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const invalidData = {
        email: 'newuser@example.com',
        name: 'John Doe',
        password: 'Short1!',
        confirmPassword: 'Short1!',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password without uppercase', () => {
      const invalidData = {
        email: 'newuser@example.com',
        name: 'John Doe',
        password: 'password123!',
        confirmPassword: 'password123!',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password without numbers', () => {
      const invalidData = {
        email: 'newuser@example.com',
        name: 'John Doe',
        password: 'Password!',
        confirmPassword: 'Password!',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject missing name', () => {
      const invalidData = {
        email: 'newuser@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('changePasswordSchema', () => {
    it('should validate correct password change data', () => {
      const validData = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
        confirmNewPassword: 'NewPassword123!',
      }

      const result = changePasswordSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject if new password same as current', () => {
      const invalidData = {
        currentPassword: 'Password123!',
        newPassword: 'Password123!',
        confirmNewPassword: 'Password123!',
      }

      const result = changePasswordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject mismatched new passwords', () => {
      const invalidData = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
        confirmNewPassword: 'DifferentPassword123!',
      }

      const result = changePasswordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('guestSchema', () => {
    it('should validate correct guest data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+79991234567',
        tier: 'gold',
      }

      const result = guestSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '+79991234567',
        tier: 'gold',
      }

      const result = guestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid phone format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123456', // too short
        tier: 'gold',
      }

      const result = guestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid tier', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+79991234567',
        tier: 'platinum', // invalid tier
      }

      const result = guestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject short name', () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        phone: '+79991234567',
        tier: 'gold',
      }

      const result = guestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('operationSchema', () => {
    it('should validate correct earn operation', () => {
      const validData = {
        guestId: '123e4567-e89b-12d3-a456-426614174000',
        type: 'earn',
        points: 100,
        description: 'Purchase reward',
      }

      const result = operationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate correct redeem operation', () => {
      const validData = {
        guestId: '123e4567-e89b-12d3-a456-426614174000',
        type: 'redeem',
        points: 50,
        description: 'Discount redemption',
      }

      const result = operationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject zero points', () => {
      const invalidData = {
        guestId: '123e4567-e89b-12d3-a456-426614174000',
        type: 'earn',
        points: 0,
        description: 'Invalid',
      }

      const result = operationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject points over 100000', () => {
      const invalidData = {
        guestId: '123e4567-e89b-12d3-a456-426614174000',
        type: 'earn',
        points: 100001,
        description: 'Too many points',
      }

      const result = operationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid operation type', () => {
      const invalidData = {
        guestId: '123e4567-e89b-12d3-a456-426614174000',
        type: 'invalid',
        points: 100,
        description: 'Invalid type',
      }

      const result = operationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid UUID', () => {
      const invalidData = {
        guestId: 'not-a-uuid',
        type: 'earn',
        points: 100,
        description: 'Invalid UUID',
      }

      const result = operationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
