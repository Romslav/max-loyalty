import { injectable } from 'inversify';
import { IBalanceDetailRepository } from '../../domain/repositories';
import { db } from '../database';

interface BalanceDetailEntry {
  guestRestaurantId: string;
  transactionId: string;
  type: 'POINTS_AWARDED' | 'POINTS_SPENT' | 'POINTS_REVERTED';
  basePoints?: number;
  bonusPoints?: number;
  oldBalance: number;
  newBalance: number;
  createdAt: Date;
}

@injectable()
export class BalanceDetailRepository implements IBalanceDetailRepository {
  async createEntry(entry: BalanceDetailEntry): Promise<void> {
    const query = `
      INSERT INTO balance_detail (guest_restaurant_id, transaction_id, type, base_points, bonus_points, old_balance, new_balance, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.run(query, [
      entry.guestRestaurantId,
      entry.transactionId,
      entry.type,
      entry.basePoints || 0,
      entry.bonusPoints || 0,
      entry.oldBalance,
      entry.newBalance,
      entry.createdAt,
    ]);
  }

  async getHistory(guestRestaurantId: string, limit: number = 100, offset: number = 0): Promise<any[]> {
    const query = `
      SELECT * FROM balance_detail
      WHERE guest_restaurant_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    return await db.all(query, [guestRestaurantId, limit, offset]);
  }

  async getTotalPointsAwarded(guestRestaurantId: string): Promise<number> {
    const query = `
      SELECT COALESCE(SUM(base_points + bonus_points), 0) as total
      FROM balance_detail
      WHERE guest_restaurant_id = ? AND type = 'POINTS_AWARDED'
    `;

    const result: any = await db.get(query, [guestRestaurantId]);
    return result.total || 0;
  }
}
