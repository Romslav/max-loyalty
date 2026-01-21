import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CardModule } from './modules/card/card.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { NotificationModule } from './modules/notification/notification.module';
import { LoyaltyTierModule } from './modules/loyalty-tier/loyalty-tier.module';
import { RewardModule } from './modules/reward/reward.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
    PrismaModule,
    AuthModule,
    CardModule,
    TransactionModule,
    RestaurantModule,
    TelegramModule,
    NotificationModule,
    LoyaltyTierModule,
    RewardModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
