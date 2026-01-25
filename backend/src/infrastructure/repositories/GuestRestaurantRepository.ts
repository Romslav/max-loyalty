import { injectable } from 'inversify';
import { IGuestRestaurantRepository } from '../../domain/repositories';
import { GuestRestaurantEntity } from '../../domain/entities';

@injectable()
export class GuestRestaurantRepository implements IGuestRestaurantRepository {
  private data: Map<string, GuestRestaurantEntity> = new Map();

  async create(entity: GuestRestaurantEntity): Promise<void> {
    this.data.set(entity.id, entity);
  }

  async getById(id: string): Promise<GuestRestaurantEntity | null> {
    return this.data.get(id) || null;
  }

  async getByGuestAndRestaurant(guestId: string, restaurantId: string): Promise<GuestRestaurantEntity | null> {
    for (const [, entity] of this.data) {
      if (entity.guestId === guestId && entity.restaurantId === restaurantId) {
        return entity;
      }
    }
    return null;
  }

  async updateBalance(id: string, newBalance: number): Promise<void> {
    const existing = this.data.get(id);
    if (existing) {
      existing.balancePoints = newBalance;
    }
  }

  async updateLastVisit(id: string): Promise<void> {
    const existing = this.data.get(id);
    if (existing) {
      existing.lastVisitAt = new Date();
      existing.visitsCount = (existing.visitsCount || 0) + 1;
    }
  }

  async block(id: string, reason: string): Promise<void> {
    const existing = this.data.get(id);
    if (existing) {
      existing.isBlocked = true;
      existing.blockReason = reason;
    }
  }

  async unblock(id: string): Promise<void> {
    const existing = this.data.get(id);
    if (existing) {
      existing.isBlocked = false;
      existing.blockReason = undefined;
    }
  }

  async upgradeTier(id: string, tierId: string): Promise<void> {
    const existing = this.data.get(id);
    if (existing) {
      existing.currentTier = { id: tierId };
    }
  }
}
