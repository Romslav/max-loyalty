import { TierEntity } from '../entities';

export interface ITierDefinitionRepository {
  create(tier: TierEntity): Promise<void>;
  getById(id: string): Promise<TierEntity | null>;
  getByRestaurant(restaurantId: string): Promise<TierEntity[]>;
  getTierByPoints(restaurantId: string, points: number): Promise<TierEntity | null>;
  getNextTier(restaurantId: string, currentTierId: string): Promise<TierEntity | null>;
}
