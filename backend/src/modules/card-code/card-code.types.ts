export interface CardIdentifier {
  id: string;
  cardId: string;
  restaurantId: string;
  code: string;
  codeType: 'QR_CODE' | 'BARCODE' | 'NFC' | 'SMS_CODE';
  codeVersion: number;
  hmacSignature?: string;
  isActive: boolean;
  rotatedAt?: Date;
  expiresAt?: Date;
  usageCount: number;
  lastUsedAt?: Date;
  createdAt: Date;
}

export type CardIdentifierType = 'QR_CODE' | 'BARCODE' | 'NFC' | 'SMS_CODE';

export interface CodeValidationResult {
  valid: boolean;
  cardId?: string;
  card?: any;
  error?: string;
}

export interface CodeGenerationResult {
  code: string;
  identifier: CardIdentifier;
}
