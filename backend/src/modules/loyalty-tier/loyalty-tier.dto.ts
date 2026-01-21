import { IsString, IsInt, IsFloat, IsBoolean, IsOptional, IsArray, IsHexColor, Min, Max } from 'class-validator';

export class CreateLoyaltyTierDto {
  @IsString()
  name: string; // "Silver", "Gold", "Platinum"

  @IsInt()
  @Min(1)
  @Max(10)
  level: number; // 1, 2, 3, 4

  @IsHexColor()
  @IsOptional()
  color?: string; // "#FFD700"

  @IsString()
  @IsOptional()
  icon?: string; // URL to icon

  @IsInt()
  @Min(0)
  minPointsRequired: number; // Points threshold

  @IsFloat()
  @IsOptional()
  minSpendRequired?: number; // Alternative: spend amount

  @IsInt()
  @IsOptional()
  minTransactionsRequired?: number; // Alternative: transaction count

  @IsFloat()
  @Min(1.0)
  @Max(3.0)
  pointsMultiplier: number; // 1.0x, 1.2x, 1.5x

  @IsInt()
  @Min(0)
  bonusPointsPerMonth: number; // Free points each month

  @IsFloat()
  @Min(0)
  @Max(100)
  discountPercentage: number; // Additional discount %

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[]; // ["priority_support", "vip_line"]

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean; // Initial tier for new cards
}

export class UpdateLoyaltyTierDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsHexColor()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  minPointsRequired?: number;

  @IsFloat()
  @Min(1.0)
  @IsOptional()
  pointsMultiplier?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  bonusPointsPerMonth?: number;

  @IsFloat()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercentage?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class LoyaltyTierResponseDto {
  id: string;
  restaurantId: string;
  name: string;
  level: number;
  color: string;
  icon?: string;
  minPointsRequired: number;
  pointsMultiplier: number;
  bonusPointsPerMonth: number;
  discountPercentage: number;
  features: string[];
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TierUpgradeHistoryDto {
  id: string;
  cardId: string;
  fromTier: LoyaltyTierResponseDto;
  toTier: LoyaltyTierResponseDto;
  triggerType: string; // "POINTS_THRESHOLD", "SPEND_THRESHOLD", "ADMIN_UPGRADE"
  triggerValue?: number;
  reason?: string;
  upgradedAt: Date;
  upgradedBy?: string;
}
