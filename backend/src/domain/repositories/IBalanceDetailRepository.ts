import { BalanceDetailEntity } from '../entities';

export interface IBalanceDetailRepository {
  createEntry(data: any): Promise<void>;
  getByGuest(guestRestaurantId: string, limit?: number, offset?: number): Promise<BalanceDetailEntity[]>;
  getByTransaction(transactionId: string): Promise<BalanceDetailEntity | null>;
  getTotalPointsAwarded(guestRestaurantId: string): Promise<number>;
}
