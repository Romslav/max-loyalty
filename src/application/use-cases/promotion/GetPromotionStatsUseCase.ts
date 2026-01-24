/**
 * GetPromotionStatsUseCase
 * 
 * Use case for retrieving promotion statistics and analytics.
 * Includes usage patterns, conversion rates, and performance metrics.
 */

import { ValidationError } from '../../errors/PointsErrors'

/**
 * Promotion statistics DTO
 */
export interface PromotionStats {
  promotionId: string
  name: string
  totalCodeGenerated: number
  totalCodeUsed: number
  usageRate: number
  totalSavings: number
  averageDiscountPerUse: number
  conversionRate: number
  topCodes: Array<{
    code: string
    used: number
    savings: number
  }>
  dailyUsage: Array<{
    date: string
    count: number
    savings: number
  }>
  tierBreakdown: Array<{
    tier: string
    used: number
    savings: number
  }>
  regionBreakdown: Array<{
    region: string
    used: number
    savings: number
  }>
}

/**
 * Get Promotion Stats Use Case
 */
export class GetPromotionStatsUseCase {
  constructor() {}

  /**
   * Execute the use case
   * @param promotionId Promotion ID
   * @returns Promotion statistics
   * @throws ValidationError if promotion not found
   */
  async execute(promotionId: string): Promise<PromotionStats> {
    // Step 1: Validate input
    if (!promotionId) {
      throw new ValidationError({
        promotionId: 'ID кампании обязателен',
      })
    }

    // Step 2: Check if promotion exists
    if (!this.promotionExists(promotionId)) {
      throw new ValidationError({
        promotionId: 'Кампания не найдена',
      })
    }

    // Step 3: Fetch statistics (simulate)
    return this.fetchStats(promotionId)
  }

  /**
   * Check if promotion exists
   */
  private promotionExists(promotionId: string): boolean {
    const validIds = ['promo_1', 'promo_2', 'promo_3']
    return validIds.includes(promotionId)
  }

  /**
   * Fetch promotion statistics (simulated)
   */
  private fetchStats(promotionId: string): PromotionStats {
    const statsMap: Record<string, PromotionStats> = {
      promo_1: {
        promotionId: 'promo_1',
        name: 'Летняя распродажа',
        totalCodeGenerated: 100,
        totalCodeUsed: 45,
        usageRate: 45,
        totalSavings: 9000,
        averageDiscountPerUse: 200,
        conversionRate: 18.5,
        topCodes: [
          { code: 'PROMO20', used: 45, savings: 9000 },
          { code: 'SUMMER15', used: 32, savings: 4800 },
          { code: 'SPECIAL25', used: 28, savings: 7000 },
        ],
        dailyUsage: [
          { date: '2026-01-20', count: 5, savings: 1000 },
          { date: '2026-01-21', count: 8, savings: 1600 },
          { date: '2026-01-22', count: 12, savings: 2400 },
          { date: '2026-01-23', count: 10, savings: 2000 },
          { date: '2026-01-24', count: 10, savings: 2000 },
        ],
        tierBreakdown: [
          { tier: 'Bronze', used: 15, savings: 3000 },
          { tier: 'Silver', used: 18, savings: 3600 },
          { tier: 'Gold', used: 9, savings: 1800 },
          { tier: 'Platinum', used: 3, savings: 600 },
        ],
        regionBreakdown: [
          { region: 'RU', used: 30, savings: 6000 },
          { region: 'BY', used: 10, savings: 2000 },
          { region: 'KZ', used: 5, savings: 1000 },
        ],
      },
      promo_2: {
        promotionId: 'promo_2',
        name: 'Новые клиенты',
        totalCodeGenerated: 500,
        totalCodeUsed: 128,
        usageRate: 25.6,
        totalSavings: 32000,
        averageDiscountPerUse: 250,
        conversionRate: 12.8,
        topCodes: [
          { code: 'NEWUSER50', used: 128, savings: 32000 },
        ],
        dailyUsage: [
          { date: '2026-01-01', count: 8, savings: 2000 },
          { date: '2026-01-02', count: 12, savings: 3000 },
          { date: '2026-01-03', count: 15, savings: 3750 },
          { date: '2026-01-04', count: 18, savings: 4500 },
          { date: '2026-01-24', count: 75, savings: 18750 },
        ],
        tierBreakdown: [
          { tier: 'Bronze', used: 100, savings: 25000 },
          { tier: 'Silver', used: 20, savings: 5000 },
          { tier: 'Gold', used: 8, savings: 2000 },
        ],
        regionBreakdown: [
          { region: 'RU', used: 80, savings: 20000 },
          { region: 'BY', used: 30, savings: 7500 },
          { region: 'UA', used: 18, savings: 4500 },
        ],
      },
    }

    return statsMap[promotionId] || this.generateDefaultStats(promotionId)
  }

  /**
   * Generate default stats for unknown promotions
   */
  private generateDefaultStats(promotionId: string): PromotionStats {
    return {
      promotionId,
      name: 'Универсальная кампания',
      totalCodeGenerated: 0,
      totalCodeUsed: 0,
      usageRate: 0,
      totalSavings: 0,
      averageDiscountPerUse: 0,
      conversionRate: 0,
      topCodes: [],
      dailyUsage: [],
      tierBreakdown: [],
      regionBreakdown: [],
    }
  }
}
