import { TransactionEntity } from '../entities';

export interface ITransactionRepository {
  create(transaction: TransactionEntity): Promise<void>;
  getById(id: string): Promise<TransactionEntity | null>;
  getByGuest(guestRestaurantId: string, limit?: number, offset?: number): Promise<TransactionEntity[]>;
  getByRestaurant(restaurantId: string, limit?: number, offset?: number): Promise<TransactionEntity[]>;
  getTotalSpent(guestRestaurantId: string): Promise<number>;
  getTransactionCount(guestRestaurantId: string): Promise<number>;
}
