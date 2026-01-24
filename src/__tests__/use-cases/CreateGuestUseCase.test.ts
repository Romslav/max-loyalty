/**
 * CreateGuestUseCase Tests
 * 
 * Comprehensive test suite for guest creation:
 * - Happy paths
 * - Validation errors
 * - Duplicate email/phone
 * - Referral processing
 * - Edge cases
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateGuestUseCase } from '../../application/use-cases/guest/CreateGuestUseCase'
import { GuestValidator } from '../../application/validators/GuestValidator'
import { Guest } from '../../domain/entities/guest/Guest'
import { ValidationError, OperationFailedError } from '../../application/errors/PointsErrors'

describe('CreateGuestUseCase', () => {
  let useCase: CreateGuestUseCase
  let mockGuestRepository: any
  let validator: GuestValidator

  beforeEach(() => {
    validator = new GuestValidator()

    mockGuestRepository = {
      create: vi.fn().mockImplementation((guest: Guest) => {
        return Promise.resolve(guest)
      }),
      getByEmail: vi.fn().mockResolvedValue(null),
      getByPhone: vi.fn().mockResolvedValue(null),
      getById: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockResolvedValue(null),
    }

    useCase = new CreateGuestUseCase(mockGuestRepository, validator)
  })

  describe('Happy Path - Create Guest', () => {
    it('should successfully create a new guest', async () => {
      const input = {
        email: 'john@example.com',
        phone: '+79991234567',
        firstName: 'John',
        lastName: 'Doe',
      }

      const result = await useCase.execute(input)

      expect(result).toBeDefined()
      expect(result.email).toBe('john@example.com')
      expect(result.firstName).toBe('John')
      expect(result.lastName).toBe('Doe')
      expect(result.status).toBe('active')
      expect(result.tier).toBe('bronze')
      expect(result.referralCode).toMatch(/^REF-[A-Z0-9]{8}$/)
      expect(mockGuestRepository.create).toHaveBeenCalled()
    })

    it('should create guest with referral code', async () => {
      const input = {
        email: 'jane@example.com',
        phone: '79991111111',
        firstName: 'Jane',
        lastName: 'Smith',
        referredBy: 'guest-123',
      }

      mockGuestRepository.getById.mockResolvedValue(
        Guest.createNew(
          'guest-123',
          'referrer@example.com',
          '79999999999',
          'Referrer',
          'Name',
          'REF-ABCD1234',
        ),
      )

      const result = await useCase.execute(input)

      expect(result).toBeDefined()
      expect(mockGuestRepository.create).toHaveBeenCalled()
      expect(mockGuestRepository.getById).toHaveBeenCalledWith('guest-123')
    })

    it('should generate unique referral codes', async () => {
      const input1 = {
        email: 'guest1@example.com',
        phone: '79991111111',
        firstName: 'Guest',
        lastName: 'One',
      }

      const input2 = {
        email: 'guest2@example.com',
        phone: '79992222222',
        firstName: 'Guest',
        lastName: 'Two',
      }

      const result1 = await useCase.execute(input1)
      mockGuestRepository.getByEmail.mockResolvedValue(null)
      mockGuestRepository.getByPhone.mockResolvedValue(null)

      const result2 = await useCase.execute(input2)

      expect(result1.referralCode).not.toBe(result2.referralCode)
    })
  })

  describe('Validation Errors', () => {
    it('should fail with missing email', async () => {
      const input = {
        email: '',
        phone: '+79991234567',
        firstName: 'John',
        lastName: 'Doe',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with invalid email format', async () => {
      const input = {
        email: 'invalid-email',
        phone: '+79991234567',
        firstName: 'John',
        lastName: 'Doe',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with missing phone', async () => {
      const input = {
        email: 'john@example.com',
        phone: '',
        firstName: 'John',
        lastName: 'Doe',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with invalid phone (too short)', async () => {
      const input = {
        email: 'john@example.com',
        phone: '123456789', // Only 9 digits
        firstName: 'John',
        lastName: 'Doe',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with missing first name', async () => {
      const input = {
        email: 'john@example.com',
        phone: '+79991234567',
        firstName: '',
        lastName: 'Doe',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with missing last name', async () => {
      const input = {
        email: 'john@example.com',
        phone: '+79991234567',
        firstName: 'John',
        lastName: '',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with first name too long', async () => {
      const input = {
        email: 'john@example.com',
        phone: '+79991234567',
        firstName: 'a'.repeat(101),
        lastName: 'Doe',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with last name too long', async () => {
      const input = {
        email: 'john@example.com',
        phone: '+79991234567',
        firstName: 'John',
        lastName: 'a'.repeat(101),
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })
  })

  describe('Business Rule Errors', () => {
    it('should fail if email already exists', async () => {
      const existingGuest = Guest.createNew(
        'guest-1',
        'john@example.com',
        '79991111111',
        'John',
        'Doe',
        'REF-ABCD1234',
      )

      mockGuestRepository.getByEmail.mockResolvedValue(existingGuest)

      const input = {
        email: 'john@example.com',
        phone: '+79991234567',
        firstName: 'John',
        lastName: 'Doe',
      }

      await expect(useCase.execute(input)).rejects.toThrow(OperationFailedError)
    })

    it('should fail if phone already exists', async () => {
      const existingGuest = Guest.createNew(
        'guest-1',
        'john@example.com',
        '+79991234567',
        'John',
        'Doe',
        'REF-ABCD1234',
      )

      mockGuestRepository.getByPhone.mockResolvedValue(existingGuest)

      const input = {
        email: 'jane@example.com',
        phone: '+79991234567',
        firstName: 'Jane',
        lastName: 'Doe',
      }

      await expect(useCase.execute(input)).rejects.toThrow(OperationFailedError)
    })

    it('should fail if referrer not found', async () => {
      mockGuestRepository.getById.mockResolvedValue(null)

      const input = {
        email: 'jane@example.com',
        phone: '+79991234567',
        firstName: 'Jane',
        lastName: 'Doe',
        referredBy: 'invalid-referrer',
      }

      await expect(useCase.execute(input)).rejects.toThrow()
    })
  })

  describe('Repository Integration', () => {
    it('should call repository create method', async () => {
      const input = {
        email: 'john@example.com',
        phone: '+79991234567',
        firstName: 'John',
        lastName: 'Doe',
      }

      await useCase.execute(input)

      expect(mockGuestRepository.create).toHaveBeenCalledTimes(1)
      const createdEntity = mockGuestRepository.create.mock.calls[0][0]
      expect(createdEntity).toBeInstanceOf(Guest)
    })

    it('should check email uniqueness', async () => {
      const input = {
        email: 'john@example.com',
        phone: '+79991234567',
        firstName: 'John',
        lastName: 'Doe',
      }

      await useCase.execute(input)

      expect(mockGuestRepository.getByEmail).toHaveBeenCalledWith('john@example.com')
    })

    it('should check phone uniqueness', async () => {
      const input = {
        email: 'john@example.com',
        phone: '+79991234567',
        firstName: 'John',
        lastName: 'Doe',
      }

      await useCase.execute(input)

      expect(mockGuestRepository.getByPhone).toHaveBeenCalledWith('+79991234567')
    })
  })

  describe('Edge Cases', () => {
    it('should accept valid email formats', async () => {
      const validEmails = [
        'user@example.com',
        'user+tag@example.co.uk',
        'user_name@example.com',
      ]

      for (const email of validEmails) {
        const input = {
          email,
          phone: '+79991234567',
          firstName: 'Test',
          lastName: 'User',
        }

        const result = await useCase.execute(input)
        expect(result.email).toBe(email)
        mockGuestRepository.getByEmail.mockResolvedValue(null)
        mockGuestRepository.getByPhone.mockResolvedValue(null)
      }
    })

    it('should accept international phone formats', async () => {
      const validPhones = [
        '+79991234567',
        '79991234567',
        '+1 (999) 123-4567',
        '9991234567',
      ]

      for (const phone of validPhones) {
        const input = {
          email: `user${Math.random()}@example.com`,
          phone,
          firstName: 'Test',
          lastName: 'User',
        }

        const result = await useCase.execute(input)
        expect(result).toBeDefined()
        mockGuestRepository.getByEmail.mockResolvedValue(null)
        mockGuestRepository.getByPhone.mockResolvedValue(null)
      }
    })
  })
})
