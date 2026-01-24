/**
 * UpdatePromotionUseCase
 * 
 * Use case for updating existing promotional campaigns.
 * Handles partial updates and status changes.
 */

import { ValidationError } from '../../errors/PointsErrors'

/**
 * Update promotion input DTO
 */
export interface UpdatePromotionInput {
  promotionId: string
  name?: string
  description?: string
  status?: 'draft' | 'active' | 'paused' | 'ended' | 'archived'
  endDate?: Date
  maxCodes?: number
}

/**
 * Update promotion output DTO
 */
export interface UpdatePromotionOutput {
  id: string
  name: string
  description: string
  status: string
  message: string
}

/**
 * Update Promotion Use Case
 */
export class UpdatePromotionUseCase {
  constructor() {}

  /**
   * Execute the use case
   * @param input Input parameters
   * @returns Updated promotion
   * @throws ValidationError if input is invalid
   */
  async execute(input: UpdatePromotionInput): Promise<UpdatePromotionOutput> {
    // Step 1: Validate input
    this.validateInput(input)

    // Step 2: Check if promotion exists (simulate)
    if (!this.promotionExists(input.promotionId)) {
      throw new ValidationError({
        promotionId: 'Кампания не найдена',
      })
    }

    // Step 3: Validate updates
    if (input.name !== undefined) {
      this.validateName(input.name)
    }
    if (input.description !== undefined) {
      this.validateDescription(input.description)
    }
    if (input.status !== undefined) {
      this.validateStatus(input.status)
    }
    if (input.endDate !== undefined) {
      this.validateEndDate(input.endDate)
    }

    // Step 4: Apply updates (simulate)
    const updated = this.applyUpdates(input)

    // Step 5: Return output
    return {
      id: input.promotionId,
      name: input.name || updated.name,
      description: input.description || updated.description,
      status: input.status || updated.status,
      message: '✅ Кампания успешно обновлена',
    }
  }

  /**
   * Validate input
   */
  private validateInput(input: UpdatePromotionInput): void {
    const errors: Record<string, string> = {}

    if (!input.promotionId) {
      errors.promotionId = 'ID кампании обязателен'
    }

    if (!input.name && !input.description && !input.status && !input.endDate && !input.maxCodes) {
      errors.update = 'Требуется указать хотя бы один параметр для обновления'
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors)
    }
  }

  /**
   * Validate name
   */
  private validateName(name: string): void {
    const errors: Record<string, string> = {}

    if (!name.trim()) {
      errors.name = 'Название не может быть пусто'
    } else if (name.length > 100) {
      errors.name = 'Название не должно превышать 100 символов'
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors)
    }
  }

  /**
   * Validate description
   */
  private validateDescription(description: string): void {
    const errors: Record<string, string> = {}

    if (!description.trim()) {
      errors.description = 'Описание не может быть пусто'
    } else if (description.length > 500) {
      errors.description = 'Описание не должно превышать 500 символов'
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors)
    }
  }

  /**
   * Validate status
   */
  private validateStatus(status: string): void {
    const validStatuses = ['draft', 'active', 'paused', 'ended', 'archived']
    if (!validStatuses.includes(status)) {
      throw new ValidationError({
        status: `Статус должен быть одним из: ${validStatuses.join(', ')}`,
      })
    }
  }

  /**
   * Validate end date
   */
  private validateEndDate(endDate: Date): void {
    if (endDate < new Date()) {
      throw new ValidationError({
        endDate: 'Дата окончания не может быть в прошлом',
      })
    }
  }

  /**
   * Check if promotion exists
   */
  private promotionExists(promotionId: string): boolean {
    // Simulate database lookup
    const validIds = ['promo_1', 'promo_2', 'promo_3']
    return validIds.includes(promotionId)
  }

  /**
   * Apply updates (simulate)
   */
  private applyUpdates(
    input: UpdatePromotionInput,
  ): { name: string; description: string; status: string } {
    // Simulate fetching and updating
    return {
      name: 'Summer Sale',
      description: 'Summer promotion',
      status: 'active',
    }
  }
}
