import { injectable } from 'inversify';
import { ITierDefinitionRepository } from '../../domain/repositories';
import { TierEntity } from '../../domain/entities';

@injectable()
export class TierDefinitionRepository implements ITierDefinitionRepository {
  private tiers: Map<string, TierEntity> = new Map();

  async create(tier: TierEntity): Promise<void> {
    this.tiers.set(tier.id, tier);
  }

  async getById(id: string): Promise<TierEntity | null> {
    return this.tiers.get(id) || null;
  }

  async getByRestaurant(restaurantId: string): Promise<TierEntity[]> {
    const results: TierEntity[] = [];

    for (const [, tier] of this.tiers) {
      if (tier.restaurantId === restaurantId) {
        results.push(tier);
      }
    }

    return results.sort((a, b) => a.minPoints - b.minPoints);
  }

  async getTierByPoints(restaurantId: string, points: number): Promise<TierEntity | null> {
    let bestTier: TierEntity | null = null;

    for (const [, tier] of this.tiers) {
      if (tier.restaurantId === restaurantId && tier.minPoints <= points) {
        if (!bestTier || tier.minPoints > bestTier.minPoints) {
          bestTier = tier;
        }
      }
    }

    return bestTier;
  }

  async getNextTier(restaurantId: string, currentTierId: string): Promise<TierEntity | null> {
    const currentTier = await this.getById(currentTierId);
    if (!currentTier) return null;

    const allTiers = await this.getByRestaurant(restaurantId);
    const currentIndex = allTiers.findIndex((t) => t.id === currentTierId);

    return currentIndex < allTiers.length - 1 ? allTiers[currentIndex + 1] : null;
  }
}
