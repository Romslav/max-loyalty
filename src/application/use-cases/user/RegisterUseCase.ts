/**
 * RegisterUseCase - регистрация нового пользователя
 */

import type { IUserRepository } from '../../../domain/repositories';
import type { User, CreateUserInput } from '../../../domain/entities';
import { BusinessLogicError, ValidationError } from '../../errors';
import { validateCreateUserInput, normalizeCreateUserInput } from '../../validators';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'restaurant' | 'cashier' | 'guest';
  restaurantId?: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

/**
 * Use Case: Зарегистрировать нового пользователя
 */
export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Выполнить use case
   */
  async execute(request: RegisterRequest): Promise<RegisterResponse> {
    // Валидировать входные данные
    this.validateInput(request);

    // Создать объект CreateUserInput
    const createInput: CreateUserInput = {
      email: request.email,
      password: request.password,
      name: request.name,
      role: request.role || 'guest',
      restaurantId: request.restaurantId,
    };

    // Валидировать
    validateCreateUserInput(createInput);

    // Нормализировать
    const normalizedInput = normalizeCreateUserInput(createInput);

    // Проверить, не существует ли пользователь с такой почтой
    const existingUser = await this.userRepository.findByEmail(normalizedInput.email);
    if (existingUser) {
      throw BusinessLogicError.alreadyExists('User', normalizedInput.email);
    }

    // Создать пользователя
    const newUser = await this.userRepository.create(normalizedInput);

    return {
      user: newUser,
      message: `User registered successfully with role: ${newUser.role}`,
    };
  }

  /**
   * Валидировать входные данные
   */
  private validateInput(request: RegisterRequest): void {
    if (!request.email) {
      throw ValidationError.missingField('email');
    }

    if (!request.password) {
      throw ValidationError.missingField('password');
    }

    if (!request.name) {
      throw ValidationError.missingField('name');
    }
  }
}
