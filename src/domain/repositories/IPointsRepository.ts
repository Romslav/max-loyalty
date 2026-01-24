/**
 * IPointsRepository Interface
 * 
 * Contract for points data persistence layer.
 * Abstracts the storage mechanism (API, database, etc).
 */

import { PointsOperation } from '../entities/points/PointsOperation'

export interface IPointsRepository {
  /**
   * Get current points balance for a guest
   * @param guestId Guest identifier
   * @returns Current points balance
   */
  getBalance(guestId: string): Promise<number>

  /**
   * Create a new points operation
   * @param operation PointsOperation entity
   * @returns Created operation
   */
  create(operation: PointsOperation): Promise<PointsOperation>

  /**
   * Get a specific points operation
   * @param operationId Operation identifier
   * @returns PointsOperation or null if not found
   */
  getById(operationId: string): Promise<PointsOperation | null>

  /**
   * Get points operation history for a guest
   * @param guestId Guest identifier
   * @param limit Number of records to return
   * @param offset Pagination offset
   * @returns Array of operations
   */
  getHistory(
    guestId: string,
    limit: number,
    offset: number,
  ): Promise<PointsOperation[]>

  /**
   * Get points operation history filtered by type
   * @param guestId Guest identifier
   * @param operationType Type of operation (add, redeem, transfer)
   * @param limit Number of records to return
   * @returns Array of filtered operations
   */
  getHistoryByType(
    guestId: string,
    operationType: 'add' | 'redeem' | 'transfer',
    limit: number,
  ): Promise<PointsOperation[]>

  /**
   * Update operation status
   * @param operationId Operation identifier
   * @param status New status
   * @returns Updated operation
   */
  updateStatus(
    operationId: string,
    status: 'pending' | 'completed' | 'failed' | 'cancelled',
  ): Promise<PointsOperation>

  /**
   * Get total points earned (all add operations)
   * @param guestId Guest identifier
   * @returns Total earned points
   */
  getTotalEarned(guestId: string): Promise<number>

  /**
   * Get total points redeemed
   * @param guestId Guest identifier
   * @returns Total redeemed points
   */
  getTotalRedeemed(guestId: string): Promise<number>
}
