// Domain Service Interface - Transaction & Points Management
// Handles SALE, REDEMPTION, MANUAL operations, tier progression

export interface ITransactionService {
  // Main transaction operations
  createSaleTransaction(data: CreateSaleDTO): Promise<Transaction>;
  createRedemptionTransaction(data: CreateRedemptionDTO): Promise<Transaction>;
  createManualCreditTransaction(data: CreateManualOperationDTO): Promise<Transaction>;
  createManualDebitTransaction(data: CreateManualOperationDTO): Promise<Transaction>;
  
  // Transaction retrieval
  getTransaction(id: string): Promise<Transaction | null>;
  getGuestTransactionHistory(guestId: string, restaurantId: string, limit?: number): Promise<Transaction[]>;
  getRestaurantTransactions(restaurantId: string, filters?: TransactionFilters): Promise<Transaction[]>;
  
  // Points management
  calculatePointsAwarded(amount: number, discountPercent: number): CalculatePointsResult;
  canRedeemPoints(guestRestaurantId: string, pointsNeeded: number): Promise<boolean>;
  
  // Tier progression
  updateGuestTier(guestRestaurantId: string): Promise<TierUpdateResult>;
  checkTierUpgrade(currentBalance: number, newBalance: number): TierInfo | null;
  checkTierDowngrade(currentBalance: number, newBalance: number): TierInfo | null;
  
  // Card regeneration
  invalidateAndRegenerateCard(transactionId: string, guestRestaurantId: string): Promise<CardIdentifiers>;
  
  // Expiration handling
  handlePointsExpiration(guestRestaurantId: string): Promise<ExpirationResult>;
}

export interface CreateSaleDTO {
  guestRestaurantId: string;
  restaurantId: string;
  guestId: string;
  posId: string;
  amountRubles: number;
  chequeNumber?: string;
  cashierId?: string;
}

export interface CreateRedemptionDTO {
  guestRestaurantId: string;
  restaurantId: string;
  guestId: string;
  pointsToRedeem: number;
  posId: string;
  chequeNumber?: string;
}

export interface CreateManualOperationDTO {
  guestRestaurantId: string;
  restaurantId: string;
  guestId: string;
  pointsAmount: number;
  reason: 'COMPENSATION' | 'PENALTY' | 'PROMOTION' | 'OTHER';
  comment: string;
  managerId: string;
  sendNotification: boolean;
}

export interface Transaction {
  id: string;
  guestRestaurantId: string;
  restaurantId: string;
  guestId: string;
  transactionType: TransactionType;
  amountRubles?: number;
  basePointsAwarded: number;
  bonusPointsAwarded: number;
  pointsChanged: number;
  oldBalance: number;
  newBalance: number;
  oldTier: string;
  newTier: string;
  discountPercent: number;
  chequeNumber?: string;
  posId?: string;
  cashierId?: string;
  manualComment?: string;
  status: TransactionStatus;
  createdAt: Date;
}

export type TransactionType = 'SALE' | 'REDEMPTION' | 'MANUALCREDIT' | 'MANUALDEBIT' | 'TIERUPGRADE' | 'EXPIRATION' | 'REFERRALCREDIT';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  transactionType?: TransactionType;
  status?: TransactionStatus;
  posId?: string;
}

export interface CalculatePointsResult {
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
}

export interface TierUpdateResult {
  oldTier: string;
  newTier: string;
  tierChanged: boolean;
  discountPercent: number;
  tierEventId?: string;
}

export interface TierInfo {
  tierName: string;
  tierLevel: number;
  minPoints: number;
  maxPoints: number;
  discountPercent: number;
}

export interface CardIdentifiers {
  id: string;
  qrToken: string;
  sixDigitCode: string;
  cardType: string;
  isActive: boolean;
}

export interface ExpirationResult {
  expiredPoints: number;
  newBalance: number;
  transactionId: string;
}
