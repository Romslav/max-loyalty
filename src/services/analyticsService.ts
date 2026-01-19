import { apiClient } from '../config/apiClient'

interface DashboardStats {
  label: string
  value: number | string
  change?: number
  trend?: 'up' | 'down'
}

interface AnalyticsResponse {
  stats: DashboardStats[]
  chartData?: unknown
  timestamp: string
}

/**
 * 📊 Analytics Service
 * All analytics-related API calls
 */
export const analyticsService = {
  /**
   * Get dashboard statistics
   * GET /api/analytics/dashboard
   */
  async getDashboard(): Promise<DashboardStats[]> {
    try {
      const response = await apiClient.get<AnalyticsResponse>('/analytics/dashboard')
      console.log('✅ Dashboard stats loaded:', response.data.stats)
      return response.data.stats
    } catch (error) {
      console.error('❌ Failed to load dashboard stats:', error)
      throw error
    }
  },

  /**
   * Get guest analytics
   * GET /api/analytics/guests?period=30d
   */
  async getGuestAnalytics(period: string = '30d') {
    try {
      const response = await apiClient.get('/analytics/guests', {
        params: { period },
      })
      return response.data
    } catch (error) {
      console.error('❌ Failed to load guest analytics:', error)
      throw error
    }
  },

  /**
   * Get revenue analytics
   * GET /api/analytics/revenue?period=30d
   */
  async getRevenueAnalytics(period: string = '30d') {
    try {
      const response = await apiClient.get('/analytics/revenue', {
        params: { period },
      })
      return response.data
    } catch (error) {
      console.error('❌ Failed to load revenue analytics:', error)
      throw error
    }
  },

  /**
   * Export analytics as CSV
   * GET /api/analytics/export?format=csv
   */
  async exportAnalytics(format: 'csv' | 'json' = 'csv') {
    try {
      const response = await apiClient.get('/analytics/export', {
        params: { format },
      })
      return response.data
    } catch (error) {
      console.error('❌ Failed to export analytics:', error)
      throw error
    }
  },
}
