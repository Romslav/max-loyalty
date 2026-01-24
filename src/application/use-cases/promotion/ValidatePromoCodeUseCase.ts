/**
 * ValidatePromoCodeUseCase
 * 
 * Use case for validating and applying promo codes.
 * Checks validity, restrictions, and usage limits.
 */

import { ValidationError, OperationFailedError } from '../../errors/PointsErrors'

/**
 * Validate promo code input DTO
 */
export interface ValidatePromoCodeInput {
  code: string
  guestTier?: string
  guestRegion?: string
  orderAmount?: number
  guestEmail?: string
}

/**
 * Validate promo code output DTO
 */
export interface ValidatePromoCodeOutput {
  valid: boolean
  code: string
  discountAmount: number
  discountPercentage?: number
  restrictions?: string[]
  message: string
}

/**
 * Validate Promo Code Use Case
 */
export class ValidatePromoCodeUseCase {
  constructor() {}

  /**
   * Execute the use case
   * @param input Input parameters
   * @returns Validation result
   * @throws ValidationError if input is invalid
   */
  async execute(input: ValidatePromoCodeInput): Promise<ValidatePromoCodeOutput> {
    // Step 1: Validate input
    this.validateInput(input)

    // Step 2: Check code format
    if (!this.isValidCodeFormat(input.code)) {
      return {
        valid: false,
        code: input.code,
        discountAmount: 0,
        message: '❌ Некорректный формат промокода',
      }
    }

    // Step 3: Check code existence (simulate)
    const codeExists = this.codeExists(input.code)
    if (!codeExists) {
      return {
        valid: false,
        code: input.code,
        discountAmount: 0,
        message: '❌ Промокод не найден',
      }
    }

    // Step 4: Check code status (simulate)
    const isActive = this.isCodeActive(input.code)
    if (!isActive) {
      return {
        valid: false,
        code: input.code,
        discountAmount: 0,
        message: '❌ Промокод истёк или деактивирован',
      }
    }

    // Step 5: Check usage limit (simulate)
    const usageValid = this.checkUsageLimit(input.code)
    if (!usageValid) {
      return {
        valid: false,
        code: input.code,
        discountAmount: 0,
        message: '❌ Промокод исчерпан',
      }
    }

    // Step 6: Check restrictions
    const restrictions: string[] = []
    if (input.guestTier && !this.isApplicableToTier(input.code, input.guestTier)) {
      restrictions.push(`❌ Не доступен для уровня ${input.guestTier}`)
    }
    if (input.guestRegion && !this.isApplicableToRegion(input.code, input.guestRegion)) {
      restrictions.push(`❌ Не доступен в регионе ${input.guestRegion}`)
    }
    if (input.orderAmount && !this.meetsMinimumAmount(input.code, input.orderAmount)) {
      restrictions.push('❌ Минимальная сумма заказа не достигнута')
    }

    if (restrictions.length > 0) {
      return {
        valid: false,
        code: input.code,
        discountAmount: 0,
        restrictions,
        message: '❌ Промокод не применим',
      }
    }

    // Step 7: Calculate discount
    const discountAmount = this.calculateDiscount(input.code, input.orderAmount || 0)
    const discountPercentage = this.getDiscountPercentage(input.code)

    return {
      valid: true,
      code: input.code,
      discountAmount,
      discountPercentage,
      message: `✅ Промокод применён! Скидка: ${discountPercentage}%`,
    }
  }

  /**
   * Validate input
   */
  private validateInput(input: ValidatePromoCodeInput): void {
    const errors: Record<string, string> = {}

    if (!input.code || input.code.trim().length === 0) {
      errors.code = 'Промокод обязателен'
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors)
    }
  }

  /**
   * Check if code format is valid
   */
  private isValidCodeFormat(code: string): boolean {
    // Check if code is alphanumeric and 8-12 characters
    return /^[A-Z0-9]{8,12}$/.test(code.toUpperCase())
  }

  /**
   * Check if code exists
   */
  private codeExists(code: string): boolean {
    // Simulate database lookup
    const validCodes = ['SAVE10OFF', 'PROMO20', 'NEWUSER50', 'VIP100']
    return validCodes.includes(code.toUpperCase())
  }

  /**
   * Check if code is active
   */
  private isCodeActive(code: string): boolean {
    // Simulate checking code status
    const inactiveCodes = ['EXPIRED2024', 'ARCHIVED']
    return !inactiveCodes.includes(code.toUpperCase())
  }

  /**
   * Check usage limit
   */
  private checkUsageLimit(code: string): boolean {
    // Simulate checking usage limit
    const exhaustedCodes: string[] = [] // Empty for now - all codes valid
    return !exhaustedCodes.includes(code.toUpperCase())
  }

  /**
   * Check if applicable to tier
   */
  private isApplicableToTier(code: string, tier: string): boolean {
    // Simulate tier restrictions
    const tierRestrictions: Record<string, string[]> = {
      PROMO20: ['silver', 'gold', 'platinum', 'vip'],
      VIP100: ['platinum', 'vip'],
      SAVE10OFF: ['bronze', 'silver', 'gold', 'platinum', 'vip'],
      NEWUSER50: ['bronze'],
    }

    const allowed = tierRestrictions[code.toUpperCase()] || ['bronze', 'silver', 'gold', 'platinum', 'vip']
    return allowed.includes(tier.toLowerCase())
  }

  /**
   * Check if applicable to region
   */
  private isApplicableToRegion(code: string, region: string): boolean {
    // Simulate region restrictions
    const regionRestrictions: Record<string, string[]> = {
      PROMO20: ['RU', 'BY', 'KZ'],
      VIP100: ['RU'],
      SAVE10OFF: ['RU', 'BY', 'KZ', 'UA'],
    }

    const allowed = regionRestrictions[code.toUpperCase()] || ['RU', 'BY', 'KZ', 'UA']
    return allowed.includes(region.toUpperCase())
  }

  /**
   * Check if meets minimum amount
   */
  private meetsMinimumAmount(code: string, orderAmount: number): boolean {
    // Simulate minimum order amounts
    const minimums: Record<string, number> = {
      PROMO20: 500,
      VIP100: 1000,
      SAVE10OFF: 100,
      NEWUSER50: 200,
    }

    const minimum = minimums[code.toUpperCase()] || 0
    return orderAmount >= minimum
  }

  /**
   * Calculate discount amount
   */
  private calculateDiscount(code: string, orderAmount: number): number {
    const percentage = this.getDiscountPercentage(code)
    return Math.floor((orderAmount * percentage) / 100)
  }

  /**
   * Get discount percentage for code
   */
  private getDiscountPercentage(code: string): number {
    const discounts: Record<string, number> = {
      SAVE10OFF: 10,
      PROMO20: 20,
      NEWUSER50: 50,
      VIP100: 25,
    }

    return discounts[code.toUpperCase()] || 0
  }
}
