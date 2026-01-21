import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateGuestCardDto, ValidateCardCodeDto } from './card.dto';
import { Request } from 'express';

@Controller('api/cards')
export class CardController {
  private readonly logger = new Logger(CardController.name);

  constructor(private readonly cardService: CardService) {}

  /**
   * Get all cards for current user
   * GET /api/cards
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserCards(@Req() req: Request) {
    return this.cardService.getUserCards((req.user as any).userId);
  }

  /**
   * Get specific card details
   * GET /api/cards/:cardId
   */
  @UseGuards(JwtAuthGuard)
  @Get(':cardId')
  async getCard(@Param('cardId') cardId: string, @Req() req: Request) {
    const card = await this.cardService.getCard(cardId);
    if (card.userId !== (req.user as any).userId) {
      throw new BadRequestException('Unauthorized');
    }
    return card;
  }

  /**
   * Create new guest card
   * POST /api/cards
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async createCard(@Body() dto: CreateGuestCardDto, @Req() req: Request) {
    return this.cardService.createCard(dto, (req.user as any).userId);
  }

  /**
   * Get card by code (for scanning)
   * POST /api/cards/validate
   */
  @Post('validate')
  @HttpCode(200)
  async validateCode(@Body() dto: ValidateCardCodeDto) {
    return this.cardService.validateCardCode(dto.code, dto.restaurantId);
  }

  /**
   * Get active QR code for card
   * GET /api/cards/:cardId/qr-code
   */
  @UseGuards(JwtAuthGuard)
  @Get(':cardId/qr-code')
  async getQRCode(@Param('cardId') cardId: string, @Req() req: Request) {
    const card = await this.cardService.getCard(cardId);
    if (card.userId !== (req.user as any).userId) {
      throw new BadRequestException('Unauthorized');
    }
    return this.cardService.getCardQRCode(cardId);
  }

  /**
   * Get card transaction history
   * GET /api/cards/:cardId/transactions
   */
  @UseGuards(JwtAuthGuard)
  @Get(':cardId/transactions')
  async getCardTransactions(
    @Param('cardId') cardId: string,
    @Req() req: Request,
  ) {
    const card = await this.cardService.getCard(cardId);
    if (card.userId !== (req.user as any).userId) {
      throw new BadRequestException('Unauthorized');
    }
    return this.cardService.getCardTransactions(cardId, 50);
  }

  /**
   * Get card points history
   * GET /api/cards/:cardId/points
   */
  @UseGuards(JwtAuthGuard)
  @Get(':cardId/points')
  async getCardPoints(
    @Param('cardId') cardId: string,
    @Req() req: Request,
  ) {
    const card = await this.cardService.getCard(cardId);
    if (card.userId !== (req.user as any).userId) {
      throw new BadRequestException('Unauthorized');
    }
    return this.cardService.getCardPointsHistory(cardId, 50);
  }

  /**
   * Suspend card
   * PUT /api/cards/:cardId/suspend
   */
  @UseGuards(JwtAuthGuard)
  @Put(':cardId/suspend')
  async suspendCard(@Param('cardId') cardId: string, @Req() req: Request) {
    const card = await this.cardService.getCard(cardId);
    if (card.userId !== (req.user as any).userId) {
      throw new BadRequestException('Unauthorized');
    }
    return this.cardService.updateCardStatus(cardId, 'SUSPENDED');
  }

  /**
   * Reactivate card
   * PUT /api/cards/:cardId/reactivate
   */
  @UseGuards(JwtAuthGuard)
  @Put(':cardId/reactivate')
  async reactivateCard(@Param('cardId') cardId: string, @Req() req: Request) {
    const card = await this.cardService.getCard(cardId);
    if (card.userId !== (req.user as any).userId) {
      throw new BadRequestException('Unauthorized');
    }
    return this.cardService.updateCardStatus(cardId, 'ACTIVE');
  }
}
