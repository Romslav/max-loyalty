/**
 * ✅ FIXED: IPromotionRepository Interface - Code Audit Corrections
 * Fixed 2 errors related to error handling and parameter documentation
 */

import { Promotion } from '../entities/Promotion';

/**
 * Repository interface for Promotion entity
 * Provides abstraction for data persistence layer
 * 
 * ✅ FIX #6: Explicit error handling
 * ✅ FIX #7: Parameter validation documentation
 */
export interface IPromotionRepository {
  /**
   * Create a new promotion
   * @param promotion - Promotion entity to create
   * @throws Error if promotion validation fails
   */
  create(promotion: Promotion): Promise<void>;

  /**
   * Find promotion by ID
   * @param id - Non-empty string, max 50 chars
   * @throws Error if ID is invalid
   */
  findById(id: string): Promise<Promotion | null>;

  /**
   * Find promotion by code
   * @param code - Non-empty string, max 50 chars, case-insensitive
   * @throws Error if code is invalid
   */
  findByCode(code: string): Promise<Promotion | null>;

  /**
   * Find all active promotions
   */
  findActive(): Promise<Promotion[]>;

  /**
   * Find promotions by status
   */
  findByStatus(status: string): Promise<Promotion[]>;

  /**
   * Find promotions by type
   */
  findByType(type: string): Promise<Promotion[]>;

  /**
   * Get all promotions with pagination
   */
  findAll(page: number, limit: number): Promise<{
    promotions: Promotion[];
    total: number;
    page: number;
    pages: number;
  }>;

  /**
   * Search promotions by criteria
   */
  search(query: string, filters?: Record<string, any>): Promise<Promotion[]>;

  /**
   * Update existing promotion
   * @throws Error if promotion not found
   */
  update(id: string, promotion: Partial<Promotion>): Promise<void>;

  /**
   * Delete promotion by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if code already exists
   */
  codeExists(code: string, excludeId?: string): Promise<boolean>;

  /**
   * Record promotion usage
   */
  recordUsage(promotionId: string, userId: string, discountAmount: number): Promise<void>;
}
