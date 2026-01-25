export class TierEventEntity {
  id: string;
  guestRestaurantId: string;
  restaurantId: string;
  fromTierId?: string;
  toTierId: string;
  eventType: string;
  reason?: string;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.guestRestaurantId = data.guestRestaurantId;
    this.restaurantId = data.restaurantId;
    this.fromTierId = data.fromTierId;
    this.toTierId = data.toTierId;
    this.eventType = data.eventType;
    this.reason = data.reason;
    this.createdAt = data.createdAt || new Date();
  }

  static create(data: any): TierEventEntity {
    return new TierEventEntity(data);
  }
}
