import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [RewardService, PrismaService],
  controllers: [RewardController],
  exports: [RewardService],
})
export class RewardModule {}
