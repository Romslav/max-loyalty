import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export enum DateRange {
  SEVEN_DAYS = '7d',
  THIRTY_DAYS = '30d',
  NINETY_DAYS = '90d',
  CUSTOM = 'custom',
}

export class DateRangeDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsEnum(DateRange)
  range?: DateRange;
}

export class ChartDataDto {
  label: string;
  value: number;
  timestamp?: string;
}

export class RevenueChartDto {
  data: ChartDataDto[];
  total: number;
  average: number;
  trend: number; // percentage
}

export class TierDistributionDto {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
    color?: string;
  }>;
  total: number;
}

export class TopCustomersDto {
  data: Array<{
    id: string;
    name: string;
    points: number;
    spend: number;
    tier: string;
  }>;
  limit: number;
}

export class RewardPopularityDto {
  data: Array<{
    id: string;
    name: string;
    redemptions: number;
    percentage: number;
  }>;
  total: number;
}

export class CardActivityDto {
  data: ChartDataDto[];
  totalActive: number;
  totalInactive: number;
  growthRate: number;
}

export class PointsIssuedDto {
  data: ChartDataDto[];
  total: number;
  average: number;
}

export class AnalyticsOverviewDto {
  revenue: RevenueChartDto;
  tierDistribution: TierDistributionDto;
  topCustomers: TopCustomersDto;
  rewardPopularity: RewardPopularityDto;
  cardActivity: CardActivityDto;
  pointsIssued: PointsIssuedDto;
}
