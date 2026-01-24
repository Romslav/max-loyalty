/**
 * Promotion Entity
 * 
 * Domain entity for loyalty program promotions.
 * Handles discount codes, campaigns, and promotion logic.
 * Full business rules and validation.
 */

/**
 * Promotion type enum
 */
export enum PromotionType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  TIER_BASED = 'tier_based',
  FREE_ITEM = 'free_item',
  POINTS_MULTIPLIER = 'points_multiplier',
  BIRTHDAY = 'birthday',
}

/**
 * Promotion status enum
 */
export enum PromotionStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SCHEDULED = 'scheduled',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  ARCHIVED = 'archived',
}

/**
 * Promotion application scope
 */
export enum PromotionScope {
  SINGLE_USE = 'single_use',
  PER_GUEST = 'per_guest',
  UNLIMITED = 'unlimited',
}

/**
 * Promotion applicable tiers
 */
export type ApplicableTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip' | 'all'

/**
 * Discount configuration
 */
export interface DiscountConfig {
  type: PromotionType
  value: number // percentage (0-100) or fixed amount
  maxDiscount?: number
  minPurchase?: number
  maxUsesPerGuest?: number
  applicableTiers: ApplicableTier[]
}

/**
 * Promotion rules
 */
export interface PromotionRules {
  scope: PromotionScope
  startDate: Date
  endDate: Date
  maxUsage: number
  currentUsage: number
  requiresBirthday?: boolean
  requiresReferral?: boolean
  excludedCategories?: string[]
  applicableMenuItems?: string[]
  minGuestPoints?: number
  maxGuestPoints?: number
}

/**
 * Usage tracking
 */
export interface UsageData {
  totalUsages: number
  totalDiscountAmount: number
  averageOrderValue: number
  uniqueGuestsUsed: Set<string>
  lastUsedDate?: Date
  usagesByTier: Record<string, number>
}

/**
 * Promotion entity
 */
export class Promotion {
  readonly id: string
  readonly code: string
  readonly name: string
  readonly description: string
  readonly discount: DiscountConfig
  readonly rules: PromotionRules
  readonly status: PromotionStatus
  readonly usage: UsageData
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly createdBy: string
  readonly metadata: Record<string, any>

  /**
   * Create promotion
   */
  constructor(
    id: string,
    code: string,
    name: string,
    description: string,
    discount: DiscountConfig,
    rules: PromotionRules,
    status: PromotionStatus,
    usage: UsageData,
    createdAt: Date,
    updatedAt: Date,
    createdBy: string,
    metadata: Record<string, any> = {},
  ) {
    this.id = id
    this.code = code
    this.name = name
    this.description = description
    this.discount = discount
    this.rules = rules
    this.status = status
    this.usage = usage
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.createdBy = createdBy
    this.metadata = metadata
  }

  /**
   * Check if promotion is currently active
   */
  isActive(): boolean {
    const now = new Date()
    return (
      this.status === PromotionStatus.ACTIVE &&
      now >= this.rules.startDate &&
      now <= this.rules.endDate &&
      this.rules.currentUsage < this.rules.maxUsage
    )
  }

  /**
   * Check if promotion has reached usage limit
   */
  isExpired(): boolean {
    const now = new Date()
    return now > this.rules.endDate || this.rules.currentUsage >= this.rules.maxUsage
  }

  /**
   * Check if promotion can be used by tier
   */
  canUseByTier(tier: string): boolean {
    return (
      this.discount.applicableTiers.includes('all') ||
      this.discount.applicableTiers.includes(tier as ApplicableTier)
    )
  }

  /**
   * Calculate discount amount
   */
  calculateDiscount(orderAmount: number, guestTier?: string): number {
    // Check minimum purchase
    if (this.discount.minPurchase && orderAmount < this.discount.minPurchase) {
      return 0
    }

    let discount = 0

    switch (this.discount.type) {
      case PromotionType.PERCENTAGE:
        discount = (orderAmount * this.discount.value) / 100
        break

      case PromotionType.FIXED_AMOUNT:
        discount = Math.min(this.discount.value, orderAmount)
        break

      case PromotionType.TIER_BASED:
        // Tier-based multiplier
        const tierMultipliers: Record<string, number> = {
          bronze: 1.0,
          silver: 1.1,
          gold: 1.2,
          platinum: 1.35,
          vip: 1.5,
        }
        const multiplier = tierMultipliers[guestTier || 'bronze'] || 1.0
        discount = (orderAmount * this.discount.value * multiplier) / 100
        break

      case PromotionType.POINTS_MULTIPLIER:
        // Points are calculated separately
        discount = 0
        break

      default:
        discount = 0
    }

    // Apply max discount limit
    if (this.discount.maxDiscount) {
      discount = Math.min(discount, this.discount.maxDiscount)
    }

    return Math.floor(discount)
  }

  /**
   * Check if guest can use this promotion
   */
  canUseByGuest(
    guestId: string,
    guestTier: string,
    guestPoints: number = 0,
  ): { canUse: boolean; reason?: string } {
    // Check status
    if (!this.isActive()) {
      return { canUse: false, reason: 'Promotion is not active' }
    }

    // Check tier
    if (!this.canUseByTier(guestTier)) {
      return { canUse: false, reason: 'Promotion not available for your tier' }
    }

    // Check points range
    if (this.discount.minPurchase && guestPoints < this.discount.minPurchase) {
      return { canUse: false, reason: 'Insufficient points' }
    }
    if (this.discount.maxDiscount && guestPoints > this.discount.maxDiscount) {
      return { canUse: false, reason: 'Points too high for this promotion' }
    }

    // Check per-guest usage limit
    if (this.discount.maxUsesPerGuest) {
      const guestUsageCount = this.usage.uniqueGuestsUsed.has(guestId) ? 1 : 0
      if (guestUsageCount >= this.discount.maxUsesPerGuest) {
        return { canUse: false, reason: 'You have already used this promotion' }
      }
    }

    return { canUse: true }
  }

  /**
   * Record promotion usage
   */
  recordUsage(guestId: string, discountAmount: number, guestTier: string): void {
    this.usage.totalUsages++
    this.usage.totalDiscountAmount += discountAmount
    this.usage.uniqueGuestsUsed.add(guestId)
    this.usage.lastUsedDate = new Date()
    this.usage.usagesByTier[guestTier] = (this.usage.usagesByTier[guestTier] || 0) + 1
    this.rules.currentUsage++
  }

  /**
   * Get promotion performance metrics
   */
  getMetrics() {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      status: this.status,
      usageRate: `${((this.rules.currentUsage / this.rules.maxUsage) * 100).toFixed(1)}%`,
      totalUsages: this.usage.totalUsages,
      totalDiscountAmount: this.usage.totalDiscountAmount,
      averageOrderValue: this.usage.totalUsages > 0 ? this.usage.totalDiscountAmount / this.usage.totalUsages : 0,
      uniqueGuestsUsed: this.usage.uniqueGuestsUsed.size,
      lastUsedDate: this.usage.lastUsedDate,
      daysActive: Math.floor(
        (new Date().getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24),
      ),
    }
  }

  /**
   * Pause promotion
   */
  pause(): void {
    if (this.status === PromotionStatus.ACTIVE) {
      ;(this as Promotion).status = PromotionStatus.PAUSED
    }
  }

  /**
   * Resume promotion
   */
  resume(): void {
    if (this.status === PromotionStatus.PAUSED) {
      ;(this as Promotion).status = PromotionStatus.ACTIVE
    }
  }
}

export default Promotion
