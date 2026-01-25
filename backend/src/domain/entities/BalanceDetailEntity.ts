export class BalanceDetailEntity {
  id: string;
  guestRestaurantId: string;
  transactionId: string;
  type: string;
  basePoints: number;
  bonusPoints: number;
  oldBalance: number;
  newBalance: number;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.guestRestaurantId = data.guestRestaurantId;
    this.transactionId = data.transactionId;
    this.type = data.type;
    this.basePoints = data.basePoints || 0;
    this.bonusPoints = data.bonusPoints || 0;
    this.oldBalance = data.oldBalance;
    this.newBalance = data.newBalance;
    this.createdAt = data.createdAt || new Date();
  }

  static create(data: any): BalanceDetailEntity {
    return new BalanceDetailEntity(data);
  }
}
