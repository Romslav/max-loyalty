import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CardIdentifier, CardIdentifierType } from './card-code.types';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/**
 * CardCodeService handles QR code generation, rotation, and validation
 * CRITICAL: Implements security measures for fraud prevention
 */
@Injectable()
export class CardCodeService {
  private readonly logger = new Logger(CardCodeService.name);
  private readonly CODE_LENGTH = 12; // 12-character random code
  private readonly ROTATION_BUFFER = 1000; // Keep last 1000 codes

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a new QR code for a guest card
   * Creates a unique, traceable code with HMAC signature
   */
  async generateNewCode(cardId: string, restaurantId: string): Promise<string> {
    try {
      this.logger.log(`Generating new code for card ${cardId}`);

      // Get restaurant QR secret
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { qrCodeSecret: true, qrCodeVersion: true },
      });

      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      // Generate unique code
      const newCode = this.generateUniqueCode();
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = this.generateHmacSignature(newCode, restaurant.qrCodeSecret, timestamp);

      // Deactivate old codes
      await this.prisma.cardIdentifier.updateMany({
        where: {
          cardId,
          isActive: true,
        },
        data: {
          isActive: false,
          rotatedAt: new Date(),
        },
      });

      // Create new code
      const identifier = await this.prisma.cardIdentifier.create({
        data: {
          cardId,
          restaurantId,
          code: newCode,
          codeType: 'QR_CODE',
          codeVersion: restaurant.qrCodeVersion,
          hmacSignature: signature,
          isActive: true,
          usageCount: 0,
        },
      });

      this.logger.debug(`New code generated: ${newCode}`);
      return newCode;
    } catch (error) {
      this.logger.error(`Failed to generate new code: ${error}`);
      throw error;
    }
  }

  /**
   * Validate a scanned QR code
   * Checks signature, expiration, and rotation status
   */
  async validateCode(
    code: string,
    restaurantId: string,
  ): Promise<{
    valid: boolean;
    cardId?: string;
    card?: any;
    error?: string;
  }> {
    try {
      // Find code
      const identifier = await this.prisma.cardIdentifier.findUnique({
        where: {
          code_restaurantId: {
            code,
            restaurantId,
          },
        },
        include: {
          card: {
            include: {
              user: true,
              tier: true,
            },
          },
        },
      });

      if (!identifier) {
        return {
          valid: false,
          error: 'Code not found',
        };
      }

      // Check if code is active
      if (!identifier.isActive) {
        return {
          valid: false,
          error: 'Code has been rotated',
        };
      }

      // Check expiration
      if (identifier.expiresAt && identifier.expiresAt < new Date()) {
        return {
          valid: false,
          error: 'Code has expired',
        };
      }

      // Verify HMAC signature
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { qrCodeSecret: true },
      });

      const expectedSignature = this.generateHmacSignature(
        code,
        restaurant.qrCodeSecret,
        Math.floor(identifier.createdAt.getTime() / 1000),
      );

      if (identifier.hmacSignature !== expectedSignature) {
        this.logger.warn(`Invalid signature for code: ${code}`);
        return {
          valid: false,
          error: 'Invalid signature',
        };
      }

      // Increment usage
      await this.prisma.cardIdentifier.update({
        where: { id: identifier.id },
        data: {
          usageCount: { increment: 1 },
          lastUsedAt: new Date(),
        },
      });

      // Check for duplicate usage within same minute (fraud detection)
      const recentUsage = await this.prisma.cardIdentifier.findUnique({
        where: { id: identifier.id },
      });

      if (
        recentUsage.lastUsedAt &&
        Date.now() - recentUsage.lastUsedAt.getTime() < 60000 &&
        recentUsage.usageCount > 1
      ) {
        this.logger.warn(`Potential fraud: Code ${code} used multiple times within minute`);
        return {
          valid: true,
          cardId: identifier.cardId,
          card: identifier.card,
          error: 'WARNING: Multiple uses detected',
        };
      }

      return {
        valid: true,
        cardId: identifier.cardId,
        card: identifier.card,
      };
    } catch (error) {
      this.logger.error(`Error validating code: ${error}`);
      return {
        valid: false,
        error: 'Validation failed',
      };
    }
  }

  /**
   * Rotate codes for a card on schedule
   * Runs periodically to invalidate old codes
   */
  async rotateCodesForCard(cardId: string): Promise<string> {
    try {
      const card = await this.prisma.guestCard.findUnique({
        where: { id: cardId },
        select: { restaurantId: true },
      });

      if (!card) {
        throw new Error('Card not found');
      }

      const newCode = await this.generateNewCode(cardId, card.restaurantId);
      this.logger.log(`Code rotated for card ${cardId}`);
      return newCode;
    } catch (error) {
      this.logger.error(`Failed to rotate code: ${error}`);
      throw error;
    }
  }

  /**
   * Batch rotate all active codes for restaurant
   * Runs as scheduled job for security
   */
  async rotateAllCodesForRestaurant(restaurantId: string): Promise<number> {
    try {
      this.logger.log(`Starting batch code rotation for restaurant ${restaurantId}`);

      // Get all active codes
      const activeIdentifiers = await this.prisma.cardIdentifier.findMany({
        where: {
          restaurantId,
          isActive: true,
        },
        select: { cardId: true },
      });

      let rotatedCount = 0;
      for (const identifier of activeIdentifiers) {
        try {
          await this.rotateCodesForCard(identifier.cardId);
          rotatedCount++;
        } catch (error) {
          this.logger.warn(`Failed to rotate code for card ${identifier.cardId}: ${error}`);
        }
      }

      this.logger.log(`Rotated ${rotatedCount} codes for restaurant ${restaurantId}`);
      return rotatedCount;
    } catch (error) {
      this.logger.error(`Batch rotation failed: ${error}`);
      throw error;
    }
  }

  /**
   * Get current active code for a card
   */
  async getActiveCode(cardId: string): Promise<string | null> {
    try {
      const identifier = await this.prisma.cardIdentifier.findFirst({
        where: {
          cardId,
          isActive: true,
        },
        select: { code: true },
      });

      return identifier?.code || null;
    } catch (error) {
      this.logger.error(`Failed to get active code: ${error}`);
      return null;
    }
  }

  /**
   * Get code history for a card
   */
  async getCodeHistory(
    cardId: string,
    limit: number = 50,
  ): Promise<CardIdentifier[]> {
    try {
      return await this.prisma.cardIdentifier.findMany({
        where: { cardId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      this.logger.error(`Failed to get code history: ${error}`);
      throw error;
    }
  }

  /**
   * Generate unique 12-character code
   * Format: XXXXXX-XXXXXX (6-6 digits)
   */
  private generateUniqueCode(): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    for (let i = 0; i < this.CODE_LENGTH; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Format as XXXXXX-XXXXXX
    return `${code.substring(0, 6)}-${code.substring(6)}`;
  }

  /**
   * Generate HMAC-SHA256 signature for code verification
   */
  private generateHmacSignature(code: string, secret: string, timestamp: number): string {
    const message = `${code}:${timestamp}`;
    return crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex');
  }

  /**
   * Verify HMAC signature
   */
  verifyHmacSignature(code: string, secret: string, timestamp: number, signature: string): boolean {
    const expectedSignature = this.generateHmacSignature(code, secret, timestamp);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }

  /**
   * Clean up old inactive codes (keep only last N)
   * Runs as maintenance job
   */
  async cleanupOldCodes(restaurantId: string, keepCount: number = this.ROTATION_BUFFER): Promise<number> {
    try {
      this.logger.log(`Cleaning up old codes for restaurant ${restaurantId}`);

      // Find inactive codes to delete
      const inactiveCodes = await this.prisma.cardIdentifier.findMany({
        where: {
          restaurantId,
          isActive: false,
        },
        orderBy: { createdAt: 'desc' },
        skip: keepCount,
        select: { id: true },
      });

      if (inactiveCodes.length === 0) {
        return 0;
      }

      // Delete old codes
      const result = await this.prisma.cardIdentifier.deleteMany({
        where: {
          id: {
            in: inactiveCodes.map((c) => c.id),
          },
        },
      });

      this.logger.log(`Deleted ${result.count} old codes`);
      return result.count;
    } catch (error) {
      this.logger.error(`Failed to cleanup codes: ${error}`);
      throw error;
    }
  }
}
