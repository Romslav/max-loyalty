import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from './services/notification.service';
import { EmailService } from './services/email.service';
import { SMSService } from './services/sms.service';
import { TemplateService } from './services/template.service';
import { TierListener } from './listeners/tier.listener';
import { TransactionListener } from './listeners/transaction.listener';
import { RewardListener } from './listeners/reward.listener';
import { ScheduledNotificationsJob } from './jobs/scheduled-notifications.job';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    // Services
    NotificationService,
    EmailService,
    SMSService,
    TemplateService,
    PrismaService,
    // Event Listeners
    TierListener,
    TransactionListener,
    RewardListener,
    // Scheduled Jobs
    ScheduledNotificationsJob,
  ],
  exports: [
    NotificationService,
    EmailService,
    SMSService,
    TemplateService,
  ],
})
export class NotificationModule {}
