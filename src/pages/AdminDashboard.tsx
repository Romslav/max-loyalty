import { useEffect } from 'react'
import { useQuery } from '../hooks/useQuery'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { Card } from '../components/Card'
import { analyticsService } from '../services/analyticsService'
import { useRefresh } from '../hooks/useRefresh'

interface StatCard {
  label: string
  value: number | string
  change?: number
  trend?: 'up' | 'down'
}

const AdminDashboard = () => {
  // 🔄 Fetch dashboard stats with auto-refresh
  const { data: stats, loading, error, refetch } = useQuery(
    () => analyticsService.getDashboard(),
    {
      retryCount: 3,
      retryDelay: 1000,
      refreshInterval: 30000, // Auto-refresh every 30 seconds
    }
  )

  // 🔄 Auto-refresh interval hook
  useRefresh(refetch, 30000)

  // ⏳ Loading state
  if (loading && !stats) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  // ❌ Error state
  if (error && !stats) {
    return (
      <ErrorAlert
        error={error}
        title="Failed to load dashboard"
        onRetry={refetch}
      />
    )
  }

  // ✅ Render dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, Admin</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={refetch}
                disabled={loading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? '⟳ Refreshing...' : '⟳ Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error banner if retry available */}
        {error && stats && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⚠️ Some data may be outdated. <button onClick={refetch} className="underline font-semibold">Retry</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats?.map((stat: StatCard) => (
            <Card key={stat.label} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  {stat.change !== undefined && (
                    <p
                      className={`text-sm mt-2 flex items-center ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.trend === 'up' ? '📈' : '📉'} {Math.abs(stat.change)}% from last period
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Section (placeholder) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Guest Trend</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              📊 Chart placeholder
            </div>
          </Card>

          {/* Chart 2 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              📊 Chart placeholder
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
