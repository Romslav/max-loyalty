/**
 * DI Container - Dependency Injection Container
 * 
 * Определяет все зависимости для депенденси инжекшн
 */

// Repositories
import { HttpUserRepository } from '../repositories/HttpUserRepository';
import { HttpGuestRepository } from '../repositories/HttpGuestRepository';

// Use Cases
import {
  LoginUseCase,
  GetUserUseCase,
  CreateGuestUseCase,
  GetGuestUseCase,
} from '../../application';

// HTTP Client
import { HttpClient } from '../http/HttpClient';

/**
 * DI Container - Singleton instances
 */
class DIContainer {
  // HTTP Client
  private _httpClient: HttpClient | null = null;

  // Repositories
  private _userRepository: HttpUserRepository | null = null;
  private _guestRepository: HttpGuestRepository | null = null;

  // Use Cases
  private _loginUseCase: LoginUseCase | null = null;
  private _getUserUseCase: GetUserUseCase | null = null;
  private _createGuestUseCase: CreateGuestUseCase | null = null;
  private _getGuestUseCase: GetGuestUseCase | null = null;

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

  // ============================================================================
  // USE CASES
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
}

/**
 * глобальный singleton инстанциа container
 */
export const container = new DIContainer();
