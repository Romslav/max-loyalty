/**
 * CreatePromotionUseCase
 * 
 * Use case for creating new promotions.
 * Validates all promotion data and generates codes.
 * Production-ready with error handling.
 */

import { v4 as uuidv4 } from 'uuid'
import { Promotion, PromotionType, PromotionStatus, DiscountConfig, PromotionRules } from '../../../domain/entities/promotion/Promotion'
import { IPromotionRepository } from '../../../domain/repositories/IPromotionRepository'
import { ValidationError, OperationFailedError } from '../../errors/PointsErrors'

/**
 * Create promotion input DTO
 */
export interface CreatePromotionInput {
  name: string
  description: string
  code?: string // Auto-generate if not provided
  discountType: PromotionType
  discountValue: number
  maxDiscount?: number
  minPurchase?: number
  maxUsesPerGuest?: number
  applicableTiers: string[]
  startDate: Date
  endDate: Date
  maxUsage: number
  scope: 'single_use' | 'per_guest' | 'unlimited'
  requiresBirthday?: boolean
  requiresReferral?: boolean
  excludedCategories?: string[]
  applicableMenuItems?: string[]
  createdBy: string
}

/**
 * Create promotion output DTO
 */
export interface CreatePromotionOutput {
  id: string
  code: string
  name: string
  description: string
  discountType: PromotionType
  discountValue: number
  startDate: Date
  endDate: Date
  status: PromotionStatus
  createdAt: Date
}

/**
 * CreatePromotionUseCase
 */
export class CreatePromotionUseCase {
  constructor(private promotionRepository: IPromotionRepository) {}

  /**
   * Execute use case
   */
  async execute(input: CreatePromotionInput): Promise<CreatePromotionOutput> {
    // Step 1: Validate input
    this.validateInput(input)

    // Step 2: Generate or validate code
    let code = input.code
    if (!code) {
      code = this.generateCode()
    }

    // Check if code already exists
    const existingPromotion = await this.promotionRepository.getByCode(code)
    if (existingPromotion) {
      throw new OperationFailedError(
        'promotion-creation',
        `Promotion code "${code}" already exists`,
      )
    }

    // Step 3: Create promotion object
    const now = new Date()
    const promotion = new Promotion(
      uuidv4(),
      code,
      input.name,
      input.description,
      {
        type: input.discountType,
        value: input.discountValue,
        maxDiscount: input.maxDiscount,
        minPurchase: input.minPurchase,
        maxUsesPerGuest: input.maxUsesPerGuest,
        applicableTiers: input.applicableTiers as any,
      } as DiscountConfig,
      {
        scope: input.scope as any,
        startDate: input.startDate,
        endDate: input.endDate,
        maxUsage: input.maxUsage,
        currentUsage: 0,
        requiresBirthday: input.requiresBirthday,
        requiresReferral: input.requiresReferral,
        excludedCategories: input.excludedCategories,
        applicableMenuItems: input.applicableMenuItems,
      } as PromotionRules,
      PromotionStatus.DRAFT,
      {
        totalUsages: 0,
        totalDiscountAmount: 0,
        averageOrderValue: 0,
        uniqueGuestsUsed: new Set(),
        usagesByTier: {},
      },
      now,
      now,
      input.createdBy,
    )

    // Step 4: Persist promotion
    const savedPromotion = await this.promotionRepository.create(promotion)

    // Step 5: Return output
    return {
      id: savedPromotion.id,
      code: savedPromotion.code,
      name: savedPromotion.name,
      description: savedPromotion.description,
      discountType: savedPromotion.discount.type,
      discountValue: savedPromotion.discount.value,
      startDate: savedPromotion.rules.startDate,
      endDate: savedPromotion.rules.endDate,
      status: savedPromotion.status,
      createdAt: savedPromotion.createdAt,
    }
  }

  /**
   * Validate input
   */
  private validateInput(input: CreatePromotionInput): void {
    const errors: Record<string, string> = {}

    // Name
    if (!input.name || input.name.trim().length === 0) {
      errors.name = 'Promotion name is required'
    } else if (input.name.length > 200) {
      errors.name = 'Promotion name must not exceed 200 characters'
    }

    // Description
    if (!input.description || input.description.trim().length === 0) {
      errors.description = 'Promotion description is required'
    } else if (input.description.length > 1000) {
      errors.description = 'Description must not exceed 1000 characters'
    }

    // Discount type
    const validTypes = Object.values(PromotionType)
    if (!validTypes.includes(input.discountType)) {
      errors.discountType = `Invalid discount type. Must be one of: ${validTypes.join(', ')}`
    }

    // Discount value
    if (input.discountValue <= 0) {
      errors.discountValue = 'Discount value must be greater than 0'
    }
    if (input.discountType === PromotionType.PERCENTAGE && input.discountValue > 100) {
      errors.discountValue = 'Percentage discount cannot exceed 100'
    }

    // Dates
    if (input.startDate >= input.endDate) {
      errors.dates = 'Start date must be before end date'
    }
    if (input.startDate < new Date()) {
      // Allow past start dates for already-started promotions
    }

    // Max usage
    if (input.maxUsage <= 0) {
      errors.maxUsage = 'Max usage must be greater than 0'
    }

    // Applicable tiers
    if (!input.applicableTiers || input.applicableTiers.length === 0) {
      errors.applicableTiers = 'At least one tier must be selected'
    }

    // Created by
    if (!input.createdBy) {
      errors.createdBy = 'Creator ID is required'
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors)
    }
  }

  /**
   * Generate random promotion code
   */
  private generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const length = 8
    let code = ''

    // Add timestamp prefix
    const timestamp = Date.now().toString(36).toUpperCase()
    code += timestamp.slice(-3) // Last 3 chars of timestamp

    // Add random characters
    for (let i = 0; i < length - 3; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return code
  }
}

export default CreatePromotionUseCase
