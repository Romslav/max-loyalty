import { injectable } from 'inversify';
import { ITransactionRepository } from '../../domain/repositories';
import { TransactionEntity } from '../../domain/entities';
import { db } from '../database';

@injectable()
export class TransactionRepository implements ITransactionRepository {
  async create(transaction: TransactionEntity): Promise<void> {
    const query = `
      INSERT INTO transactions (id, guest_restaurant_id, restaurant_id, type, amount, base_points_awarded, bonus_points_awarded, old_balance, new_balance, status, pos_id, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.run(query, [
      transaction.id,
      transaction.guestRestaurantId,
      transaction.restaurantId,
      transaction.type,
      transaction.amount,
      transaction.basePointsAwarded,
      transaction.bonusPointsAwarded,
      transaction.oldBalance,
      transaction.newBalance,
      transaction.status,
      transaction.posId || null,
      transaction.notes || null,
      transaction.createdAt,
    ]);
  }

  async getById(id: string): Promise<TransactionEntity | null> {
    const query = `SELECT * FROM transactions WHERE id = ? LIMIT 1`;
    const row: any = await db.get(query, [id]);
    return row ? TransactionEntity.fromDatabase(row) : null;
  }

  async getByGuest(guestRestaurantId: string, limit: number = 50, offset: number = 0): Promise<TransactionEntity[]> {
    const query = `
      SELECT * FROM transactions
      WHERE guest_restaurant_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const rows: any[] = await db.all(query, [guestRestaurantId, limit, offset]);
    return rows.map((row) => TransactionEntity.fromDatabase(row));
  }

  async getByRestaurant(restaurantId: string, limit: number = 100, offset: number = 0): Promise<TransactionEntity[]> {
    const query = `
      SELECT * FROM transactions
      WHERE restaurant_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const rows: any[] = await db.all(query, [restaurantId, limit, offset]);
    return rows.map((row) => TransactionEntity.fromDatabase(row));
  }

  async getTotalSpent(guestRestaurantId: string): Promise<number> {
    const query = `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE guest_restaurant_id = ? AND type = 'SALE'`;
    const result: any = await db.get(query, [guestRestaurantId]);
    return result.total || 0;
  }

  async getTransactionCount(guestRestaurantId: string): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM transactions WHERE guest_restaurant_id = ?`;
    const result: any = await db.get(query, [guestRestaurantId]);
    return result.count || 0;
  }
}
