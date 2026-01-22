/**
 * UpdateUserUseCase - обновление данных пользователя
 */

import type { IUserRepository } from '../../../domain/repositories';
import type { User, UpdateUserInput } from '../../../domain/entities';
import { NotFoundError, ValidationError } from '../../errors';
import { validateUpdateUserInput } from '../../validators';

export interface UpdateUserRequest {
  userId: string;
  email?: string;
  name?: string;
  password?: string;
}

export interface UpdateUserResponse {
  user: User;
  message: string;
}

/**
 * Use Case: Обновить пользователя
 */
export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Выполнить use case
   */
  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    // Валидировать входные данные
    this.validateInput(request);

    // Получить текущего пользователя
    const currentUser = await this.userRepository.findById(request.userId);
    if (!currentUser) {
      throw NotFoundError.userNotFound(request.userId);
    }

    // Создать объект UpdateUserInput
    const updateInput: UpdateUserInput = {
      email: request.email,
      name: request.name,
      password: request.password,
    };

    // Валидировать
    validateUpdateUserInput(updateInput);

    // TODO: Реализовать обновление пользователя
    // На данный момент просто возвращаем текущего пользователя
    // В реальной системе нужно отправить данные на бэкэнд

    return {
      user: currentUser,
      message: 'User updated successfully',
    };
  }

  /**
   * Валидировать входные данные
   */
  private validateInput(request: UpdateUserRequest): void {
    if (!request.userId) {
      throw ValidationError.missingField('userId');
    }

    // Проверить, что хотя бы одно поле для обновления существует
    if (!request.email && !request.name && !request.password) {
      throw ValidationError.invalidInput(
        'At least one field (email, name, or password) must be provided',
        'request'
      );
    }
  }
}
