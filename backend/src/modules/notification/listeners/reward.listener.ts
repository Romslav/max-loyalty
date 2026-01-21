import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../services/notification.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { RewardNotificationDto } from '../notification.dto';

@Injectable()
export class RewardListener {
  private logger = new Logger('RewardListener');

  constructor(
    private notificationService: NotificationService,
    private prisma: PrismaService,
  ) {}

  /**
   * Listen for reward redemption events
   */
  @OnEvent('reward.redeemed')
  async handleRewardRedeemed(payload: any) {
    try {
      this.logger.log(
        `Reward redeemed event: ${payload.rewardId} by card ${payload.cardId}`,
      );

      // Get card with guest
      const card = await this.prisma.loyaltyCard.findUnique({
        where: { id: payload.cardId },
        include: { guest: true },
      });

      if (!card?.guest?.email) {
        this.logger.warn(`No email found for card ${payload.cardId}`);
        return;
      }

      // Get reward details
      const reward = await this.prisma.reward.findUnique({
        where: { id: payload.rewardId },
      });

      if (!reward) {
        this.logger.warn(`Reward not found: ${payload.rewardId}`);
        return;
      }

      // Send confirmation notification
      const notificationData: RewardNotificationDto = {
        cardId: payload.cardId,
        userName: card.guest.name,
        rewardName: reward.name,
        pointsRequired: reward.pointsRequired,
        currentPoints: card.currentPoints || 0,
        email: card.guest.email,
      };

      // Note: This could be customized to send a "confirmation" instead
    } catch (error) {
      this.logger.error('Error handling reward redeemed event:', error);
    }
  }

  /**
   * Listen for reward available events (e.g., tier-based rewards unlock)
   */
  @OnEvent('reward.available')
  async handleRewardAvailable(payload: any) {
    try {
      this.logger.log(
        `Reward available event: ${payload.rewardId} for card ${payload.cardId}`,
      );

      // Get card with guest
      const card = await this.prisma.loyaltyCard.findUnique({
        where: { id: payload.cardId },
        include: { guest: true },
      });

      if (!card?.guest?.email) {
        this.logger.warn(`No email found for card ${payload.cardId}`);
        return;
      }

      // Get reward details
      const reward = await this.prisma.reward.findUnique({
        where: { id: payload.rewardId },
      });

      if (!reward) {
        this.logger.warn(`Reward not found: ${payload.rewardId}`);
        return;
      }

      // Send notification
      const notificationData: RewardNotificationDto = {
        cardId: payload.cardId,
        userName: card.guest.name,
        rewardName: reward.name,
        pointsRequired: reward.pointsRequired,
        currentPoints: card.currentPoints || 0,
        email: card.guest.email,
      };

      await this.notificationService.notifyRewardAvailable(notificationData);
    } catch (error) {
      this.logger.error('Error handling reward available event:', error);
    }
  }
}
