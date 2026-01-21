import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../services/notification.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { PointsEarnedNotificationDto } from '../notification.dto';

@Injectable()
export class TransactionListener {
  private logger = new Logger('TransactionListener');

  constructor(
    private notificationService: NotificationService,
    private prisma: PrismaService,
  ) {}

  /**
   * Listen for points earned events
   */
  @OnEvent('points.earned')
  async handlePointsEarned(payload: any) {
    try {
      this.logger.log(
        `Points earned event: ${payload.points} points for card ${payload.cardId}`,
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

      // Get current balance
      const currentBalance = card.currentPoints || 0;

      // Send notification
      const notificationData: PointsEarnedNotificationDto = {
        cardId: payload.cardId,
        userName: card.guest.name,
        points: payload.points,
        currentBalance: currentBalance + payload.points,
        amount: payload.amount || 0,
        email: card.guest.email,
      };

      await this.notificationService.notifyPointsEarned(notificationData);
    } catch (error) {
      this.logger.error('Error handling points earned event:', error);
    }
  }

  /**
   * Listen for points redeemed events
   */
  @OnEvent('points.redeemed')
  async handlePointsRedeemed(payload: any) {
    try {
      this.logger.log(
        `Points redeemed event: ${payload.points} points for card ${payload.cardId}`,
      );
      // Implement if needed
    } catch (error) {
      this.logger.error('Error handling points redeemed event:', error);
    }
  }
}
