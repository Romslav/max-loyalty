import { injectable, inject } from 'inversify';
import { ITransactionService } from '../../domain/services';
import { ITransactionRepository, IGuestRestaurantRepository, ITierEventRepository, IBalanceDetailRepository } from '../../domain/repositories';
import { ICardService } from '../../domain/services/CardService';
import { TYPES } from '../../shared/types';
import { TransactionEntity, PointsCalculator } from '../../domain/entities';
import { ErrorCode } from '../../shared/types';

@injectable()
export class TransactionServiceImpl implements ITransactionService {
  constructor(
    @inject(TYPES.Repositories.ITransactionRepository)
    private transactionRepository: ITransactionRepository,

    @inject(TYPES.Repositories.IGuestRestaurantRepository)
    private guestRestaurantRepository: IGuestRestaurantRepository,

    @inject(TYPES.Repositories.ITierEventRepository)
    private tierEventRepository: ITierEventRepository,

    @inject(TYPES.Repositories.IBalanceDetailRepository)
    private balanceDetailRepository: IBalanceDetailRepository,

    @inject(TYPES.Services.ICardService)
    private cardService: ICardService,
  ) {}

  async processSaleTransaction(input: any): Promise<any> {
    console.log('Processing Sale Transaction...');
    this.validateInput(input);

    const guestRestaurant = await this.guestRestaurantRepository.getById(input.guestRestaurantId);

    if (!guestRestaurant) {
      throw {
        code: ErrorCode.GUEST_NOT_FOUND,
        message: `Guest ${input.guestRestaurantId} not found`,
      };
    }

    if (guestRestaurant.isBlocked) {
      throw {
        code: ErrorCode.GUEST_BLOCKED,
        message: `Guest is blocked: ${guestRestaurant.blockReason || 'no reason'}`,
      };
    }

    const tierDiscount = guestRestaurant.currentTier?.discountPercent || 5;
    const pointsCalculation = PointsCalculator.calculatePointsAwarded(
      input.amountRubles,
      tierDiscount,
    );

    console.log(`Points Calculation:`);
    console.log(`  Base: ${pointsCalculation.basePoints}`);
    console.log(`  Bonus: ${pointsCalculation.bonusPoints}`);
    console.log(`  Total: ${pointsCalculation.totalPoints}`);

    const transaction = TransactionEntity.create({
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      guestRestaurantId: input.guestRestaurantId,
      restaurantId: input.restaurantId,
      type: 'SALE',
      amount: input.amountRubles,
      basePointsAwarded: pointsCalculation.basePoints,
      bonusPointsAwarded: pointsCalculation.bonusPoints,
      oldBalance: guestRestaurant.balancePoints,
      newBalance: guestRestaurant.balancePoints + pointsCalculation.totalPoints,
      status: 'COMPLETED',
      posId: input.posId,
      notes: input.notes,
      createdAt: new Date(),
    });

    await this.transactionRepository.create(transaction);
    console.log(`Transaction created: ${transaction.id}`);

    const newBalance = guestRestaurant.balancePoints + pointsCalculation.totalPoints;
    await this.guestRestaurantRepository.updateBalance(input.guestRestaurantId, newBalance);

    await this.balanceDetailRepository.createEntry({
      guestRestaurantId: input.guestRestaurantId,
      transactionId: transaction.id,
      type: 'POINTS_AWARDED',
      basePoints: pointsCalculation.basePoints,
      bonusPoints: pointsCalculation.bonusPoints,
      oldBalance: guestRestaurant.balancePoints,
      newBalance,
      createdAt: new Date(),
    });

    let tierUpgraded = false;
    let newTierName: string | undefined;

    if (guestRestaurant.currentTier?.maxPoints && newBalance > guestRestaurant.currentTier.maxPoints) {
      console.log(`Tier upgrade possible: ${newBalance} > ${guestRestaurant.currentTier.maxPoints}`);
      tierUpgraded = true;
      // TODO: implement tier upgrade logic
    }

    if (guestRestaurant.activeCardId) {
      await this.cardService.invalidateCard(guestRestaurant.activeCardId, transaction.id);
    }

    const newQRToken = this.cardService.generateQRToken(
      input.guestRestaurantId,
      input.restaurantId,
    );
    const newSixDigitCode = this.cardService.generate6DigitCode();

    await this.guestRestaurantRepository.updateLastVisit(input.guestRestaurantId);

    console.log(`Transaction completed successfully!`);

    return {
      transactionId: transaction.id,
      basePointsAwarded: pointsCalculation.basePoints,
      bonusPointsAwarded: pointsCalculation.bonusPoints,
      totalPointsAwarded: pointsCalculation.totalPoints,
      oldBalance: guestRestaurant.balancePoints,
      newBalance,
      tierUpgraded,
      newTierName,
      newQRToken,
      newSixDigitCode,
    };
  }

  async getTransactionHistory(guestRestaurantId: string, limit: number = 50, offset: number = 0): Promise<any[]> {
    const transactions = await this.transactionRepository.getByGuest(guestRestaurantId, limit, offset);

    return transactions.map((txn) => ({
      transactionId: txn.id,
      type: txn.type,
      amount: txn.amount,
      pointsAwarded: txn.basePointsAwarded + txn.bonusPointsAwarded,
      newBalance: txn.newBalance,
      status: txn.status,
      createdAt: txn.createdAt,
    }));
  }

  async getCurrentBalance(guestRestaurantId: string): Promise<number> {
    const guestRestaurant = await this.guestRestaurantRepository.getById(guestRestaurantId);

    if (!guestRestaurant) {
      throw {
        code: ErrorCode.GUEST_NOT_FOUND,
        message: `Guest ${guestRestaurantId} not found`,
      };
    }

    return guestRestaurant.balancePoints;
  }

  async getTotalSpent(guestRestaurantId: string): Promise<number> {
    return this.transactionRepository.getTotalSpent(guestRestaurantId);
  }

  async getVisitCount(guestRestaurantId: string): Promise<number> {
    const guestRestaurant = await this.guestRestaurantRepository.getById(guestRestaurantId);

    if (!guestRestaurant) {
      throw {
        code: ErrorCode.GUEST_NOT_FOUND,
        message: `Guest ${guestRestaurantId} not found`,
      };
    }

    return guestRestaurant.visitsCount;
  }

  private validateInput(input: any): void {
    if (!input.guestRestaurantId) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'guestRestaurantId is required',
      };
    }

    if (!input.restaurantId) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'restaurantId is required',
      };
    }

    if (!input.amountRubles || input.amountRubles <= 0) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'amountRubles must be greater than 0',
      };
    }

    if (input.amountRubles > 1000000) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'amountRubles exceeds maximum limit (1,000,000)',
      };
    }
  }
}
