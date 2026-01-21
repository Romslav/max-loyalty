import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { CardCodeService } from '../card-code/card-code.service';

@Module({
  imports: [PrismaModule],
  providers: [TelegramBotService, CardCodeService],
  exports: [TelegramBotService],
})
export class TelegramModule {}
