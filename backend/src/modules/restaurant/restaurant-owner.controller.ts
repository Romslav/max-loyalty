import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  Logger,
  Query,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OwnerGuard } from '../../guards/owner.guard';
import { ManageGuestCardDto, UpdateRestaurantSettingsDto } from './restaurant.dto';
import { Request } from 'express';

/**
 * Restaurant Owner API
 * Endpoints for restaurant owners and managers to:
 * 1. View guest cards
 * 2. See analytics
 * 3. Manage loyalty tiers
 * 4. View staff transactions
 * 5. Manage restaurant settings
 */
@Controller('api/owner/restaurants')
@UseGuards(JwtAuthGuard, OwnerGuard)
export class RestaurantOwnerController {
  private readonly logger = new Logger(RestaurantOwnerController.name);

  constructor(private readonly restaurantService: RestaurantService) {}

  /**
   * Get all restaurants owned by user
   * GET /api/owner/restaurants
   */
  @Get()
  async getOwnedRestaurants(@Req() req: Request) {
    return this.restaurantService.getUserRestaurants((req.user as any).userId);
  }

  /**
   * Get restaurant details
   * GET /api/owner/restaurants/:restaurantId
   */
  @Get(':restaurantId')
  async getRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Req() req: Request,
  ) {
    return this.restaurantService.getRestaurantWithPermissionCheck(
      restaurantId,
      (req.user as any).userId,
    );
  }

  /**
   * Get all guest cards for restaurant
   * GET /api/owner/restaurants/:restaurantId/guest-cards
   */
  @Get(':restaurantId/guest-cards')
  async getGuestCards(
    @Param('restaurantId') restaurantId: string,
    @Query('limit') limit: string = '100',
    @Query('offset') offset: string = '0',
    @Req() req: Request,
  ) {
    await this.restaurantService.getRestaurantWithPermissionCheck(
      restaurantId,
      (req.user as any).userId,
    );

    return this.restaurantService.getRestaurantGuestCards(
      restaurantId,
      parseInt(limit),
      parseInt(offset),
    );
  }

  /**
   * Get guest card details
   * GET /api/owner/restaurants/:restaurantId/guest-cards/:cardId
   */
  @Get(':restaurantId/guest-cards/:cardId')
  async getGuestCard(
    @Param('restaurantId') restaurantId: string,
    @Param('cardId') cardId: string,
    @Req() req: Request,
  ) {
    await this.restaurantService.getRestaurantWithPermissionCheck(
      restaurantId,
      (req.user as any).userId,
    );

    return this.restaurantService.getGuestCardDetails(cardId, restaurantId);
  }

  /**
   * Suspend guest card
   * PUT /api/owner/restaurants/:restaurantId/guest-cards/:cardId/suspend
   */
  @Put(':restaurantId/guest-cards/:cardId/suspend')
  async suspendGuestCard(
    @Param('restaurantId') restaurantId: string,
    @Param('cardId') cardId: string,
    @Req() req: Request,
  ) {
    await this.restaurantService.getRestaurantWithPermissionCheck(
      restaurantId,
      (req.user as any).userId,
    );

    return this.restaurantService.updateGuestCardStatus(cardId, restaurantId, 'SUSPENDED');
  }

  /**
   * Block guest card
   * PUT /api/owner/restaurants/:restaurantId/guest-cards/:cardId/block
   */
  @Put(':restaurantId/guest-cards/:cardId/block')
  async blockGuestCard(
    @Param('restaurantId') restaurantId: string,
    @Param('cardId') cardId: string,
    @Req() req: Request,
  ) {
    await this.restaurantService.getRestaurantWithPermissionCheck(
      restaurantId,
      (req.user as any).userId,
    );

    return this.restaurantService.updateGuestCardStatus(cardId, restaurantId, 'BLOCKED');
  }

  /**
   * Add bonus points to card
   * POST /api/owner/restaurants/:restaurantId/guest-cards/:cardId/add-bonus
   */
  @Post(':restaurantId/guest-cards/:cardId/add-bonus')
  @HttpCode(200)
  async addBonusPoints(
    @Param('restaurantId') restaurantId: string,
    @Param('cardId') cardId: string,
    @Body() dto: { points: number; reason: string },
    @Req() req: Request,
  ) {
    await this.restaurantService.getRestaurantWithPermissionCheck(
      restaurantId,
      (req.user as any).userId,
    );

    return this.restaurantService.addBonusPointsToCard(
      cardId,
      restaurantId,
      dto.points,
      dto.reason,
      (req.user as any).userId,
    );
  }

  /**
   * Get restaurant analytics
   * GET /api/owner/restaurants/:restaurantId/analytics
   */
  @Get(':restaurantId/analytics')
  async getAnalytics(
    @Param('restaurantId') restaurantId: string,
    @Query('days') days: string = '30',
    @Req() req: Request,
  ) {
    await this.restaurantService.getRestaurantWithPermissionCheck(
      restaurantId,
      (req.user as any).userId,
    );

    return this.restaurantService.getRestaurantAnalytics(restaurantId, parseInt(days));
  }

  /**
   * Update restaurant settings
   * PUT /api/owner/restaurants/:restaurantId/settings
   */
  @Put(':restaurantId/settings')
  async updateSettings(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: UpdateRestaurantSettingsDto,
    @Req() req: Request,
  ) {
    await this.restaurantService.getRestaurantWithPermissionCheck(
      restaurantId,
      (req.user as any).userId,
    );

    return this.restaurantService.updateRestaurantSettings(restaurantId, dto);
  }

  /**
   * Rotate QR codes for all cards
   * POST /api/owner/restaurants/:restaurantId/rotate-qr-codes
   */
  @Post(':restaurantId/rotate-qr-codes')
  @HttpCode(200)
  async rotateQRCodes(
    @Param('restaurantId') restaurantId: string,
    @Req() req: Request,
  ) {
    await this.restaurantService.getRestaurantWithPermissionCheck(
      restaurantId,
      (req.user as any).userId,
    );

    return this.restaurantService.rotateRestaurantQRCodes(restaurantId);
  }
}
