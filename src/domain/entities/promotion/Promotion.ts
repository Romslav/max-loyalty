/**
 * Promotion Entity
 * 
 * Domain model representing a promotional campaign.
 * Manages promotion details, codes, validity, and rules.
 */

export type PromotionType = 'percentage' | 'fixed' | 'tiered' | 'buy_x_get_y' | 'birthday'
export type PromotionStatus = 'draft' | 'active' | 'paused' | 'ended' | 'archived'
export type DiscountTarget = 'points' | 'price' | 'membership'

/**
 * Discount configuration
 */
export interface DiscountConfig {
  type: 'percentage' | 'fixed'
  value: number
  minAmount?: number
  maxDiscount?: number
}

/**
 * Promotion code
 */
export interface PromoCode {
  code: string
  used: number
  maxUses?: number
  status: 'active' | 'inactive' | 'expired'
}

/**
 * Promotion usage statistics
 */
export interface PromotionStats {
  totalUses: number
  uniqueUsers: number
  totalDiscountGiven: number
  conversionRate: number
  averageOrderValue: number
}

/**
 * Promotion restrictions
 */
export interface PromotionRestrictions {
  minOrderAmount?: number
  maxOrderAmount?: number
  applicableTiers?: string[]
  excludeProducts?: string[]
  applicableRegions?: string[]
  maxUsesPerUser?: number
  maxTotalUses?: number
}

/**
 * Promotion Entity
 */
export class Promotion {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public type: PromotionType,
    public status: PromotionStatus,
    public discountConfig: DiscountConfig,
    public discountTarget: DiscountTarget,
    public promoCodes: PromoCode[],
    public startDate: Date,
    public endDate: Date,
    public restrictions?: PromotionRestrictions,
    public stats?: PromotionStats,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  /**
   * Check if promotion is currently active
   */
  isActive(): boolean {
    const now = new Date()
    return (
      this.status === 'active' &&
      now >= this.startDate &&
      now <= this.endDate
    )
  }

  /**
   * Check if promotion has started
   */
  hasStarted(): boolean {
    return new Date() >= this.startDate
  }

  /**
   * Check if promotion has ended
   */
  hasEnded(): boolean {
    return new Date() > this.endDate
  }

  /**
   * Get remaining days
   */
  getRemainingDays(): number {
    const now = new Date()
    if (now > this.endDate) return 0
    const diff = this.endDate.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  /**
   * Check if code is valid
   */
  isCodeValid(code: string): boolean {
    const promoCode = this.promoCodes.find((c) => c.code === code.toUpperCase())
    if (!promoCode) return false

    if (promoCode.status !== 'active') return false
    if (!this.isActive()) return false
    if (promoCode.maxUses && promoCode.used >= promoCode.maxUses) return false

    return true
  }

  /**
   * Calculate discount amount
   */
  calculateDiscount(amount: number): number {
    const config = this.discountConfig

    if (config.minAmount && amount < config.minAmount) {
      return 0
    }

    let discount = 0
    if (config.type === 'percentage') {
      discount = (amount * config.value) / 100
    } else if (config.type === 'fixed') {
      discount = config.value
    }

    if (config.maxDiscount && discount > config.maxDiscount) {
      discount = config.maxDiscount
    }

    return Math.floor(discount)
  }

  /**
   * Use a promo code
   */
  useCode(code: string): void {
    const promoCode = this.promoCodes.find((c) => c.code === code.toUpperCase())
    if (promoCode) {
      promoCode.used++
    }
    this.updatedAt = new Date()
  }

  /**
   * Get active promo codes
   */
  getActiveCode(): PromoCode | undefined {
    return this.promoCodes.find(
      (c) => c.status === 'active' && (!c.maxUses || c.used < c.maxUses),
    )
  }

  /**
   * Check if promotion is applicable to guest
   */
  isApplicableToGuest(
    guestTier?: string,
    guestRegion?: string,
    orderAmount?: number,
  ): boolean {
    if (!this.isActive()) return false

    if (this.restrictions) {
      if (
        this.restrictions.minOrderAmount &&
        orderAmount &&
        orderAmount < this.restrictions.minOrderAmount
      ) {
        return false
      }
      if (
        this.restrictions.maxOrderAmount &&
        orderAmount &&
        orderAmount > this.restrictions.maxOrderAmount
      ) {
        return false
      }
      if (
        this.restrictions.applicableTiers &&
        guestTier &&
        !this.restrictions.applicableTiers.includes(guestTier)
      ) {
        return false
      }
      if (
        this.restrictions.applicableRegions &&
        guestRegion &&
        !this.restrictions.applicableRegions.includes(guestRegion)
      ) {
        return false
      }
    }

    return true
  }

  /**
   * Get promotion summary
   */
  getSummary(): string {
    const discountStr =
      this.discountConfig.type === 'percentage'
        ? `${this.discountConfig.value}%`
        : `₽${this.discountConfig.value}`

    return `${this.name}: ${discountStr} discount on ${this.discountTarget}`
  }
}
