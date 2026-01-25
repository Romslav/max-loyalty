import { CardIdentifierEntity } from '../entities';

export interface ICardIdentifierRepository {
  create(card: CardIdentifierEntity): Promise<void>;
  getById(id: string): Promise<CardIdentifierEntity | null>;
  getByQRToken(qrToken: string): Promise<CardIdentifierEntity | null>;
  getBySixDigitCode(code: string): Promise<CardIdentifierEntity | null>;
  getActiveByGuest(guestRestaurantId: string): Promise<CardIdentifierEntity | null>;
  invalidate(cardId: string, transactionId: string): Promise<void>;
  getHistoryByGuest(guestRestaurantId: string, limit?: number): Promise<CardIdentifierEntity[]>;
}
