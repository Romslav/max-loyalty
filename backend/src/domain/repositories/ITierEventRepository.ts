import { TierEventEntity } from '../entities';

export interface ITierEventRepository {
  create(event: TierEventEntity): Promise<void>;
  getByGuest(guestRestaurantId: string, limit?: number): Promise<TierEventEntity[]>;
  getByRestaurant(restaurantId: string, limit?: number): Promise<TierEventEntity[]>;
  getLatestUpgrade(guestRestaurantId: string): Promise<TierEventEntity | null>;
}
