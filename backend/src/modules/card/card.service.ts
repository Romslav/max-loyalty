import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CardCodeService } from '../card-code/card-code.service';
import { CreateGuestCardDto } from './card.dto';

@Injectable()
export class CardService {
  private readonly logger = new Logger(CardService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cardCodeService: CardCodeService,
  ) {}

  /**
   * Get all cards for user
   */
  async getUserCards(userId: string) {
    try {
      const cards = await this.prisma.guestCard.findMany({
        where: { userId },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
          tier: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return cards;
    } catch (error) {
      this.logger.error(`Failed to get user cards: ${error}`);
      throw error;
    }
  }

  /**
   * Get specific card with details
   */
  async getCard(cardId: string) {
    try {
      const card = await this.prisma.guestCard.findUnique({
        where: { id: cardId },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              address: true,
              city: true,
              pointsPerPurchase: true,
            },
          },
          tier: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      if (!card) {
        throw new NotFoundException('Card not found');
      }

      return card;
    } catch (error) {
      this.logger.error(`Failed to get card: ${error}`);
      throw error;
    }
  }

  /**
   * Create new guest card
   */
  async createCard(dto: CreateGuestCardDto, userId: string) {
    try {
      // Check if restaurant exists
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: dto.restaurantId },
      });

      if (!restaurant) {
        throw new BadRequestException('Restaurant not found');
      }

      // Check if card already exists
      const existingCard = await this.prisma.guestCard.findFirst({
        where: {
          userId,
          restaurantId: dto.restaurantId,
        },
      });

      if (existingCard) {
        throw new BadRequestException('You already have a card for this restaurant');
      }

      // Create card
      const card = await this.prisma.guestCard.create({
        data: {
          restaurantId: dto.restaurantId,
          userId,
          guestName: dto.guestName,
          guestPhone: dto.guestPhone,
          guestEmail: dto.guestEmail,
          status: 'ACTIVE',
          cardType: (dto.cardType as any) || 'STANDARD',
        },
        include: {
          restaurant: true,
        },
      });

      // Generate QR code
      const qrCode = await this.cardCodeService.generateNewCode(
        card.id,
        card.restaurantId,
      );

      this.logger.log(`Card created: ${card.id}`);

      return {
        ...card,
        qrCode,
      };
    } catch (error) {
      this.logger.error(`Failed to create card: ${error}`);
      throw error;
    }
  }

  /**
   * Validate card code (used during transaction)
   */
  async validateCardCode(code: string, restaurantId: string) {
    try {
      const result = await this.cardCodeService.validateCode(code, restaurantId);

      if (!result.valid) {
        throw new BadRequestException(result.error || 'Invalid code');
      }

      return {
        valid: true,
        cardId: result.cardId,
        card: result.card,
      };
    } catch (error) {
      this.logger.error(`Failed to validate code: ${error}`);
      throw error;
    }
  }

  /**
   * Get active QR code for card
   */
  async getCardQRCode(cardId: string) {
    try {
      const code = await this.cardCodeService.getActiveCode(cardId);

      if (!code) {
        throw new NotFoundException('No active QR code found');
      }

      return { code };
    } catch (error) {
      this.logger.error(`Failed to get QR code: ${error}`);
      throw error;
    }
  }

  /**
   * Get card transaction history
   */
  async getCardTransactions(cardId: string, limit: number = 50) {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: { cardId },
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { transactionDate: 'desc' },
        take: limit,
      });

      return transactions;
    } catch (error) {
      this.logger.error(`Failed to get transactions: ${error}`);
      throw error;
    }
  }

  /**
   * Get card points history
   */
  async getCardPointsHistory(cardId: string, limit: number = 50) {
    try {
      const pointLogs = await this.prisma.pointLog.findMany({
        where: { cardId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return pointLogs;
    } catch (error) {
      this.logger.error(`Failed to get points history: ${error}`);
      throw error;
    }
  }

  /**
   * Update card status
   */
  async updateCardStatus(cardId: string, status: string) {
    try {
      const card = await this.prisma.guestCard.update({
        where: { id: cardId },
        data: {
          status: status as any,
        },
        include: {
          restaurant: true,
        },
      });

      this.logger.log(`Card status updated: ${cardId} -> ${status}`);

      return card;
    } catch (error) {
      this.logger.error(`Failed to update card status: ${error}`);
      throw error;
    }
  }

  /**
   * Get card by code (staff side)
   */
  async getCardByCode(code: string, restaurantId: string) {
    try {
      const validationResult = await this.cardCodeService.validateCode(code, restaurantId);

      if (!validationResult.valid) {
        throw new BadRequestException('Invalid code');
      }

      return validationResult.card;
    } catch (error) {
      this.logger.error(`Failed to get card by code: ${error}`);
      throw error;
    }
  }

  /**
   * Rotate card code
   */
  async rotateCardCode(cardId: string) {
    try {
      const card = await this.getCard(cardId);
      const newCode = await this.cardCodeService.rotateCodesForCard(cardId);

      this.logger.log(`Card code rotated: ${cardId}`);

      return { newCode };
    } catch (error) {
      this.logger.error(`Failed to rotate code: ${error}`);
      throw error;
    }
  }
}
