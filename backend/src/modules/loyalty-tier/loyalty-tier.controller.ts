import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoyaltyTierService } from './loyalty-tier.service';
import { CreateLoyaltyTierDto, UpdateLoyaltyTierDto } from './loyalty-tier.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OwnerGuard } from '../../guards/owner.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';

@ApiTags('Loyalty Tiers')
@Controller('api/loyalty-tiers')
@UseGuards(JwtAuthGuard)
export class LoyaltyTierController {
  constructor(private tierService: LoyaltyTierService) {}

  /**
   * Create a new loyalty tier
   */
  @Post('restaurants/:restaurantId')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Create a new loyalty tier' })
  @ApiBearerAuth()
  async createTier(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateLoyaltyTierDto,
  ) {
    return this.tierService.createTier(restaurantId, dto);
  }

  /**
   * Get all tiers for a restaurant
   */
  @Get('restaurants/:restaurantId')
  @ApiOperation({ summary: 'Get all loyalty tiers for a restaurant' })
  @ApiBearerAuth()
  async getTiers(@Param('restaurantId') restaurantId: string) {
    return this.tierService.getTiersByRestaurant(restaurantId);
  }

  /**
   * Get single tier
   */
  @Get(':tierId')
  @ApiOperation({ summary: 'Get a single loyalty tier' })
  @ApiBearerAuth()
  async getTier(@Param('tierId') tierId: string) {
    return this.tierService.getTierById(tierId);
  }

  /**
   * Update a loyalty tier
   */
  @Put(':tierId')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Update a loyalty tier' })
  @ApiBearerAuth()
  async updateTier(
    @Param('tierId') tierId: string,
    @Body() dto: UpdateLoyaltyTierDto,
  ) {
    return this.tierService.updateTier(tierId, dto);
  }

  /**
   * Delete a loyalty tier
   */
  @Delete(':tierId')
  @UseGuards(OwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a loyalty tier' })
  @ApiBearerAuth()
  async deleteTier(@Param('tierId') tierId: string) {
    return this.tierService.deleteTier(tierId);
  }

  /**
   * Get tier upgrade history for a card
   */
  @Get('cards/:cardId/upgrade-history')
  @ApiOperation({ summary: 'Get tier upgrade history for a card' })
  @ApiBearerAuth()
  async getUpgradeHistory(
    @Param('cardId') cardId: string,
  ) {
    return this.tierService.getTierUpgradeHistory(cardId);
  }

  /**
   * Manually upgrade a card to a tier (Admin only)
   */
  @Post('cards/:cardId/upgrade')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Manually upgrade card to a tier' })
  @ApiBearerAuth()
  async manualUpgrade(
    @Param('cardId') cardId: string,
    @Body() body: { tierId: string; reason: string },
    @CurrentUser() user: any,
  ) {
    return this.tierService.manualUpgradeTier(
      cardId,
      body.tierId,
      body.reason,
      user.id,
    );
  }
}
