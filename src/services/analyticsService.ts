import axios from 'axios'

export interface DashboardStats {
  totalGuests: number
  activeGuests: number
  totalPoints: number
  totalRedeemed: number
  monthlyRevenue: number
  guestGrowth: number
}

export interface GuestAnalytics {
  id: string
  name: string
  joinDate: string
  visits: number
  totalSpent: number
  totalPoints: number
  pointsRedeemed: number
  tier: string
}

export interface RevenueData {
  date: string
  revenue: number
  transactions: number
  points: number
}

export interface AnalyticsResponse {
  data: any
  period: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const apiClient = axios.create({
  baseURL: API_URL,
})

class AnalyticsService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<{ data: DashboardStats }>(
        '/analytics/dashboard'
      )
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get guest analytics
   */
  async getGuestAnalytics(page: number = 1, limit: number = 10): Promise<{
    data: GuestAnalytics[]
    total: number
  }> {
    try {
      const response = await apiClient.get('/analytics/guests', {
        params: { page, limit },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(period: string = 'month'): Promise<RevenueData[]> {
    try {
      const response = await apiClient.get<{ data: RevenueData[] }>(
        '/analytics/revenue',
        { params: { period } }
      )
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get points distribution analytics
   */
  async getPointsAnalytics(period: string = 'month'): Promise<AnalyticsResponse> {
    try {
      const response = await apiClient.get('/analytics/points', {
        params: { period },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Export analytics data
   */
  async exportAnalytics(format: 'csv' | 'pdf' = 'csv'): Promise<Blob> {
    try {
      const response = await apiClient.get('/analytics/export', {
        params: { format },
        responseType: 'blob',
      })
      return response.data
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

export const analyticsService = new AnalyticsService()
