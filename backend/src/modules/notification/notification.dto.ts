import { IsString, IsEmail, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export enum NotificationType {
  TIER_UPGRADE = 'TIER_UPGRADE',
  POINTS_EARNED = 'POINTS_EARNED',
  REWARD_AVAILABLE = 'REWARD_AVAILABLE',
  REWARD_REDEEMED = 'REWARD_REDEEMED',
  WELCOME = 'WELCOME',
  MONTHLY_SUMMARY = 'MONTHLY_SUMMARY',
  BIRTHDAY_BONUS = 'BIRTHDAY_BONUS',
  LOW_POINTS_WARNING = 'LOW_POINTS_WARNING',
}

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  html: string;

  @IsString()
  @IsOptional()
  text?: string;
}

export class SendSMSDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  message: string;
}

export class NotificationPreferencesDto {
  @IsBoolean()
  @IsOptional()
  emailNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  smsNotifications?: boolean;

  @IsString()
  @IsOptional()
  @IsEnum(['INSTANT', 'DAILY', 'WEEKLY'])
  frequency?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}

export class TierUpgradeNotificationDto {
  cardId: string;
  userName: string;
  tierName: string;
  tierLevel: number;
  pointsMultiplier: number;
  features: string[];
  email: string;
}

export class PointsEarnedNotificationDto {
  cardId: string;
  userName: string;
  points: number;
  currentBalance: number;
  amount: number;
  email: string;
}

export class RewardNotificationDto {
  cardId: string;
  userName: string;
  rewardName: string;
  pointsRequired: number;
  currentPoints: number;
  email: string;
}
