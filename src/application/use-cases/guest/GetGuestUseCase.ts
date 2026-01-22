/**
 * GetGuestUseCase - получение информации о госте
 */

import type { IGuestRepository } from '../../../domain/repositories';
import type { Guest } from '../../../domain/entities';
import { NotFoundError, ValidationError } from '../../errors';

/**
 * Use Case: Получить гостя
 */
export class GetGuestUseCase {
  constructor(private guestRepository: IGuestRepository) {}

  /**
   * Выполнить use case
   */
  async execute(guestId: string): Promise<Guest> {
    this.validateInput(guestId);

    const guest = await this.guestRepository.findById(guestId);
    if (!guest) {
      throw NotFoundError.guestNotFound(guestId);
    }

    return guest;
  }

  /**
   * Валидировать входные данные
   */
  private validateInput(guestId: string): void {
    if (!guestId) {
      throw ValidationError.missingField('guestId');
    }
  }
}
