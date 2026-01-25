import { injectable } from 'inversify';
import { ITierEventRepository } from '../../domain/repositories';
import { TierEventEntity } from '../../domain/entities';

@injectable()
export class TierEventRepository implements ITierEventRepository {
  private events: Map<string, TierEventEntity> = new Map();

  async create(event: TierEventEntity): Promise<void> {
    this.events.set(event.id, event);
  }

  async getByGuest(guestRestaurantId: string, limit: number = 50): Promise<TierEventEntity[]> {
    const results: TierEventEntity[] = [];

    for (const [, event] of this.events) {
      if (event.guestRestaurantId === guestRestaurantId) {
        results.push(event);
      }

      if (results.length >= limit) break;
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getByRestaurant(restaurantId: string, limit: number = 100): Promise<TierEventEntity[]> {
    const results: TierEventEntity[] = [];

    for (const [, event] of this.events) {
      if (event.restaurantId === restaurantId) {
        results.push(event);
      }

      if (results.length >= limit) break;
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getLatestUpgrade(guestRestaurantId: string): Promise<TierEventEntity | null> {
    let latest: TierEventEntity | null = null;

    for (const [, event] of this.events) {
      if (event.guestRestaurantId === guestRestaurantId && event.eventType === 'UPGRADE') {
        if (!latest || event.createdAt > latest.createdAt) {
          latest = event;
        }
      }
    }

    return latest;
  }
}
