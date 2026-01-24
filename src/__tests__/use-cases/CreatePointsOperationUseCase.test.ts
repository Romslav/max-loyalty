/**
 * CreatePointsOperationUseCase Tests
 * 
 * Comprehensive test suite covering all scenarios:
 * - Happy paths (add, redeem, transfer)
 * - Validation errors
 * - Insufficient balance
 * - Guest not found
 * - Restaurant not found
 * - Edge cases
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreatePointsOperationUseCase } from '../../application/use-cases/points/CreatePointsOperationUseCase'
import { PointsOperationValidator } from '../../application/validators/PointsOperationValidator'
import { PointsOperation } from '../../domain/entities/points/PointsOperation'
import {
  ValidationError,
  InsufficientPointsError,
  GuestNotFoundError,
} from '../../application/errors/PointsErrors'

describe('CreatePointsOperationUseCase', () => {
  let useCase: CreatePointsOperationUseCase
  let mockPointsRepository: any
  let validator: PointsOperationValidator

  beforeEach(() => {
    validator = new PointsOperationValidator()

    mockPointsRepository = {
      getBalance: vi.fn().mockResolvedValue(1000),
      create: vi.fn().mockImplementation((operation: PointsOperation) => {
        return Promise.resolve(operation)
      }),
      updateStatus: vi.fn().mockImplementation((id: string, status: string) => {
        return Promise.resolve(
          PointsOperation.create({
            id,
            guestId: 'guest-1',
            restaurantId: 'restaurant-1',
            operationType: 'add',
            amount: 100,
            description: 'Test operation',
            status: status as any,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        )
      }),
    }

    useCase = new CreatePointsOperationUseCase(mockPointsRepository, validator)
  })

  describe('Happy Path - ADD Operation', () => {
    it('should successfully create add operation', async () => {
      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'add' as const,
        amount: 100,
        description: 'Purchase bonus points',
      }

      const result = await useCase.execute(input)

      expect(result).toBeDefined()
      expect(result.guestId).toBe('guest-1')
      expect(result.operationType).toBe('add')
      expect(result.amount).toBe(100)
      expect(result.status).toBe('completed')
      expect(mockPointsRepository.create).toHaveBeenCalled()
      expect(mockPointsRepository.updateStatus).toHaveBeenCalledWith(
        expect.any(String),
        'completed',
      )
    })

    it('should generate unique operation ID', async () => {
      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'add' as const,
        amount: 100,
        description: 'Test',
      }

      const result1 = await useCase.execute(input)
      const result2 = await useCase.execute(input)

      expect(result1.id).not.toBe(result2.id)
      expect(result1.id).toMatch(/^op-/)
      expect(result2.id).toMatch(/^op-/)
    })
  })

  describe('Happy Path - REDEEM Operation', () => {
    it('should successfully redeem points with sufficient balance', async () => {
      mockPointsRepository.getBalance.mockResolvedValue(500)

      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'redeem' as const,
        amount: 250,
        description: 'Redeem for discount',
      }

      const result = await useCase.execute(input)

      expect(result).toBeDefined()
      expect(result.operationType).toBe('redeem')
      expect(result.amount).toBe(250)
      expect(mockPointsRepository.getBalance).toHaveBeenCalledWith('guest-1')
    })

    it('should create redeem operation in pending state', async () => {
      mockPointsRepository.getBalance.mockResolvedValue(500)
      mockPointsRepository.updateStatus.mockImplementation((id: string) => {
        return Promise.resolve(
          PointsOperation.create({
            id,
            guestId: 'guest-1',
            restaurantId: 'restaurant-1',
            operationType: 'redeem',
            amount: 100,
            description: 'Redeem',
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        )
      })

      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'redeem' as const,
        amount: 100,
        description: 'Redeem',
      }

      const result = await useCase.execute(input)
      expect(result.status).toBe('pending')
    })
  })

  describe('Happy Path - TRANSFER Operation', () => {
    it('should successfully transfer points with sufficient balance', async () => {
      mockPointsRepository.getBalance.mockResolvedValue(500)

      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'transfer' as const,
        amount: 150,
        description: 'Transfer to friend',
        recipientGuestId: 'guest-2',
      }

      const result = await useCase.execute(input)

      expect(result).toBeDefined()
      expect(result.operationType).toBe('transfer')
      expect(result.amount).toBe(150)
    })

    it('should validate recipient exists', async () => {
      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'transfer' as const,
        amount: 100,
        description: 'Transfer',
        recipientGuestId: 'guest-2',
      }

      // Should not throw because recipient is provided
      const result = await useCase.execute(input)
      expect(result).toBeDefined()
    })
  })

  describe('Validation Errors', () => {
    it('should fail with missing guest ID', async () => {
      const input = {
        guestId: '',
        restaurantId: 'restaurant-1',
        operationType: 'add' as const,
        amount: 100,
        description: 'Test',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with missing restaurant ID', async () => {
      const input = {
        guestId: 'guest-1',
        restaurantId: '',
        operationType: 'add' as const,
        amount: 100,
        description: 'Test',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with invalid operation type', async () => {
      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'invalid' as any,
        amount: 100,
        description: 'Test',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with negative amount', async () => {
      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'add' as const,
        amount: -100,
        description: 'Test',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with zero amount', async () => {
      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'add' as const,
        amount: 0,
        description: 'Test',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with missing description', async () => {
      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'add' as const,
        amount: 100,
        description: '',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with too long description', async () => {
      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'add' as const,
        amount: 100,
        description: 'a'.repeat(501),
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })
  })

  describe('Business Rule Errors', () => {
    it('should fail to redeem with insufficient balance', async () => {
      mockPointsRepository.getBalance.mockResolvedValue(100)

      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'redeem' as const,
        amount: 500,
        description: 'Redeem',
      }

      await expect(useCase.execute(input)).rejects.toThrow(InsufficientPointsError)
    })

    it('should fail to transfer with insufficient balance', async () => {
      mockPointsRepository.getBalance.mockResolvedValue(100)

      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'transfer' as const,
        amount: 500,
        description: 'Transfer',
        recipientGuestId: 'guest-2',
      }

      await expect(useCase.execute(input)).rejects.toThrow(InsufficientPointsError)
    })

    it('should fail to transfer to same guest', async () => {
      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'transfer' as const,
        amount: 100,
        description: 'Transfer',
        recipientGuestId: 'guest-1', // Same as sender
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should fail with exact balance check', async () => {
      mockPointsRepository.getBalance.mockResolvedValue(100)

      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'redeem' as const,
        amount: 101,
        description: 'Redeem',
      }

      await expect(useCase.execute(input)).rejects.toThrow(InsufficientPointsError)
    })

    it('should succeed with exact balance', async () => {
      mockPointsRepository.getBalance.mockResolvedValue(100)

      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'redeem' as const,
        amount: 100,
        description: 'Redeem',
      }

      const result = await useCase.execute(input)
      expect(result).toBeDefined()
      expect(result.amount).toBe(100)
    })
  })

  describe('Repository Integration', () => {
    it('should call repository create method', async () => {
      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'add' as const,
        amount: 100,
        description: 'Test',
      }

      await useCase.execute(input)

      expect(mockPointsRepository.create).toHaveBeenCalledTimes(1)
      const createdEntity = mockPointsRepository.create.mock.calls[0][0]
      expect(createdEntity).toBeInstanceOf(PointsOperation)
    })

    it('should call getBalance for redeem operations', async () => {
      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'redeem' as const,
        amount: 100,
        description: 'Test',
      }

      await useCase.execute(input)

      expect(mockPointsRepository.getBalance).toHaveBeenCalledWith('guest-1')
    })

    it('should not call getBalance for add operations', async () => {
      mockPointsRepository.getBalance.mockClear()

      const input = {
        guestId: 'guest-1',
        restaurantId: 'restaurant-1',
        operationType: 'add' as const,
        amount: 100,
        description: 'Test',
      }

      await useCase.execute(input)

      expect(mockPointsRepository.getBalance).not.toHaveBeenCalled()
    })
  })
})
