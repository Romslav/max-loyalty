import { injectable } from 'inversify';
import { IRestaurantRepository } from '../../domain/repositories';
import { RestaurantEntity } from '../../domain/entities';

@injectable()
export class RestaurantRepository implements IRestaurantRepository {
  private restaurants: Map<string, RestaurantEntity> = new Map();

  async create(restaurant: RestaurantEntity): Promise<void> {
    this.restaurants.set(restaurant.id, restaurant);
  }

  async getById(id: string): Promise<RestaurantEntity | null> {
    return this.restaurants.get(id) || null;
  }

  async getByINN(inn: string): Promise<RestaurantEntity | null> {
    for (const [, restaurant] of this.restaurants) {
      if (restaurant.inn === inn) {
        return restaurant;
      }
    }
    return null;
  }

  async update(id: string, restaurant: RestaurantEntity): Promise<void> {
    this.restaurants.set(id, restaurant);
  }

  async getAll(): Promise<RestaurantEntity[]> {
    const results: RestaurantEntity[] = [];

    for (const [, restaurant] of this.restaurants) {
      results.push(restaurant);
    }

    return results;
  }

  async getByCity(city: string): Promise<RestaurantEntity[]> {
    const results: RestaurantEntity[] = [];

    for (const [, restaurant] of this.restaurants) {
      if (restaurant.city === city) {
        results.push(restaurant);
      }
    }

    return results;
  }
}
