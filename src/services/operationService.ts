import axios from 'axios'

export interface Operation {
  id: string
  guestId: string
  restaurantId: string
  type: 'earn' | 'redeem' | 'adjustment'
  points: number
  description: string
  createdAt: string
  createdBy: string
  status: 'pending' | 'completed' | 'cancelled'
}

export interface CreateOperationDTO {
  guestId: string
  type: 'earn' | 'redeem' | 'adjustment'
  points: number
  description: string
}

export interface OperationsResponse {
  data: Operation[]
  total: number
  page: number
  limit: number
}

export interface OperationStats {
  totalEarned: number
  totalRedeemed: number
  net: number
  monthlyEarned: number
  monthlyRedeemed: number
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const apiClient = axios.create({
  baseURL: API_URL,
})

class OperationService {
  /**
   * Get operations with filters
   */
  async getOperations(
    page: number = 1,
    limit: number = 20,
    filters?: { guestId?: string; type?: string; status?: string }
  ): Promise<OperationsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (filters?.guestId) params.append('guestId', filters.guestId)
      if (filters?.type) params.append('type', filters.type)
      if (filters?.status) params.append('status', filters.status)

      const response = await apiClient.get<OperationsResponse>(
        `/operations?${params.toString()}`
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get operation by ID
   */
  async getOperationById(id: string): Promise<Operation> {
    try {
      const response = await apiClient.get<{ data: Operation }>(
        `/operations/${id}`
      )
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Create new operation
   */
  async createOperation(data: CreateOperationDTO): Promise<Operation> {
    try {
      const response = await apiClient.post<{ data: Operation }>(
        '/operations',
        data
      )
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get operation statistics
   */
  async getOperationStats(): Promise<OperationStats> {
    try {
      const response = await apiClient.get<{ data: OperationStats }>(
        '/operations/stats'
      )
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      return new Error(message || 'An error occurred')
    }
    return error instanceof Error ? error : new Error('An unknown error occurred')
  }
}

export const operationService = new OperationService()
