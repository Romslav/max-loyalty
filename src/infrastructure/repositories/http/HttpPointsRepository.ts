/**
 * HttpPointsRepository
 * 
 * HTTP-based implementation of IPointsRepository.
 * Communicates with backend API for points operations.
 */

import { PointsOperation } from '../../../domain/entities/points/PointsOperation'
import { IPointsRepository } from '../../../domain/repositories/IPointsRepository'
import { HttpClient } from '../../http/HttpClient'
import { NetworkError } from '../../../application/errors/PointsErrors'

export interface PointsOperationDTO {
  id: string
  guestId: string
  restaurantId: string
  operationType: 'add' | 'redeem' | 'transfer'
  amount: number
  description: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  recipientGuestId?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface PointsBalanceDTO {
  guestId: string
  balance: number
  earned: number
  redeemed: number
  lastUpdated: string
}

export interface PointsHistoryResponse {
  operations: PointsOperationDTO[]
  total: number
  page: number
  pageSize: number
}

export class HttpPointsRepository implements IPointsRepository {
  private readonly baseUrl = '/api/v1/points'

  constructor(private httpClient: HttpClient) {}

  /**
   * Get current balance for a guest
   */
  async getBalance(guestId: string): Promise<number> {
    try {
      const response = await this.httpClient.get<PointsBalanceDTO>(
        `${this.baseUrl}/guests/${guestId}/balance`,
      )
      return response.balance
    } catch (error) {
      throw this.handleError('getBalance', error)
    }
  }

  /**
   * Create a new points operation
   */
  async create(operation: PointsOperation): Promise<PointsOperation> {
    try {
      const dto = operation.toDTO()
      const response = await this.httpClient.post<PointsOperationDTO>(
        `${this.baseUrl}/operations`,
        {
          guestId: dto.guestId,
          restaurantId: dto.restaurantId,
          operationType: dto.operationType,
          amount: dto.amount,
          description: dto.description,
          recipientGuestId: dto.recipientGuestId,
        },
      )

      return this.mapDTOToEntity(response)
    } catch (error) {
      throw this.handleError('create', error)
    }
  }

  /**
   * Get operation by ID
   */
  async getById(operationId: string): Promise<PointsOperation | null> {
    try {
      const response = await this.httpClient.get<PointsOperationDTO>(
        `${this.baseUrl}/operations/${operationId}`,
      )
      return this.mapDTOToEntity(response)
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw this.handleError('getById', error)
    }
  }

  /**
   * Get operation history for a guest with pagination
   */
  async getHistory(
    guestId: string,
    limit: number,
    offset: number,
  ): Promise<PointsOperation[]> {
    try {
      const response = await this.httpClient.get<PointsHistoryResponse>(
        `${this.baseUrl}/guests/${guestId}/operations`,
        {
          params: {
            limit: Math.min(limit, 100), // Max 100
            offset: Math.max(0, offset),
          },
        },
      )

      return response.operations.map((dto) => this.mapDTOToEntity(dto))
    } catch (error) {
      throw this.handleError('getHistory', error)
    }
  }

  /**
   * Get operation history filtered by type
   */
  async getHistoryByType(
    guestId: string,
    operationType: 'add' | 'redeem' | 'transfer',
    limit: number,
  ): Promise<PointsOperation[]> {
    try {
      const response = await this.httpClient.get<PointsHistoryResponse>(
        `${this.baseUrl}/guests/${guestId}/operations`,
        {
          params: {
            type: operationType,
            limit: Math.min(limit, 100),
            offset: 0,
          },
        },
      )

      return response.operations.map((dto) => this.mapDTOToEntity(dto))
    } catch (error) {
      throw this.handleError('getHistoryByType', error)
    }
  }

  /**
   * Update operation status
   */
  async updateStatus(
    operationId: string,
    status: 'pending' | 'completed' | 'failed' | 'cancelled',
  ): Promise<PointsOperation> {
    try {
      const response = await this.httpClient.patch<PointsOperationDTO>(
        `${this.baseUrl}/operations/${operationId}`,
        { status },
      )
      return this.mapDTOToEntity(response)
    } catch (error) {
      throw this.handleError('updateStatus', error)
    }
  }

  /**
   * Get total earned points
   */
  async getTotalEarned(guestId: string): Promise<number> {
    try {
      const response = await this.httpClient.get<PointsBalanceDTO>(
        `${this.baseUrl}/guests/${guestId}/balance`,
      )
      return response.earned
    } catch (error) {
      throw this.handleError('getTotalEarned', error)
    }
  }

  /**
   * Get total redeemed points
   */
  async getTotalRedeemed(guestId: string): Promise<number> {
    try {
      const response = await this.httpClient.get<PointsBalanceDTO>(
        `${this.baseUrl}/guests/${guestId}/balance`,
      )
      return response.redeemed
    } catch (error) {
      throw this.handleError('getTotalRedeemed', error)
    }
  }

  /**
   * Convert DTO to domain entity
   */
  private mapDTOToEntity(dto: PointsOperationDTO): PointsOperation {
    return PointsOperation.create({
      id: dto.id,
      guestId: dto.guestId,
      restaurantId: dto.restaurantId,
      operationType: dto.operationType,
      amount: dto.amount,
      description: dto.description,
      status: dto.status,
      recipientGuestId: dto.recipientGuestId,
      metadata: dto.metadata,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
    })
  }

  /**
   * Handle errors with proper error types
   */
  private handleError(operation: string, error: any): Error {
    if (error instanceof NetworkError) {
      return error
    }

    const message = error?.response?.data?.message || error?.message || 'Unknown error'
    return new NetworkError(`Failed to ${operation}: ${message}`, error)
  }
}
