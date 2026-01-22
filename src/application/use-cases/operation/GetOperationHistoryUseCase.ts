/**
 * GetOperationHistoryUseCase - получение истории операций
 */

import type { IOperationRepository } from '../../../domain/repositories';
import type { Operation } from '../../../domain/entities';
import { ValidationError } from '../../errors';

export interface GetOperationHistoryRequest {
  guestId?: string;
  limit?: number;
  offset?: number;
}

export interface GetOperationHistoryResponse {
  operations: Operation[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Use Case: Получить историю операций
 */
export class GetOperationHistoryUseCase {
  constructor(private operationRepository: IOperationRepository) {}

  /**
   * Выполнить use case
   */
  async execute(request: GetOperationHistoryRequest): Promise<GetOperationHistoryResponse> {
    // Валидировать входные данные
    this.validateInput(request);

    const limit = request.limit || 20;
    const offset = request.offset || 0;

    // TODO: Поиск операций в базе
    // let operations: Operation[] = [];
    // let total: number = 0;

    // if (request.guestId) {
    //   operations = await this.operationRepository.getByGuestId(
    //     request.guestId,
    //     limit,
    //     offset
    //   );
    //   total = await this.operationRepository.countByGuestId(request.guestId);
    // } else {
    //   operations = await this.operationRepository.findAll(limit, offset);
    //   total = await this.operationRepository.count();
    // }

    return {
      operations: [],
      total: 0,
      limit,
      offset,
    };
  }

  /**
   * Валидировать входные данные
   */
  private validateInput(request: GetOperationHistoryRequest): void {
    if (request.limit && request.limit <= 0) {
      throw ValidationError.invalidInput('Limit must be greater than 0', 'limit');
    }

    if (request.offset && request.offset < 0) {
      throw ValidationError.invalidInput('Offset must be greater than or equal to 0', 'offset');
    }
  }
}
