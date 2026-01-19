import { useState } from 'react'
import { useQuery } from '../hooks/useQuery'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { EmptyState } from '../components/EmptyState'
import { Pagination } from '../components/Pagination'
import { SearchInput } from '../components/SearchInput'
import { Card } from '../components/Card'
import { guestService } from '../services/guestService'

interface QueryParams {
  page: number
  limit: number
  search?: string
}

interface Guest {
  id: string
  name: string
  email: string
  phone: string
  points: number
  status: string
  createdAt: string
  lastActivity?: string
}

interface GuestsResponse {
  guests: Guest[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const GuestsList = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [limit] = useState(20)

  // 🔄 Build query params
  const queryParams: QueryParams = {
    page,
    limit,
    ...(search && { search }),
  }

  // 🔄 Fetch guests with pagination and search
  const { data, loading, error, refetch } = useQuery(
    () => guestService.getGuests(queryParams),
    {
      retryCount: 3,
      retryDelay: 1000,
      dependencies: [page, search, limit], // ⚠️ Critical: refetch when params change
    }
  )

  // ⏳ Loading state
  if (loading && !data) {
    return <LoadingSpinner text="Loading guests..." />
  }

  // ❌ Error state
  if (error && !data) {
    return (
      <ErrorAlert
        error={error}
        title="Failed to load guests"
        onRetry={refetch}
      />
    )
  }

  // 🗑 Empty state
  if (!data?.guests || data.guests.length === 0) {
    return (
      <EmptyState
        title="No guests yet"
        description="Start by creating your first guest to build your loyalty program"
        action={() => {
          // TODO: Navigate to create guest page
          console.log('Create guest')
        }}
        buttonLabel="+ Add Guest"
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
              <h1 className="text-3xl font-bold text-gray-900">Guests</h1>
              <p className="text-gray-600 mt-1">Manage your loyalty program guests</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              + Add Guest
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchInput
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={setSearch}
          />
        </div>

        {/* Error banner if partial data */}
        {error && data && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⚠️ Some data may be outdated. <button onClick={refetch} className="underline font-semibold">Retry</button>
          </div>
        )}

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Points</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.guests.map((guest: Guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{guest.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{guest.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{guest.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      💪 {guest.points.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          guest.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : guest.status === 'inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(guest.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button className="text-blue-600 hover:text-blue-700 font-medium mr-4">Edit</button>
                      <button className="text-red-600 hover:text-red-700 font-medium">Delete</button>
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
            Showing <span className="font-semibold">{data.guests.length}</span> of{' '}
            <span className="font-semibold">{data.total}</span> guests
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

export default GuestsList
