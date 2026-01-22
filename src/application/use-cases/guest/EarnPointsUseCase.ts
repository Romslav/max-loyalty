/**
 * EarnPointsUseCase - заработка баллов гостом
 */

import type { IGuestRepository, IOperationRepository } from '../../../domain/repositories';
import type { Guest } from '../../../domain/entities';
import { NotFoundError, ValidationError, BusinessLogicError } from '../../errors';

export interface EarnPointsRequest {
  guestId: string;
  points: number;
  reason?: string;
  transactionId?: string;
}

export interface EarnPointsResponse {
  guest: Guest;
  pointsEarned: number;
  totalPoints: number;
  message: string;
}

/**
 * Use Case: Заработать баллы
 */
export class EarnPointsUseCase {
  constructor(
    private guestRepository: IGuestRepository,
    private operationRepository: IOperationRepository
  ) {}

  /**
   * Выполнить use case
   */
  async execute(request: EarnPointsRequest): Promise<EarnPointsResponse> {
    // Валидировать входные данные
    this.validateInput(request);

    // Получить гостя
    const guest = await this.guestRepository.findById(request.guestId);
    if (!guest) {
      throw NotFoundError.guestNotFound(request.guestId);
    }

    // Обновить баллы
    const previousBalance = guest.loyaltyBalance;
    guest.loyaltyBalance += request.points;

    // TODO: Отправить данные на бэкэнд
    // await this.guestRepository.update(guest);

    // TODO: Сохранить операцию
    // const operation = await this.operationRepository.create({
    //   guestId: request.guestId,
    //   type: 'earn',
    //   points: request.points,
    //   reason: request.reason,
    //   transactionId: request.transactionId,
    //   timestamp: new Date(),
    // });

    return {
      guest,
      pointsEarned: request.points,
      totalPoints: guest.loyaltyBalance,
      message: `Guest earned ${request.points} points. Total balance: ${guest.loyaltyBalance}`,
    };
  }

  /**
   * Валидировать входные данные
   */
  private validateInput(request: EarnPointsRequest): void {
    if (!request.guestId) {
      throw ValidationError.missingField('guestId');
    }

    if (!request.points || request.points <= 0) {
      throw ValidationError.invalidInput('Points must be greater than 0', 'points');
    }
  }
}
