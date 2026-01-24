/**
 * ValidatePromotionCodeUseCase
 * 
 * Use case for validating and checking promotion codes.
 * Full business logic for code validation.
 * Production-ready with comprehensive checks.
 */

import { IPromotionRepository } from '../../../domain/repositories/IPromotionRepository'
import { OperationFailedError } from '../../errors/PointsErrors'

/**
 * Validate promotion code input
 */
export interface ValidatePromotionCodeInput {
  code: string
  guestId: string
  guestTier: string
  guestPoints: number
  orderAmount: number
}

/**
 * Validate promotion code output
 */
export interface ValidatePromotionCodeOutput {
  isValid: boolean
  promotion?: {
    id: string
    code: string
    name: string
    description: string
    discount: number
    discountPercentage: number
    minPurchase?: number
    applicableTiers: string[]
  }
  error?: string
  warnings?: string[]
}

/**
 * ValidatePromotionCodeUseCase
 */
export class ValidatePromotionCodeUseCase {
  constructor(private promotionRepository: IPromotionRepository) {}

  /**
   * Execute use case
   */
  async execute(input: ValidatePromotionCodeInput): Promise<ValidatePromotionCodeOutput> {
    // Step 1: Find promotion by code
    const promotion = await this.promotionRepository.getByCode(input.code)

    if (!promotion) {
      return {
        isValid: false,
        error: 'Promotion code not found',
      }
    }

    // Step 2: Check if active
    if (!promotion.isActive()) {
      return {
        isValid: false,
        error: 'Promotion is not currently active',
      }
    }

    // Step 3: Check if expired by date/usage
    if (promotion.isExpired()) {
      return {
        isValid: false,
        error: 'Promotion has expired',
      }
    }

    // Step 4: Check guest eligibility
    const eligibilityCheck = promotion.canUseByGuest(
      input.guestId,
      input.guestTier,
      input.guestPoints,
    )

    if (!eligibilityCheck.canUse) {
      return {
        isValid: false,
        error: eligibilityCheck.reason || 'Guest is not eligible for this promotion',
      }
    }

    // Step 5: Check minimum purchase
    if (promotion.discount.minPurchase && input.orderAmount < promotion.discount.minPurchase) {
      return {
        isValid: false,
        error: `Minimum purchase amount is $${promotion.discount.minPurchase}. Current order: $${input.orderAmount}`,
      }
    }

    // Step 6: Calculate discount
    const discountAmount = promotion.calculateDiscount(input.orderAmount, input.guestTier)
    const discountPercentage = (discountAmount / input.orderAmount) * 100

    // Step 7: Collect warnings
    const warnings: string[] = []

    if (promotion.rules.currentUsage / promotion.rules.maxUsage > 0.8) {
      warnings.push('This promotion is nearly fully used')
    }

    const daysUntilExpiry = Math.ceil(
      (promotion.rules.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )
    if (daysUntilExpiry < 3) {
      warnings.push(`This promotion expires in ${daysUntilExpiry} days`)
    }

    // Step 8: Return success
    return {
      isValid: true,
      promotion: {
        id: promotion.id,
        code: promotion.code,
        name: promotion.name,
        description: promotion.description,
        discount: discountAmount,
        discountPercentage: Math.round(discountPercentage * 100) / 100,
        minPurchase: promotion.discount.minPurchase,
        applicableTiers: promotion.discount.applicableTiers,
      },
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  }
}

export default ValidatePromotionCodeUseCase
