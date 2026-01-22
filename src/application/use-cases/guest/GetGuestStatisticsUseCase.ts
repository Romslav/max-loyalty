/**
 * GetGuestStatisticsUseCase - получение статистики гостя
 */

import type { IGuestRepository, IOperationRepository } from '../../../domain/repositories';
import { NotFoundError, ValidationError } from '../../errors';

export interface GuestStatistics {
  guestId: string;
  totalLoyaltyPoints: number;
  pointsEarned: number;
  pointsRedeemed: number;
  visitCount: number;
  averageSpend: number;
  totalSpend: number;
  joinDate: Date;
  lastVisit?: Date;
}

export interface GetGuestStatisticsRequest {
  guestId: string;
}

/**
 * Use Case: Получить статистику
 */
export class GetGuestStatisticsUseCase {
  constructor(
    private guestRepository: IGuestRepository,
    private operationRepository: IOperationRepository
  ) {}

  /**
   * Выполнить use case
   */
  async execute(request: GetGuestStatisticsRequest): Promise<GuestStatistics> {
    // Валидировать входные данные
    this.validateInput(request);

    // Получить гостя
    const guest = await this.guestRepository.findById(request.guestId);
    if (!guest) {
      throw NotFoundError.guestNotFound(request.guestId);
    }

    // TODO: Получить данные операций из базы
    // const operations = await this.operationRepository.getByGuestId(request.guestId);

    // TODO: Посчитать статистику
    // const earned = operations
    //   .filter((op) => op.type === 'earn')
    //   .reduce((sum, op) => sum + op.points, 0);

    return {
      guestId: guest.id,
      totalLoyaltyPoints: guest.loyaltyBalance,
      pointsEarned: 0, // TODO: Calculate from operations
      pointsRedeemed: 0, // TODO: Calculate from operations
      visitCount: 0, // TODO: Get from operations
      averageSpend: 0, // TODO: Calculate from operations
      totalSpend: 0, // TODO: Calculate from operations
      joinDate: guest.createdAt,
      lastVisit: guest.updatedAt,
    };
  }

  /**
   * Валидировать входные данные
   */
  private validateInput(request: GetGuestStatisticsRequest): void {
    if (!request.guestId) {
      throw ValidationError.missingField('guestId');
    }
  }
}
