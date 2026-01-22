/**
 * LoginUseCase - вход пользователя в систему
 */

import type { IUserRepository } from '../../../domain/repositories';
import type { User, AuthToken } from '../../../domain/entities';
import { AuthenticationError, ValidationError } from '../../errors';
import { validateEmail } from '../../validators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Use Case: Вход пользователя
 */
export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Выполнить use case
   */
  async execute(request: LoginRequest): Promise<LoginResponse> {
    // Валидировать входные данные
    this.validateInput(request);

    // Поиск пользователя по email
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw AuthenticationError.invalidCredentials();
    }

    // Проверить активность
    if (!user.isActive) {
      throw AuthenticationError.userInactive();
    }

    // TODO: За сейчас не верифицируем password
    // Она верифицируется на бэкэнде
    // Нужно доабавить AuthService

    // Генерировать JWT токены
    // TODO: Нужно реализовать AuthService
    const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIn0.mock';
    const mockRefreshToken = 'refresh_token_mock';

    return {
      user,
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      expiresIn: 3600, // 1 час
    };
  }

  /**
   * Валидировать входные данные
   */
  private validateInput(request: LoginRequest): void {
    if (!request.email) {
      throw ValidationError.missingField('email');
    }

    if (!request.password) {
      throw ValidationError.missingField('password');
    }

    validateEmail(request.email);
  }
}
