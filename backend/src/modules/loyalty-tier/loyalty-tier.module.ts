import { Module } from '@nestjs/common';
import { LoyaltyTierService } from './loyalty-tier.service';
import { LoyaltyTierController } from './loyalty-tier.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [LoyaltyTierService, PrismaService],
  controllers: [LoyaltyTierController],
  exports: [LoyaltyTierService],
})
export class LoyaltyTierModule {}
