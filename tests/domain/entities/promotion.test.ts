/**
 * Promotion Entity Tests
 * 
 * Comprehensive test coverage for Promotion domain logic.
 * Business rules, calculations, validations.
 */

import { Promotion, PromotionType, PromotionStatus } from '../../../src/domain/entities/promotion/Promotion'

describe('Promotion Entity', () => {
  let promotion: Promotion

  beforeEach(() => {
    const now = new Date()
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

    promotion = new Promotion(
      'promo-123',
      'SUMMER20',
      'Summer Sale 20%',
      'Get 20% off on all items',
      {
        type: PromotionType.PERCENTAGE,
        value: 20,
        maxDiscount: 100,
        minPurchase: 50,
        maxUsesPerGuest: 3,
        applicableTiers: ['silver', 'gold', 'platinum'],
      },
      {
        scope: 'per_guest',
        startDate: now,
        endDate: futureDate,
        maxUsage: 1000,
        currentUsage: 0,
        requiresBirthday: false,
        requiresReferral: false,
      },
      PromotionStatus.ACTIVE,
      {
        totalUsages: 0,
        totalDiscountAmount: 0,
        averageOrderValue: 0,
        uniqueGuestsUsed: new Set(),
        usagesByTier: {},
      },
      now,
      now,
      'admin-123',
    )
  })

  describe('isActive', () => {
    it('should return true when status is ACTIVE', () => {
      expect(promotion.isActive()).toBe(true)
    })

    it('should return false when status is DRAFT', () => {
      promotion.status = PromotionStatus.DRAFT
      expect(promotion.isActive()).toBe(false)
    })

    it('should return false when status is PAUSED', () => {
      promotion.status = PromotionStatus.PAUSED
      expect(promotion.isActive()).toBe(false)
    })
  })

  describe('isExpired', () => {
    it('should return false for valid promotion', () => {
      expect(promotion.isExpired()).toBe(false)
    })

    it('should return true when endDate passed', () => {
      promotion.rules.endDate = new Date(Date.now() - 1000) // 1 second ago
      expect(promotion.isExpired()).toBe(true)
    })

    it('should return true when maxUsage reached', () => {
      promotion.rules.currentUsage = promotion.rules.maxUsage
      expect(promotion.isExpired()).toBe(true)
    })
  })

  describe('calculateDiscount', () => {
    it('should calculate percentage discount correctly', () => {
      const discount = promotion.calculateDiscount(100, 'gold')
      expect(discount).toBe(20) // 20% of 100
    })

    it('should respect maxDiscount cap', () => {
      const discount = promotion.calculateDiscount(1000, 'gold') // Would be 200
      expect(discount).toBe(100) // Capped at maxDiscount
    })

    it('should apply tier multiplier if defined', () => {
      const discount = promotion.calculateDiscount(200, 'platinum')
      // Assuming platinum has 1.2x multiplier
      expect(discount).toBeGreaterThanOrEqual(20)
    })

    it('should return 0 when order below minimum purchase', () => {
      const discount = promotion.calculateDiscount(30, 'gold') // Below minPurchase of 50
      expect(discount).toBe(0)
    })
  })

  describe('canUseByGuest', () => {
    it('should allow eligible guest', () => {
      const result = promotion.canUseByGuest('guest-123', 'gold', 100)
      expect(result.canUse).toBe(true)
    })

    it('should reject if tier not applicable', () => {
      const result = promotion.canUseByGuest('guest-123', 'bronze', 100)
      expect(result.canUse).toBe(false)
      expect(result.reason).toContain('tier')
    })

    it('should reject if max uses per guest exceeded', () => {
      promotion.usage.uniqueGuestsUsed.add('guest-123')
      promotion.usage.usagesByTier['guest-123'] = 3 // Max is 3
      const result = promotion.canUseByGuest('guest-123', 'gold', 100)
      expect(result.canUse).toBe(false)
    })

    it('should reject if amount below minimum purchase', () => {
      const result = promotion.canUseByGuest('guest-123', 'gold', 30)
      expect(result.canUse).toBe(false)
      expect(result.reason).toContain('minimum')
    })
  })

  describe('recordUsage', () => {
    it('should record guest usage', () => {
      promotion.recordUsage('guest-123', 20, 'gold')
      expect(promotion.usage.totalUsages).toBe(1)
      expect(promotion.usage.totalDiscountAmount).toBe(20)
      expect(promotion.usage.uniqueGuestsUsed.has('guest-123')).toBe(true)
    })

    it('should track usage by tier', () => {
      promotion.recordUsage('guest-123', 20, 'gold')
      promotion.recordUsage('guest-456', 15, 'silver')
      expect(promotion.usage.usagesByTier['gold']).toBe(1)
      expect(promotion.usage.usagesByTier['silver']).toBe(1)
    })

    it('should increment current usage', () => {
      expect(promotion.rules.currentUsage).toBe(0)
      promotion.recordUsage('guest-123', 20, 'gold')
      expect(promotion.rules.currentUsage).toBe(1)
    })
  })

  describe('isEligibleByTier', () => {
    it('should return true for applicable tier', () => {
      expect(promotion.isEligibleByTier('gold')).toBe(true)
      expect(promotion.isEligibleByTier('platinum')).toBe(true)
    })

    it('should return false for non-applicable tier', () => {
      expect(promotion.isEligibleByTier('bronze')).toBe(false)
      expect(promotion.isEligibleByTier('vip')).toBe(false)
    })
  })

  describe('isWithinScope', () => {
    it('should allow single_use scope per guest', () => {
      promotion.rules.scope = 'single_use'
      promotion.usage.uniqueGuestsUsed.add('guest-123')
      const result = promotion.canUseByGuest('guest-123', 'gold', 100)
      expect(result.canUse).toBe(false)
    })

    it('should allow per_guest scope for multiple different guests', () => {
      promotion.rules.scope = 'per_guest'
      const result1 = promotion.canUseByGuest('guest-123', 'gold', 100)
      const result2 = promotion.canUseByGuest('guest-456', 'gold', 100)
      expect(result1.canUse).toBe(true)
      expect(result2.canUse).toBe(true)
    })

    it('should allow unlimited scope multiple times', () => {
      promotion.rules.scope = 'unlimited'
      for (let i = 0; i < 5; i++) {
        const result = promotion.canUseByGuest('guest-123', 'gold', 100)
        expect(result.canUse).toBe(true)
        promotion.recordUsage('guest-123', 20, 'gold')
      }
      expect(promotion.rules.currentUsage).toBe(5)
    })
  })
})
