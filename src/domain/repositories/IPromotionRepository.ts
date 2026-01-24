/**
 * IPromotionRepository Interface
 * 
 * Repository contract for promotion data persistence.
 * Full CRUD operations and query methods.
 */

import { Promotion, PromotionStatus } from '../entities/promotion/Promotion'

/**
 * Promotion repository interface
 */
export interface IPromotionRepository {
  /**
   * Get promotion by ID
   */
  getById(id: string): Promise<Promotion | null>

  /**
   * Get promotion by code
   */
  getByCode(code: string): Promise<Promotion | null>

  /**
   * Get all promotions
   */
  getAll(): Promise<Promotion[]>

  /**
   * Get promotions by status
   */
  getByStatus(status: PromotionStatus): Promise<Promotion[]>

  /**
   * Get active promotions (current time)
   */
  getActive(): Promise<Promotion[]>

  /**
   * Get promotions by creator
   */
  getByCreator(creatorId: string): Promise<Promotion[]>

  /**
   * Get promotions for tier
   */
  getByTier(tier: string): Promise<Promotion[]>

  /**
   * Get promotions by date range
   */
  getByDateRange(startDate: Date, endDate: Date): Promise<Promotion[]>

  /**
   * Search promotions
   */
  search(query: string): Promise<Promotion[]>

  /**
   * Create promotion
   */
  create(promotion: Promotion): Promise<Promotion>

  /**
   * Update promotion
   */
  update(id: string, updates: Partial<any>): Promise<Promotion>

  /**
   * Delete promotion
   */
  delete(id: string): Promise<boolean>

  /**
   * Check if code exists
   */
  codeExists(code: string, excludeId?: string): Promise<boolean>

  /**
   * Get promotion statistics
   */
  getStatistics(id: string): Promise<{
    totalUsages: number
    totalDiscountAmount: number
    averageOrderValue: number
    uniqueGuestsUsed: number
    usagesByTier: Record<string, number>
  } | null>

  /**
   * Get top promotions by usage
   */
  getTopByUsage(limit: number): Promise<Promotion[]>

  /**
   * Get promotional campaigns
   */
  getCampaigns(): Promise<Promotion[]>

  /**
   * Update promotion status
   */
  updateStatus(id: string, status: PromotionStatus): Promise<Promotion>

  /**
   * Batch create promotions
   */
  createBatch(promotions: Promotion[]): Promise<Promotion[]>

  /**
   * Archive old promotions
   */
  archiveExpired(): Promise<number>

  /**
   * Get pagination
   */
  getPaginated(
    page: number,
    limit: number,
    filters?: {
      status?: PromotionStatus
      tier?: string
      creator?: string
    },
  ): Promise<{
    items: Promotion[]
    total: number
    page: number
    limit: number
  }>
}

export default IPromotionRepository
