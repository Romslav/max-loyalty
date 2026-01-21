import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { SMSService } from './sms.service';
import { TemplateService } from './template.service';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  NotificationType,
  TierUpgradeNotificationDto,
  PointsEarnedNotificationDto,
  RewardNotificationDto,
} from '../notification.dto';

@Injectable()
export class NotificationService {
  private logger = new Logger('NotificationService');

  constructor(
    private emailService: EmailService,
    private smsService: SMSService,
    private templateService: TemplateService,
    private prisma: PrismaService,
  ) {}

  /**
   * Send tier upgrade notification
   */
  async notifyTierUpgrade(
    data: TierUpgradeNotificationDto,
  ): Promise<void> {
    try {
      const html = this.templateService.getTierUpgradeTemplate(data);
      await this.emailService.sendEmail({
        to: data.email,
        subject: `🎉 Congratulations! You've reached ${data.tierName} tier!`,
        html,
      });
      this.logger.log(
        `Tier upgrade notification sent to ${data.email}`,
      );
    } catch (error) {
      this.logger.error('Failed to send tier upgrade notification:', error);
    }
  }

  /**
   * Send points earned notification
   */
  async notifyPointsEarned(
    data: PointsEarnedNotificationDto,
  ): Promise<void> {
    try {
      const html = this.templateService.getPointsEarnedTemplate(data);
      await this.emailService.sendEmail({
        to: data.email,
        subject: `💰 You earned ${data.points} points!`,
        html,
      });
      this.logger.log(`Points earned notification sent to ${data.email}`);
    } catch (error) {
      this.logger.error('Failed to send points earned notification:', error);
    }
  }

  /**
   * Send reward available notification
   */
  async notifyRewardAvailable(
    data: RewardNotificationDto,
  ): Promise<void> {
    try {
      const html = this.templateService.getRewardAvailableTemplate(data);
      await this.emailService.sendEmail({
        to: data.email,
        subject: `🎁 New reward unlocked: ${data.rewardName}`,
        html,
      });
      this.logger.log(`Reward available notification sent to ${data.email}`);
    } catch (error) {
      this.logger.error(
        'Failed to send reward available notification:',
        error,
      );
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, userName: string): Promise<void> {
    try {
      const html = this.templateService.getWelcomeTemplate({ userName });
      await this.emailService.sendEmail({
        to: email,
        subject: '👋 Welcome to MaxLoyalty!',
        html,
      });
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error('Failed to send welcome email:', error);
    }
  }

  /**
   * Get user notification preferences
   */
  async getPreferences(userId: string): Promise<any> {
    const prefs = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    return prefs || {
      userId,
      emailNotifications: true,
      smsNotifications: false,
      frequency: 'INSTANT',
    };
  }

  /**
   * Update user notification preferences
   */
  async updatePreferences(
    userId: string,
    preferences: any,
  ): Promise<void> {
    await this.prisma.userPreferences.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences,
      },
    });
    this.logger.log(`Preferences updated for user ${userId}`);
  }
}
