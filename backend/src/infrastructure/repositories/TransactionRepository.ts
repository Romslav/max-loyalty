import { injectable } from 'inversify';
import { ITransactionRepository } from '../../domain/repositories';
import { TransactionEntity } from '../../domain/entities';

@injectable()
export class TransactionRepository implements ITransactionRepository {
  private transactions: Map<string, TransactionEntity> = new Map();

  async create(transaction: TransactionEntity): Promise<void> {
    this.transactions.set(transaction.id, transaction);
  }

  async getById(id: string): Promise<TransactionEntity | null> {
    return this.transactions.get(id) || null;
  }

  async getByGuest(guestRestaurantId: string, limit: number = 50, offset: number = 0): Promise<TransactionEntity[]> {
    const results: TransactionEntity[] = [];
    let count = 0;
    let skipped = 0;

    for (const [, txn] of this.transactions) {
      if (txn.guestRestaurantId !== guestRestaurantId) continue;

      if (skipped < offset) {
        skipped++;
        continue;
      }

      results.push(txn);
      count++;

      if (count >= limit) break;
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getByRestaurant(restaurantId: string, limit: number = 100, offset: number = 0): Promise<TransactionEntity[]> {
    const results: TransactionEntity[] = [];
    let count = 0;
    let skipped = 0;

    for (const [, txn] of this.transactions) {
      if (txn.restaurantId !== restaurantId) continue;

      if (skipped < offset) {
        skipped++;
        continue;
      }

      results.push(txn);
      count++;

      if (count >= limit) break;
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTotalSpent(guestRestaurantId: string): Promise<number> {
    let total = 0;

    for (const [, txn] of this.transactions) {
      if (txn.guestRestaurantId === guestRestaurantId && txn.type === 'SALE') {
        total += txn.amount;
      }
    }

    return total;
  }

  async getTransactionCount(guestRestaurantId: string): Promise<number> {
    let count = 0;

    for (const [, txn] of this.transactions) {
      if (txn.guestRestaurantId === guestRestaurantId) {
        count++;
      }
    }

    return count;
  }
}
