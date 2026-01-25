// Dependency Injection Type Identifiers
// Central registry of all service identifiers used by Inversify container

export const TYPES = {
  // ============ REPOSITORIES ============
  Repositories: {
    IGuestRepository: Symbol.for('IGuestRepository'),
    IGuestRestaurantRepository: Symbol.for('IGuestRestaurantRepository'),
    ITransactionRepository: Symbol.for('ITransactionRepository'),
    ICardRepository: Symbol.for('ICardRepository'),
    ITierRepository: Symbol.for('ITierRepository'),
    IRestaurantRepository: Symbol.for('IRestaurantRepository'),
    IPhoneVerificationRepository: Symbol.for('IPhoneVerificationRepository'),
    IBalanceDetailRepository: Symbol.for('IBalanceDetailRepository'),
    IPointOfSaleRepository: Symbol.for('IPointOfSaleRepository'),
    ITierEventRepository: Symbol.for('ITierEventRepository'),
  },

  // ============ DOMAIN SERVICES ============
  Services: {
    IGuestService: Symbol.for('IGuestService'),
    ITransactionService: Symbol.for('ITransactionService'),
    ICardService: Symbol.for('ICardService'),
    IRestaurantService: Symbol.for('IRestaurantService'),
  },

  // ============ INFRASTRUCTURE SERVICES ============
  Infrastructure: {
    CardCryptography: Symbol.for('CardCryptography'),
    JWTHandler: Symbol.for('JWTHandler'),
    PasswordHasher: Symbol.for('PasswordHasher'),
    CacheManager: Symbol.for('CacheManager'),
    DatabaseConnection: Symbol.for('DatabaseConnection'),
  },

  // ============ APPLICATION USE CASES ============
  UseCases: {
    RegisterGuest: Symbol.for('RegisterGuest'),
    ProcessSaleTransaction: Symbol.for('ProcessSaleTransaction'),
    RedeemPoints: Symbol.for('RedeemPoints'),
    UpdateTier: Symbol.for('UpdateTier'),
    HandleExpiration: Symbol.for('HandleExpiration'),
    ProcessManualOperation: Symbol.for('ProcessManualOperation'),
    GetGuestProfile: Symbol.for('GetGuestProfile'),
    GetRestaurantAnalytics: Symbol.for('GetRestaurantAnalytics'),
  },
};

// ============ COMMON TYPES ============

export type UUID = string & { readonly __brand: 'UUID' };

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';

export type TierLevel = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'VIP';

export type GuestSource = 'telegram' | 'web' | 'qr' | 'sms';

export type CardType = 'PHYSICAL' | 'DIGITAL';

export type SubscriptionTier = 'FREE' | 'CUSTOM' | 'STANDARD' | 'PRO' | 'ULTIMA';

export type RestaurantStatus = 'ACTIVE' | 'FROZEN' | 'BLOCKED';

export type StaffRole = 'MANAGER' | 'CASHIER';

export type SystemType = 'DISCOUNT' | 'ACCUMULATION';

// ============ ERROR TYPES ============

export enum ErrorCode {
  // Validation errors (400)
  INVALID_PHONE = 'INVALID_PHONE',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  GUEST_BLOCKED = 'GUEST_BLOCKED',
  INVALID_QR_TOKEN = 'INVALID_QR_TOKEN',
  INVALID_SIX_DIGIT_CODE = 'INVALID_SIX_DIGIT_CODE',
  VERIFICATION_FAILED = 'VERIFICATION_FAILED',
  MAX_ATTEMPTS_EXCEEDED = 'MAX_ATTEMPTS_EXCEEDED',

  // Not found errors (404)
  GUEST_NOT_FOUND = 'GUEST_NOT_FOUND',
  GUEST_RESTAURANT_NOT_FOUND = 'GUEST_RESTAURANT_NOT_FOUND',
  RESTAURANT_NOT_FOUND = 'RESTAURANT_NOT_FOUND',
  TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND',
  CARD_NOT_FOUND = 'CARD_NOT_FOUND',
  POS_NOT_FOUND = 'POS_NOT_FOUND',
  TIER_NOT_FOUND = 'TIER_NOT_FOUND',

  // Conflict errors (409)
  PHONE_ALREADY_REGISTERED = 'PHONE_ALREADY_REGISTERED',
  GUEST_ALREADY_REGISTERED_IN_RESTAURANT = 'GUEST_ALREADY_REGISTERED_IN_RESTAURANT',
  SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED',
  GUEST_LIMIT_EXCEEDED = 'GUEST_LIMIT_EXCEEDED',

  // Server errors (500)
  DATABASE_ERROR = 'DATABASE_ERROR',
  TRANSACTION_ROLLBACK = 'TRANSACTION_ROLLBACK',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  CRYPTO_ERROR = 'CRYPTO_ERROR',
}

// ============ API RESPONSE TYPES ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  code: ErrorCode | string;
  message: string;
  details?: Record<string, unknown>;
  path?: string;
}

// ============ PAGINATION ============

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============ DATE RANGE ============

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// ============ AUDIT ============

export interface AuditMetadata {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}
