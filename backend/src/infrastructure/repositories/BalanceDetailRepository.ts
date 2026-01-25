import { injectable } from 'inversify';
import { IBalanceDetailRepository } from '../../domain/repositories';
import { BalanceDetailEntity } from '../../domain/entities';

@injectable()
export class BalanceDetailRepository implements IBalanceDetailRepository {
  private details: Map<string, any> = new Map();

  async createEntry(data: any): Promise<void> {
    const id = `bd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.details.set(id, {
      id,
      guestRestaurantId: data.guestRestaurantId,
      transactionId: data.transactionId,
      type: data.type,
      basePoints: data.basePoints,
      bonusPoints: data.bonusPoints,
      oldBalance: data.oldBalance,
      newBalance: data.newBalance,
      createdAt: data.createdAt || new Date(),
    });
  }

  async getByGuest(
    guestRestaurantId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<BalanceDetailEntity[]> {
    const results: BalanceDetailEntity[] = [];
    let count = 0;
    let skipped = 0;

    for (const [, data] of this.details) {
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

  async getByTransaction(
    transactionId: string,
  ): Promise<BalanceDetailEntity | null> {
    for (const [, data] of this.details) {
      if (data.transactionId === transactionId) {
        return this.mapToEntity(data);
      }
    }
    return null;
  }

  async getTotalPointsAwarded(
    guestRestaurantId: string,
  ): Promise<number> {
    let total = 0;

    for (const [, data] of this.details) {
      if (data.guestRestaurantId === guestRestaurantId) {
        total += (data.basePoints || 0) + (data.bonusPoints || 0);
      }
    }

    return total;
  }

  private mapToEntity(data: any): BalanceDetailEntity {
    return BalanceDetailEntity.create(data);
  }
}
