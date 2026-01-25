// Domain Repository Interfaces - Data Access Layer Contract
// No implementation details, only contract definitions

import {
  GuestEntity,
  TransactionEntity,
  TierEntity,
  CardEntity,
  RestaurantEntity,
} from '../entities';

// ============ GUEST REPOSITORIES ============

export interface IGuestRepository {
  save(guest: GuestEntity): Promise<void>;
  findById(id: string): Promise<GuestEntity | null>;
  findByPhone(phone: string): Promise<GuestEntity | null>;
  findByTelegramId(telegramId: string): Promise<GuestEntity | null>;
  update(guest: GuestEntity): Promise<void>;
}

export interface IGuestRestaurantRepository {
  save(data: GuestRestaurantData): Promise<void>;
  findById(id: string): Promise<GuestRestaurantData | null>;
  findByGuestAndRestaurant(guestId: string, restaurantId: string): Promise<GuestRestaurantData | null>;
  updateBalance(guestRestaurantId: string, newBalance: number): Promise<void>;
  updateTier(guestRestaurantId: string, tier: string, discountPercent: number): Promise<void>;
  updateLastVisit(guestRestaurantId: string): Promise<void>;
  incrementVisits(guestRestaurantId: string): Promise<void>>
  findTopGuestsByBalance(restaurantId: string, limit: number): Promise<GuestRestaurantData[]>;
}

export interface GuestRestaurantData {
  id: string;
  guestId: string;
  restaurantId: string;
  balancePoints: number;
  tier: string;
  tierProgression: number;
  visitsCount: number;
  totalSpentRubles: number;
  lastVisitAt?: Date;
  createdAt: Date;
  isActive: boolean;
  isBlocked: boolean;
}

// ============ PHONE VERIFICATION REPOSITORY ============

export interface IPhoneVerificationRepository {
  saveVerificationCode(phone: string, code: string, expiresAt: Date): Promise<void>;
  getVerificationRecord(phone: string): Promise<VerificationRecord | null>;
  markAsVerified(phone: string): Promise<void>;
  incrementAttempts(phone: string): Promise<void>;
  deleteExpiredRecords(): Promise<number>;
}

export interface VerificationRecord {
  phone: string;
  verificationCode: string;
  attempts: number;
  createdAt: Date;
  expiresAt: Date;
  verified: boolean;
}

// ============ TRANSACTION REPOSITORY ============

export interface ITransactionRepository {
  save(transaction: TransactionEntity): Promise<string>;
  findById(id: string): Promise<TransactionEntity | null>;
  findByGuestRestaurant(guestRestaurantId: string, limit?: number): Promise<TransactionEntity[]>;
  findByRestaurant(
    restaurantId: string,
    filters?: TransactionFilters,
  ): Promise<TransactionEntity[]>;
  findDailySales(restaurantId: string, date: Date): Promise<DailySalesData>;
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  transactionType?: string;
  status?: string;
  posId?: string;
}

export interface DailySalesData {
  totalSales: number;
  pointsAwarded: number;
  transactionCount: number;
  date: Date;
}

// ============ BALANCE DETAIL REPOSITORY ============

export interface IBalanceDetailRepository {
  save(data: BalanceDetailData): Promise<void>;
  findByGuestRestaurant(guestRestaurantId: string): Promise<BalanceDetailData | null>;
  update(guestRestaurantId: string, updates: Partial<BalanceDetailData>): Promise<void>;
}

export interface BalanceDetailData {
  id: string;
  guestRestaurantId: string;
  basePoints: number;
  bonusPoints: number;
  transferredPoints: number;
  expiredPoints: number;
  redeemedPoints: number;
}

// ============ CARD IDENTIFIER REPOSITORY ============

export interface ICardRepository {
  save(card: CardEntity): Promise<void>;
  findById(id: string): Promise<CardEntity | null>;
  findByQRToken(qrToken: string): Promise<CardEntity | null>;
  findBySixDigitCode(code: string, restaurantId: string): Promise<CardEntity | null>;
  findByGuestRestaurant(guestRestaurantId: string): Promise<CardEntity[]>;
  deactivateCard(cardId: string, transactionId: string): Promise<void>;
  findHistory(guestRestaurantId: string, limit?: number): Promise<CardEntity[]>;
}

// ============ TIER DEFINITION REPOSITORY ============

export interface ITierRepository {
  save(tier: TierEntity): Promise<void>;
  findById(id: string): Promise<TierEntity | null>;
  findByRestaurant(restaurantId: string): Promise<TierEntity[]>;
  findByPointsRange(restaurantId: string, points: number): Promise<TierEntity | null>;
  update(tier: TierEntity): Promise<void>;
}

// ============ RESTAURANT REPOSITORY ============

export interface IRestaurantRepository {
  save(restaurant: RestaurantEntity): Promise<void>;
  findById(id: string): Promise<RestaurantEntity | null>;
  findByOwner(ownerId: string): Promise<RestaurantEntity[]>;
  update(restaurant: RestaurantEntity): Promise<void>;
  updateStatus(id: string, status: 'ACTIVE' | 'FROZEN' | 'BLOCKED'): Promise<void>;
}

// ============ POINT OF SALE REPOSITORY ============

export interface IPointOfSaleRepository {
  save(data: PointOfSaleData): Promise<void>;
  findById(id: string): Promise<PointOfSaleData | null>;
  findByRestaurant(restaurantId: string): Promise<PointOfSaleData[]>;
  update(data: PointOfSaleData): Promise<void>;
}

export interface PointOfSaleData {
  id: string;
  restaurantId: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  isActive: boolean;
}

// ============ TIER EVENT REPOSITORY ============

export interface ITierEventRepository {
  save(event: TierEventData): Promise<void>;
  findByGuestRestaurant(guestRestaurantId: string): Promise<TierEventData[]>;
  markNotificationSent(eventId: string): Promise<void>;
}

export interface TierEventData {
  id: string;
  guestRestaurantId: string;
  restaurantId: string;
  oldTier?: string;
  newTier: string;
  transactionId?: string;
  notificationSent: boolean;
  createdAt: Date;
}
