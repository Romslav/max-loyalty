/**
 * RedeemPointsUseCase - трата баллов гостом
 */

import type { IGuestRepository, IOperationRepository } from '../../../domain/repositories';
import type { Guest } from '../../../domain/entities';
import { NotFoundError, ValidationError, BusinessLogicError } from '../../errors';

export interface RedeemPointsRequest {
  guestId: string;
  points: number;
  rewardType: string;
  rewardDescription?: string;
}

export interface RedeemPointsResponse {
  guest: Guest;
  pointsRedeemed: number;
  remainingPoints: number;
  message: string;
}

/**
 * Use Case: Потратить баллы
 */
export class RedeemPointsUseCase {
  constructor(
    private guestRepository: IGuestRepository,
    private operationRepository: IOperationRepository
  ) {}

  /**
   * Выполнить use case
   */
  async execute(request: RedeemPointsRequest): Promise<RedeemPointsResponse> {
    // Валидировать входные данные
    this.validateInput(request);

    // Получить гостя
    const guest = await this.guestRepository.findById(request.guestId);
    if (!guest) {
      throw NotFoundError.guestNotFound(request.guestId);
    }

    // Проверить достаточно ли баллов
    if (guest.loyaltyBalance < request.points) {
      throw BusinessLogicError.insufficientPoints(
        request.points,
        guest.loyaltyBalance
      );
    }

    // Нючить баллы
    const previousBalance = guest.loyaltyBalance;
    guest.loyaltyBalance -= request.points;

    // TODO: Отправить данные на бэкэнд
    // await this.guestRepository.update(guest);

    // TODO: Сохранить операцию
    // const operation = await this.operationRepository.create({
    //   guestId: request.guestId,
    //   type: 'redeem',
    //   points: request.points,
    //   rewardType: request.rewardType,
    //   rewardDescription: request.rewardDescription,
    //   timestamp: new Date(),
    // });

    return {
      guest,
      pointsRedeemed: request.points,
      remainingPoints: guest.loyaltyBalance,
      message: `Guest redeemed ${request.points} points for ${request.rewardType}. Remaining balance: ${guest.loyaltyBalance}`,
    };
  }

  /**
   * Валидировать входные данные
   */
  private validateInput(request: RedeemPointsRequest): void {
    if (!request.guestId) {
      throw ValidationError.missingField('guestId');
    }

    if (!request.points || request.points <= 0) {
      throw ValidationError.invalidInput('Points must be greater than 0', 'points');
    }

    if (!request.rewardType) {
      throw ValidationError.missingField('rewardType');
    }
  }
}
