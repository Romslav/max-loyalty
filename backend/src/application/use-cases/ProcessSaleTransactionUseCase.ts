// Application Layer - Process Sale Transaction Use Case
// Core business logic: Sale → Points Award → Tier Update → Card Regen → Notification

import { ITransactionService } from '../../domain/services/TransactionService';
import { ICardService } from '../../domain/services/CardService';
import { IGuestRestaurantRepository } from '../../domain/repositories';
import { TransactionEntity, PointsCalculator } from '../../domain/entities';

export class ProcessSaleTransactionUseCase {
  constructor(
    private readonly transactionService: ITransactionService,
    private readonly cardService: ICardService,
    private readonly guestRestaurantRepo: IGuestRestaurantRepository,
  ) {}

  async execute(input: ProcessSaleInput): Promise<ProcessSaleOutput> {
    // Step 1: Get guest restaurant data
    const guestRestaurant = await this.guestRestaurantRepo.findById(
      input.guestRestaurantId,
    );
    if (!guestRestaurant) {
      throw new Error('Guest-Restaurant relationship not found');
    }

    if (guestRestaurant.isBlocked) {
      throw new Error('Guest is blocked in this restaurant');
    }

    // Step 2: Calculate points
    const oldBalance = guestRestaurant.balancePoints;
    const { basePoints, bonusPoints, totalPoints } = PointsCalculator.calculatePointsAwarded(
      input.amountRubles,
      this.getTierDiscountPercent(guestRestaurant.tier),
    );

    const newBalance = oldBalance + totalPoints;

    // Step 3: Create transaction (atomically)
    const transaction = await this.transactionService.createSaleTransaction({
      guestRestaurantId: input.guestRestaurantId,
      restaurantId: input.restaurantId,
      guestId: input.guestId,
      posId: input.posId,
      amountRubles: input.amountRubles,
      chequeNumber: input.chequeNumber,
      cashierId: input.cashierId,
    });

    // Step 4: Update balance
    await this.guestRestaurantRepo.updateBalance(input.guestRestaurantId, newBalance);

    // Step 5: Check tier upgrade
    const tierUpdate = await this.transactionService.updateGuestTier(
      input.guestRestaurantId,
    );

    // Step 6: Regenerate card (HMAC-SHA256 + 6-digit code)
    const newCard = await this.cardService.regenerateCardIdentifiers(
      transaction.id,
      input.guestRestaurantId,
    );

    // Step 7: Update last visit
    await this.guestRestaurantRepo.updateLastVisit(input.guestRestaurantId);
    await this.guestRestaurantRepo.incrementVisits(input.guestRestaurantId);

    return {
      transactionId: transaction.id,
      basePointsAwarded: basePoints,
      bonusPointsAwarded: bonusPoints,
      totalPointsAwarded: totalPoints,
      oldBalance,
      newBalance,
      oldTier: guestRestaurant.tier,
      newTier: tierUpdate.newTier,
      tierUpgraded: tierUpdate.tierChanged,
      discountPercent: tierUpdate.discountPercent,
      newQRToken: newCard.qrToken,
      newSixDigitCode: newCard.sixDigitCode,
      timestamp: new Date(),
    };
  }

  private getTierDiscountPercent(tier: string): number {
    const tierDiscounts: Record<string, number> = {
      BRONZE: 5,
      SILVER: 10,
      GOLD: 15,
      PLATINUM: 20,
      VIP: 25,
    };
    return tierDiscounts[tier] || 0;
  }
}

export interface ProcessSaleInput {
  guestRestaurantId: string;
  restaurantId: string;
  guestId: string;
  posId: string;
  amountRubles: number;
  chequeNumber?: string;
  cashierId?: string;
}

export interface ProcessSaleOutput {
  transactionId: string;
  basePointsAwarded: number;
  bonusPointsAwarded: number;
  totalPointsAwarded: number;
  oldBalance: number;
  newBalance: number;
  oldTier: string;
  newTier: string;
  tierUpgraded: boolean;
  discountPercent: number;
  newQRToken: string;
  newSixDigitCode: string;
  timestamp: Date;
}
