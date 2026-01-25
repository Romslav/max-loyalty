// Domain Service Interface - Card Identifiers & Security
// Handles QR tokens, 6-digit codes, regeneration, and validation

export interface ICardService {
  // Card generation
  generateCardIdentifiers(guestRestaurantId: string, restaurantId: string): Promise<CardIdentifiers>;
  
  // QR validation & lookup
  validateQRToken(qrToken: string, restaurantId: string): Promise<QRValidationResult>;
  getGuestByQRToken(qrToken: string, restaurantId: string): Promise<GuestCardData | null>;
  
  // 6-digit code validation & lookup
  validateSixDigitCode(code: string, restaurantId: string): Promise<SixDigitValidationResult>;
  getGuestBySixDigitCode(code: string, restaurantId: string): Promise<GuestCardData | null>;
  
  // Card regeneration (post-transaction)
  regenerateCardIdentifiers(transactionId: string, guestRestaurantId: string): Promise<CardIdentifiers>;
  invalidateOldCard(cardId: string, newCardId: string): Promise<void>;
  
  // Card history
  getCardHistory(guestRestaurantId: string): Promise<CardHistory[]>;
  getCardById(id: string): Promise<CardIdentifiers | null>;
  
  // Card status
  isCardActive(cardId: string): Promise<boolean>;
  deactivateCard(cardId: string): Promise<void>;
  reactivateCard(cardId: string): Promise<void>;
}

export interface CardIdentifiers {
  id: string;
  guestRestaurantId: string;
  restaurantId: string;
  qrToken: string;
  sixDigitCode: string;
  cardType: 'PHYSICAL' | 'DIGITAL';
  isActive: boolean;
  createdAt: Date;
  invalidatedByTxId?: string;
  invalidatedAt?: Date;
}

export interface QRValidationResult {
  isValid: boolean;
  guestRestaurantId?: string;
  restaurantId?: string;
  cardId?: string;
  isActive?: boolean;
  error?: string;
}

export interface SixDigitValidationResult {
  isValid: boolean;
  guestRestaurantId?: string;
  restaurantId?: string;
  cardId?: string;
  isActive?: boolean;
  error?: string;
}

export interface GuestCardData {
  guestId: string;
  guestRestaurantId: string;
  restaurantId: string;
  cardId: string;
  name: string;
  phone: string;
  tier: string;
  balancePoints: number;
  isBlocked: boolean;
}

export interface CardHistory {
  id: string;
  cardId: string;
  qrToken: string;
  sixDigitCode: string;
  createdAt: Date;
  invalidatedAt?: Date;
  invalidatedByTxId?: string;
}

// Security & Cryptography
export interface ICardCryptography {
  // QR token generation with HMAC-SHA256
  generateQRToken(guestRestaurantId: string, restaurantId: string, timestamp: Date): string;
  verifyQRToken(token: string, secret: string): boolean;
  
  // 6-digit code generation
  generate6DigitCode(restaurantId: string): Promise<string>;
  check6DigitCodeUniqueness(code: string, restaurantId: string): Promise<boolean>;
}

export interface CardRegenerationRequest {
  transactionId: string;
  guestRestaurantId: string;
  oldCardId: string;
  reason: 'POST_TRANSACTION' | 'MANUAL_REQUEST' | 'SECURITY' | 'REPLACEMENT';
  timestamp: Date;
}
