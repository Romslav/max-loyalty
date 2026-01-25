import { injectable } from 'inversify';
import { ITierDefinitionRepository } from '../../domain/repositories';
import { TierEntity } from '../../domain/entities';

@injectable()
export class TierDefinitionRepository implements ITierDefinitionRepository {
  private tiers: Map<string, any> = new Map();

  async create(tier: TierEntity): Promise<void> {
    this.tiers.set(tier.id, {
      id: tier.id,
      restaurantId: tier.restaurantId,
      name: tier.name,
      discountPercent: tier.discountPercent,
      minPoints: tier.minPoints,
      maxPoints: tier.maxPoints,
      createdAt: tier.createdAt,
    });
  }

  async getById(id: string): Promise<TierEntity | null> {
    const data = this.tiers.get(id);
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async getByRestaurant(
    restaurantId: string,
  ): Promise<TierEntity[]> {
    const results: TierEntity[] = [];

    for (const [, data] of this.tiers) {
      if (data.restaurantId === restaurantId) {
        results.push(this.mapToEntity(data));
      }
    }

    return results.sort((a, b) => a.minPoints - b.minPoints);
  }

  async getTierByPoints(
    restaurantId: string,
    points: number,
  ): Promise<TierEntity | null> {
    let bestTier: any | null = null;

    for (const [, data] of this.tiers) {
      if (
        data.restaurantId === restaurantId &&
        data.minPoints <= points &&
        data.maxPoints >= points
      ) {
        if (!bestTier || data.minPoints > bestTier.minPoints) {
          bestTier = data;
        }
      }
    }

    return bestTier ? this.mapToEntity(bestTier) : null;
  }

  async getNextTier(
    restaurantId: string,
    currentTierId: string,
  ): Promise<TierEntity | null> {
    const current = await this.getById(currentTierId);
    if (!current) return null;

    let nextTier: any | null = null;
    const minRequired = current.maxPoints + 1;

    for (const [, data] of this.tiers) {
      if (data.restaurantId === restaurantId && data.minPoints >= minRequired) {
        if (!nextTier || data.minPoints < nextTier.minPoints) {
          nextTier = data;
        }
      }
    }

    return nextTier ? this.mapToEntity(nextTier) : null;
  }

  private mapToEntity(data: any): TierEntity {
    return TierEntity.create(data);
  }
}
