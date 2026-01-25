export class CardIdentifierEntity {
  id: string;
  guestRestaurantId: string;
  restaurantId: string;
  qrToken: string;
  sixDigitCode: string;
  isActive: boolean;
  invalidatedAt?: Date;
  invalidatedByTransactionId?: string;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.guestRestaurantId = data.guestRestaurantId;
    this.restaurantId = data.restaurantId;
    this.qrToken = data.qrToken;
    this.sixDigitCode = data.sixDigitCode;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.invalidatedAt = data.invalidatedAt;
    this.invalidatedByTransactionId = data.invalidatedByTransactionId;
    this.createdAt = data.createdAt || new Date();
  }

  static create(data: any): CardIdentifierEntity {
    return new CardIdentifierEntity(data);
  }
}
