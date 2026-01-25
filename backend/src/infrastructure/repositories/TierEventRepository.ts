import { injectable } from 'inversify';
import { ITierEventRepository } from '../../domain/repositories';
import { TierEventEntity } from '../../domain/entities';

@injectable()
export class TierEventRepository implements ITierEventRepository {
  private events: Map<string, any> = new Map();

  async create(event: TierEventEntity): Promise<void> {
    this.events.set(event.id, {
      id: event.id,
      guestRestaurantId: event.guestRestaurantId,
      restaurantId: event.restaurantId,
      fromTierId: event.fromTierId,
      toTierId: event.toTierId,
      eventType: event.eventType,
      reason: event.reason,
      createdAt: event.createdAt,
    });
  }

  async getByGuest(
    guestRestaurantId: string,
    limit: number = 20,
  ): Promise<TierEventEntity[]> {
    const results: TierEventEntity[] = [];
    let count = 0;

    for (const [, data] of this.events) {
      if (data.guestRestaurantId === guestRestaurantId) {
        results.push(this.mapToEntity(data));
        count++;

        if (count >= limit) break;
      }
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getByRestaurant(
    restaurantId: string,
    limit: number = 100,
  ): Promise<TierEventEntity[]> {
    const results: TierEventEntity[] = [];
    let count = 0;

    for (const [, data] of this.events) {
      if (data.restaurantId === restaurantId) {
        results.push(this.mapToEntity(data));
        count++;

        if (count >= limit) break;
      }
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getLatestUpgrade(
    guestRestaurantId: string,
  ): Promise<TierEventEntity | null> {
    let latest: any | null = null;

    for (const [, data] of this.events) {
      if (
        data.guestRestaurantId === guestRestaurantId &&
        data.eventType === 'UPGRADE'
      ) {
        if (!latest || data.createdAt > latest.createdAt) {
          latest = data;
        }
      }
    }

    return latest ? this.mapToEntity(latest) : null;
  }

  private mapToEntity(data: any): TierEventEntity {
    return TierEventEntity.create(data);
  }
}
