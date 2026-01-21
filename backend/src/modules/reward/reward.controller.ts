import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RewardService } from './reward.service';
import { CreateRewardDto, UpdateRewardDto, RedeemRewardDto, RewardListQueryDto } from './reward.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OwnerGuard } from '../../guards/owner.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';

@ApiTags('Rewards')
@Controller('api/rewards')
@UseGuards(JwtAuthGuard)
export class RewardController {
  constructor(private rewardService: RewardService) {}

  /**
   * Create a new reward (Owner only)
   */
  @Post('restaurants/:restaurantId')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Create a new reward' })
  @ApiBearerAuth()
  async createReward(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateRewardDto,
  ) {
    return this.rewardService.createReward(restaurantId, dto);
  }

  /**
   * Get all rewards for a restaurant
   */
  @Get('restaurants/:restaurantId')
  @ApiOperation({ summary: 'Get all rewards for a restaurant' })
  @ApiBearerAuth()
  async getRewards(
    @Param('restaurantId') restaurantId: string,
    @Query() query: RewardListQueryDto,
  ) {
    return this.rewardService.getRewards(restaurantId, {
      limit: query.limit,
      offset: query.offset,
      category: query.category,
      isActive: query.isActive,
      sortBy: query.sortBy,
    });
  }

  /**
   * Get featured rewards for a restaurant
   */
  @Get('restaurants/:restaurantId/featured')
  @ApiOperation({ summary: 'Get featured rewards' })
  @ApiBearerAuth()
  async getFeaturedRewards(@Param('restaurantId') restaurantId: string) {
    return this.rewardService.getFeaturedRewards(restaurantId);
  }

  /**
   * Get single reward
   */
  @Get(':rewardId')
  @ApiOperation({ summary: 'Get a single reward' })
  @ApiBearerAuth()
  async getReward(@Param('rewardId') rewardId: string) {
    return this.rewardService.getRewardById(rewardId);
  }

  /**
   * Update a reward (Owner only)
   */
  @Put(':rewardId')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Update a reward' })
  @ApiBearerAuth()
  async updateReward(
    @Param('rewardId') rewardId: string,
    @Body() dto: UpdateRewardDto,
  ) {
    return this.rewardService.updateReward(rewardId, dto);
  }

  /**
   * Delete a reward (Owner only)
   */
  @Delete(':rewardId')
  @UseGuards(OwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a reward' })
  @ApiBearerAuth()
  async deleteReward(@Param('rewardId') rewardId: string) {
    return this.rewardService.deleteReward(rewardId);
  }

  /**
   * Redeem a reward
   */
  @Post('cards/:cardId/redeem')
  @ApiOperation({ summary: 'Redeem a reward' })
  @ApiBearerAuth()
  async redeemReward(
    @Param('cardId') cardId: string,
    @Body() dto: RedeemRewardDto,
  ) {
    return this.rewardService.redeemReward(cardId, dto.rewardId);
  }

  /**
   * Get redemptions for a card
   */
  @Get('cards/:cardId/redemptions')
  @ApiOperation({ summary: 'Get card redemptions' })
  @ApiBearerAuth()
  async getCardRedemptions(
    @Param('cardId') cardId: string,
    @Query('status') status?: string,
  ) {
    return this.rewardService.getCardRedemptions(cardId, status);
  }

  /**
   * Mark redemption as used (Staff only)
   */
  @Post('redemptions/:code/use')
  @ApiOperation({ summary: 'Mark redemption as used' })
  @ApiBearerAuth()
  async useRedemption(
    @Param('code') code: string,
    @CurrentUser() user: any,
  ) {
    return this.rewardService.useRedemption(code, user.id);
  }

  /**
   * Cancel a redemption
   */
  @Post('redemptions/:id/cancel')
  @ApiOperation({ summary: 'Cancel a redemption' })
  @ApiBearerAuth()
  async cancelRedemption(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.rewardService.cancelRedemption(id, reason);
  }

  /**
   * Get reward statistics
   */
  @Get('restaurants/:restaurantId/stats')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Get reward statistics' })
  @ApiBearerAuth()
  async getStats(@Param('restaurantId') restaurantId: string) {
    return this.rewardService.getRewardStats(restaurantId);
  }
}
