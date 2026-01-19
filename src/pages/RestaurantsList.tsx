import { useState } from 'react'
import { useQuery } from '../hooks/useQuery'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { EmptyState } from '../components/EmptyState'
import { Pagination } from '../components/Pagination'
import { SearchInput } from '../components/SearchInput'
import { Card } from '../components/Card'

interface QueryParams {
  page: number
  limit: number
  search?: string
}

interface Restaurant {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  status: 'active' | 'inactive' | 'suspended'
  guests: number
  revenue: number
  createdAt: string
}

interface RestaurantsResponse {
  restaurants: Restaurant[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Mock service for testing (replace with real service)
const restaurantService = {
  async getRestaurants(params: QueryParams): Promise<RestaurantsResponse> {
    // TODO: Replace with real API call
    // return apiClient.get('/restaurants', { params })
    return Promise.resolve({
      restaurants: [
        {
          id: '1',
          name: 'Restaurant A',
          email: 'a@restaurant.com',
          phone: '+1234567890',
          address: '123 Main St',
          city: 'New York',
          status: 'active',
          guests: 342,
          revenue: 125000,
          createdAt: '2024-01-15',
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    })
  },
}

const RestaurantsList = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [limit] = useState(20)

  // 🎯 Build query params
  const queryParams: QueryParams = {
    page,
    limit,
    ...(search && { search }),
  }

  // 🔄 Fetch restaurants with pagination and search
  const { data, loading, error, refetch } = useQuery(
    () => restaurantService.getRestaurants(queryParams),
    {
      retryCount: 3,
      retryDelay: 1000,
      dependencies: [page, search, limit],
    }
  )

  // ⏳ Loading state
  if (loading && !data) {
    return <LoadingSpinner text="Loading restaurants..." />
  }

  // ❌ Error state
  if (error && !data) {
    return (
      <ErrorAlert
        error={error}
        title="Failed to load restaurants"
        onRetry={refetch}
      />
    )
  }

  // 🗑️ Empty state
  if (!data?.restaurants || data.restaurants.length === 0) {
    return (
      <EmptyState
        title="No restaurants yet"
        description="Start by registering your first restaurant"
        action={() => console.log('Create restaurant')}
        buttonLabel="+ Add Restaurant"
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
              <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
              <p className="text-gray-600 mt-1">Manage your restaurants</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              + Add Restaurant
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchInput
            placeholder="Search by name, email, city..."
            value={search}
            onChange={setSearch}
          />
        </div>

        {/* Error banner if partial data */}
        {error && data && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⚠️ Some data may be outdated.{' '}
            <button onClick={refetch} className="underline font-semibold">
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Guests
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.restaurants.map((restaurant: Restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {restaurant.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {restaurant.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {restaurant.city}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {restaurant.guests}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${restaurant.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          restaurant.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : restaurant.status === 'inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {restaurant.status.charAt(0).toUpperCase() +
                          restaurant.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button className="text-blue-600 hover:text-blue-700 font-medium mr-4">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{data.restaurants.length}</span> of{' '}
            <span className="font-semibold">{data.total}</span> restaurants
          </div>
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}

export default RestaurantsList
