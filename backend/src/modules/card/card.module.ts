import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CardCodeService } from '../card-code/card-code.service';

@Module({
  imports: [PrismaModule],
  controllers: [CardController],
  providers: [CardService, CardCodeService],
  exports: [CardService],
})
export class CardModule {}
