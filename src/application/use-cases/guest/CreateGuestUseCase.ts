/**
 * CreateGuestUseCase - создание нового гостя в программе лояльности
 */

import type { IGuestRepository } from '../../../domain/repositories';
import type { Guest, CreateGuestInput } from '../../../domain/entities';
import { BusinessLogicError } from '../../errors';
import { validateCreateGuestInput, normalizeCreateGuestInput } from '../../validators';

/**
 * Use Case: Создать нового гостя
 */
export class CreateGuestUseCase {
  constructor(private guestRepository: IGuestRepository) {}

  /**
   * Выполнить use case
   */
  async execute(input: CreateGuestInput): Promise<Guest> {
    // Валидировать входные данные
    validateCreateGuestInput(input);

    // Нормализировать
    const normalizedInput = normalizeCreateGuestInput(input);

    // Проверить, не существует ли уже гость с таким email
    const existingGuest = await this.guestRepository.findByEmail(normalizedInput.email);
    if (existingGuest) {
      throw BusinessLogicError.alreadyExists('Guest', normalizedInput.email);
    }

    // Создать гостя
    const newGuest = await this.guestRepository.create(normalizedInput);

    return newGuest;
  }
}
