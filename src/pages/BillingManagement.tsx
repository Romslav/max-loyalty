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
  status?: string
}

interface Invoice {
  id: string
  invoiceNumber: string
  restaurant: string
  amount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  createdAt: string
  paidAt?: string
}

interface BillingResponse {
  invoices: Invoice[]
  total: number
  page: number
  limit: number
  totalPages: number
  totalRevenue?: number
  totalPending?: number
}

// Mock service for testing (replace with real service)
const billingService = {
  async getInvoices(params: QueryParams): Promise<BillingResponse> {
    // TODO: Replace with real API call
    // return apiClient.get('/billing/invoices', { params })
    return Promise.resolve({
      invoices: [
        {
          id: '1',
          invoiceNumber: 'INV-001',
          restaurant: 'Restaurant A',
          amount: 5000,
          status: 'paid',
          dueDate: '2026-02-01',
          createdAt: '2026-01-15',
          paidAt: '2026-01-18',
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
      totalRevenue: 125000,
      totalPending: 15000,
    })
  },
}

const BillingManagement = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [limit] = useState(20)

  // Build query params
  const queryParams: QueryParams = {
    page,
    limit,
    ...(search && { search }),
    ...(status && { status }),
  }

  // Fetch invoices
  const { data, loading, error, refetch } = useQuery(
    () => billingService.getInvoices(queryParams),
    {
      retryCount: 3,
      retryDelay: 1000,
      dependencies: [page, search, status, limit],
    }
  )

  // Loading state
  if (loading && !data) {
    return <LoadingSpinner text="Loading invoices..." />
  }

  // Error state
  if (error && !data) {
    return (
      <ErrorAlert
        error={error}
        title="Failed to load invoices"
        onRetry={refetch}
      />
    )
  }

  // Empty state
  if (!data?.invoices || data.invoices.length === 0) {
    return (
      <EmptyState
        title="No invoices yet"
        description="Invoices will appear here as restaurants make transactions"
        action={() => console.log('Create invoice')}
        buttonLabel="+ Create Invoice"
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
              <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
              <p className="text-gray-600 mt-1">Manage invoices and payments</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              + Create Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Revenue */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${data?.totalRevenue?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-green-600 mt-2">📈 All time</p>
            </div>
          </Card>

          {/* Pending Payments */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Payments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${data?.totalPending?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-orange-600 mt-2">⏳ Awaiting payment</p>
            </div>
          </Card>

          {/* Total Invoices */}
          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {data?.total || '0'}
              </p>
              <p className="text-sm text-blue-600 mt-2">📋 All invoices</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div className="md:col-span-2">
            <SearchInput
              placeholder="Search by invoice number or restaurant..."
              value={search}
              onChange={setSearch}
            />
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
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
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Due Date
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
                {data.invoices.map((invoice: Invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {invoice.restaurant}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : invoice.status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      {invoice.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-700 font-medium mr-4">
                          Mark Paid
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-700 font-medium mr-4">
                        View
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
            Showing <span className="font-semibold">{data.invoices.length}</span> of{' '}
            <span className="font-semibold">{data.total}</span> invoices
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

export default BillingManagement
