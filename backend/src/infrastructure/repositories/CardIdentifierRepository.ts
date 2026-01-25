import { injectable } from 'inversify';
import { ICardIdentifierRepository } from '../../domain/repositories';
import { CardIdentifierEntity } from '../../domain/entities';

@injectable()
export class CardIdentifierRepository implements ICardIdentifierRepository {
  private cards: Map<string, any> = new Map();

  async create(card: CardIdentifierEntity): Promise<void> {
    this.cards.set(card.id, {
      id: card.id,
      guestRestaurantId: card.guestRestaurantId,
      restaurantId: card.restaurantId,
      qrToken: card.qrToken,
      sixDigitCode: card.sixDigitCode,
      isActive: card.isActive,
      invalidatedAt: card.invalidatedAt,
      invalidatedByTransactionId: card.invalidatedByTransactionId,
      createdAt: card.createdAt,
    });
  }

  async getById(id: string): Promise<CardIdentifierEntity | null> {
    const data = this.cards.get(id);
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async getByQRToken(qrToken: string): Promise<CardIdentifierEntity | null> {
    for (const [, data] of this.cards) {
      if (data.qrToken === qrToken && data.isActive && !data.invalidatedAt) {
        return this.mapToEntity(data);
      }
    }
    return null;
  }

  async getBySixDigitCode(code: string): Promise<CardIdentifierEntity | null> {
    for (const [, data] of this.cards) {
      if (data.sixDigitCode === code && data.isActive && !data.invalidatedAt) {
        return this.mapToEntity(data);
      }
    }
    return null;
  }

  async getActiveByGuest(
    guestRestaurantId: string,
  ): Promise<CardIdentifierEntity | null> {
    for (const [, data] of this.cards) {
      if (
        data.guestRestaurantId === guestRestaurantId &&
        data.isActive &&
        !data.invalidatedAt
      ) {
        return this.mapToEntity(data);
      }
    }
    return null;
  }

  async invalidate(
    cardId: string,
    transactionId: string,
  ): Promise<void> {
    const existing = this.cards.get(cardId);
    if (existing) {
      existing.isActive = false;
      existing.invalidatedAt = new Date();
      existing.invalidatedByTransactionId = transactionId;
    }
  }

  async getHistoryByGuest(
    guestRestaurantId: string,
    limit: number = 10,
  ): Promise<CardIdentifierEntity[]> {
    const results: CardIdentifierEntity[] = [];
    let count = 0;

    for (const [, data] of this.cards) {
      if (data.guestRestaurantId === guestRestaurantId) {
        results.push(this.mapToEntity(data));
        count++;

        if (count >= limit) break;
      }
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private mapToEntity(data: any): CardIdentifierEntity {
    return CardIdentifierEntity.create(data);
  }
}
