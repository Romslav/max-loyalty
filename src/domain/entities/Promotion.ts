/**
 * ✅ FIXED: Promotion Entity - Code Audit Corrections
 * Fixed 5 critical errors related to type safety and validation
 */

export enum PromotionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  TIER_BASED = 'TIER_BASED',
  POINTS_MULTIPLIER = 'POINTS_MULTIPLIER'
}

export enum PromotionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SCHEDULED = 'SCHEDULED',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED'
}

export interface DiscountConfig {
  percentageValue?: number;
  fixedAmount?: number;
  tierMultiplier?: Record<string, number>;
  pointsMultiplier?: number;
}

export interface PromotionRules {
  minPurchaseAmount?: number;
  maxPurchaseAmount?: number;
  maxUsagePerUser?: number;
  maxTotalUsage?: number;
  allowGuestUsage?: boolean;
}

export interface PromotionUsage {
  totalUsageCount: number;
  lastUsedAt?: Date;
  usageByUser: Record<string, number>;
}

export class Promotion {
  private id: string;
  private code: string;
  private type: PromotionType;
  private status: PromotionStatus;
  private config: DiscountConfig;
  private rules: PromotionRules;
  private usage: PromotionUsage;
  private createdAt: Date;
  private expiryDate: Date;
  private tier?: string;

  /**
   * ✅ FIX #4: Added full validation in constructor
   */
  constructor(
    id: string,
    code: string,
    type: PromotionType,
    expiryDate: Date,
    config: DiscountConfig = {},
    rules: PromotionRules = {}
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('Invalid ID: ID must be non-empty string');
    }
    if (!code || code.trim().length === 0) {
      throw new Error('Invalid code: Code must be non-empty string');
    }
    if (code.length > 50) {
      throw new Error('Invalid code: Code must not exceed 50 characters');
    }
    if (!type || !Object.values(PromotionType).includes(type)) {
      throw new Error('Invalid type: Type must be valid PromotionType');
    }
    if (!expiryDate || !(expiryDate instanceof Date)) {
      throw new Error('Invalid expiry date: Must be valid Date object');
    }
    if (expiryDate <= new Date()) {
      throw new Error('Invalid expiry date: Must be in the future');
    }

    this.id = id;
    this.code = code;
    this.type = type;
    this.expiryDate = expiryDate;
    this.config = config;
    this.rules = rules;
    this.status = PromotionStatus.DRAFT;
    this.createdAt = new Date();
    this.usage = {
      totalUsageCount: 0,
      usageByUser: {}
    };
  }

  getId(): string {
    return this.id;
  }

  getCode(): string {
    return this.code;
  }

  getType(): PromotionType {
    return this.type;
  }

  getStatus(): PromotionStatus {
    return this.status;
  }

  /**
   * ✅ FIX #1: Always returns number, handles all types
   */
  calculateDiscount(amount: number): number {
    if (amount < 0) {
      throw new Error('Amount must be non-negative');
    }

    switch (this.type) {
      case PromotionType.PERCENTAGE:
        if (this.config.percentageValue === undefined) {
          throw new Error('Percentage value not configured');
        }
        const percentage = Math.min(this.config.percentageValue, 100);
        return amount * (percentage / 100);

      case PromotionType.FIXED_AMOUNT:
        if (this.config.fixedAmount === undefined) {
          throw new Error('Fixed amount not configured');
        }
        return Math.min(this.config.fixedAmount, amount);

      case PromotionType.TIER_BASED:
        if (!this.config.tierMultiplier || !this.tier) {
          return 0;
        }
        const multiplier = this.config.tierMultiplier[this.tier] || 1;
        return amount * (multiplier - 1);

      case PromotionType.POINTS_MULTIPLIER:
        return 0;

      default:
        return 0;
    }
  }

  /**
   * ✅ FIX #3: Normalized time for correct expiry check
   */
  isExpired(): boolean {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const expiry = new Date(this.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    return expiry < now;
  }

  isActive(): boolean {
    return this.status === PromotionStatus.ACTIVE && !this.isExpired();
  }

  activate(): void {
    if (this.isExpired()) {
      throw new Error('Cannot activate expired promotion');
    }
    this.status = PromotionStatus.ACTIVE;
  }

  pause(): void {
    this.status = PromotionStatus.PAUSED;
  }

  archive(): void {
    this.status = PromotionStatus.ARCHIVED;
  }

  /**
   * ✅ FIX #2: Validates negative values and checks limits
   */
  recordUsage(userId: string): void {
    if (!userId || userId.trim().length === 0) {
      throw new Error('Invalid user ID');
    }

    if (this.usage.totalUsageCount < 0) {
      throw new Error('Invalid usage state: count is negative');
    }

    if (this.rules.maxTotalUsage) {
      if (this.usage.totalUsageCount >= this.rules.maxTotalUsage) {
        throw new Error('Promotion usage limit reached');
      }
    }

    if (this.rules.maxUsagePerUser) {
      const userUsage = this.usage.usageByUser[userId] || 0;
      if (userUsage >= this.rules.maxUsagePerUser) {
        throw new Error('User usage limit reached');
      }
    }

    this.usage.totalUsageCount++;
    this.usage.usageByUser[userId] = (this.usage.usageByUser[userId] || 0) + 1;
    this.usage.lastUsedAt = new Date();
  }

  getUsage(): PromotionUsage {
    return { ...this.usage };
  }

  /**
   * ✅ FIX #5: Added null check before using
   */
  canUseByGuest(): boolean {
    if (!this.rules.allowGuestUsage) {
      return false;
    }
    return !this.tier || this.tier !== 'PREMIUM';
  }

  isEligibleByTier(userTier: string): boolean {
    if (!this.config.tierMultiplier) {
      return true;
    }
    return userTier in this.config.tierMultiplier;
  }

  isWithinScope(purchaseAmount: number): boolean {
    if (this.rules.minPurchaseAmount && purchaseAmount < this.rules.minPurchaseAmount) {
      return false;
    }
    if (this.rules.maxPurchaseAmount && purchaseAmount > this.rules.maxPurchaseAmount) {
      return false;
    }
    return true;
  }
}
