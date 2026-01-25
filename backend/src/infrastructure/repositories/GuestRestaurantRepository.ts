import { injectable } from 'inversify';
import { IGuestRestaurantRepository } from '../../domain/repositories';
import { GuestRestaurantEntity } from '../../domain/entities';

@injectable()
export class GuestRestaurantRepository implements IGuestRestaurantRepository {
  private data: Map<string, any> = new Map();

  async create(entity: GuestRestaurantEntity): Promise<void> {
    this.data.set(entity.id, {
      id: entity.id,
      guestId: entity.guestId,
      restaurantId: entity.restaurantId,
      currentTier: entity.currentTier,
      balancePoints: entity.balancePoints,
      isBlocked: entity.isBlocked,
      blockReason: entity.blockReason,
      activeCardId: entity.activeCardId,
      visitsCount: entity.visitsCount,
      lastVisitAt: entity.lastVisitAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async getById(id: string): Promise<GuestRestaurantEntity | null> {
    const data = this.data.get(id);
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async getByGuestAndRestaurant(
    guestId: string,
    restaurantId: string,
  ): Promise<GuestRestaurantEntity | null> {
    for (const [, data] of this.data) {
      if (data.guestId === guestId && data.restaurantId === restaurantId) {
        return this.mapToEntity(data);
      }
    }
    return null;
  }

  async updateBalance(id: string, newBalance: number): Promise<void> {
    const existing = this.data.get(id);
    if (existing) {
      existing.balancePoints = newBalance;
      existing.updatedAt = new Date();
    }
  }

  async updateLastVisit(id: string): Promise<void> {
    const existing = this.data.get(id);
    if (existing) {
      existing.lastVisitAt = new Date();
      existing.visitsCount = (existing.visitsCount || 0) + 1;
      existing.updatedAt = new Date();
    }
  }

  async block(id: string, reason: string): Promise<void> {
    const existing = this.data.get(id);
    if (existing) {
      existing.isBlocked = true;
      existing.blockReason = reason;
      existing.updatedAt = new Date();
    }
  }

  async unblock(id: string): Promise<void> {
    const existing = this.data.get(id);
    if (existing) {
      existing.isBlocked = false;
      existing.blockReason = null;
      existing.updatedAt = new Date();
    }
  }

  async upgradeTier(id: string, tierId: string): Promise<void> {
    const existing = this.data.get(id);
    if (existing) {
      existing.currentTier = { id: tierId };
      existing.updatedAt = new Date();
    }
  }

  private mapToEntity(data: any): GuestRestaurantEntity {
    return GuestRestaurantEntity.create(data);
  }
}
