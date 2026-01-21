import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async sendNotification(
    userId: string,
    type: string,
    title: string,
    body: string,
    metadata?: Record<string, any>,
  ) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId,
          type: type as any,
          title,
          body,
          metadata: JSON.stringify(metadata || {}),
          deliveryChannel: 'IN_APP',
        },
      });

      this.logger.debug(`Notification created for user ${userId}`);
      return notification;
    } catch (error) {
      this.logger.error(`Failed to create notification: ${error}`);
      throw error;
    }
  }

  async getUserNotifications(userId: string, limit: number = 20) {
    try {
      return await this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      this.logger.error(`Failed to get notifications: ${error}`);
      throw error;
    }
  }
}
