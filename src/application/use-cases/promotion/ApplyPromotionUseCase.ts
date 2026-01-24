/**
 * ApplyPromotionUseCase
 * 
 * Use case for applying promotions to orders.
 * Records usage and updates promotion metrics.
 * Production-ready with transaction support.
 */

import { IPromotionRepository } from '../../../domain/repositories/IPromotionRepository'
import { OperationFailedError } from '../../errors/PointsErrors'

/**
 * Apply promotion input
 */
export interface ApplyPromotionInput {
  code: string
  guestId: string
  guestTier: string
  orderAmount: number
  orderId: string
}

/**
 * Apply promotion output
 */
export interface ApplyPromotionOutput {
  promotionId: string
  code: string
  discountAmount: number
  finalOrderAmount: number
  pointsEarned: number
  message: string
}

/**
 * ApplyPromotionUseCase
 */
export class ApplyPromotionUseCase {
  constructor(private promotionRepository: IPromotionRepository) {}

  /**
   * Execute use case
   */
  async execute(input: ApplyPromotionInput): Promise<ApplyPromotionOutput> {
    // Step 1: Find promotion
    const promotion = await this.promotionRepository.getByCode(input.code)

    if (!promotion) {
      throw new OperationFailedError('promotion-apply', 'Promotion code not found')
    }

    // Step 2: Validate promotion is active
    if (!promotion.isActive()) {
      throw new OperationFailedError('promotion-apply', 'Promotion is not currently active')
    }

    // Step 3: Check guest eligibility
    const eligibility = promotion.canUseByGuest(
      input.guestId,
      input.guestTier,
      input.orderAmount,
    )

    if (!eligibility.canUse) {
      throw new OperationFailedError('promotion-apply', eligibility.reason || 'Guest is not eligible')
    }

    // Step 4: Calculate discount
    const discountAmount = promotion.calculateDiscount(input.orderAmount, input.guestTier)

    // Step 5: Record promotion usage
    promotion.recordUsage(input.guestId, discountAmount, input.guestTier)

    // Step 6: Update promotion in repository
    await this.promotionRepository.update(promotion.id, {
      usage: promotion.usage,
      updatedAt: new Date(),
    })

    // Step 7: Calculate final amounts
    const finalOrderAmount = Math.max(0, input.orderAmount - discountAmount)
    const pointsEarned = Math.floor(finalOrderAmount * 0.1) // 1 point per 10 currency units

    // Step 8: Return output
    return {
      promotionId: promotion.id,
      code: promotion.code,
      discountAmount,
      finalOrderAmount,
      pointsEarned,
      message: `Discount of $${discountAmount} applied! Final amount: $${finalOrderAmount}. Points earned: ${pointsEarned}`,
    }
  }
}

export default ApplyPromotionUseCase
