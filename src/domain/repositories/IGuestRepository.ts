/**
 * IGuestRepository Interface
 * 
 * Contract for guest data persistence layer.
 * Abstracts the storage mechanism (API, database, etc).
 */

import { Guest } from '../entities/guest/Guest'

export interface IGuestRepository {
  /**
   * Create a new guest
   * @param guest Guest entity
   * @returns Created guest
   */
  create(guest: Guest): Promise<Guest>

  /**
   * Get guest by ID
   * @param id Guest ID
   * @returns Guest or null if not found
   */
  getById(id: string): Promise<Guest | null>

  /**
   * Get guest by email
   * @param email Email address
   * @returns Guest or null if not found
   */
  getByEmail(email: string): Promise<Guest | null>

  /**
   * Get guest by phone
   * @param phone Phone number
   * @returns Guest or null if not found
   */
  getByPhone(phone: string): Promise<Guest | null>

  /**
   * Get guest by referral code
   * @param code Referral code
   * @returns Guest or null if not found
   */
  getByReferralCode(code: string): Promise<Guest | null>

  /**
   * Update guest
   * @param id Guest ID
   * @param data Updated guest data
   * @returns Updated guest
   */
  update(id: string, data: Partial<any>): Promise<Guest>

  /**
   * List guests with pagination
   * @param limit Number of records
   * @param offset Pagination offset
   * @returns Array of guests
   */
  list(limit: number, offset: number): Promise<Guest[]>

  /**
   * Search guests by email or phone
   * @param query Search query
   * @param limit Results limit
   * @returns Array of matching guests
   */
  search(query: string, limit: number): Promise<Guest[]>

  /**
   * Get guests by tier
   * @param tier Tier name
   * @param limit Results limit
   * @returns Array of guests in tier
   */
  getByTier(tier: string, limit: number): Promise<Guest[]>

  /**
   * Get referrals for a guest
   * @param guestId Guest ID
   * @returns Array of guest IDs referred by this guest
   */
  getReferrals(guestId: string): Promise<string[]>

  /**
   * Delete guest (soft delete)
   * @param id Guest ID
   */
  delete(id: string): Promise<void>
}
