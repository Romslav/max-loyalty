import { injectable } from 'inversify';
import { ITierEventRepository } from '../../domain/repositories';
import { db } from '../database';

interface TierEvent {
  id?: string;
  guestRestaurantId: string;
  oldTierId: string;
  newTierId: string;
  reason: string;
  triggeredByTransactionId?: string;
  createdAt: Date;
}

@injectable()
export class TierEventRepository implements ITierEventRepository {
  async create(event: TierEvent): Promise<void> {
    const id = event.id || `te-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const query = `
      INSERT INTO tier_events (id, guest_restaurant_id, old_tier_id, new_tier_id, reason, triggered_by_transaction_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.run(query, [
      id,
      event.guestRestaurantId,
      event.oldTierId,
      event.newTierId,
      event.reason,
      event.triggeredByTransactionId || null,
      event.createdAt,
    ]);
  }

  async getByGuest(guestRestaurantId: string, limit: number = 50, offset: number = 0): Promise<TierEvent[]> {
    const query = `
      SELECT * FROM tier_events
      WHERE guest_restaurant_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    return await db.all(query, [guestRestaurantId, limit, offset]);
  }

  async getLatest(guestRestaurantId: string): Promise<TierEvent | null> {
    const query = `
      SELECT * FROM tier_events
      WHERE guest_restaurant_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const row: any = await db.get(query, [guestRestaurantId]);
    return row || null;
  }
}
