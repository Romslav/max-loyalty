import { injectable } from 'inversify';
import * as crypto from 'crypto';
import { ICardService } from '../../domain/services/CardService';
import { ErrorCode } from '../../shared/types';

@injectable()
export class CardServiceImpl implements ICardService {
  private readonly QR_SECRET_KEY = process.env.QR_SECRET_KEY || 'dev-secret-key';
  private readonly QR_ALGORITHM = 'sha256';

  generateQRToken(guestRestaurantId: string, restaurantId: string): string {
    if (!guestRestaurantId || !restaurantId) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'guestRestaurantId and restaurantId are required',
      };
    }

    const timestamp = Date.now();
    const payload = `${guestRestaurantId}:${restaurantId}:${timestamp}`;

    const signature = crypto
      .createHmac(this.QR_ALGORITHM, this.QR_SECRET_KEY)
      .update(payload)
      .digest('hex');

    const token = `${payload}.${signature}`;

    console.log(`QR Token Generated: ${signature.substring(0, 20)}...`);

    return token;
  }

  validateQRToken(token: string, restaurantId: string): any {
    try {
      const [payload, signature] = token.split('.');

      if (!payload || !signature) {
        return {
          isValid: false,
          reason: 'Invalid token format',
        };
      }

      const expectedSignature = crypto
        .createHmac(this.QR_ALGORITHM, this.QR_SECRET_KEY)
        .update(payload)
        .digest('hex');

      const isSignatureValid = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );

      if (!isSignatureValid) {
        return {
          isValid: false,
          reason: 'Invalid signature',
        };
      }

      const [_guestRestaurantId, _restaurantId, timestamp] = payload.split(':');
      const now = Date.now();
      const tokenAge = now - parseInt(timestamp);
      const MAX_AGE = 24 * 60 * 60 * 1000;

      if (tokenAge > MAX_AGE) {
        return {
          isValid: false,
          reason: 'Token expired (24 hours)',
        };
      }

      if (_restaurantId !== restaurantId) {
        return {
          isValid: false,
          reason: 'Token does not match restaurant',
        };
      }

      console.log(`QR Token Valid: ${_guestRestaurantId}`);

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        reason: `Validation error: ${(error as Error).message}`,
      };
    }
  }

  generate6DigitCode(): string {
    const code = crypto.randomInt(0, 1000000);
    return code.toString().padStart(6, '0');
  }

  validate6DigitCode(code: string, restaurantId: string): any {
    if (!code || code.length !== 6) {
      return {
        isValid: false,
        reason: 'Code must be 6 digits',
      };
    }

    if (!/^\d{6}$/.test(code)) {
      return {
        isValid: false,
        reason: 'Code must contain only digits',
      };
    }

    console.log(`6-Digit Code Format Valid: ${code}`);

    return { isValid: true };
  }

  async invalidateCard(cardId: string, transactionId: string): Promise<void> {
    // TODO: Mark card as invalidated in database
    console.log(`Card invalidated: ${cardId} (txn: ${transactionId})`);
  }

  async getActiveCard(guestRestaurantId: string, restaurantId: string): Promise<any | null> {
    // TODO: Get active card from database
    return null;
  }
}
