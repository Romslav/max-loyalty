import { injectable, inject } from 'inversify';
import { IRestaurantService } from '../../domain/services';
import { IRestaurantRepository, ITierDefinitionRepository } from '../../domain/repositories';
import { TYPES } from '../../shared/types';
import { RestaurantEntity, TierEntity } from '../../domain/entities';
import { ErrorCode } from '../../shared/types';

@injectable()
export class RestaurantServiceImpl implements IRestaurantService {
  constructor(
    @inject(TYPES.Repositories.IRestaurantRepository)
    private restaurantRepository: IRestaurantRepository,

    @inject(TYPES.Repositories.ITierDefinitionRepository)
    private tierDefinitionRepository: ITierDefinitionRepository,
  ) {}

  async registerRestaurant(input: any): Promise<any> {
    if (!input.name || !input.inn || !input.address) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'name, inn, address are required',
      };
    }

    const existing = await this.restaurantRepository.getByINN(input.inn);
    if (existing) {
      throw {
        code: ErrorCode.RESTAURANT_ALREADY_EXISTS,
        message: `Restaurant with INN ${input.inn} already exists`,
      };
    }

    const restaurant = RestaurantEntity.create({
      id: `rest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: input.name.trim(),
      inn: input.inn.trim(),
      address: input.address.trim(),
      city: input.city?.trim() || '',
      phone: input.phone?.trim(),
      email: input.email?.trim(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.restaurantRepository.create(restaurant);
    console.log(`Restaurant registered: ${restaurant.id} (${input.inn})`);

    return restaurant;
  }

  async getRestaurant(restaurantId: string): Promise<any> {
    if (!restaurantId) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'restaurantId is required',
      };
    }

    const restaurant = await this.restaurantRepository.getById(restaurantId);
    if (!restaurant) {
      throw {
        code: ErrorCode.RESTAURANT_NOT_FOUND,
        message: `Restaurant ${restaurantId} not found`,
      };
    }

    return restaurant;
  }

  async updateCustomization(input: any): Promise<void> {
    const restaurant = await this.getRestaurant(input.restaurantId);

    if (input.programName) {
      restaurant.updateProgramName(input.programName.trim());
    }

    if (input.description) {
      restaurant.updateDescription(input.description.trim());
    }

    if (input.pointsPerRuble) {
      restaurant.updatePointsPerRuble(input.pointsPerRuble);
    }

    if (input.pointsExpireDays) {
      restaurant.updatePointsExpireDays(input.pointsExpireDays);
    }

    restaurant.updatedAt = new Date();
    await this.restaurantRepository.update(input.restaurantId, restaurant);

    console.log(`Restaurant customization updated: ${input.restaurantId}`);
  }

  async defineTiers(input: any): Promise<void> {
    await this.getRestaurant(input.restaurantId);

    if (!input.tiersConfig || input.tiersConfig.length === 0) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'tiersConfig must contain at least one tier',
      };
    }

    for (const tierConfig of input.tiersConfig) {
      const tier = TierEntity.create({
        id: `tier-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        restaurantId: input.restaurantId,
        name: tierConfig.name,
        discountPercent: tierConfig.discountPercent,
        minPoints: tierConfig.minPoints,
        maxPoints: tierConfig.maxPoints,
        createdAt: new Date(),
      });

      await this.tierDefinitionRepository.create(tier);
    }

    console.log(`Tiers defined: ${input.restaurantId} (${input.tiersConfig.length} tiers)`);
  }

  async getStaffList(restaurantId: string): Promise<any[]> {
    // TODO: Get staff from database
    return [];
  }

  async assignStaff(restaurantId: string, userId: string): Promise<void> {
    // TODO: Create staff assignment in database
    console.log(`Staff assigned: ${userId} to ${restaurantId}`);
  }
}
