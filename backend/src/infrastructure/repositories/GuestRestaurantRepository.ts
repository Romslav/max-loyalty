import { injectable } from 'inversify';
import { IGuestRestaurantRepository } from '../../domain/repositories';
import { GuestRestaurantEntity } from '../../domain/entities';
import { db } from '../database';

@injectable()
export class GuestRestaurantRepository implements IGuestRestaurantRepository {
  async create(guestRestaurant: GuestRestaurantEntity): Promise<void> {
    const query = `
      INSERT INTO guest_restaurant (id, guest_id, restaurant_id, balance_points, current_tier_id, visits_count, last_visit_at, active_card_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.run(query, [
      guestRestaurant.id,
      guestRestaurant.guestId,
      guestRestaurant.restaurantId,
      guestRestaurant.balancePoints,
      guestRestaurant.currentTierId,
      guestRestaurant.visitsCount,
      guestRestaurant.lastVisitAt,
      guestRestaurant.activeCardId,
      guestRestaurant.createdAt,
      guestRestaurant.updatedAt,
    ]);
  }

  async getById(id: string): Promise<GuestRestaurantEntity | null> {
    const query = `SELECT * FROM guest_restaurant WHERE id = ? LIMIT 1`;
    const row: any = await db.get(query, [id]);
    return row ? GuestRestaurantEntity.fromDatabase(row) : null;
  }

  async getByGuestAndRestaurant(guestId: string, restaurantId: string): Promise<GuestRestaurantEntity | null> {
    const query = `SELECT * FROM guest_restaurant WHERE guest_id = ? AND restaurant_id = ? LIMIT 1`;
    const row: any = await db.get(query, [guestId, restaurantId]);
    return row ? GuestRestaurantEntity.fromDatabase(row) : null;
  }

  async updateBalance(id: string, newBalance: number): Promise<void> {
    const query = `UPDATE guest_restaurant SET balance_points = ?, updated_at = ? WHERE id = ?`;
    await db.run(query, [newBalance, new Date(), id]);
  }

  async updateLastVisit(id: string): Promise<void> {
    const query = `UPDATE guest_restaurant SET last_visit_at = ?, updated_at = ?, visits_count = visits_count + 1 WHERE id = ?`;
    await db.run(query, [new Date(), new Date(), id]);
  }

  async upgradeTier(id: string, newTierId: string): Promise<void> {
    const query = `UPDATE guest_restaurant SET current_tier_id = ?, updated_at = ? WHERE id = ?`;
    await db.run(query, [newTierId, new Date(), id]);
  }

  async setActiveCard(id: string, cardId: string): Promise<void> {
    const query = `UPDATE guest_restaurant SET active_card_id = ?, updated_at = ? WHERE id = ?`;
    await db.run(query, [cardId, new Date(), id]);
  }
}
