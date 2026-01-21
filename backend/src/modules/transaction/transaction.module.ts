import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CardCodeService } from '../card-code/card-code.service';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionController],
  providers: [TransactionService, CardCodeService],
  exports: [TransactionService],
})
export class TransactionModule {}
