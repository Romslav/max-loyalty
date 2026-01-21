import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class ManageGuestCardDto {
  @IsString()
  @IsOptional()
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED';

  @IsNumber()
  @IsOptional()
  pointsAdjustment?: number;
}

export class UpdateRestaurantSettingsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsNumber()
  @IsOptional()
  pointsPerPurchase?: number;

  @IsNumber()
  @IsOptional()
  pointsExpirationDays?: number;

  @IsNumber()
  @IsOptional()
  qrCodeRotationMinutes?: number;

  @IsEnum(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
  @IsOptional()
  status?: string;
}
