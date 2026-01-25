import { injectable } from 'inversify';
import { ITransactionRepository } from '../../domain/repositories';
import { TransactionEntity } from '../../domain/entities';

@injectable()
export class TransactionRepository implements ITransactionRepository {
  private transactions: Map<string, any> = new Map();

  async create(transaction: TransactionEntity): Promise<void> {
    this.transactions.set(transaction.id, {
      id: transaction.id,
      guestRestaurantId: transaction.guestRestaurantId,
      restaurantId: transaction.restaurantId,
      type: transaction.type,
      amount: transaction.amount,
      basePointsAwarded: transaction.basePointsAwarded,
      bonusPointsAwarded: transaction.bonusPointsAwarded,
      oldBalance: transaction.oldBalance,
      newBalance: transaction.newBalance,
      status: transaction.status,
      posId: transaction.posId,
      notes: transaction.notes,
      createdAt: transaction.createdAt,
    });
  }

  async getById(id: string): Promise<TransactionEntity | null> {
    const data = this.transactions.get(id);
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async getByGuest(
    guestRestaurantId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<TransactionEntity[]> {
    const results: TransactionEntity[] = [];
    let count = 0;
    let skipped = 0;

    for (const [, data] of this.transactions) {
      if (data.guestRestaurantId !== guestRestaurantId) continue;

      if (skipped < offset) {
        skipped++;
        continue;
      }

      results.push(this.mapToEntity(data));
      count++;

      if (count >= limit) break;
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getByRestaurant(
    restaurantId: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<TransactionEntity[]> {
    const results: TransactionEntity[] = [];
    let count = 0;
    let skipped = 0;

    for (const [, data] of this.transactions) {
      if (data.restaurantId !== restaurantId) continue;

      if (skipped < offset) {
        skipped++;
        continue;
      }

      results.push(this.mapToEntity(data));
      count++;

      if (count >= limit) break;
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTotalSpent(guestRestaurantId: string): Promise<number> {
    let total = 0;

    for (const [, data] of this.transactions) {
      if (data.guestRestaurantId === guestRestaurantId && data.type === 'SALE') {
        total += data.amount;
      }
    }

    return total;
  }

  async getTransactionCount(
    guestRestaurantId: string,
  ): Promise<number> {
    let count = 0;

    for (const [, data] of this.transactions) {
      if (data.guestRestaurantId === guestRestaurantId) {
        count++;
      }
    }

    return count;
  }

  private mapToEntity(data: any): TransactionEntity {
    return TransactionEntity.create(data);
  }
}
