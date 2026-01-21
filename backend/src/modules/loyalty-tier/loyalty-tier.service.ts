import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLoyaltyTierDto, UpdateLoyaltyTierDto, LoyaltyTierResponseDto } from './loyalty-tier.dto';

@Injectable()
export class LoyaltyTierService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new loyalty tier for restaurant
   */
  async createTier(
    restaurantId: string,
    dto: CreateLoyaltyTierDto,
  ): Promise<LoyaltyTierResponseDto> {
    // Check if tier with this level already exists
    const existingTier = await this.prisma.loyaltyTier.findFirst({
      where: {
        restaurantId,
        level: dto.level,
      },
    });

    if (existingTier) {
      throw new BadRequestException(
        `Loyalty tier with level ${dto.level} already exists for this restaurant`,
      );
    }

    // Check if minPointsRequired is in ascending order
    const higherTier = await this.prisma.loyaltyTier.findFirst({
      where: {
        restaurantId,
        level: { lt: dto.level },
        minPointsRequired: { gte: dto.minPointsRequired },
      },
    });

    if (higherTier) {
      throw new BadRequestException(
        `Points threshold must be higher than lower tier (${higherTier.minPointsRequired})`,
      );
    }

    // If this is default, remove default from others
    if (dto.isDefault) {
      await this.prisma.loyaltyTier.updateMany({
        where: {
          restaurantId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const tier = await this.prisma.loyaltyTier.create({
      data: {
        restaurantId,
        name: dto.name,
        level: dto.level,
        color: dto.color || '#808080',
        icon: dto.icon,
        minPointsRequired: dto.minPointsRequired,
        minSpendRequired: dto.minSpendRequired,
        minTransactionsRequired: dto.minTransactionsRequired,
        pointsMultiplier: dto.pointsMultiplier,
        bonusPointsPerMonth: dto.bonusPointsPerMonth,
        discountPercentage: dto.discountPercentage,
        features: dto.features || [],
        isDefault: dto.isDefault || false,
      },
    });

    return this.mapTierToDto(tier);
  }

  /**
   * Get all tiers for a restaurant
   */
  async getTiersByRestaurant(restaurantId: string): Promise<LoyaltyTierResponseDto[]> {
    const tiers = await this.prisma.loyaltyTier.findMany({
      where: { restaurantId },
      orderBy: { level: 'asc' },
    });

    return tiers.map((tier) => this.mapTierToDto(tier));
  }

  /**
   * Get a single tier by ID
   */
  async getTierById(tierId: string): Promise<LoyaltyTierResponseDto> {
    const tier = await this.prisma.loyaltyTier.findUnique({
      where: { id: tierId },
    });

    if (!tier) {
      throw new NotFoundException(`Loyalty tier with ID ${tierId} not found`);
    }

    return this.mapTierToDto(tier);
  }

  /**
   * Update a loyalty tier
   */
  async updateTier(
    tierId: string,
    dto: UpdateLoyaltyTierDto,
  ): Promise<LoyaltyTierResponseDto> {
    const tier = await this.prisma.loyaltyTier.findUnique({
      where: { id: tierId },
    });

    if (!tier) {
      throw new NotFoundException(`Loyalty tier with ID ${tierId} not found`);
    }

    // If updating points requirement, validate ordering
    if (dto.minPointsRequired && dto.minPointsRequired !== tier.minPointsRequired) {
      const conflictingTier = await this.prisma.loyaltyTier.findFirst({
        where: {
          restaurantId: tier.restaurantId,
          id: { not: tierId },
          minPointsRequired: { gte: dto.minPointsRequired },
          level: { lt: tier.level },
        },
      });

      if (conflictingTier) {
        throw new BadRequestException(
          `Points threshold must be higher than lower tiers`,
        );
      }
    }

    // If setting as default, remove from others
    if (dto.isActive === false) {
      throw new BadRequestException(
        `Cannot deactivate a tier. Use delete instead.`,
      );
    }

    const updated = await this.prisma.loyaltyTier.update({
      where: { id: tierId },
      data: {
        name: dto.name,
        color: dto.color,
        icon: dto.icon,
        minPointsRequired: dto.minPointsRequired,
        pointsMultiplier: dto.pointsMultiplier,
        bonusPointsPerMonth: dto.bonusPointsPerMonth,
        discountPercentage: dto.discountPercentage,
        features: dto.features,
        isActive: dto.isActive,
      },
    });

    return this.mapTierToDto(updated);
  }

  /**
   * Delete a loyalty tier
   */
  async deleteTier(tierId: string): Promise<void> {
    const tier = await this.prisma.loyaltyTier.findUnique({
      where: { id: tierId },
      include: {
        guestCards: { select: { id: true } },
      },
    });

    if (!tier) {
      throw new NotFoundException(`Loyalty tier with ID ${tierId} not found`);
    }

    if (tier.guestCards.length > 0) {
      throw new BadRequestException(
        `Cannot delete tier with ${tier.guestCards.length} active cards. Reassign cards first.`,
      );
    }

    await this.prisma.loyaltyTier.delete({
      where: { id: tierId },
    });
  }

  /**
   * Get default tier for a restaurant (used for new cards)
   */
  async getDefaultTier(restaurantId: string) {
    const tier = await this.prisma.loyaltyTier.findFirst({
      where: {
        restaurantId,
        isDefault: true,
      },
    });

    if (!tier) {
      throw new NotFoundException(
        `No default loyalty tier configured for restaurant ${restaurantId}`,
      );
    }

    return tier;
  }

  /**
   * Find tier for a card based on current points
   */
  async findTierForPoints(
    restaurantId: string,
    points: number,
  ): Promise<any> {
    // Find the highest tier the card qualifies for
    const tier = await this.prisma.loyaltyTier.findFirst({
      where: {
        restaurantId,
        minPointsRequired: { lte: points },
        isActive: true,
      },
      orderBy: {
        minPointsRequired: 'desc', // Get highest tier
      },
    });

    if (!tier) {
      // Return default tier if points not enough for any tier
      return this.getDefaultTier(restaurantId);
    }

    return tier;
  }

  /**
   * Check and upgrade card to new tier if eligible
   */
  async checkAndUpgradeTier(
    cardId: string,
    currentPoints: number,
  ): Promise<any> {
    const card = await this.prisma.guestCard.findUnique({
      where: { id: cardId },
      include: {
        tier: true,
        restaurant: true,
      },
    });

    if (!card || !card.restaurant) {
      throw new NotFoundException(`Guest card ${cardId} not found`);
    }

    const newTier = await this.findTierForPoints(
      card.restaurant.id,
      currentPoints,
    );

    // If tier changed, create upgrade record
    if (card.tierId !== newTier.id) {
      const oldTierId = card.tierId;

      // Update card
      const updated = await this.prisma.guestCard.update({
        where: { id: cardId },
        data: { tierId: newTier.id, lastTierCheckAt: new Date() },
        include: { tier: true },
      });

      // Create history record
      if (oldTierId) {
        await this.prisma.tierUpgradeHistory.create({
          data: {
            cardId,
            fromTierId: oldTierId,
            toTierId: newTier.id,
            triggerType: 'POINTS_THRESHOLD',
            triggerValue: currentPoints,
            reason: `Auto-upgraded to ${newTier.name}`,
          },
        });
      }

      return updated;
    }

    return card;
  }

  /**
   * Manually upgrade card to specific tier (Admin only)
   */
  async manualUpgradeTier(
    cardId: string,
    newTierId: string,
    reason: string,
    adminId: string,
  ): Promise<any> {
    const card = await this.prisma.guestCard.findUnique({
      where: { id: cardId },
      include: { tier: true },
    });

    if (!card) {
      throw new NotFoundException(`Guest card ${cardId} not found`);
    }

    const newTier = await this.prisma.loyaltyTier.findUnique({
      where: { id: newTierId },
    });

    if (!newTier) {
      throw new NotFoundException(`Loyalty tier ${newTierId} not found`);
    }

    const oldTierId = card.tierId;

    const updated = await this.prisma.guestCard.update({
      where: { id: cardId },
      data: { tierId: newTierId, lastTierCheckAt: new Date() },
      include: { tier: true },
    });

    // Record upgrade
    if (oldTierId) {
      await this.prisma.tierUpgradeHistory.create({
        data: {
          cardId,
          fromTierId: oldTierId,
          toTierId: newTierId,
          triggerType: 'ADMIN_UPGRADE',
          reason,
          upgradedBy: adminId,
        },
      });
    }

    return updated;
  }

  /**
   * Get tier upgrade history for a card
   */
  async getTierUpgradeHistory(cardId: string, limit: number = 20) {
    const history = await this.prisma.tierUpgradeHistory.findMany({
      where: { cardId },
      include: {
        fromTier: true,
        toTier: true,
      },
      orderBy: { upgradedAt: 'desc' },
      take: limit,
    });

    return history;
  }

  /**
   * Helper: Map database tier to DTO
   */
  private mapTierToDto(tier: any): LoyaltyTierResponseDto {
    return {
      id: tier.id,
      restaurantId: tier.restaurantId,
      name: tier.name,
      level: tier.level,
      color: tier.color,
      icon: tier.icon,
      minPointsRequired: tier.minPointsRequired,
      pointsMultiplier: tier.pointsMultiplier,
      bonusPointsPerMonth: tier.bonusPointsPerMonth,
      discountPercentage: tier.discountPercentage,
      features: tier.features,
      isActive: tier.isActive,
      isDefault: tier.isDefault,
      createdAt: tier.createdAt,
      updatedAt: tier.updatedAt,
    };
  }
}
