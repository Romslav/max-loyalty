import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsUUID()
  restaurantId: string;

  @IsString()
  scannedCode: string; // QR code scanned

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  referenceId?: string; // Order number, receipt number, etc.

  @IsOptional()
  @IsString()
  metadata?: string; // JSON: items, order details, etc.

  @IsOptional()
  @IsEnum(['PURCHASE', 'REFUND', 'ADJUSTMENT', 'BONUS'])
  type?: string;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(['COMPLETED', 'FAILED', 'CANCELLED', 'DISPUTED'])
  status?: string;

  @IsOptional()
  @IsNumber()
  pointsAdjustment?: number;
}
