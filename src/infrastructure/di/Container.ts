/**
 * Dependency Injection Container - зарегистрированные сервисы и репозитория
 * использует pattern "Singleton" для единого экземпляра
 */

import type { IUserRepository, IGuestRepository, IRestaurantRepository, IOperationRepository, IBillingRepository } from '../../domain/repositories';
import { HttpUserRepository } from '../repositories/HttpUserRepository';
import { HttpGuestRepository } from '../repositories/HttpGuestRepository';

interface DIContainer {
  userRepository: IUserRepository;
  guestRepository: IGuestRepository;
  restaurantRepository: IRestaurantRepository;
  operationRepository: IOperationRepository;
  billingRepository: IBillingRepository;
}

/**
 * Контейнер для управления депенденсиями
 */
class Container implements DIContainer {
  private static instance: Container;
  private _userRepository: IUserRepository | null = null;
  private _guestRepository: IGuestRepository | null = null;
  private _restaurantRepository: IRestaurantRepository | null = null;
  private _operationRepository: IOperationRepository | null = null;
  private _billingRepository: IBillingRepository | null = null;

  private constructor() {}

  /**
   * Получить синглтон экземпляр контейнера
   */
  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * User Repository getter
   */
  get userRepository(): IUserRepository {
    if (!this._userRepository) {
      this._userRepository = new HttpUserRepository();
    }
    return this._userRepository;
  }

  /**
   * Guest Repository getter
   */
  get guestRepository(): IGuestRepository {
    if (!this._guestRepository) {
      this._guestRepository = new HttpGuestRepository();
    }
    return this._guestRepository;
  }

  /**
   * Restaurant Repository getter
   */
  get restaurantRepository(): IRestaurantRepository {
    if (!this._restaurantRepository) {
      // TODO: реализовать HttpRestaurantRepository
      throw new Error('RestaurantRepository not implemented');
    }
    return this._restaurantRepository;
  }

  /**
   * Operation Repository getter
   */
  get operationRepository(): IOperationRepository {
    if (!this._operationRepository) {
      // TODO: реализовать HttpOperationRepository
      throw new Error('OperationRepository not implemented');
    }
    return this._operationRepository;
  }

  /**
   * Billing Repository getter
   */
  get billingRepository(): IBillingRepository {
    if (!this._billingRepository) {
      // TODO: реализовать HttpBillingRepository
      throw new Error('BillingRepository not implemented');
    }
    return this._billingRepository;
  }
}

// Настройка и экспорт контейнера
export const container = Container.getInstance();

// экспорт типа для TypeScript
export type { DIContainer };
