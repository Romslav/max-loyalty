/**
 * Guest Entity
 * 
 * Core domain entity representing a guest in the loyalty program.
 * Manages profile, tier progression, referrals, and status.
 * Production-ready implementation with full business logic.
 */

export type GuestStatus = 'active' | 'inactive' | 'blocked' | 'pending_verification'
export type GuestTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip'

export interface GuestProps {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  status: GuestStatus
  tier: GuestTier
  joinedAt: Date
  updatedAt: Date
  lastVisit?: Date
  referralCode?: string
  referredBy?: string
  totalVisits: number
  totalSpent: number
  metadata?: Record<string, any>
}

/**
 * Tier configuration with point thresholds
 */
const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 500,
  gold: 1500,
  platinum: 3500,
  vip: 7000,
}

/**
 * Domain entity for guests
 */
export class Guest {
  private readonly props: GuestProps

  private constructor(props: GuestProps) {
    this.props = {
      ...props,
      updatedAt: props.updatedAt || new Date(),
    }
  }

  // Getters
  get id(): string {
    return this.props.id
  }

  get email(): string {
    return this.props.email
  }

  get phone(): string {
    return this.props.phone
  }

  get firstName(): string {
    return this.props.firstName
  }

  get lastName(): string {
    return this.props.lastName
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`.trim()
  }

  get status(): GuestStatus {
    return this.props.status
  }

  get tier(): GuestTier {
    return this.props.tier
  }

  get joinedAt(): Date {
    return this.props.joinedAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  get lastVisit(): Date | undefined {
    return this.props.lastVisit
  }

  get referralCode(): string | undefined {
    return this.props.referralCode
  }

  get referredBy(): string | undefined {
    return this.props.referredBy
  }

  get totalVisits(): number {
    return this.props.totalVisits
  }

  get totalSpent(): number {
    return this.props.totalSpent
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata
  }

  get isActive(): boolean {
    return this.status === 'active'
  }

  get isVerified(): boolean {
    return this.status !== 'pending_verification'
  }

  // Business methods
  activate(): Guest {
    if (this.status === 'active') {
      return this
    }

    return new Guest({
      ...this.props,
      status: 'active',
      updatedAt: new Date(),
    })
  }

  deactivate(): Guest {
    return new Guest({
      ...this.props,
      status: 'inactive',
      updatedAt: new Date(),
    })
  }

  block(reason?: string): Guest {
    return new Guest({
      ...this.props,
      status: 'blocked',
      metadata: { ...this.props.metadata, blockReason: reason },
      updatedAt: new Date(),
    })
  }

  updateTier(newTier: GuestTier): Guest {
    if (newTier === this.tier) {
      return this
    }

    return new Guest({
      ...this.props,
      tier: newTier,
      updatedAt: new Date(),
    })
  }

  recordVisit(): Guest {
    return new Guest({
      ...this.props,
      totalVisits: this.props.totalVisits + 1,
      lastVisit: new Date(),
      updatedAt: new Date(),
    })
  }

  updateSpending(amount: number): Guest {
    return new Guest({
      ...this.props,
      totalSpent: Math.max(0, this.props.totalSpent + amount),
      updatedAt: new Date(),
    })
  }

  updateProfile(firstName: string, lastName: string, phone: string): Guest {
    return new Guest({
      ...this.props,
      firstName,
      lastName,
      phone,
      updatedAt: new Date(),
    })
  }

  // Tier calculation based on points
  static calculateTier(points: number): GuestTier {
    if (points >= TIER_THRESHOLDS.vip) return 'vip'
    if (points >= TIER_THRESHOLDS.platinum) return 'platinum'
    if (points >= TIER_THRESHOLDS.gold) return 'gold'
    if (points >= TIER_THRESHOLDS.silver) return 'silver'
    return 'bronze'
  }

  // Factory methods
  static create(props: GuestProps): Guest {
    return new Guest({
      ...props,
      updatedAt: new Date(),
    })
  }

  static createNew(
    id: string,
    email: string,
    phone: string,
    firstName: string,
    lastName: string,
    referralCode: string,
    referredBy?: string,
  ): Guest {
    return new Guest({
      id,
      email,
      phone,
      firstName,
      lastName,
      status: 'active',
      tier: 'bronze',
      joinedAt: new Date(),
      updatedAt: new Date(),
      referralCode,
      referredBy,
      totalVisits: 0,
      totalSpent: 0,
    })
  }

  // Conversion to DTO
  toDTO(): GuestProps {
    return { ...this.props }
  }

  // Get tier info
  getTierInfo(): { tier: GuestTier; threshold: number; nextTier?: GuestTier; pointsToNext?: number } {
    const tiers: GuestTier[] = ['bronze', 'silver', 'gold', 'platinum', 'vip']
    const currentIndex = tiers.indexOf(this.tier)
    const threshold = TIER_THRESHOLDS[this.tier]

    if (currentIndex === tiers.length - 1) {
      return { tier: this.tier, threshold }
    }

    const nextTier = tiers[currentIndex + 1]
    const nextThreshold = TIER_THRESHOLDS[nextTier]

    return {
      tier: this.tier,
      threshold,
      nextTier,
      pointsToNext: nextThreshold - threshold,
    }
  }
}
