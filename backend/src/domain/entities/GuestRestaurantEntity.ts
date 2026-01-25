export class GuestRestaurantEntity {
  id: string;
  guestId: string;
  restaurantId: string;
  currentTier: any;
  balancePoints: number;
  isBlocked: boolean;
  blockReason?: string;
  activeCardId?: string;
  visitsCount: number;
  lastVisitAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.guestId = data.guestId;
    this.restaurantId = data.restaurantId;
    this.currentTier = data.currentTier;
    this.balancePoints = data.balancePoints || 0;
    this.isBlocked = data.isBlocked || false;
    this.blockReason = data.blockReason;
    this.activeCardId = data.activeCardId;
    this.visitsCount = data.visitsCount || 0;
    this.lastVisitAt = data.lastVisitAt;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static create(data: any): GuestRestaurantEntity {
    return new GuestRestaurantEntity(data);
  }

  addPoints(points: number): void {
    this.balancePoints += points;
    this.updatedAt = new Date();
  }

  updateProgramName(name: string): void {
    this.updatedAt = new Date();
  }
}
