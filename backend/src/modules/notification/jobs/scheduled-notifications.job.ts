import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ScheduledNotificationsJob {
  private logger = new Logger('ScheduledNotificationsJob');

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  /**
   * Run every day at 8 AM
   * Send monthly bonus points on card anniversary
   */
  @Cron('0 8 * * *')
  async handleMonthlyBonusPoints() {
    try {
      this.logger.log('Starting monthly bonus points job...');

      // Get all active cards created 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);

      const thirtyDaysAgoEnd = new Date(thirtyDaysAgo);
      thirtyDaysAgoEnd.setDate(thirtyDaysAgoEnd.getDate() + 1);

      const cardsWithAnniversary = await this.prisma.loyaltyCard.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
            lt: thirtyDaysAgoEnd,
          },
          status: 'ACTIVE',
        },
        include: {
          guest: true,
          tier: true,
        },
      });

      this.logger.log(`Found ${cardsWithAnniversary.length} cards with anniversary`);

      // Give bonus points to each card
      for (const card of cardsWithAnniversary) {
        const bonusPoints = card.tier?.bonusPointsPerMonth || 100;

        // Add points
        await this.prisma.pointTransaction.create({
          data: {
            cardId: card.id,
            points: bonusPoints,
            type: 'BONUS',
            reason: 'Monthly bonus points',
          },
        });

        // Update card points
        await this.prisma.loyaltyCard.update({
          where: { id: card.id },
          data: {
            currentPoints: {
              increment: bonusPoints,
            },
          },
        });

        this.logger.log(
          `Added ${bonusPoints} bonus points to card ${card.id}`,
        );
      }

      this.logger.log('Monthly bonus points job completed');
    } catch (error) {
      this.logger.error('Error in monthly bonus points job:', error);
    }
  }

  /**
   * Run every day at 10 AM
   * Send monthly summary emails
   */
  @Cron('0 10 * * 0') // Every Sunday at 10 AM
  async handleMonthlySummaryEmails() {
    try {
      this.logger.log('Starting monthly summary emails job...');

      // Get all active cards with email notifications enabled
      const cards = await this.prisma.loyaltyCard.findMany({
        where: {
          status: 'ACTIVE',
          guest: {
            preferences: {
              emailNotifications: true,
            },
          },
        },
        include: {
          guest: true,
          tier: true,
          transactions: {
            where: {
              createdAt: {
                gte: new Date(new Date().setDate(new Date().getDate() - 30)),
              },
            },
          },
          pointTransactions: {
            where: {
              createdAt: {
                gte: new Date(new Date().setDate(new Date().getDate() - 30)),
              },
            },
          },
        },
      });

      this.logger.log(`Sending monthly summary to ${cards.length} members`);

      // Send summary to each card
      for (const card of cards) {
        const totalSpend = card.transactions.reduce(
          (sum, tx) => sum + tx.amount,
          0,
        );
        const totalPoints = card.pointTransactions.reduce(
          (sum, pt) => sum + pt.points,
          0,
        );

        const html = this.generateMonthlySummaryHtml({
          name: card.guest?.name || 'Member',
          totalSpend,
          totalPoints,
          currentPoints: card.currentPoints,
          tier: card.tier?.name || 'Bronze',
          transactions: card.transactions.length,
        });

        await this.notificationService.emailService.sendEmail({
          to: card.guest?.email || '',
          subject: '📈 Your Loyalty Summary',
          html,
        });
      }

      this.logger.log('Monthly summary emails sent');
    } catch (error) {
      this.logger.error('Error in monthly summary emails job:', error);
    }
  }

  /**
   * Run daily at 6 PM
   * Clean up expired reward redemptions
   */
  @Cron('0 18 * * *')
  async handleExpiredRewardsCleanup() {
    try {
      this.logger.log('Starting expired rewards cleanup job...');

      // Find expired redemptions
      const expiredRedemptions = await this.prisma.rewardRedemption.findMany({
        where: {
          status: 'PENDING',
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      this.logger.log(`Found ${expiredRedemptions.length} expired redemptions`);

      // Mark as expired and refund points
      for (const redemption of expiredRedemptions) {
        // Update status
        await this.prisma.rewardRedemption.update({
          where: { id: redemption.id },
          data: {
            status: 'EXPIRED',
          },
        });

        // Refund points
        await this.prisma.loyaltyCard.update({
          where: { id: redemption.cardId },
          data: {
            currentPoints: {
              increment: redemption.pointsSpent,
            },
          },
        });

        // Log refund
        await this.prisma.pointTransaction.create({
          data: {
            cardId: redemption.cardId,
            points: redemption.pointsSpent,
            type: 'REFUND',
            reason: 'Expired reward refund',
          },
        });

        this.logger.log(
          `Refunded ${redemption.pointsSpent} points to card ${redemption.cardId}`,
        );
      }

      this.logger.log('Expired rewards cleanup completed');
    } catch (error) {
      this.logger.error('Error in expired rewards cleanup job:', error);
    }
  }

  /**
   * Generate monthly summary HTML
   */
  private generateMonthlySummaryHtml(data: {
    name: string;
    totalSpend: number;
    totalPoints: number;
    currentPoints: number;
    tier: string;
    transactions: number;
  }): string {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }
            .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
            .stat-box { background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #3B82F6; }
            .stat-label { font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 5px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #333; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📈 Your Monthly Summary</h1>
            </div>
            
            <p>Hi ${data.name},</p>
            <p>Here's your loyalty summary for this month:</p>
            
            <div class="stats">
              <div class="stat-box">
                <div class="stat-label">Total Spend</div>
                <div class="stat-value">€${data.totalSpend.toFixed(2)}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Points Earned</div>
                <div class="stat-value">+${data.totalPoints}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Current Balance</div>
                <div class="stat-value">${data.currentPoints}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Your Tier</div>
                <div class="stat-value">⭐ ${data.tier}</div>
              </div>
            </div>
            
            <p><strong>${data.transactions}</strong> transactions this month</p>
            
            <div class="footer">
              <p>© MaxLoyalty 2026</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
