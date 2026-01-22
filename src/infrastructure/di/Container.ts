/**
 * DI Container - Dependency Injection Container
 * 
 * Централизованное место для всех зависимостей
 */

// Repositories
import { HttpUserRepository } from '../repositories/HttpUserRepository';
import { HttpGuestRepository } from '../repositories/HttpGuestRepository';

// Use Cases
import {
  // User Use Cases
  LoginUseCase,
  GetUserUseCase,
  RegisterUseCase,
  UpdateUserUseCase,
  // Guest Use Cases
  CreateGuestUseCase,
  GetGuestUseCase,
  EarnPointsUseCase,
  RedeemPointsUseCase,
  GetGuestStatisticsUseCase,
  // Operation Use Cases
  GetOperationHistoryUseCase,
} from '../../application';

// HTTP Client
import { HttpClient } from '../http/HttpClient';
import type { IOperationRepository } from '@/domain/repositories';

/**
 * Stub Implementation of IOperationRepository
 * TODO: Replace with actual HttpOperationRepository when backend ready
 */
class StubOperationRepository implements IOperationRepository {
  async create(_data: any): Promise<any> {
    console.warn('StubOperationRepository.create called - not implemented');
    return {};
  }

  async findById(_id: string): Promise<any> {
    console.warn('StubOperationRepository.findById called - not implemented');
    return null;
  }

  async findByGuestId(_guestId: string): Promise<any[]> {
    console.warn('StubOperationRepository.findByGuestId called - not implemented');
    return [];
  }

  async findByRestaurantId(_restaurantId: string): Promise<any[]> {
    console.warn('StubOperationRepository.findByRestaurantId called - not implemented');
    return [];
  }

  async update(_id: string, _data: any): Promise<any> {
    console.warn('StubOperationRepository.update called - not implemented');
    return {};
  }

  async delete(_id: string): Promise<void> {
    console.warn('StubOperationRepository.delete called - not implemented');
  }
}

/**
 * DI Container - Singleton instances
 */
class DIContainer {
  // HTTP Client
  private _httpClient: HttpClient | null = null;

  // Repositories
  private _userRepository: HttpUserRepository | null = null;
  private _guestRepository: HttpGuestRepository | null = null;
  private _operationRepository: IOperationRepository | null = null;

  // ========== User Use Cases ==========
  private _loginUseCase: LoginUseCase | null = null;
  private _getUserUseCase: GetUserUseCase | null = null;
  private _registerUseCase: RegisterUseCase | null = null;
  private _updateUserUseCase: UpdateUserUseCase | null = null;

  // ========== Guest Use Cases ==========
  private _createGuestUseCase: CreateGuestUseCase | null = null;
  private _getGuestUseCase: GetGuestUseCase | null = null;
  private _earnPointsUseCase: EarnPointsUseCase | null = null;
  private _redeemPointsUseCase: RedeemPointsUseCase | null = null;
  private _getGuestStatisticsUseCase: GetGuestStatisticsUseCase | null = null;

  // ========== Operation Use Cases ==========
  private _getOperationHistoryUseCase: GetOperationHistoryUseCase | null = null;

  /**
   * Получить HTTP Client
   */
  get httpClient(): HttpClient {
    if (!this._httpClient) {
      this._httpClient = new HttpClient();
    }
    return this._httpClient;
  }

  /**
   * Получить User Repository
   */
  get userRepository(): HttpUserRepository {
    if (!this._userRepository) {
      this._userRepository = new HttpUserRepository(this.httpClient);
    }
    return this._userRepository;
  }

  /**
   * Получить Guest Repository
   */
  get guestRepository(): HttpGuestRepository {
    if (!this._guestRepository) {
      this._guestRepository = new HttpGuestRepository(this.httpClient);
    }
    return this._guestRepository;
  }

  /**
   * Получить Operation Repository
   * TODO: Replace with HttpOperationRepository when available
   */
  get operationRepository(): IOperationRepository {
    if (!this._operationRepository) {
      this._operationRepository = new StubOperationRepository();
    }
    return this._operationRepository;
  }

  // ============================================================================
  // USER USE CASES
  // ============================================================================

  /**
   * Получить LoginUseCase
   */
  get loginUseCase(): LoginUseCase {
    if (!this._loginUseCase) {
      this._loginUseCase = new LoginUseCase(this.userRepository);
    }
    return this._loginUseCase;
  }

  /**
   * Получить GetUserUseCase
   */
  get getUserUseCase(): GetUserUseCase {
    if (!this._getUserUseCase) {
      this._getUserUseCase = new GetUserUseCase(this.userRepository);
    }
    return this._getUserUseCase;
  }

  /**
   * Получить RegisterUseCase
   */
  get registerUseCase(): RegisterUseCase {
    if (!this._registerUseCase) {
      this._registerUseCase = new RegisterUseCase(this.userRepository);
    }
    return this._registerUseCase;
  }

  /**
   * Получить UpdateUserUseCase
   */
  get updateUserUseCase(): UpdateUserUseCase {
    if (!this._updateUserUseCase) {
      this._updateUserUseCase = new UpdateUserUseCase(this.userRepository);
    }
    return this._updateUserUseCase;
  }

  // ============================================================================
  // GUEST USE CASES
  // ============================================================================

  /**
   * Получить CreateGuestUseCase
   */
  get createGuestUseCase(): CreateGuestUseCase {
    if (!this._createGuestUseCase) {
      this._createGuestUseCase = new CreateGuestUseCase(this.guestRepository);
    }
    return this._createGuestUseCase;
  }

  /**
   * Получить GetGuestUseCase
   */
  get getGuestUseCase(): GetGuestUseCase {
    if (!this._getGuestUseCase) {
      this._getGuestUseCase = new GetGuestUseCase(this.guestRepository);
    }
    return this._getGuestUseCase;
  }

  /**
   * Получить EarnPointsUseCase
   */
  get earnPointsUseCase(): EarnPointsUseCase {
    if (!this._earnPointsUseCase) {
      this._earnPointsUseCase = new EarnPointsUseCase(
        this.guestRepository,
        this.operationRepository
      );
    }
    return this._earnPointsUseCase;
  }

  /**
   * Получить RedeemPointsUseCase
   */
  get redeemPointsUseCase(): RedeemPointsUseCase {
    if (!this._redeemPointsUseCase) {
      this._redeemPointsUseCase = new RedeemPointsUseCase(
        this.guestRepository,
        this.operationRepository
      );
    }
    return this._redeemPointsUseCase;
  }

  /**
   * Получить GetGuestStatisticsUseCase
   */
  get getGuestStatisticsUseCase(): GetGuestStatisticsUseCase {
    if (!this._getGuestStatisticsUseCase) {
      this._getGuestStatisticsUseCase = new GetGuestStatisticsUseCase(
        this.guestRepository,
        this.operationRepository
      );
    }
    return this._getGuestStatisticsUseCase;
  }

  // ============================================================================
  // OPERATION USE CASES
  // ============================================================================

  /**
   * Получить GetOperationHistoryUseCase
   */
  get getOperationHistoryUseCase(): GetOperationHistoryUseCase {
    if (!this._getOperationHistoryUseCase) {
      this._getOperationHistoryUseCase = new GetOperationHistoryUseCase(
        this.operationRepository
      );
    }
    return this._getOperationHistoryUseCase;
  }
}

/**
 * Глобальный singleton инстанция container
 */
export const container = new DIContainer();
