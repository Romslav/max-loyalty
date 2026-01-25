import { GuestRestaurantEntity } from '../entities';

export interface IGuestRestaurantRepository {
  create(entity: GuestRestaurantEntity): Promise<void>;
  getById(id: string): Promise<GuestRestaurantEntity | null>;
  getByGuestAndRestaurant(guestId: string, restaurantId: string): Promise<GuestRestaurantEntity | null>;
  updateBalance(id: string, newBalance: number): Promise<void>;
  updateLastVisit(id: string): Promise<void>;
  block(id: string, reason: string): Promise<void>;
  unblock(id: string): Promise<void>;
  upgradeTier(id: string, tierId: string): Promise<void>;
}
