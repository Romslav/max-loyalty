import { injectable } from 'inversify';
import { IRestaurantRepository } from '../../domain/repositories';
import { RestaurantEntity } from '../../domain/entities';

@injectable()
export class RestaurantRepository implements IRestaurantRepository {
  private restaurants: Map<string, any> = new Map();

  async create(restaurant: RestaurantEntity): Promise<void> {
    this.restaurants.set(restaurant.id, {
      id: restaurant.id,
      name: restaurant.name,
      inn: restaurant.inn,
      address: restaurant.address,
      city: restaurant.city,
      phone: restaurant.phone,
      email: restaurant.email,
      isActive: restaurant.isActive,
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,
    });
  }

  async getById(id: string): Promise<RestaurantEntity | null> {
    const data = this.restaurants.get(id);
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async getByINN(inn: string): Promise<RestaurantEntity | null> {
    for (const [, data] of this.restaurants) {
      if (data.inn === inn) {
        return this.mapToEntity(data);
      }
    }
    return null;
  }

  async update(
    id: string,
    restaurant: RestaurantEntity,
  ): Promise<void> {
    if (this.restaurants.has(id)) {
      this.restaurants.set(id, {
        id,
        name: restaurant.name,
        inn: restaurant.inn,
        address: restaurant.address,
        city: restaurant.city,
        phone: restaurant.phone,
        email: restaurant.email,
        isActive: restaurant.isActive,
        createdAt: restaurant.createdAt,
        updatedAt: restaurant.updatedAt,
      });
    }
  }

  async getAll(): Promise<RestaurantEntity[]> {
    const results: RestaurantEntity[] = [];

    for (const [, data] of this.restaurants) {
      results.push(this.mapToEntity(data));
    }

    return results;
  }

  async getByCity(city: string): Promise<RestaurantEntity[]> {
    const results: RestaurantEntity[] = [];

    for (const [, data] of this.restaurants) {
      if (data.city.toLowerCase() === city.toLowerCase()) {
        results.push(this.mapToEntity(data));
      }
    }

    return results;
  }

  private mapToEntity(data: any): RestaurantEntity {
    return RestaurantEntity.create(data);
  }
}
