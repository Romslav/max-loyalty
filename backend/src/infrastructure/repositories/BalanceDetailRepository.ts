import { injectable } from 'inversify';
import { IBalanceDetailRepository } from '../../domain/repositories';
import { BalanceDetailEntity } from '../../domain/entities';

@injectable()
export class BalanceDetailRepository implements IBalanceDetailRepository {
  private details: Map<string, BalanceDetailEntity> = new Map();

  async createEntry(data: any): Promise<void> {
    const entry = BalanceDetailEntity.create({
      id: `bd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
    });

    this.details.set(entry.id, entry);
  }

  async getByGuest(guestRestaurantId: string, limit: number = 100, offset: number = 0): Promise<BalanceDetailEntity[]> {
    const results: BalanceDetailEntity[] = [];
    let count = 0;
    let skipped = 0;

    for (const [, detail] of this.details) {
      if (detail.guestRestaurantId !== guestRestaurantId) continue;

      if (skipped < offset) {
        skipped++;
        continue;
      }

      results.push(detail);
      count++;

      if (count >= limit) break;
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getByTransaction(transactionId: string): Promise<BalanceDetailEntity | null> {
    for (const [, detail] of this.details) {
      if (detail.transactionId === transactionId) {
        return detail;
      }
    }
    return null;
  }

  async getTotalPointsAwarded(guestRestaurantId: string): Promise<number> {
    let total = 0;

    for (const [, detail] of this.details) {
      if (detail.guestRestaurantId === guestRestaurantId) {
        total += detail.basePoints + detail.bonusPoints;
      }
    }

    return total;
  }
}
