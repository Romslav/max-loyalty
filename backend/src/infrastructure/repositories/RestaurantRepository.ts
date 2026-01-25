import { injectable } from 'inversify';
import { IRestaurantRepository } from '../../domain/repositories';
import { RestaurantEntity } from '../../domain/entities';
import { db } from '../database';

@injectable()
export class RestaurantRepository implements IRestaurantRepository {
  async create(restaurant: RestaurantEntity): Promise<void> {
    const query = `
      INSERT INTO restaurants (id, name, inn, address, city, phone, email, is_active, loyalty_program_name, bonus_points_name, qr_code_enabled, sms_notifications_enabled, email_notifications_enabled, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.run(query, [
      restaurant.id,
      restaurant.name,
      restaurant.inn,
      restaurant.address,
      restaurant.city,
      restaurant.phone,
      restaurant.email,
      restaurant.isActive ? 1 : 0,
      restaurant.customization?.loyaltyProgramName || 'Loyalty Program',
      restaurant.customization?.bonusPointsName || 'Points',
      restaurant.customization?.qrCodeEnabled ? 1 : 0,
      restaurant.customization?.smsNotificationsEnabled ? 1 : 0,
      restaurant.customization?.emailNotificationsEnabled ? 1 : 0,
      restaurant.createdAt,
      restaurant.updatedAt,
    ]);
  }

  async getById(id: string): Promise<RestaurantEntity | null> {
    const query = `SELECT * FROM restaurants WHERE id = ? LIMIT 1`;
    const row: any = await db.get(query, [id]);
    return row ? RestaurantEntity.fromDatabase(row) : null;
  }

  async getByINN(inn: string): Promise<RestaurantEntity | null> {
    const query = `SELECT * FROM restaurants WHERE inn = ? LIMIT 1`;
    const row: any = await db.get(query, [inn]);
    return row ? RestaurantEntity.fromDatabase(row) : null;
  }

  async update(id: string, restaurant: RestaurantEntity): Promise<void> {
    const query = `
      UPDATE restaurants
      SET name = ?, address = ?, city = ?, phone = ?, email = ?, loyalty_program_name = ?, bonus_points_name = ?, qr_code_enabled = ?, sms_notifications_enabled = ?, email_notifications_enabled = ?, updated_at = ?
      WHERE id = ?
    `;

    await db.run(query, [
      restaurant.name,
      restaurant.address,
      restaurant.city,
      restaurant.phone,
      restaurant.email,
      restaurant.customization?.loyaltyProgramName || 'Loyalty Program',
      restaurant.customization?.bonusPointsName || 'Points',
      restaurant.customization?.qrCodeEnabled ? 1 : 0,
      restaurant.customization?.smsNotificationsEnabled ? 1 : 0,
      restaurant.customization?.emailNotificationsEnabled ? 1 : 0,
      restaurant.updatedAt,
      id,
    ]);
  }

  async getAll(limit: number = 100, offset: number = 0): Promise<RestaurantEntity[]> {
    const query = `
      SELECT * FROM restaurants
      WHERE is_active = 1
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const rows: any[] = await db.all(query, [limit, offset]);
    return rows.map((row) => RestaurantEntity.fromDatabase(row));
  }
}
