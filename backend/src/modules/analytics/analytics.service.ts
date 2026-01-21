import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DateRange,
  DateRangeDto,
  RevenueChartDto,
  TierDistributionDto,
  TopCustomersDto,
  RewardPopularityDto,
  CardActivityDto,
  PointsIssuedDto,
  ChartDataDto,
} from './analytics.dto';

@Injectable()
export class AnalyticsService {
  private logger = new Logger('AnalyticsService');

  constructor(private prisma: PrismaService) {}

  /**
   * Get date range from enum
   */
  private getDateRange(range: DateRange): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
      case DateRange.SEVEN_DAYS:
        startDate.setDate(startDate.getDate() - 7);
        break;
      case DateRange.THIRTY_DAYS:
        startDate.setDate(startDate.getDate() - 30);
        break;
      case DateRange.NINETY_DAYS:
        startDate.setDate(startDate.getDate() - 90);
        break;
    }

    return { startDate, endDate };
  }

  /**
   * Get revenue chart data
   */
  async getRevenueChart(
    restaurantId: string,
    dateRangeDto: DateRangeDto,
  ): Promise<RevenueChartDto> {
    try {
      const range = this.getDateRange(dateRangeDto.range || DateRange.THIRTY_DAYS);

      // Get transactions
      const transactions = await this.prisma.transaction.findMany({
        where: {
          card: {
            restaurantId,
          },
          createdAt: {
            gte: range.startDate,
            lte: range.endDate,
          },
        },
        select: {
          amount: true,
          createdAt: true,
        },
      });

      // Aggregate by day
      const dailyData = new Map<string, number>();
      let total = 0;

      transactions.forEach((tx) => {
        const day = tx.createdAt.toISOString().split('T')[0];
        dailyData.set(day, (dailyData.get(day) || 0) + tx.amount);
        total += tx.amount;
      });

      // Convert to chart format
      const data: ChartDataDto[] = Array.from(dailyData.entries()).map(
        ([date, value]) => ({
          label: new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          value: Math.round(value * 100) / 100,
          timestamp: date,
        }),
      );

      const average = transactions.length > 0 ? total / transactions.length : 0;

      // Calculate trend (compare to previous period)
      const prevRange = new Date(range.startDate);
      prevRange.setDate(prevRange.getDate() - (range.endDate.getTime() - range.startDate.getTime()) / (1000 * 60 * 60 * 24));

      const prevTransactions = await this.prisma.transaction.findMany({
        where: {
          card: {
            restaurantId,
          },
          createdAt: {
            gte: prevRange,
            lte: range.startDate,
          },
        },
        select: {
          amount: true,
        },
      });

      const prevTotal = prevTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      const trend = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;

      return {
        data,
        total: Math.round(total * 100) / 100,
        average: Math.round(average * 100) / 100,
        trend: Math.round(trend),
      };
    } catch (error) {
      this.logger.error('Error getting revenue chart:', error);
      return {
        data: [],
        total: 0,
        average: 0,
        trend: 0,
      };
    }
  }

  /**
   * Get tier distribution chart
   */
  async getTierDistribution(restaurantId: string): Promise<TierDistributionDto> {
    try {
      // Get all tiers with card counts
      const tiers = await this.prisma.loyaltyTier.findMany({
        where: { restaurantId },
        select: {
          id: true,
          name: true,
          color: true,
          level: true,
          _count: {
            select: {
              cards: true,
            },
          },
        },
      });

      const total = tiers.reduce((sum, t) => sum + t._count.cards, 0);

      const data = tiers.map((tier) => ({
        name: tier.name,
        value: tier._count.cards,
        percentage: total > 0 ? Math.round((tier._count.cards / total) * 100) : 0,
        color: tier.color,
      }));

      return { data, total };
    } catch (error) {
      this.logger.error('Error getting tier distribution:', error);
      return { data: [], total: 0 };
    }
  }

  /**
   * Get top customers
   */
  async getTopCustomers(
    restaurantId: string,
    limit: number = 10,
  ): Promise<TopCustomersDto> {
    try {
      const customers = await this.prisma.loyaltyCard.findMany({
        where: { restaurantId },
        include: {
          guest: true,
          tier: true,
          transactions: true,
        },
        orderBy: {
          currentPoints: 'desc',
        },
        take: limit,
        select: {
          id: true,
          guest: {
            select: {
              name: true,
            },
          },
          currentPoints: true,
          tier: {
            select: {
              name: true,
            },
          },
          transactions: {
            select: {
              amount: true,
            },
          },
        },
      });

      const data = customers.map((customer) => ({
        id: customer.id,
        name: customer.guest?.name || 'Unknown',
        points: customer.currentPoints || 0,
        spend: customer.transactions.reduce((sum, tx) => sum + tx.amount, 0),
        tier: customer.tier?.name || 'Bronze',
      }));

      return { data, limit };
    } catch (error) {
      this.logger.error('Error getting top customers:', error);
      return { data: [], limit };
    }
  }

  /**
   * Get reward popularity
   */
  async getRewardPopularity(restaurantId: string): Promise<RewardPopularityDto> {
    try {
      const rewards = await this.prisma.reward.findMany({
        where: { restaurantId },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              redemptions: true,
            },
          },
        },
        orderBy: {
          _count: {
            redemptions: 'desc',
          },
        },
        take: 10,
      });

      const total = rewards.reduce((sum, r) => sum + r._count.redemptions, 0);

      const data = rewards.map((reward) => ({
        id: reward.id,
        name: reward.name,
        redemptions: reward._count.redemptions,
        percentage:
          total > 0
            ? Math.round((reward._count.redemptions / total) * 100)
            : 0,
      }));

      return { data, total };
    } catch (error) {
      this.logger.error('Error getting reward popularity:', error);
      return { data: [], total: 0 };
    }
  }

  /**
   * Get card activity
   */
  async getCardActivity(
    restaurantId: string,
    dateRangeDto: DateRangeDto,
  ): Promise<CardActivityDto> {
    try {
      const range = this.getDateRange(dateRangeDto.range || DateRange.THIRTY_DAYS);

      // Get cards created in range
      const newCards = await this.prisma.loyaltyCard.count({
        where: {
          restaurantId,
          createdAt: {
            gte: range.startDate,
            lte: range.endDate,
          },
        },
      });

      // Get active cards (with transactions in range)
      const activeCards = await this.prisma.loyaltyCard.findMany({
        where: {
          restaurantId,
          transactions: {
            some: {
              createdAt: {
                gte: range.startDate,
                lte: range.endDate,
              },
            },
          },
        },
        select: { id: true },
      });

      const totalInactive = await this.prisma.loyaltyCard.count({
        where: {
          restaurantId,
          transactions: {
            none: {
              createdAt: {
                gte: range.startDate,
                lte: range.endDate,
              },
            },
          },
        },
      });

      // Generate daily data
      const data: ChartDataDto[] = [];
      const currentDate = new Date(range.startDate);

      while (currentDate <= range.endDate) {
        const dayEnd = new Date(currentDate);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const dayActive = await this.prisma.loyaltyCard.count({
          where: {
            restaurantId,
            transactions: {
              some: {
                createdAt: {
                  gte: currentDate,
                  lte: dayEnd,
                },
              },
            },
          },
        });

        data.push({
          label: currentDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          value: dayActive,
          timestamp: currentDate.toISOString().split('T')[0],
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      const totalActive = activeCards.length;
      const growthRate =
        newCards > 0
          ? Math.round((newCards / (totalActive + totalInactive)) * 100)
          : 0;

      return {
        data,
        totalActive,
        totalInactive,
        growthRate,
      };
    } catch (error) {
      this.logger.error('Error getting card activity:', error);
      return {
        data: [],
        totalActive: 0,
        totalInactive: 0,
        growthRate: 0,
      };
    }
  }

  /**
   * Get points issued
   */
  async getPointsIssued(
    restaurantId: string,
    dateRangeDto: DateRangeDto,
  ): Promise<PointsIssuedDto> {
    try {
      const range = this.getDateRange(dateRangeDto.range || DateRange.THIRTY_DAYS);

      // Get all point transactions
      const transactions = await this.prisma.pointTransaction.findMany({
        where: {
          card: {
            restaurantId,
          },
          createdAt: {
            gte: range.startDate,
            lte: range.endDate,
          },
        },
        select: {
          points: true,
          createdAt: true,
        },
      });

      // Aggregate by day
      const dailyData = new Map<string, number>();
      let total = 0;

      transactions.forEach((tx) => {
        const day = tx.createdAt.toISOString().split('T')[0];
        const absPoints = Math.abs(tx.points);
        dailyData.set(day, (dailyData.get(day) || 0) + absPoints);
        total += absPoints;
      });

      // Convert to chart format
      const data: ChartDataDto[] = Array.from(dailyData.entries()).map(
        ([date, value]) => ({
          label: new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          value,
          timestamp: date,
        }),
      );

      const average = transactions.length > 0 ? total / transactions.length : 0;

      return {
        data,
        total,
        average: Math.round(average),
      };
    } catch (error) {
      this.logger.error('Error getting points issued:', error);
      return {
        data: [],
        total: 0,
        average: 0,
      };
    }
  }
}
