import React, { useState } from 'react'
import { useQuery } from '../hooks/useQuery'
import { useMutation } from '../hooks/useMutation'
import { guestService } from '../services/guestService'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { ErrorAlert } from '../components/common/ErrorAlert'
import { EmptyState } from '../components/common/EmptyState'
import { Pagination } from '../components/common/Pagination'
import { SearchInput } from '../components/common/SearchInput'

interface Guest {
  id: string
  name: string
  email: string
  phone: string
  totalPoints: number
  tier: string
  status: string
}

export const GuestsList: React.FC = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [totalPages, setTotalPages] = useState(1)

  // Fetch guests with pagination and search
  const { data: guestsResponse, loading, error, refetch } = useQuery(
    async () => {
      const response = await guestService.getGuests(page, 10, search)
      setTotalPages(Math.ceil(response.total / 10))
      return response.data
    },
    { enabled: true }
  )

  // Delete guest mutation
  const { mutate: deleteGuest, loading: isDeleting } = useMutation(
    async (id: string) => {
      await guestService.deleteGuest(id)
      refetch()
    },
    {
      onSuccess: () => {
        alert('Guest deleted successfully')
        refetch()
      },
      onError: (error) => {
        alert(`Error: ${error.message}`)
      },
    }
  )

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleSearch = (query: string) => {
    setSearch(query)
    setPage(1) // Reset to first page on search
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Guests</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          + Add Guest
        </button>
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Search guests..."
        onSearch={handleSearch}
      />

      {/* Error */}
      <ErrorAlert
        error={error}
        onRetry={refetch}
        onDismiss={() => {}}
      />

      {/* Loading */}
      {loading && <LoadingSpinner message="Loading guests..." />}

      {/* Empty State */}
      {!loading && (!guestsResponse || guestsResponse.length === 0) && (
        <EmptyState
          title="No guests found"
          message="Start by adding your first guest to the system"
          action={{
            label: 'Add Guest',
            onClick: () => {},
          }}
        />
      )}

      {/* Table */}
      {!loading && guestsResponse && guestsResponse.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {guestsResponse.map((guest: Guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {guest.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {guest.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {guest.totalPoints}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      {guest.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        guest.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {guest.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                    <button
                      onClick={() => deleteGuest(guest.id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={loading}
        />
      )}
    </div>
  )
}
