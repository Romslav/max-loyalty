import { injectable } from 'inversify';
import { ITierDefinitionRepository } from '../../domain/repositories';
import { TierEntity } from '../../domain/entities';
import { db } from '../database';

@injectable()
export class TierDefinitionRepository implements ITierDefinitionRepository {
  async create(tier: TierEntity): Promise<void> {
    const query = `
      INSERT INTO tier_definitions (id, restaurant_id, name, discount_percent, min_points, max_points, benefits, position, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.run(query, [
      tier.id,
      tier.restaurantId,
      tier.name,
      tier.discountPercent,
      tier.minPoints,
      tier.maxPoints,
      JSON.stringify(tier.benefits || []),
      tier.position,
      tier.isActive ? 1 : 0,
      tier.createdAt,
      tier.updatedAt,
    ]);
  }

  async getById(id: string): Promise<TierEntity | null> {
    const query = `SELECT * FROM tier_definitions WHERE id = ? LIMIT 1`;
    const row: any = await db.get(query, [id]);
    return row ? TierEntity.fromDatabase(row) : null;
  }

  async getByRestaurant(restaurantId: string): Promise<TierEntity[]> {
    const query = `
      SELECT * FROM tier_definitions
      WHERE restaurant_id = ? AND is_active = 1
      ORDER BY position ASC
    `;

    const rows: any[] = await db.all(query, [restaurantId]);
    return rows.map((row) => TierEntity.fromDatabase(row));
  }

  async getByRestaurantAndPoints(restaurantId: string, points: number): Promise<TierEntity | null> {
    const query = `
      SELECT * FROM tier_definitions
      WHERE restaurant_id = ? AND min_points <= ? AND ? <= max_points AND is_active = 1
      ORDER BY position DESC
      LIMIT 1
    `;

    const row: any = await db.get(query, [restaurantId, points, points]);
    return row ? TierEntity.fromDatabase(row) : null;
  }

  async update(id: string, tier: TierEntity): Promise<void> {
    const query = `
      UPDATE tier_definitions
      SET name = ?, discount_percent = ?, min_points = ?, max_points = ?, benefits = ?, position = ?, is_active = ?, updated_at = ?
      WHERE id = ?
    `;

    await db.run(query, [
      tier.name,
      tier.discountPercent,
      tier.minPoints,
      tier.maxPoints,
      JSON.stringify(tier.benefits || []),
      tier.position,
      tier.isActive ? 1 : 0,
      tier.updatedAt,
      id,
    ]);
  }
}
