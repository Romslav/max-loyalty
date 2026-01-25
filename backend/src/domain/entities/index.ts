// Domain Entities - Core business objects
// Pure TypeScript classes, no dependencies on frameworks or DB

export class GuestEntity {
  constructor(
    readonly id: string,
    readonly phone: string,
    readonly name: string,
    readonly email: string | null,
    readonly dateOfBirth: Date | null,
    readonly telegramId: string | null,
    readonly source: string,
    readonly isVerified: boolean,
    readonly language: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    phone: string;
    name: string;
    email?: string;
    dateOfBirth?: Date;
    telegramId?: string;
    source: string;
    isVerified?: boolean;
    language?: string;
  }): GuestEntity {
    return new GuestEntity(
      data.id,
      data.phone,
      data.name,
      data.email || null,
      data.dateOfBirth || null,
      data.telegramId || null,
      data.source,
      data.isVerified || false,
      data.language || 'ru',
      new Date(),
      new Date(),
    );
  }
}

export class TransactionEntity {
  constructor(
    readonly id: string,
    readonly guestRestaurantId: string,
    readonly restaurantId: string,
    readonly guestId: string,
    readonly transactionType: string,
    readonly amountRubles: number | null,
    readonly basePointsAwarded: number,
    readonly bonusPointsAwarded: number,
    readonly pointsChanged: number,
    readonly oldBalance: number,
    readonly newBalance: number,
    readonly oldTier: string,
    readonly newTier: string,
    readonly discountPercent: number,
    readonly status: string,
    readonly createdAt: Date,
  ) {}

  getTotalPointsAwarded(): number {
    return this.basePointsAwarded + this.bonusPointsAwarded;
  }

  isSale(): boolean {
    return this.transactionType === 'SALE';
  }

  isRedemption(): boolean {
    return this.transactionType === 'REDEMPTION';
  }

  static create(data: {
    id: string;
    guestRestaurantId: string;
    restaurantId: string;
    guestId: string;
    transactionType: string;
    basePointsAwarded: number;
    bonusPointsAwarded: number;
    pointsChanged: number;
    oldBalance: number;
    newBalance: number;
    oldTier: string;
    newTier: string;
    discountPercent: number;
    amountRubles?: number;
  }): TransactionEntity {
    return new TransactionEntity(
      data.id,
      data.guestRestaurantId,
      data.restaurantId,
      data.guestId,
      data.transactionType,
      data.amountRubles || null,
      data.basePointsAwarded,
      data.bonusPointsAwarded,
      data.pointsChanged,
      data.oldBalance,
      data.newBalance,
      data.oldTier,
      data.newTier,
      data.discountPercent,
      'COMPLETED',
      new Date(),
    );
  }
}

export class TierEntity {
  constructor(
    readonly id: string,
    readonly restaurantId: string,
    readonly tierName: string,
    readonly tierLevel: number,
    readonly minPoints: number,
    readonly maxPoints: number | null,
    readonly discountPercent: number,
    readonly tierColor: string,
    readonly tierIcon: string | null,
    readonly privileges: Record<string, unknown> | null,
  ) {}

  isWithinRange(points: number): boolean {
    if (points < this.minPoints) return false;
    if (this.maxPoints && points > this.maxPoints) return false;
    return true;
  }

  static create(data: {
    id: string;
    restaurantId: string;
    tierName: string;
    tierLevel: number;
    minPoints: number;
    maxPoints?: number;
    discountPercent: number;
    tierColor: string;
    tierIcon?: string;
    privileges?: Record<string, unknown>;
  }): TierEntity {
    return new TierEntity(
      data.id,
      data.restaurantId,
      data.tierName,
      data.tierLevel,
      data.minPoints,
      data.maxPoints || null,
      data.discountPercent,
      data.tierColor,
      data.tierIcon || null,
      data.privileges || null,
    );
  }
}

export class CardEntity {
  constructor(
    readonly id: string,
    readonly guestRestaurantId: string,
    readonly restaurantId: string,
    readonly qrToken: string,
    readonly sixDigitCode: string,
    readonly cardType: string,
    readonly isActive: boolean,
    readonly createdAt: Date,
    readonly invalidatedAt: Date | null,
    readonly invalidatedByTxId: string | null,
  ) {}

  isValid(): boolean {
    return this.isActive && !this.invalidatedAt;
  }

  static create(data: {
    id: string;
    guestRestaurantId: string;
    restaurantId: string;
    qrToken: string;
    sixDigitCode: string;
    cardType?: string;
  }): CardEntity {
    return new CardEntity(
      data.id,
      data.guestRestaurantId,
      data.restaurantId,
      data.qrToken,
      data.sixDigitCode,
      data.cardType || 'DIGITAL',
      true,
      new Date(),
      null,
      null,
    );
  }
}

export class RestaurantEntity {
  constructor(
    readonly id: string,
    readonly ownerId: string,
    readonly name: string,
    readonly address: string,
    readonly phone: string,
    readonly email: string,
    readonly systemType: string,
    readonly subscriptionTier: string,
    readonly status: string,
    readonly primaryColor: string,
    readonly secondaryColor: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  isFrozen(): boolean {
    return this.status === 'FROZEN';
  }

  isBlocked(): boolean {
    return this.status === 'BLOCKED';
  }

  static create(data: {
    id: string;
    ownerId: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    systemType: string;
    subscriptionTier: string;
    primaryColor?: string;
    secondaryColor?: string;
  }): RestaurantEntity {
    return new RestaurantEntity(
      data.id,
      data.ownerId,
      data.name,
      data.address,
      data.phone,
      data.email,
      data.systemType,
      data.subscriptionTier,
      'ACTIVE',
      data.primaryColor || '#000000',
      data.secondaryColor || '#FFFFFF',
      new Date(),
      new Date(),
    );
  }
}

export class PointsCalculator {
  /**
   * DISCOUNT System: points = amount_rubles + (amount_rubles * discount_percent / 100)
   * Example: 1500 rubles at BRONZE (5%) = 1500 + 75 = 1575 points
   */
  static calculatePointsAwarded(
    amountRubles: number,
    discountPercent: number,
  ): { basePoints: number; bonusPoints: number; totalPoints: number } {
    const basePoints = Math.floor(amountRubles);
    const bonusPoints = Math.floor((amountRubles * discountPercent) / 100);
    const totalPoints = basePoints + bonusPoints;

    return { basePoints, bonusPoints, totalPoints };
  }
}
