import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from './services/notification.service';
import { EmailService } from './services/email.service';
import { SMSService } from './services/sms.service';
import { TemplateService } from './services/template.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    NotificationService,
    EmailService,
    SMSService,
    TemplateService,
    PrismaService,
  ],
  exports: [
    NotificationService,
    EmailService,
    SMSService,
    TemplateService,
  ],
})
export class NotificationModule {}
