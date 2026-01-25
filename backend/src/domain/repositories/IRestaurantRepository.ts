import { RestaurantEntity } from '../entities';

export interface IRestaurantRepository {
  create(restaurant: RestaurantEntity): Promise<void>;
  getById(id: string): Promise<RestaurantEntity | null>;
  getByINN(inn: string): Promise<RestaurantEntity | null>;
  update(id: string, restaurant: RestaurantEntity): Promise<void>;
  getAll(): Promise<RestaurantEntity[]>;
  getByCity(city: string): Promise<RestaurantEntity[]>;
}
