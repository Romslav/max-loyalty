import { useQuery } from '../hooks/useQuery'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { Card } from '../components/Card'

interface Analytics {
  totalGuests: number
  activeRestaurants: number
  totalPointsDistributed: number
  totalPointsRedeemed: number
  averagePointsPerGuest: number
  monthlyRevenue: number
  conversionRate: number
  retentionRate: number
  topRestaurants: Array<{
    name: string
    guests: number
    revenue: number
  }>
  guestGrowth: Array<{
    month: string
    count: number
  }>
  pointsFlow: Array<{
    month: string
    distributed: number
    redeemed: number
  }>
}

// Mock service for testing
const analyticsService = {
  async getDashboard(): Promise<Analytics> {
    // TODO: Replace with real API call
    // return apiClient.get('/analytics/dashboard')
    return Promise.resolve({
      totalGuests: 15234,
      activeRestaurants: 42,
      totalPointsDistributed: 2850000,
      totalPointsRedeemed: 1920000,
      averagePointsPerGuest: 187,
      monthlyRevenue: 125000,
      conversionRate: 68,
      retentionRate: 74,
      topRestaurants: [
        { name: 'Restaurant A', guests: 1234, revenue: 45000 },
        { name: 'Restaurant B', guests: 892, revenue: 32000 },
        { name: 'Restaurant C', guests: 756, revenue: 28000 },
      ],
      guestGrowth: [
        { month: 'Jan', count: 2100 },
        { month: 'Feb', count: 2850 },
        { month: 'Mar', count: 3200 },
        { month: 'Apr', count: 3850 },
        { month: 'May', count: 4100 },
        { month: 'Jun', count: 5234 },
      ],
      pointsFlow: [
        { month: 'Jan', distributed: 380000, redeemed: 200000 },
        { month: 'Feb', distributed: 420000, redeemed: 240000 },
        { month: 'Mar', distributed: 450000, redeemed: 290000 },
        { month: 'Apr', distributed: 480000, redeemed: 320000 },
        { month: 'May', distributed: 510000, redeemed: 380000 },
        { month: 'Jun', distributed: 610000, redeemed: 490000 },
      ],
    })
  },
}

const AnalyticsPage = () => {
  const { data, loading, error, refetch } = useQuery(
    () => analyticsService.getDashboard(),
    {
      retryCount: 3,
      retryDelay: 1000,
    }
  )

  // Loading state
  if (loading && !data) {
    return <LoadingSpinner text="Loading analytics..." />
  }

  // Error state
  if (error && !data) {
    return (
      <ErrorAlert
        error={error}
        title="Failed to load analytics"
        onRetry={refetch}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">Real-time business insights</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
              📄 Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Guests */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Guests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {data?.totalGuests.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-2">📈 +12% this month</p>
              </div>
            </div>
          </Card>

          {/* Active Restaurants */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Restaurants</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {data?.activeRestaurants}
                </p>
                <p className="text-sm text-green-600 mt-2">✅ All active</p>
              </div>
            </div>
          </Card>

          {/* Monthly Revenue */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${data?.monthlyRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-2">💰 +8% growth</p>
              </div>
            </div>
          </Card>

          {/* Conversion Rate */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {data?.conversionRate}%
                </p>
                <p className="text-sm text-green-600 mt-2">⬆️ +2% target</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Second Row KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Points Distributed */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">Points Distributed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {(data?.totalPointsDistributed || 0).toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 mt-2">🎁 Total lifetime</p>
            </div>
          </Card>

          {/* Points Redeemed */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">Points Redeemed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {(data?.totalPointsRedeemed || 0).toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 mt-2">🏆 Claimed rewards</p>
            </div>
          </Card>

          {/* Avg Points/Guest */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Points/Guest</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {data?.averagePointsPerGuest}
              </p>
              <p className="text-sm text-blue-600 mt-2">👤 Per customer</p>
            </div>
          </Card>

          {/* Retention Rate */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">Retention Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {data?.retentionRate}%
              </p>
              <p className="text-sm text-blue-600 mt-2">🔄 Customer loyalty</p>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Guest Growth Chart */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">Guest Growth</h2>
              <p className="text-sm text-gray-600">Last 6 months</p>
            </div>
            <div className="flex items-end justify-around h-64 gap-2">
              {data?.guestGrowth.map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-12 bg-blue-500 rounded-t transition hover:bg-blue-600"
                    style={{
                      height: `${(item.count / 5234) * 100}%`,
                    }}
                    title={`${item.month}: ${item.count} guests`}
                  />
                  <p className="text-xs text-gray-600 mt-2">{item.month}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Points Flow Chart */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">Points Flow</h2>
              <p className="text-sm text-gray-600">Distributed vs Redeemed</p>
            </div>
            <div className="flex items-end justify-around h-64 gap-4">
              {data?.pointsFlow.map((item, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div className="flex gap-1">
                    <div
                      className="w-3 bg-green-500 rounded-t transition hover:bg-green-600"
                      style={{
                        height: `${(item.distributed / 610000) * 100}%`,
                      }}
                      title={`${item.month}: ${item.distributed} distributed`}
                    />
                    <div
                      className="w-3 bg-orange-500 rounded-t transition hover:bg-orange-600"
                      style={{
                        height: `${(item.redeemed / 610000) * 100}%`,
                      }}
                      title={`${item.month}: ${item.redeemed} redeemed`}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{item.month}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600">Distributed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-gray-600">Redeemed</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Restaurants */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Top Restaurants</h2>
            <p className="text-sm text-gray-600">By revenue</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Guests
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Avg/Guest
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.topRestaurants.map((restaurant, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {restaurant.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {restaurant.guests}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${restaurant.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      $
                      {Math.round(
                        restaurant.revenue / restaurant.guests
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AnalyticsPage
