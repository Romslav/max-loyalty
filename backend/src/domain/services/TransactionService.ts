export interface ITransactionService {
  processSaleTransaction(input: any): Promise<any>;
  getTransactionHistory(guestRestaurantId: string, limit?: number, offset?: number): Promise<any[]>;
  getCurrentBalance(guestRestaurantId: string): Promise<number>;
  getTotalSpent(guestRestaurantId: string): Promise<number>;
  getVisitCount(guestRestaurantId: string): Promise<number>;
}
