/**
 * GetUserUseCase - получение информации о пользователе
 */

import type { IUserRepository } from '../../../domain/repositories';
import type { User } from '../../../domain/entities';
import { NotFoundError, ValidationError } from '../../errors';

/**
 * Use Case: Получить всю информацию о пользователе
 */
export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Выполнить use case
   */
  async execute(userId: string): Promise<User> {
    this.validateInput(userId);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw NotFoundError.userNotFound(userId);
    }

    return user;
  }

  /**
   * Валидировать входные данные
   */
  private validateInput(userId: string): void {
    if (!userId) {
      throw ValidationError.missingField('userId');
    }
  }
}
