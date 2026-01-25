export class TierEntity {
  id: string;
  restaurantId: string;
  name: string;
  discountPercent: number;
  minPoints: number;
  maxPoints: number;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.restaurantId = data.restaurantId;
    this.name = data.name;
    this.discountPercent = data.discountPercent;
    this.minPoints = data.minPoints;
    this.maxPoints = data.maxPoints;
    this.createdAt = data.createdAt || new Date();
  }

  static create(data: any): TierEntity {
    return new TierEntity(data);
  }
}
