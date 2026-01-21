import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateTransactionDto } from './transaction.dto';
import { Request } from 'express';

/**
 * Transaction API - Used by staff to:
 * 1. Scan QR code and create transaction
 * 2. Award points
 * 3. Track revenue and engagement
 */
@Controller('api/transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}

  /**
   * Create transaction from scanned QR code
   * POST /api/transactions
   *
   * Staff scans QR code at restaurant
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async createTransaction(
    @Body() dto: CreateTransactionDto,
    @Req() req: Request,
  ) {
    const staffId = (req.user as any).userId;
    return this.transactionService.createTransaction(dto, staffId);
  }

  /**
   * Get staff transactions for today/period
   * GET /api/transactions/staff/:staffId
   */
  @UseGuards(JwtAuthGuard)
  @Get('staff/:staffId')
  async getStaffTransactions(
    @Param('staffId') staffId: string,
    @Req() req: Request,
  ) {
    // Verify it's their own data or they're admin
    if ((req.user as any).userId !== staffId && (req.user as any).role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    return this.transactionService.getStaffTransactions(staffId, 100);
  }

  /**
   * Get transaction details
   * GET /api/transactions/:transactionId
   */
  @UseGuards(JwtAuthGuard)
  @Get(':transactionId')
  async getTransaction(
    @Param('transactionId') transactionId: string,
    @Req() req: Request,
  ) {
    return this.transactionService.getTransaction(transactionId);
  }
}
