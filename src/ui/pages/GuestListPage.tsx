/**
 * GuestListPage Component
 * 
 * Main page for managing guests.
 * Features: list, search, filter, bulk operations, export.
 * Pagination and real-time updates.
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { GuestSearchBar, type SearchFilters } from '../components/guest/GuestSearchBar'
import { GuestBulkActionsToolbar, type BulkAction } from '../components/guest/GuestBulkActionsToolbar'
import { EditGuestDialog } from '../components/guest/EditGuestDialog'
import type { GuestProfile } from '../../stores/guestStore'

interface GuestListPageProps {
  onNavigate?: (path: string) => void
}

interface TableGuest extends GuestProfile {
  selected?: boolean
}

/**
 * Guest List Page Component
 */
export const GuestListPage: React.FC<GuestListPageProps> = ({ onNavigate }) => {
  const [guests, setGuests] = useState<TableGuest[]>([])
  const [filteredGuests, setFilteredGuests] = useState<TableGuest[]>([])
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [editingGuest, setEditingGuest] = useState<TableGuest | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})

  const itemsPerPage = 20

  // Load guests
  useEffect(() => {
    const loadGuests = async () => {
      setIsLoading(true)
      try {
        // Mock data - replace with actual API call
        const mockGuests: TableGuest[] = [
          {
            id: '1',
            firstName: 'Иван',
            lastName: 'Петров',
            phone: '+79001234567',
            email: 'ivan@example.com',
            status: 'active',
            tier: 'gold',
            points: 15000,
            referralCode: 'IVAN2024',
            referredBy: null,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2025-01-24'),
            referralStats: { referrals: 5, earnings: 2500 },
          },
          {
            id: '2',
            firstName: 'Мария',
            lastName: 'Сидорова',
            phone: '+79009876543',
            email: 'maria@example.com',
            status: 'active',
            tier: 'platinum',
            points: 25000,
            referralCode: 'MARIA2024',
            referredBy: '1',
            createdAt: new Date('2024-02-10'),
            updatedAt: new Date('2025-01-24'),
            referralStats: { referrals: 12, earnings: 6000 },
          },
        ]
        setGuests(mockGuests)
      } finally {
        setIsLoading(false)
      }
    }

    loadGuests()
  }, [])

  // Filter guests
  useEffect(() => {
    let result = [...guests]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (g) =>
          g.firstName.toLowerCase().includes(query) ||
          g.lastName.toLowerCase().includes(query) ||
          g.email.toLowerCase().includes(query) ||
          g.phone.includes(query),
      )
    }

    // Tier filter
    if (filters.tier) {
      result = result.filter((g) => g.tier === filters.tier)
    }

    // Status filter
    if (filters.status) {
      result = result.filter((g) => g.status === filters.status)
    }

    setFilteredGuests(result)
    setCurrentPage(1)
  }, [guests, searchQuery, filters])

  const handleSearch = useCallback((query: string, newFilters: SearchFilters) => {
    setSearchQuery(query)
    setFilters(newFilters)
  }, [])

  const handleSelectGuest = useCallback((guestId: string) => {
    setSelectedGuestIds((prev) => {
      const next = new Set(prev)
      if (next.has(guestId)) {
        next.delete(guestId)
      } else {
        next.add(guestId)
      }
      return next
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    if (selectedGuestIds.size === paginatedGuests.length) {
      setSelectedGuestIds(new Set())
    } else {
      const ids = new Set(paginatedGuests.map((g) => g.id))
      setSelectedGuestIds(ids)
    }
  }, [selectedGuestIds])

  const handleBulkAction = useCallback(
    async (actionId: string, guestIds: string[]) => {
      switch (actionId) {
        case 'export':
          exportGuests(guestIds)
          break
        case 'block':
          // Handle block action
          break
        case 'activate':
          // Handle activate action
          break
      }
      setSelectedGuestIds(new Set())
    },
    [],
  )

  const bulkActions: BulkAction[] = [
    {
      id: 'export',
      label: 'Цв Экспорт',
      icon: '💾',
      color: 'secondary',
      onExecute: async (ids) => {
        exportGuests(ids)
      },
    },
    {
      id: 'block',
      label: '🚭 Заблокировать',
      icon: '🚭',
      color: 'danger',
      confirmRequired: true,
      confirmMessage: 'Вы точно что хотите заблокировать этих гостей?',
      onExecute: async (ids) => {
        // Handle block
      },
    },
  ]

  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredGuests.slice(start, end)
  }, [filteredGuests, currentPage])

  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage)

  function exportGuests(guestIds: string[]): void {
    const guestsToExport = guests.filter((g) => guestIds.includes(g.id))
    const csv = [
      ['ID', 'Name', 'Phone', 'Email', 'Tier', 'Status', 'Points'],
      ...guestsToExport.map((g) => [g.id, `${g.firstName} ${g.lastName}`, g.phone, g.email, g.tier, g.status, g.points]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `guests_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👥 Отдел гостей</h1>
          <p className="mt-2 text-gray-600">Отключ основных операций</p>
        </div>
        <button
          onClick={() => onNavigate?.('/guests/management')}
          className="rounded-lg bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700"
        >
          🏗️ Прибавить гостя
        </button>
      </div>

      {/* Search and Filter */}
      <GuestSearchBar onSearch={handleSearch} />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedGuestIds.size === paginatedGuests.length && paginatedGuests.length > 0}
                  onChange={handleSelectAll}
                  className="h-5 w-5 cursor-pointer rounded border-gray-300 text-teal-600"
                  aria-label="Выбрать все"
                />
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Наименование</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Контакт</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Очки</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Уровень</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Статус</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Выбрано</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedGuests.map((guest) => (
              <tr key={guest.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedGuestIds.has(guest.id)}
                    onChange={() => handleSelectGuest(guest.id)}
                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-teal-600"
                  />
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">
                    {guest.firstName} {guest.lastName}
                  </p>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <p className="text-sm">{guest.phone}</p>
                  <p className="text-xs text-gray-500">{guest.email}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-teal-600">{guest.points.toLocaleString()}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block rounded-full bg-teal-100 px-2 py-1 text-sm font-medium text-teal-800">
                    {guest.tier}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      guest.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {guest.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setEditingGuest(guest)}
                    className="text-teal-600 hover:text-teal-700"
                    aria-label="Отредактировать"
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            «
          </button>
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const page = i + Math.max(1, currentPage - 2)
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded px-3 py-2 ${
                  page === currentPage
                    ? 'bg-teal-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            )
          })}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            »
          </button>
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      {selectedGuestIds.size > 0 && (
        <GuestBulkActionsToolbar
          selectedGuestIds={Array.from(selectedGuestIds)}
          actions={bulkActions}
          onAction={handleBulkAction}
        />
      )}

      {/* Edit Dialog */}
      {editingGuest && (
        <EditGuestDialog
          guest={editingGuest}
          isOpen={true}
          onClose={() => setEditingGuest(null)}
          onSuccess={(updated) => {
            setGuests((prev) => prev.map((g) => (g.id === updated.id ? updated : g)))
            setEditingGuest(null)
          }}
        />
      )}
    </div>
  )
}

export default GuestListPage
