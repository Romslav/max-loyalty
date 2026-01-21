import { IsString, IsInt, IsFloat, IsBoolean, IsOptional, IsArray, IsISO8601, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRewardDto {
  @IsString()
  name: string; // "Free Coffee", "10% Discount"

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string; // URL to image

  @IsString()
  category: string; // "FOOD", "DISCOUNT", "EXPERIENCE", "MERCHANDISE"

  @IsInt()
  @Min(1)
  pointsRequired: number; // How many points to redeem

  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number; // NULL = unlimited

  @IsISO8601()
  validFrom: string; // ISO datetime

  @IsISO8601()
  validUntil: string; // ISO datetime

  @IsISO8601()
  @IsOptional()
  redeemDeadline?: string; // Days after redemption to use

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  minTierLevel?: number; // Minimum tier to access

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowedTiers?: string[]; // Specific tiers

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  priority?: number; // Higher = shown first
}

export class UpdateRewardDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  pointsRequired?: number;

  @IsInt()
  @IsOptional()
  quantity?: number;

  @IsISO8601()
  @IsOptional()
  validUntil?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  priority?: number;
}

export class RewardResponseDto {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  image?: string;
  category: string;
  pointsRequired: number;
  quantity?: number;
  quantityRedeemed: number;
  validFrom: Date;
  validUntil: Date;
  redeemDeadline?: Date;
  minTierLevel: number;
  allowedTiers: string[];
  isActive: boolean;
  isFeatured: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export class RedeemRewardDto {
  @IsString()
  rewardId: string;
}

export class RewardRedemptionResponseDto {
  id: string;
  cardId: string;
  rewardId: string;
  reward: RewardResponseDto;
  pointsSpent: number;
  code: string; // Redemption code
  status: string; // PENDING, USED, EXPIRED, CANCELLED
  redeemedAt: Date;
  usedAt?: Date;
  expiresAt: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class RewardListQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsString()
  @IsOptional()
  sortBy?: string; // "priority", "pointsRequired", "createdAt"
}
