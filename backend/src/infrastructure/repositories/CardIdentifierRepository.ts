import { injectable } from 'inversify';
import { ICardIdentifierRepository } from '../../domain/repositories';
import { CardIdentifierEntity } from '../../domain/entities';
import { db } from '../database';

@injectable()
export class CardIdentifierRepository implements ICardIdentifierRepository {
  async create(card: CardIdentifierEntity): Promise<void> {
    const query = `
      INSERT INTO card_identifiers (id, guest_restaurant_id, restaurant_id, qr_token, six_digit_code, is_active, invalidated_at, invalidated_by_transaction_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.run(query, [
      card.id,
      card.guestRestaurantId,
      card.restaurantId,
      card.qrToken,
      card.sixDigitCode,
      card.isActive ? 1 : 0,
      card.invalidatedAt || null,
      card.invalidatedByTransactionId || null,
      card.createdAt,
    ]);
  }

  async getByQRToken(qrToken: string): Promise<CardIdentifierEntity | null> {
    const query = `SELECT * FROM card_identifiers WHERE qr_token = ? LIMIT 1`;
    const row: any = await db.get(query, [qrToken]);
    return row ? CardIdentifierEntity.fromDatabase(row) : null;
  }

  async getBySixDigitCode(code: string): Promise<CardIdentifierEntity | null> {
    const query = `SELECT * FROM card_identifiers WHERE six_digit_code = ? AND is_active = 1 AND invalidated_at IS NULL LIMIT 1`;
    const row: any = await db.get(query, [code]);
    return row ? CardIdentifierEntity.fromDatabase(row) : null;
  }

  async getActiveCard(guestRestaurantId: string): Promise<CardIdentifierEntity | null> {
    const query = `
      SELECT * FROM card_identifiers
      WHERE guest_restaurant_id = ? AND is_active = 1 AND invalidated_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const row: any = await db.get(query, [guestRestaurantId]);
    return row ? CardIdentifierEntity.fromDatabase(row) : null;
  }

  async invalidate(id: string, transactionId: string): Promise<void> {
    const query = `UPDATE card_identifiers SET is_active = 0, invalidated_at = ?, invalidated_by_transaction_id = ? WHERE id = ?`;
    await db.run(query, [new Date(), transactionId, id]);
  }

  async getById(id: string): Promise<CardIdentifierEntity | null> {
    const query = `SELECT * FROM card_identifiers WHERE id = ? LIMIT 1`;
    const row: any = await db.get(query, [id]);
    return row ? CardIdentifierEntity.fromDatabase(row) : null;
  }
}
