/**
 * CreatePromotionUseCase
 * 
 * Use case for creating new promotional campaigns.
 * Handles validation, code generation, and storage.
 */

import { Promotion, type PromotionType, type DiscountTarget, type DiscountConfig, type PromotionRestrictions } from '../../../domain/entities/promotion/Promotion'
import { ValidationError, OperationFailedError } from '../../errors/PointsErrors'

/**
 * Create promotion input DTO
 */
export interface CreatePromotionInput {
  name: string
  description: string
  type: PromotionType
  discountConfig: DiscountConfig
  discountTarget: DiscountTarget
  startDate: Date
  endDate: Date
  numCodes?: number
  restrictions?: PromotionRestrictions
}

/**
 * Create promotion output DTO
 */
export interface CreatePromotionOutput {
  id: string
  name: string
  description: string
  type: PromotionType
  status: 'draft'
  promoCodes: string[]
  startDate: Date
  endDate: Date
}

/**
 * Create Promotion Use Case
 */
export class CreatePromotionUseCase {
  constructor() {}

  /**
   * Execute the use case
   * @param input Input parameters
   * @returns Created promotion
   * @throws ValidationError if input is invalid
   * @throws OperationFailedError if creation fails
   */
  async execute(input: CreatePromotionInput): Promise<CreatePromotionOutput> {
    // Step 1: Validate input
    this.validateInput(input)

    // Step 2: Validate dates
    if (input.startDate >= input.endDate) {
      throw new ValidationError({
        endDate: 'End date must be after start date',
      })
    }

    // Step 3: Validate discount config
    this.validateDiscountConfig(input.discountConfig)

    // Step 4: Generate promotion ID
    const promotionId = this.generatePromotionId()

    // Step 5: Generate promo codes
    const numCodes = input.numCodes || 100
    const promoCodes = this.generatePromoCodes(numCodes)

    // Step 6: Create promotion entity
    const promotion = new Promotion(
      promotionId,
      input.name,
      input.description,
      input.type,
      'draft',
      input.discountConfig,
      input.discountTarget,
      promoCodes.map((code) => ({
        code,
        used: 0,
        maxUses: undefined,
        status: 'active' as const,
      })),
      input.startDate,
      input.endDate,
      input.restrictions,
    )

    // Step 7: Return output
    return this.mapToOutput(promotion)
  }

  /**
   * Validate input
   */
  private validateInput(input: CreatePromotionInput): void {
    const errors: Record<string, string> = {}

    // Validate name
    if (!input.name || input.name.trim().length === 0) {
      errors.name = 'Promotion name is required'
    } else if (input.name.length > 100) {
      errors.name = 'Promotion name must not exceed 100 characters'
    }

    // Validate description
    if (!input.description || input.description.trim().length === 0) {
      errors.description = 'Promotion description is required'
    } else if (input.description.length > 500) {
      errors.description = 'Promotion description must not exceed 500 characters'
    }

    // Validate type
    const validTypes: PromotionType[] = ['percentage', 'fixed', 'tiered', 'buy_x_get_y', 'birthday']
    if (!validTypes.includes(input.type)) {
      errors.type = `Promotion type must be one of: ${validTypes.join(', ')}`
    }

    // Validate discount target
    const validTargets: DiscountTarget[] = ['points', 'price', 'membership']
    if (!validTargets.includes(input.discountTarget)) {
      errors.discountTarget = `Discount target must be one of: ${validTargets.join(', ')}`
    }

    // Validate dates
    if (!input.startDate) {
      errors.startDate = 'Start date is required'
    }
    if (!input.endDate) {
      errors.endDate = 'End date is required'
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors)
    }
  }

  /**
   * Validate discount config
   */
  private validateDiscountConfig(config: DiscountConfig): void {
    const errors: Record<string, string> = {}

    // Validate type
    if (!['percentage', 'fixed'].includes(config.type)) {
      errors.type = 'Discount type must be percentage or fixed'
    }

    // Validate value
    if (config.value <= 0) {
      errors.value = 'Discount value must be greater than 0'
    }

    if (config.type === 'percentage' && config.value > 100) {
      errors.value = 'Percentage discount must not exceed 100'
    }

    if (config.minAmount && config.minAmount < 0) {
      errors.minAmount = 'Minimum amount must not be negative'
    }

    if (config.maxDiscount && config.maxDiscount < 0) {
      errors.maxDiscount = 'Maximum discount must not be negative'
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors)
    }
  }

  /**
   * Generate unique promotion ID
   */
  private generatePromotionId(): string {
    return `promo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Generate unique promo codes
   */
  private generatePromoCodes(count: number): string[] {
    const codes: Set<string> = new Set()
    const timestamp = Math.floor(Date.now() / 1000)
      .toString(36)
      .toUpperCase()

    while (codes.size < count) {
      const random = Math.random().toString(36).substr(2, 6).toUpperCase()
      const code = `${timestamp}${random}`
      codes.add(code)
    }

    return Array.from(codes)
  }

  /**
   * Map entity to output DTO
   */
  private mapToOutput(promotion: Promotion): CreatePromotionOutput {
    return {
      id: promotion.id,
      name: promotion.name,
      description: promotion.description,
      type: promotion.type,
      status: 'draft',
      promoCodes: promotion.promoCodes.map((pc) => pc.code),
      startDate: promotion.startDate,
      endDate: promotion.endDate,
    }
  }
}
