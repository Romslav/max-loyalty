import { injectable } from 'inversify';
import { IGuestRepository } from '../../domain/repositories';
import { GuestEntity } from '../../domain/entities';
import { db } from '../database';

@injectable()
export class GuestRepository implements IGuestRepository {
  async create(guest: GuestEntity): Promise<void> {
    const query = `
      INSERT INTO guests (id, phone, name, email, birth_date, is_blocked, block_reason, is_email_verified, is_phone_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.run(query, [
      guest.id,
      guest.phone,
      guest.name,
      guest.email,
      guest.birthDate,
      guest.isBlocked ? 1 : 0,
      guest.blockReason || null,
      guest.isEmailVerified ? 1 : 0,
      guest.isPhoneVerified ? 1 : 0,
      guest.createdAt,
      guest.updatedAt,
    ]);
  }

  async getById(id: string): Promise<GuestEntity | null> {
    const query = `SELECT * FROM guests WHERE id = ? LIMIT 1`;
    const row: any = await db.get(query, [id]);

    if (!row) return null;

    return GuestEntity.fromDatabase(row);
  }

  async getByPhone(phone: string): Promise<GuestEntity | null> {
    const normalizedPhone = phone.replace(/\D/g, '');
    const query = `SELECT * FROM guests WHERE phone = ? LIMIT 1`;
    const row: any = await db.get(query, [normalizedPhone]);

    if (!row) return null;

    return GuestEntity.fromDatabase(row);
  }

  async update(id: string, guest: GuestEntity): Promise<void> {
    const query = `
      UPDATE guests
      SET name = ?, email = ?, birth_date = ?, is_blocked = ?, block_reason = ?, is_email_verified = ?, is_phone_verified = ?, updated_at = ?
      WHERE id = ?
    `;

    await db.run(query, [
      guest.name,
      guest.email,
      guest.birthDate,
      guest.isBlocked ? 1 : 0,
      guest.blockReason || null,
      guest.isEmailVerified ? 1 : 0,
      guest.isPhoneVerified ? 1 : 0,
      guest.updatedAt,
      id,
    ]);
  }

  async block(id: string, reason: string): Promise<void> {
    const query = `UPDATE guests SET is_blocked = 1, block_reason = ?, updated_at = ? WHERE id = ?`;
    await db.run(query, [reason, new Date(), id]);
  }

  async unblock(id: string): Promise<void> {
    const query = `UPDATE guests SET is_blocked = 0, block_reason = NULL, updated_at = ? WHERE id = ?`;
    await db.run(query, [new Date(), id]);
  }
}
