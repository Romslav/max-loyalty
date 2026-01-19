import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { operationService } from '../services/operationService'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { ErrorAlert } from '../components/common/ErrorAlert'
import { EmptyState } from '../components/common/EmptyState'
import { Pagination } from '../components/common/Pagination'
import { CanAccess } from '../components/CanAccess'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { formatDate } from '../utils/dateUtils'

interface Operation {
  id: string
  guestId: string
  guestName: string
  type: 'earn' | 'redeem'
  points: number
  description: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  createdBy: string
}

export const PointsOperations: React.FC = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [filter, setFilter] = useState<'all' | 'earn' | 'redeem'>('all')
  const [search, setSearch] = useState('')
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null)
  const [showModal, setShowModal] = useState(false)

  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['operations', page, limit, filter, search],
    queryFn: () =>
      operationService.getOperations({
        page,
        limit,
        type: filter === 'all' ? undefined : filter,
        search,
      }),
  })

  const reverseMutation = useMutation({
    mutationFn: (operationId: string) =>
      operationService.reverseOperation(operationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] })
      setShowModal(false)
      setSelectedOperation(null)
    },
  })

  const handleView = (operation: Operation) => {
    setSelectedOperation(operation)
    setShowModal(true)
  }

  const handleReverse = async () => {
    if (selectedOperation) {
      await reverseMutation.mutateAsync(selectedOperation.id)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorAlert error={error} />
  if (!data?.data?.length) return <EmptyState title="No operations yet" />

  const typeColor = (type: string) =>
    type === 'earn' ? 'text-green-600' : 'text-red-600'

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    }
    return colors[status] || colors.pending
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Points Operations</h1>
        <CanAccess permission="operations:write">
          <Button href="/operations/create">+ New Operation</Button>
        </CanAccess>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Guest
            </label>
            <input
              type="text"
              placeholder="Enter guest name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as 'all' | 'earn' | 'redeem')
                setPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="earn">Earn</option>
              <option value="redeem">Redeem</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rows per page
            </label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value))
                setPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Points
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((operation: Operation) => (
              <tr key={operation.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(operation.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {operation.guestName}
                </td>
                <td className={`px-6 py-4 text-sm font-semibold ${typeColor(operation.type)}`}>
                  {operation.type.toUpperCase()}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                  +{operation.points}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge(operation.status)}`}>
                    {operation.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleView(operation)}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    View
                  </button>
                  <CanAccess permission="operations:write">
                    {operation.status === 'completed' && (
                      <button
                        onClick={() => handleView(operation)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Reverse
                      </button>
                    )}
                  </CanAccess>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Detail Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Operation Details">
        {selectedOperation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Guest</p>
                <p className="font-medium">{selectedOperation.guestName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className={`font-medium ${typeColor(selectedOperation.type)}`}>
                  {selectedOperation.type.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Points</p>
                <p className="text-2xl font-bold text-green-600">
                  +{selectedOperation.points}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-medium ${statusBadge(selectedOperation.status).split(' ')[2]}`}>
                  {selectedOperation.status}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Description</p>
                <p>{selectedOperation.description}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Date</p>
                <p>{formatDate(selectedOperation.createdAt)}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <CanAccess permission="operations:write">
                {selectedOperation.status === 'completed' && (
                  <Button
                    variant="danger"
                    onClick={handleReverse}
                    isLoading={reverseMutation.isPending}
                  >
                    Reverse Operation
                  </Button>
                )}
              </CanAccess>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
