import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRewardDto, UpdateRewardDto, RewardResponseDto, RedeemRewardDto } from './reward.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RewardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new reward
   */
  async createReward(
    restaurantId: string,
    dto: CreateRewardDto,
  ): Promise<RewardResponseDto> {
    const validFrom = new Date(dto.validFrom);
    const validUntil = new Date(dto.validUntil);

    if (validFrom >= validUntil) {
      throw new BadRequestException('validFrom must be before validUntil');
    }

    const reward = await this.prisma.reward.create({
      data: {
        restaurantId,
        name: dto.name,
        description: dto.description,
        image: dto.image,
        category: dto.category,
        pointsRequired: dto.pointsRequired,
        quantity: dto.quantity,
        validFrom,
        validUntil,
        redeemDeadline: dto.redeemDeadline ? new Date(dto.redeemDeadline) : null,
        minTierLevel: dto.minTierLevel || 1,
        allowedTiers: dto.allowedTiers || [],
        isFeatured: dto.isFeatured || false,
        priority: dto.priority || 0,
      },
    });

    return this.mapRewardToDto(reward);
  }

  /**
   * Get all rewards for a restaurant (with filters)
   */
  async getRewards(
    restaurantId: string,
    filters: {
      limit?: number;
      offset?: number;
      category?: string;
      isActive?: boolean;
      sortBy?: string;
    } = {},
  ) {
    const {
      limit = 20,
      offset = 0,
      category,
      isActive = true,
      sortBy = 'priority',
    } = filters;

    const now = new Date();

    const where = {
      restaurantId,
      ...(category && { category }),
      isActive,
      validFrom: { lte: now },
      validUntil: { gte: now },
    };

    const orderBy = this.buildOrderBy(sortBy);

    const [rewards, total] = await Promise.all([
      this.prisma.reward.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
      }),
      this.prisma.reward.count({ where }),
    ]);

    return {
      rewards: rewards.map((r) => this.mapRewardToDto(r)),
      pagination: {
        limit,
        offset,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get featured rewards for a restaurant
   */
  async getFeaturedRewards(restaurantId: string, limit: number = 6) {
    const now = new Date();

    const rewards = await this.prisma.reward.findMany({
      where: {
        restaurantId,
        isFeatured: true,
        isActive: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
      },
      orderBy: { priority: 'desc' },
      take: limit,
    });

    return rewards.map((r) => this.mapRewardToDto(r));
  }

  /**
   * Get single reward
   */
  async getRewardById(rewardId: string): Promise<RewardResponseDto> {
    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new NotFoundException(`Reward ${rewardId} not found`);
    }

    return this.mapRewardToDto(reward);
  }

  /**
   * Update a reward
   */
  async updateReward(
    rewardId: string,
    dto: UpdateRewardDto,
  ): Promise<RewardResponseDto> {
    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new NotFoundException(`Reward ${rewardId} not found`);
    }

    const updateData: any = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.description) updateData.description = dto.description;
    if (dto.image) updateData.image = dto.image;
    if (dto.pointsRequired) updateData.pointsRequired = dto.pointsRequired;
    if (dto.quantity !== undefined) updateData.quantity = dto.quantity;
    if (dto.validUntil) updateData.validUntil = new Date(dto.validUntil);
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.isFeatured !== undefined) updateData.isFeatured = dto.isFeatured;
    if (dto.priority !== undefined) updateData.priority = dto.priority;

    const updated = await this.prisma.reward.update({
      where: { id: rewardId },
      data: updateData,
    });

    return this.mapRewardToDto(updated);
  }

  /**
   * Delete a reward
   */
  async deleteReward(rewardId: string): Promise<void> {
    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new NotFoundException(`Reward ${rewardId} not found`);
    }

    await this.prisma.reward.delete({
      where: { id: rewardId },
    });
  }

  /**
   * Redeem a reward for a guest card
   */
  async redeemReward(cardId: string, rewardId: string) {
    const card = await this.prisma.guestCard.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      throw new NotFoundException(`Guest card ${cardId} not found`);
    }

    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new NotFoundException(`Reward ${rewardId} not found`);
    }

    const now = new Date();

    // Validate reward availability
    if (!reward.isActive) {
      throw new BadRequestException('Reward is not active');
    }

    if (reward.validFrom > now || reward.validUntil < now) {
      throw new BadRequestException('Reward is not available at this time');
    }

    // Check quantity
    if (reward.quantity && reward.quantityRedeemed >= reward.quantity) {
      throw new BadRequestException('Reward is sold out');
    }

    // Check card points
    if (card.currentPoints < reward.pointsRequired) {
      throw new BadRequestException(
        `Insufficient points. Need ${reward.pointsRequired}, have ${card.currentPoints}`,
      );
    }

    // Check tier eligibility
    if (card.tierId) {
      const tier = await this.prisma.loyaltyTier.findUnique({
        where: { id: card.tierId },
      });

      if (tier && tier.level < reward.minTierLevel) {
        throw new ForbiddenException(
          `Your tier (${tier.name}) is below minimum required for this reward`,
        );
      }
    }

    // Check if already redeemed
    const existingRedemption = await this.prisma.rewardRedemption.findFirst({
      where: {
        cardId,
        rewardId,
        status: 'PENDING',
      },
    });

    if (existingRedemption) {
      throw new BadRequestException('This reward has already been redeemed');
    }

    // Calculate expiration
    const expiresAt = reward.redeemDeadline || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default

    // Generate redemption code
    const code = this.generateRedemptionCode();

    // Create redemption
    const redemption = await this.prisma.rewardRedemption.create({
      data: {
        cardId,
        rewardId,
        pointsSpent: reward.pointsRequired,
        code,
        expiresAt,
        status: 'PENDING',
      },
      include: { reward: true },
    });

    // Deduct points from card
    await this.prisma.guestCard.update({
      where: { id: cardId },
      data: {
        currentPoints: card.currentPoints - reward.pointsRequired,
      },
    });

    // Log the point deduction
    await this.prisma.pointLog.create({
      data: {
        cardId,
        points: -reward.pointsRequired,
        balanceBefore: card.currentPoints,
        balanceAfter: card.currentPoints - reward.pointsRequired,
        transactionType: 'REDEMPTION',
        description: `Redeemed reward: ${reward.name}`,
        reference: redemption.id,
      },
    });

    // Increment reward quantity redeemed
    await this.prisma.reward.update({
      where: { id: rewardId },
      data: {
        quantityRedeemed: reward.quantityRedeemed + 1,
      },
    });

    return redemption;
  }

  /**
   * Get redemptions for a card
   */
  async getCardRedemptions(
    cardId: string,
    status?: string,
  ) {
    const where = {
      cardId,
      ...(status && { status }),
    };

    const redemptions = await this.prisma.rewardRedemption.findMany({
      where,
      include: { reward: true },
      orderBy: { redeemedAt: 'desc' },
    });

    return redemptions;
  }

  /**
   * Mark reward as used (by staff)
   */
  async useRedemption(redemptionCode: string, staffId: string) {
    const redemption = await this.prisma.rewardRedemption.findUnique({
      where: { code: redemptionCode },
      include: { reward: true, guestCard: true },
    });

    if (!redemption) {
      throw new NotFoundException('Redemption code not found');
    }

    if (redemption.status !== 'PENDING') {
      throw new BadRequestException(
        `Reward has already been ${redemption.status.toLowerCase()}`,
      );
    }

    if (new Date() > redemption.expiresAt) {
      // Update status to expired
      await this.prisma.rewardRedemption.update({
        where: { id: redemption.id },
        data: { status: 'EXPIRED' },
      });

      throw new BadRequestException('Redemption has expired');
    }

    // Mark as used
    const used = await this.prisma.rewardRedemption.update({
      where: { id: redemption.id },
      data: {
        status: 'USED',
        usedAt: new Date(),
        usedBy: staffId,
      },
      include: { reward: true },
    });

    return used;
  }

  /**
   * Cancel a redemption (staff only)
   */
  async cancelRedemption(redemptionId: string, reason?: string) {
    const redemption = await this.prisma.rewardRedemption.findUnique({
      where: { id: redemptionId },
      include: { reward: true, guestCard: true },
    });

    if (!redemption) {
      throw new NotFoundException('Redemption not found');
    }

    if (redemption.status === 'USED') {
      throw new BadRequestException('Cannot cancel a used redemption');
    }

    // Refund points
    const card = redemption.guestCard;
    await this.prisma.guestCard.update({
      where: { id: card.id },
      data: {
        currentPoints: card.currentPoints + redemption.pointsSpent,
      },
    });

    // Log refund
    await this.prisma.pointLog.create({
      data: {
        cardId: card.id,
        points: redemption.pointsSpent,
        balanceBefore: card.currentPoints,
        balanceAfter: card.currentPoints + redemption.pointsSpent,
        transactionType: 'REFUND',
        description: `Cancelled redemption: ${redemption.reward.name}. Reason: ${reason || 'No reason provided'}`,
        reference: redemption.id,
      },
    });

    // Cancel redemption
    const cancelled = await this.prisma.rewardRedemption.update({
      where: { id: redemptionId },
      data: {
        status: 'CANCELLED',
        notes: reason,
      },
    });

    return cancelled;
  }

  /**
   * Get reward statistics for a restaurant
   */
  async getRewardStats(restaurantId: string) {
    const rewards = await this.prisma.reward.findMany({
      where: { restaurantId },
      include: {
        redemptions: true,
      },
    });

    const totalRewards = rewards.length;
    const totalRedemptions = rewards.reduce(
      (acc, r) => acc + r.redemptions.length,
      0,
    );
    const totalPointsRedeemed = rewards.reduce(
      (acc, r) => acc + r.redemptions.reduce((sum, red) => sum + red.pointsSpent, 0),
      0,
    );

    return {
      totalRewards,
      totalRedemptions,
      totalPointsRedeemed,
      averageRedemptionsPerReward: totalRedemptions / totalRewards || 0,
    };
  }

  // =====================
  // PRIVATE HELPERS
  // =====================

  private buildOrderBy(sortBy: string) {
    switch (sortBy) {
      case 'pointsRequired':
        return { pointsRequired: 'asc' };
      case 'createdAt':
        return { createdAt: 'desc' };
      case 'priority':
      default:
        return { priority: 'desc' };
    }
  }

  private generateRedemptionCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `REWARD-${timestamp}-${random}`;
  }

  private mapRewardToDto(reward: any): RewardResponseDto {
    return {
      id: reward.id,
      restaurantId: reward.restaurantId,
      name: reward.name,
      description: reward.description,
      image: reward.image,
      category: reward.category,
      pointsRequired: reward.pointsRequired,
      quantity: reward.quantity,
      quantityRedeemed: reward.quantityRedeemed,
      validFrom: reward.validFrom,
      validUntil: reward.validUntil,
      redeemDeadline: reward.redeemDeadline,
      minTierLevel: reward.minTierLevel,
      allowedTiers: reward.allowedTiers,
      isActive: reward.isActive,
      isFeatured: reward.isFeatured,
      priority: reward.priority,
      createdAt: reward.createdAt,
      updatedAt: reward.updatedAt,
    };
  }
}
