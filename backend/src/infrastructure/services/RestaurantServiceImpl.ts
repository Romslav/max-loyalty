import { injectable, inject } from 'inversify';
import { IRestaurantService } from '../../domain/services/RestaurantService';
import { IRestaurantRepository, ITierDefinitionRepository, IStaffRestaurantRepository } from '../../domain/repositories';
import { TYPES } from '../../shared/types';
import { RestaurantEntity, TierEntity } from '../../domain/entities';
import { ErrorCode } from '../../shared/types';

interface RegisterRestaurantInput {
  name: string;
  inn: string;
  address: string;
  city?: string;
  phone?: string;
  email?: string;
}

interface UpdateCustomizationInput {
  restaurantId: string;
  loyaltyProgramName?: string;
  bonusPointsName?: string;
  qrCodeEnabled?: boolean;
  smsNotificationsEnabled?: boolean;
  emailNotificationsEnabled?: boolean;
}

interface DefineTiersInput {
  restaurantId: string;
  tiers: Array<{
    name: string;
    discountPercent: number;
    minPoints: number;
    maxPoints: number;
    benefits?: string[];
  }>;
}

interface AssignStaffInput {
  restaurantId: string;
  userId: string;
  role: 'MANAGER' | 'CASHIER' | 'ADMIN';
}

@injectable()
export class RestaurantServiceImpl implements IRestaurantService {
  constructor(
    @inject(TYPES.Repositories.IRestaurantRepository)
    private restaurantRepository: IRestaurantRepository,

    @inject(TYPES.Repositories.ITierDefinitionRepository)
    private tierDefinitionRepository: ITierDefinitionRepository,

    @inject(TYPES.Repositories.IStaffRestaurantRepository)
    private staffRestaurantRepository: IStaffRestaurantRepository,
  ) {}

  async registerRestaurant(input: RegisterRestaurantInput): Promise<RestaurantEntity> {
    if (!input.name || !input.inn || !input.address) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'name, inn, address обязательны',
      };
    }

    const existingByInn = await this.restaurantRepository.getByINN(input.inn);
    if (existingByInn) {
      throw {
        code: ErrorCode.RESTAURANT_ALREADY_EXISTS,
        message: `Ресторан с ИНН ${input.inn} уже зарегистрирован`,
      };
    }

    const restaurant = RestaurantEntity.create({
      id: this.generateRestaurantId(),
      name: input.name.trim(),
      inn: input.inn.trim(),
      address: input.address.trim(),
      city: input.city?.trim(),
      phone: input.phone?.trim(),
      email: input.email?.trim(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.restaurantRepository.create(restaurant);
    console.log(`✅ Restaurant registered: ${restaurant.id} (${input.name})`);

    return restaurant;
  }

  async getRestaurant(restaurantId: string): Promise<RestaurantEntity | null> {
    if (!restaurantId) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'restaurantId обязателен',
      };
    }

    const restaurant = await this.restaurantRepository.getById(restaurantId);

    if (!restaurant) {
      throw {
        code: ErrorCode.RESTAURANT_NOT_FOUND,
        message: `Ресторан ${restaurantId} не найден`,
      };
    }

    return restaurant;
  }

  async updateCustomization(input: UpdateCustomizationInput): Promise<void> {
    const restaurant = await this.getRestaurant(input.restaurantId);

    if (input.loyaltyProgramName) {
      restaurant.updateCustomization({
        loyaltyProgramName: input.loyaltyProgramName,
      });
    }

    if (input.bonusPointsName) {
      restaurant.updateCustomization({
        bonusPointsName: input.bonusPointsName,
      });
    }

    if (input.qrCodeEnabled !== undefined) {
      restaurant.updateCustomization({
        qrCodeEnabled: input.qrCodeEnabled,
      });
    }

    if (input.smsNotificationsEnabled !== undefined) {
      restaurant.updateCustomization({
        smsNotificationsEnabled: input.smsNotificationsEnabled,
      });
    }

    if (input.emailNotificationsEnabled !== undefined) {
      restaurant.updateCustomization({
        emailNotificationsEnabled: input.emailNotificationsEnabled,
      });
    }

    restaurant.updatedAt = new Date();
    await this.restaurantRepository.update(input.restaurantId, restaurant);

    console.log(`✏️  Restaurant customization updated: ${input.restaurantId}`);
  }

  async defineTiers(input: DefineTiersInput): Promise<TierEntity[]> {
    await this.getRestaurant(input.restaurantId);

    if (!input.tiers || input.tiers.length === 0) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'tiers должны содержать как минимум один уровень',
      };
    }

    const createdTiers: TierEntity[] = [];

    for (let i = 0; i < input.tiers.length; i++) {
      const tierInput = input.tiers[i];

      if (tierInput.discountPercent < 0 || tierInput.discountPercent > 100) {
        throw {
          code: ErrorCode.VALIDATION_ERROR,
          message: `discountPercent должен быть от 0 до 100 (получено ${tierInput.discountPercent})`,
        };
      }

      const tier = TierEntity.create({
        id: this.generateTierId(),
        restaurantId: input.restaurantId,
        name: tierInput.name.trim(),
        discountPercent: tierInput.discountPercent,
        minPoints: tierInput.minPoints,
        maxPoints: tierInput.maxPoints,
        benefits: tierInput.benefits || [],
        position: i + 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.tierDefinitionRepository.create(tier);
      createdTiers.push(tier);

      console.log(`✅ Tier created: ${tier.name} (${tier.discountPercent}%)`);
    }

    return createdTiers;
  }

  async getRestaurantTiers(restaurantId: string): Promise<TierEntity[]> {
    await this.getRestaurant(restaurantId);
    return this.tierDefinitionRepository.getByRestaurant(restaurantId);
  }

  async getStaffList(restaurantId: string): Promise<any[]> {
    await this.getRestaurant(restaurantId);
    return this.staffRestaurantRepository.getByRestaurant(restaurantId);
  }

  async assignStaff(input: AssignStaffInput): Promise<void> {
    await this.getRestaurant(input.restaurantId);

    if (!input.userId || !input.role) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'userId и role обязательны',
      };
    }

    const validRoles = ['MANAGER', 'CASHIER', 'ADMIN'];
    if (!validRoles.includes(input.role)) {
      throw {
        code: ErrorCode.VALIDATION_ERROR,
        message: `role должна быть одной из: ${validRoles.join(', ')}`,
      };
    }

    await this.staffRestaurantRepository.assign({
      restaurantId: input.restaurantId,
      userId: input.userId,
      role: input.role,
      assignedAt: new Date(),
    });

    console.log(`✅ Staff assigned: ${input.userId} as ${input.role} in ${input.restaurantId}`);
  }

  private generateRestaurantId(): string {
    return `rest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTierId(): string {
    return `tier-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export {
  RegisterRestaurantInput,
  UpdateCustomizationInput,
  DefineTiersInput,
  AssignStaffInput,
};
