import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantOwnerController } from './restaurant-owner.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CardCodeService } from '../card-code/card-code.service';

@Module({
  imports: [PrismaModule],
  controllers: [RestaurantOwnerController],
  providers: [RestaurantService, CardCodeService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
