import { injectable } from 'inversify';
import { ICardIdentifierRepository } from '../../domain/repositories';
import { CardIdentifierEntity } from '../../domain/entities';

@injectable()
export class CardIdentifierRepository implements ICardIdentifierRepository {
  private cards: Map<string, CardIdentifierEntity> = new Map();

  async create(card: CardIdentifierEntity): Promise<void> {
    this.cards.set(card.id, card);
  }

  async getById(id: string): Promise<CardIdentifierEntity | null> {
    return this.cards.get(id) || null;
  }

  async getByQRToken(qrToken: string): Promise<CardIdentifierEntity | null> {
    for (const [, card] of this.cards) {
      if (card.qrToken === qrToken) {
        return card;
      }
    }
    return null;
  }

  async getBySixDigitCode(code: string): Promise<CardIdentifierEntity | null> {
    for (const [, card] of this.cards) {
      if (card.sixDigitCode === code && card.isActive) {
        return card;
      }
    }
    return null;
  }

  async getActiveByGuest(guestRestaurantId: string): Promise<CardIdentifierEntity | null> {
    for (const [, card] of this.cards) {
      if (card.guestRestaurantId === guestRestaurantId && card.isActive) {
        return card;
      }
    }
    return null;
  }

  async invalidate(cardId: string, transactionId: string): Promise<void> {
    const card = this.cards.get(cardId);
    if (card) {
      card.isActive = false;
      card.invalidatedAt = new Date();
      card.invalidatedByTransactionId = transactionId;
    }
  }

  async getHistoryByGuest(guestRestaurantId: string, limit: number = 50): Promise<CardIdentifierEntity[]> {
    const results: CardIdentifierEntity[] = [];

    for (const [, card] of this.cards) {
      if (card.guestRestaurantId === guestRestaurantId) {
        results.push(card);
      }

      if (results.length >= limit) break;
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
