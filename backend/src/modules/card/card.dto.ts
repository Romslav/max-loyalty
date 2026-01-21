import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';

export class CreateGuestCardDto {
  @IsUUID()
  restaurantId: string;

  @IsOptional()
  @IsString()
  guestName?: string;

  @IsOptional()
  @IsString()
  guestPhone?: string;

  @IsOptional()
  @IsString()
  guestEmail?: string;

  @IsOptional()
  @IsEnum(['STANDARD', 'PREMIUM', 'VIP', 'FAMILY'])
  cardType?: string;
}

export class ValidateCardCodeDto {
  @IsString()
  code: string;

  @IsUUID()
  restaurantId: string;
}

export class UpdateCardStatusDto {
  @IsEnum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLOCKED'])
  status: string;
}
