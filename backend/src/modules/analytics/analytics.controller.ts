import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { DateRangeDto, AnalyticsOverviewDto, DateRange } from './analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  /**
   * Get revenue chart
   */
  @Get('restaurants/:restaurantId/revenue')
  async getRevenue(
    @Param('restaurantId') restaurantId: string,
    @Query('range') range?: DateRange,
  ) {
    return this.analyticsService.getRevenueChart(restaurantId, {
      range: range || DateRange.THIRTY_DAYS,
    });
  }

  /**
   * Get tier distribution
   */
  @Get('restaurants/:restaurantId/tier-distribution')
  async getTierDistribution(@Param('restaurantId') restaurantId: string) {
    return this.analyticsService.getTierDistribution(restaurantId);
  }

  /**
   * Get top customers
   */
  @Get('restaurants/:restaurantId/top-customers')
  async getTopCustomers(
    @Param('restaurantId') restaurantId: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.analyticsService.getTopCustomers(restaurantId, limit);
  }

  /**
   * Get reward popularity
   */
  @Get('restaurants/:restaurantId/reward-popularity')
  async getRewardPopularity(@Param('restaurantId') restaurantId: string) {
    return this.analyticsService.getRewardPopularity(restaurantId);
  }

  /**
   * Get card activity
   */
  @Get('restaurants/:restaurantId/card-activity')
  async getCardActivity(
    @Param('restaurantId') restaurantId: string,
    @Query('range') range?: DateRange,
  ) {
    return this.analyticsService.getCardActivity(restaurantId, {
      range: range || DateRange.THIRTY_DAYS,
    });
  }

  /**
   * Get points issued
   */
  @Get('restaurants/:restaurantId/points-issued')
  async getPointsIssued(
    @Param('restaurantId') restaurantId: string,
    @Query('range') range?: DateRange,
  ) {
    return this.analyticsService.getPointsIssued(restaurantId, {
      range: range || DateRange.THIRTY_DAYS,
    });
  }

  /**
   * Get all analytics overview
   */
  @Get('restaurants/:restaurantId/overview')
  async getOverview(
    @Param('restaurantId') restaurantId: string,
    @Query('range') range?: DateRange,
  ): Promise<AnalyticsOverviewDto> {
    const [revenue, tierDistribution, topCustomers, rewardPopularity, cardActivity, pointsIssued] =
      await Promise.all([
        this.analyticsService.getRevenueChart(restaurantId, {
          range: range || DateRange.THIRTY_DAYS,
        }),
        this.analyticsService.getTierDistribution(restaurantId),
        this.analyticsService.getTopCustomers(restaurantId),
        this.analyticsService.getRewardPopularity(restaurantId),
        this.analyticsService.getCardActivity(restaurantId, {
          range: range || DateRange.THIRTY_DAYS,
        }),
        this.analyticsService.getPointsIssued(restaurantId, {
          range: range || DateRange.THIRTY_DAYS,
        }),
      ]);

    return {
      revenue,
      tierDistribution,
      topCustomers,
      rewardPopularity,
      cardActivity,
      pointsIssued,
    };
  }
}
