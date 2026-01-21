import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CardCodeService } from '../card-code/card-code.service';
import { CreateTransactionDto } from './transaction.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cardCodeService: CardCodeService,
  ) {}

  /**
   * Create transaction from scanned QR code
   *
   * Flow:
   * 1. Validate QR code
   * 2. Get guest card
   * 3. Calculate points based on tier
   * 4. Create transaction
   * 5. Update card points
   * 6. Log point change
   * 7. Send notification
   */
  async createTransaction(dto: CreateTransactionDto, staffId: string) {
    const prismaTransaction = await this.prisma.$transaction(async (tx) => {
      try {
        // Step 1: Validate QR code
        const validationResult = await this.cardCodeService.validateCode(
          dto.scannedCode,
          dto.restaurantId,
        );

        if (!validationResult.valid) {
          throw new BadRequestException(validationResult.error || 'Invalid QR code');
        }

        const cardId = validationResult.cardId;
        const card = validationResult.card;

        // Step 2: Get guest card with tier info
        const guestCard = await tx.guestCard.findUnique({
          where: { id: cardId },
          include: {
            restaurant: true,
            tier: true,
          },
        });

        if (!guestCard) {
          throw new NotFoundException('Card not found');
        }

        if (guestCard.status === 'SUSPENDED' || guestCard.status === 'BLOCKED') {
          throw new BadRequestException(`Card is ${guestCard.status}`);
        }

        // Step 3: Calculate points
        const basePoints = Math.floor(
          dto.amount * (guestCard.restaurant.pointsPerPurchase / 100),
        );
        const tierMultiplier = guestCard.tier?.pointMultiplier || 1;
        const pointsEarned = Math.round(basePoints * tierMultiplier);

        // Step 4: Create transaction
        const transaction = await tx.transaction.create({
          data: {
            restaurantId: dto.restaurantId,
            cardId,
            staffId,
            type: (dto.type as any) || 'PURCHASE',
            status: 'COMPLETED',
            amount: dto.amount,
            currency: 'USD',
            description: dto.description,
            referenceId: dto.referenceId,
            metadata: dto.metadata,
            pointsEarned,
            codeName: dto.scannedCode,
          },
        });

        // Step 5: Update card points
        const newPointBalance = guestCard.currentPoints + pointsEarned;
        await tx.guestCard.update({
          where: { id: cardId },
          data: {
            currentPoints: newPointBalance,
            totalPointsEarned: guestCard.totalPointsEarned + pointsEarned,
            lastUsedAt: new Date(),
          },
        });

        // Step 6: Create point log
        await tx.pointLog.create({
          data: {
            restaurantId: dto.restaurantId,
            cardId,
            transactionId: transaction.id,
            pointsChange: pointsEarned,
            balanceBefore: guestCard.currentPoints,
            balanceAfter: newPointBalance,
            reason: 'PURCHASE',
            description: `Purchase of $${dto.amount}`,
          },
        });

        this.logger.log(
          `Transaction created: ${transaction.id}, Points: ${pointsEarned}, Card: ${cardId}`,
        );

        return {
          transaction: {
            id: transaction.id,
            amount: transaction.amount,
            pointsEarned,
            newBalance: newPointBalance,
          },
          card: {
            id: cardId,
            currentPoints: newPointBalance,
            tier: guestCard.tier?.name,
          },
        };
      } catch (error) {
        this.logger.error(`Transaction creation failed: ${error}`);
        throw error;
      }
    });

    return prismaTransaction;
  }

  /**
   * Get staff transactions
   */
  async getStaffTransactions(staffId: string, limit: number = 100) {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: { staffId },
        include: {
          card: {
            select: {
              id: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          restaurant: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { transactionDate: 'desc' },
        take: limit,
      });

      // Calculate stats
      const stats = {
        totalCount: transactions.length,
        totalRevenue: transactions.reduce((sum, t) => sum + Number(t.amount), 0),
        totalPointsIssued: transactions.reduce((sum, t) => sum + t.pointsEarned, 0),
      };

      return {
        transactions,
        stats,
      };
    } catch (error) {
      this.logger.error(`Failed to get staff transactions: ${error}`);
      throw error;
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId: string) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          card: {
            include: {
              restaurant: true,
              user: true,
            },
          },
          pointLogs: true,
        },
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      return transaction;
    } catch (error) {
      this.logger.error(`Failed to get transaction: ${error}`);
      throw error;
    }
  }

  /**
   * Get restaurant transactions for analytics
   */
  async getRestaurantTransactions(
    restaurantId: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 500,
  ) {
    try {
      const where: any = { restaurantId };

      if (startDate || endDate) {
        where.transactionDate = {};
        if (startDate) where.transactionDate.gte = startDate;
        if (endDate) where.transactionDate.lte = endDate;
      }

      const transactions = await this.prisma.transaction.findMany({
        where,
        include: {
          card: {
            select: {
              currentPoints: true,
              tier: { select: { name: true } },
            },
          },
        },
        orderBy: { transactionDate: 'desc' },
        take: limit,
      });

      // Calculate analytics
      const analytics = {
        totalCount: transactions.length,
        totalRevenue: transactions.reduce((sum, t) => sum + Number(t.amount), 0),
        totalPointsIssued: transactions.reduce((sum, t) => sum + t.pointsEarned, 0),
        averageOrderValue: transactions.length > 0
          ? transactions.reduce((sum, t) => sum + Number(t.amount), 0) /
            transactions.length
          : 0,
        dateRange: {
          from: startDate,
          to: endDate,
        },
      };

      return {
        transactions,
        analytics,
      };
    } catch (error) {
      this.logger.error(`Failed to get restaurant transactions: ${error}`);
      throw error;
    }
  }

  /**
   * Process refund
   */
  async processRefund(transactionId: string, reason: string) {
    try {
      const originalTransaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId },
        include: { card: true },
      });

      if (!originalTransaction) {
        throw new NotFoundException('Transaction not found');
      }

      const refundAmount = -originalTransaction.pointsEarned;

      const refundTx = await this.prisma.$transaction(async (tx) => {
        // Create refund transaction
        const refund = await tx.transaction.create({
          data: {
            restaurantId: originalTransaction.restaurantId,
            cardId: originalTransaction.cardId,
            staffId: originalTransaction.staffId,
            type: 'REFUND',
            status: 'COMPLETED',
            amount: -originalTransaction.amount,
            pointsRedeemed: Math.abs(refundAmount),
            description: `Refund for ${transactionId}: ${reason}`,
          },
        });

        // Update card
        const card = await tx.guestCard.update({
          where: { id: originalTransaction.cardId },
          data: {
            currentPoints: {
              decrement: Math.abs(refundAmount),
            },
          },
        });

        // Log refund
        await tx.pointLog.create({
          data: {
            restaurantId: originalTransaction.restaurantId,
            cardId: originalTransaction.cardId,
            transactionId: refund.id,
            pointsChange: refundAmount,
            balanceBefore: originalTransaction.pointsEarned + card.currentPoints,
            balanceAfter: card.currentPoints,
            reason: 'PURCHASE_REFUND',
            description: `Refund: ${reason}`,
          },
        });

        return refund;
      });

      this.logger.log(`Refund processed: ${refundTx.id}`);
      return refundTx;
    } catch (error) {
      this.logger.error(`Failed to process refund: ${error}`);
      throw error;
    }
  }
}
