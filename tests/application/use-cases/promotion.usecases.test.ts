/**
 * Promotion Use Cases Tests
 * 
 * Integration tests for all promotion use cases.
 * CreatePromotionUseCase, ValidatePromotionCodeUseCase, ApplyPromotionUseCase
 */

import { CreatePromotionUseCase } from '../../../src/application/use-cases/promotion/CreatePromotionUseCase'
import { ValidatePromotionCodeUseCase } from '../../../src/application/use-cases/promotion/ValidatePromotionCodeUseCase'
import { ApplyPromotionUseCase } from '../../../src/application/use-cases/promotion/ApplyPromotionUseCase'
import { IPromotionRepository } from '../../../src/domain/repositories/IPromotionRepository'
import { Promotion, PromotionType, PromotionStatus } from '../../../src/domain/entities/promotion/Promotion'

// Mock Repository
class MockPromotionRepository implements IPromotionRepository {
  private promotions: Map<string, Promotion> = new Map()

  async getById(id: string): Promise<Promotion | null> {
    return this.promotions.get(id) || null
  }

  async getByCode(code: string): Promise<Promotion | null> {
    for (const promo of this.promotions.values()) {
      if (promo.code === code) return promo
    }
    return null
  }

  async create(promotion: Promotion): Promise<Promotion> {
    this.promotions.set(promotion.id, promotion)
    return promotion
  }

  async update(id: string, updates: any): Promise<Promotion> {
    const promo = this.promotions.get(id)
    if (!promo) throw new Error('Not found')
    Object.assign(promo, updates)
    return promo
  }

  async codeExists(code: string): Promise<boolean> {
    return (await this.getByCode(code)) !== null
  }

  // Other methods return empty defaults
  async getAll(): Promise<Promotion[]> { return [] }
  async getByStatus(): Promise<Promotion[]> { return [] }
  async getActive(): Promise<Promotion[]> { return [] }
  async getByCreator(): Promise<Promotion[]> { return [] }
  async getByTier(): Promise<Promotion[]> { return [] }
  async getByDateRange(): Promise<Promotion[]> { return [] }
  async search(): Promise<Promotion[]> { return [] }
  async delete(): Promise<boolean> { return true }
  async getStatistics() { return null }
  async getTopByUsage(): Promise<Promotion[]> { return [] }
  async getCampaigns(): Promise<Promotion[]> { return [] }
  async updateStatus() { throw new Error('Not implemented') }
  async createBatch(): Promise<Promotion[]> { return [] }
  async archiveExpired(): Promise<number> { return 0 }
  async getPaginated() { return { items: [], total: 0, page: 1, limit: 10 } }
}

describe('Promotion Use Cases', () => {
  let repository: MockPromotionRepository
  let createUseCase: CreatePromotionUseCase
  let validateUseCase: ValidatePromotionCodeUseCase
  let applyUseCase: ApplyPromotionUseCase

  beforeEach(() => {
    repository = new MockPromotionRepository()
    createUseCase = new CreatePromotionUseCase(repository)
    validateUseCase = new ValidatePromotionCodeUseCase(repository)
    applyUseCase = new ApplyPromotionUseCase(repository)
  })

  describe('CreatePromotionUseCase', () => {
    it('should create promotion with valid data', async () => {
      const input = {
        name: 'Summer Sale',
        description: 'Get 20% off',
        discountType: PromotionType.PERCENTAGE,
        discountValue: 20,
        minPurchase: 50,
        applicableTiers: ['gold', 'silver'],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxUsage: 1000,
        scope: 'unlimited' as const,
        createdBy: 'admin-123',
      }

      const result = await createUseCase.execute(input)

      expect(result.id).toBeDefined()
      expect(result.name).toBe('Summer Sale')
      expect(result.discountType).toBe(PromotionType.PERCENTAGE)
      expect(result.status).toBe(PromotionStatus.DRAFT)
    })

    it('should auto-generate code if not provided', async () => {
      const input = {
        name: 'Birthday Special',
        description: 'Birthday discount',
        discountType: PromotionType.FIXED_AMOUNT,
        discountValue: 25,
        applicableTiers: ['bronze'],
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxUsage: 500,
        scope: 'per_guest' as const,
        createdBy: 'admin-456',
      }

      const result = await createUseCase.execute(input)

      expect(result.code).toBeDefined()
      expect(result.code.length).toBeGreaterThan(0)
    })

    it('should validate required fields', async () => {
      const input = {
        name: '',
        description: 'Test',
        discountType: PromotionType.PERCENTAGE,
        discountValue: 10,
        applicableTiers: [],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxUsage: 1000,
        scope: 'unlimited' as const,
        createdBy: 'admin-123',
      }

      await expect(createUseCase.execute(input)).rejects.toThrow()
    })
  })

  describe('ValidatePromotionCodeUseCase', () => {
    beforeEach(async () => {
      // Create a test promotion
      const input = {
        name: 'Test Promo',
        description: 'For testing',
        code: 'TEST123',
        discountType: PromotionType.PERCENTAGE,
        discountValue: 15,
        applicableTiers: ['gold'],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxUsage: 1000,
        scope: 'unlimited' as const,
        createdBy: 'admin-123',
      }
      await createUseCase.execute(input)
    })

    it('should validate existing promotion code', async () => {
      const result = await validateUseCase.execute({
        code: 'TEST123',
        guestId: 'guest-123',
        guestTier: 'gold',
        guestPoints: 100,
        orderAmount: 100,
      })

      expect(result.isValid).toBe(true)
      expect(result.promotion).toBeDefined()
      expect(result.promotion?.code).toBe('TEST123')
    })

    it('should reject non-existent code', async () => {
      const result = await validateUseCase.execute({
        code: 'INVALID',
        guestId: 'guest-123',
        guestTier: 'gold',
        guestPoints: 100,
        orderAmount: 100,
      })

      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Promotion code not found')
    })

    it('should reject if tier not applicable', async () => {
      const result = await validateUseCase.execute({
        code: 'TEST123',
        guestId: 'guest-123',
        guestTier: 'bronze', // Not applicable
        guestPoints: 100,
        orderAmount: 100,
      })

      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('ApplyPromotionUseCase', () => {
    beforeEach(async () => {
      const input = {
        name: 'Apply Test',
        description: 'Apply test promotion',
        code: 'APPLY1',
        discountType: PromotionType.PERCENTAGE,
        discountValue: 10,
        applicableTiers: ['all'],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxUsage: 1000,
        scope: 'unlimited' as const,
        createdBy: 'admin-123',
      }
      await createUseCase.execute(input)
    })

    it('should apply promotion and calculate discount', async () => {
      const result = await applyUseCase.execute({
        code: 'APPLY1',
        guestId: 'guest-123',
        guestTier: 'all',
        orderAmount: 100,
        orderId: 'order-123',
      })

      expect(result.discountAmount).toBe(10) // 10% of 100
      expect(result.finalOrderAmount).toBe(90)
      expect(result.pointsEarned).toBe(9) // 1 point per 10 currency
    })

    it('should throw error for invalid code', async () => {
      await expect(
        applyUseCase.execute({
          code: 'INVALID',
          guestId: 'guest-123',
          guestTier: 'all',
          orderAmount: 100,
          orderId: 'order-123',
        }),
      ).rejects.toThrow()
    })
  })
})
