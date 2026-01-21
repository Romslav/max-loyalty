import { Injectable, Logger, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CardCodeService } from '../card-code/card-code.service';
import { UpdateRestaurantSettingsDto } from './restaurant.dto';

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cardCodeService: CardCodeService,
  ) {}

  /**
   * Get all restaurants where user is staff/owner
   */
  async getUserRestaurants(userId: string) {
    try {
      const restaurants = await this.prisma.restaurantStaff.findMany({
        where: { userId },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              email: true,
              address: true,
              city: true,
              status: true,
              guestCards: { select: { id: true } },
            },
          },
        },
      });

      return restaurants.map((r) => ({
        role: r.role,
        ...r.restaurant,
        cardCount: r.restaurant.guestCards.length,
      }));
    } catch (error) {
      this.logger.error(`Failed to get user restaurants: ${error}`);
      throw error;
    }
  }

  /**
   * Get restaurant with permission check
   */
  async getRestaurantWithPermissionCheck(restaurantId: string, userId: string) {
    try {
      const staff = await this.prisma.restaurantStaff.findFirst({
        where: {
          restaurantId,
          userId,
          role: { in: ['OWNER', 'MANAGER'] },
        },
      });

      if (!staff) {
        throw new ForbiddenException('No permission to access this restaurant');
      }

      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });

      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      return restaurant;
    } catch (error) {
      this.logger.error(`Permission check failed: ${error}`);
      throw error;
    }
  }

  /**
   * Get all guest cards for restaurant
   */
  async getRestaurantGuestCards(restaurantId: string, limit: number, offset: number) {
    try {
      const [cards, total] = await Promise.all([
        this.prisma.guestCard.findMany({
          where: { restaurantId },
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            tier: true,
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
        }),
        this.prisma.guestCard.count({ where: { restaurantId } }),
      ]);

      return {
        cards,
        pagination: {
          total,
          limit,
          offset,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get guest cards: ${error}`);
      throw error;
    }
  }

  /**
   * Get guest card details with transaction history
   */
  async getGuestCardDetails(cardId: string, restaurantId: string) {
    try {
      const card = await this.prisma.guestCard.findFirst({
        where: { id: cardId, restaurantId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
          tier: true,
          transactions: {
            take: 20,
            orderBy: { transactionDate: 'desc' },
          },
          identifiers: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
              code: true,
              isActive: true,
              usageCount: true,
              lastUsedAt: true,
            },
          },
        },
      });

      if (!card) {
        throw new NotFoundException('Card not found');
      }

      return card;
    } catch (error) {
      this.logger.error(`Failed to get card details: ${error}`);
      throw error;
    }
  }

  /**
   * Update guest card status
   */
  async updateGuestCardStatus(
    cardId: string,
    restaurantId: string,
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED',
  ) {
    try {
      const card = await this.prisma.guestCard.updateMany({
        where: { id: cardId, restaurantId },
        data: { status },
      });

      if (card.count === 0) {
        throw new NotFoundException('Card not found');
      }

      this.logger.log(`Card ${cardId} status updated to ${status}`);

      return { success: true, status };
    } catch (error) {
      this.logger.error(`Failed to update card status: ${error}`);
      throw error;
    }
  }

  /**
   * Add bonus points to card
   */
  async addBonusPointsToCard(
    cardId: string,
    restaurantId: string,
    points: number,
    reason: string,
    staffId: string,
  ) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Get card
        const card = await tx.guestCard.findFirst({
          where: { id: cardId, restaurantId },
        });

        if (!card) {
          throw new NotFoundException('Card not found');
        }

        // Update points
        const newBalance = card.currentPoints + points;
        const updated = await tx.guestCard.update({
          where: { id: cardId },
          data: {
            currentPoints: newBalance,
            totalPointsEarned: card.totalPointsEarned + points,
          },
        });

        // Log point change
        await tx.pointLog.create({
          data: {
            restaurantId,
            cardId,
            pointsChange: points,
            balanceBefore: card.currentPoints,
            balanceAfter: newBalance,
            reason: 'ADMIN_ADJUSTMENT',
            description: `Bonus: ${reason}`,
          },
        });

        return updated;
      });

      this.logger.log(`Bonus ${points} points added to card ${cardId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to add bonus points: ${error}`);
      throw error;
    }
  }

  /**
   * Get restaurant analytics
   */
  async getRestaurantAnalytics(restaurantId: string, days: number) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const transactions = await this.prisma.transaction.findMany({
        where: {
          restaurantId,
          transactionDate: { gte: startDate },
        },
        include: {
          card: { select: { currentPoints: true, tier: { select: { name: true } } } },
        },
      });

      const cards = await this.prisma.guestCard.findMany({
        where: { restaurantId },
      });

      const analytics = {
        dateRange: {
          from: startDate,
          to: new Date(),
          days,
        },
        transactions: {
          total: transactions.length,
          totalRevenue: transactions.reduce((sum, t) => sum + Number(t.amount), 0),
          totalPointsIssued: transactions.reduce((sum, t) => sum + t.pointsEarned, 0),
          averageOrderValue: transactions.length > 0
            ? transactions.reduce((sum, t) => sum + Number(t.amount), 0) /
              transactions.length
            : 0,
        },
        cards: {
          total: cards.length,
          active: cards.filter((c) => c.status === 'ACTIVE').length,
          suspended: cards.filter((c) => c.status === 'SUSPENDED').length,
          blocked: cards.filter((c) => c.status === 'BLOCKED').length,
        },
        points: {
          totalOutstanding: cards.reduce((sum, c) => sum + c.currentPoints, 0),
        },
      };

      return analytics;
    } catch (error) {
      this.logger.error(`Failed to get analytics: ${error}`);
      throw error;
    }
  }

  /**
   * Update restaurant settings
   */
  async updateRestaurantSettings(
    restaurantId: string,
    dto: UpdateRestaurantSettingsDto,
  ) {
    try {
      const restaurant = await this.prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
          name: dto.name,
          description: dto.description,
          address: dto.address,
          phoneNumber: dto.phoneNumber,
          website: dto.website,
          pointsPerPurchase: dto.pointsPerPurchase,
          pointsExpirationDays: dto.pointsExpirationDays,
          qrCodeRotationMinutes: dto.qrCodeRotationMinutes,
          status: dto.status as any,
        },
      });

      this.logger.log(`Restaurant ${restaurantId} settings updated`);

      return restaurant;
    } catch (error) {
      this.logger.error(`Failed to update settings: ${error}`);
      throw error;
    }
  }

  /**
   * Rotate all QR codes for restaurant
   */
  async rotateRestaurantQRCodes(restaurantId: string) {
    try {
      const rotatedCount = await this.cardCodeService.rotateAllCodesForRestaurant(
        restaurantId,
      );

      return {
        success: true,
        codesRotated: rotatedCount,
      };
    } catch (error) {
      this.logger.error(`Failed to rotate QR codes: ${error}`);
      throw error;
    }
  }
}
