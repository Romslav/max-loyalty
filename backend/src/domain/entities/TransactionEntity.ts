export class TransactionEntity {
  id: string;
  guestRestaurantId: string;
  restaurantId: string;
  type: string;
  amount: number;
  basePointsAwarded: number;
  bonusPointsAwarded: number;
  oldBalance: number;
  newBalance: number;
  status: string;
  posId?: string;
  notes?: string;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.guestRestaurantId = data.guestRestaurantId;
    this.restaurantId = data.restaurantId;
    this.type = data.type || 'SALE';
    this.amount = data.amount;
    this.basePointsAwarded = data.basePointsAwarded;
    this.bonusPointsAwarded = data.bonusPointsAwarded;
    this.oldBalance = data.oldBalance;
    this.newBalance = data.newBalance;
    this.status = data.status || 'PENDING';
    this.posId = data.posId;
    this.notes = data.notes;
    this.createdAt = data.createdAt || new Date();
  }

  static create(data: any): TransactionEntity {
    return new TransactionEntity(data);
  }
}
