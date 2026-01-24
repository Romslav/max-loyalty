/**
 * Promotion Use Cases Tests
 * 
 * Test suite for all promotion-related use cases.
 */

import { CreatePromotionUseCase } from '../CreatePromotionUseCase'
import { ValidatePromoCodeUseCase } from '../ValidatePromoCodeUseCase'
import { UpdatePromotionUseCase } from '../UpdatePromotionUseCase'
import { GetPromotionStatsUseCase } from '../GetPromotionStatsUseCase'
import { ValidationError } from '../../errors/PointsErrors'

describe('CreatePromotionUseCase', () => {
  let useCase: CreatePromotionUseCase

  beforeEach(() => {
    useCase = new CreatePromotionUseCase()
  })

  it('should create a promotion with valid input', async () => {
    const input = {
      name: 'Test Promotion',
      description: 'Test promotion description',
      type: 'percentage' as const,
      discountConfig: {
        type: 'percentage' as const,
        value: 20,
        minAmount: 100,
      },
      discountTarget: 'points' as const,
      startDate: new Date('2026-01-25'),
      endDate: new Date('2026-02-25'),
      numCodes: 50,
    }

    const result = await useCase.execute(input)

    expect(result.name).toBe('Test Promotion')
    expect(result.status).toBe('draft')
    expect(result.promoCodes.length).toBe(50)
  })

  it('should throw ValidationError when name is empty', async () => {
    const input = {
      name: '',
      description: 'Test',
      type: 'percentage' as const,
      discountConfig: {
        type: 'percentage' as const,
        value: 20,
      },
      discountTarget: 'points' as const,
      startDate: new Date('2026-01-25'),
      endDate: new Date('2026-02-25'),
    }

    expect(() => useCase.execute(input)).rejects.toThrow(ValidationError)
  })

  it('should throw ValidationError when endDate is before startDate', async () => {
    const input = {
      name: 'Test',
      description: 'Test',
      type: 'percentage' as const,
      discountConfig: {
        type: 'percentage' as const,
        value: 20,
      },
      discountTarget: 'points' as const,
      startDate: new Date('2026-02-25'),
      endDate: new Date('2026-01-25'),
    }

    expect(() => useCase.execute(input)).rejects.toThrow(ValidationError)
  })
})

describe('ValidatePromoCodeUseCase', () => {
  let useCase: ValidatePromoCodeUseCase

  beforeEach(() => {
    useCase = new ValidatePromoCodeUseCase()
  })

  it('should validate a valid promo code', async () => {
    const result = await useCase.execute({
      code: 'SAVE10OFF',
      orderAmount: 500,
    })

    expect(result.valid).toBe(true)
    expect(result.discountPercentage).toBe(10)
  })

  it('should reject an invalid promo code', async () => {
    const result = await useCase.execute({
      code: 'INVALID',
      orderAmount: 500,
    })

    expect(result.valid).toBe(false)
    expect(result.message).toContain('❌')
  })

  it('should check tier restrictions', async () => {
    const result = await useCase.execute({
      code: 'VIP100',
      guestTier: 'bronze',
    })

    expect(result.valid).toBe(false)
  })

  it('should check minimum order amount', async () => {
    const result = await useCase.execute({
      code: 'PROMO20',
      orderAmount: 100,
    })

    expect(result.valid).toBe(false)
  })
})

describe('UpdatePromotionUseCase', () => {
  let useCase: UpdatePromotionUseCase

  beforeEach(() => {
    useCase = new UpdatePromotionUseCase()
  })

  it('should update a promotion status', async () => {
    const result = await useCase.execute({
      promotionId: 'promo_1',
      status: 'active',
    })

    expect(result.status).toBe('active')
    expect(result.message).toContain('✅')
  })

  it('should throw ValidationError when no updates provided', async () => {
    expect(() =>
      useCase.execute({
        promotionId: 'promo_1',
      }),
    ).rejects.toThrow(ValidationError)
  })

  it('should throw ValidationError when promotion not found', async () => {
    expect(() =>
      useCase.execute({
        promotionId: 'invalid_promo',
        status: 'active',
      }),
    ).rejects.toThrow(ValidationError)
  })
})

describe('GetPromotionStatsUseCase', () => {
  let useCase: GetPromotionStatsUseCase

  beforeEach(() => {
    useCase = new GetPromotionStatsUseCase()
  })

  it('should retrieve promotion statistics', async () => {
    const result = await useCase.execute('promo_1')

    expect(result.promotionId).toBe('promo_1')
    expect(result.totalCodeGenerated).toBeGreaterThan(0)
    expect(result.usageRate).toBeGreaterThanOrEqual(0)
    expect(result.usageRate).toBeLessThanOrEqual(100)
  })

  it('should include tier breakdown', async () => {
    const result = await useCase.execute('promo_1')

    expect(result.tierBreakdown.length).toBeGreaterThan(0)
  })

  it('should include region breakdown', async () => {
    const result = await useCase.execute('promo_1')

    expect(result.regionBreakdown.length).toBeGreaterThan(0)
  })

  it('should throw ValidationError for non-existent promotion', async () => {
    expect(() => useCase.execute('invalid_promo')).rejects.toThrow(ValidationError)
  })
})
