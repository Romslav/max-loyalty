import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../services/notification.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { TierUpgradeNotificationDto } from '../notification.dto';

@Injectable()
export class TierListener {
  private logger = new Logger('TierListener');

  constructor(
    private notificationService: NotificationService,
    private prisma: PrismaService,
  ) {}

  /**
   * Listen for tier upgrade events
   */
  @OnEvent('tier.upgraded')
  async handleTierUpgrade(payload: any) {
    try {
      this.logger.log(`Tier upgrade event for card: ${payload.cardId}`);

      // Get card details
      const card = await this.prisma.loyaltyCard.findUnique({
        where: { id: payload.cardId },
        include: { guest: true },
      });

      if (!card?.guest?.email) {
        this.logger.warn(`No email found for card ${payload.cardId}`);
        return;
      }

      // Get tier details
      const tier = await this.prisma.loyaltyTier.findUnique({
        where: { id: payload.toTierId },
      });

      if (!tier) {
        this.logger.warn(`Tier not found: ${payload.toTierId}`);
        return;
      }

      // Send notification
      const notificationData: TierUpgradeNotificationDto = {
        cardId: payload.cardId,
        userName: card.guest.name,
        tierName: tier.name,
        tierLevel: tier.level,
        pointsMultiplier: tier.pointsMultiplier,
        features: tier.features || [],
        email: card.guest.email,
      };

      await this.notificationService.notifyTierUpgrade(notificationData);
    } catch (error) {
      this.logger.error('Error handling tier upgrade event:', error);
    }
  }

  /**
   * Listen for tier downgrade events
   */
  @OnEvent('tier.downgraded')
  async handleTierDowngrade(payload: any) {
    try {
      this.logger.log(`Tier downgrade event for card: ${payload.cardId}`);
      // Implement downgrade notification if needed
    } catch (error) {
      this.logger.error('Error handling tier downgrade event:', error);
    }
  }
}
