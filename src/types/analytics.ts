export enum DateRange {
  SEVEN_DAYS = '7d',
  THIRTY_DAYS = '30d',
  NINETY_DAYS = '90d',
  CUSTOM = 'custom',
}

export interface ChartData {
  label: string;
  value: number;
  timestamp?: string;
}

export interface RevenueChartData {
  data: ChartData[];
  total: number;
  average: number;
  trend: number;
}

export interface TierData {
  name: string;
  value: number;
  percentage: number;
  color?: string;
}

export interface TopCustomer {
  id: string;
  name: string;
  points: number;
  spend: number;
  tier: string;
}
