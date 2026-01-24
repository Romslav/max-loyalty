/**
 * GuestSearchBar Component
 * 
 * Advanced search and filter bar for guests.
 * Supports search by name, email, phone, tier, status.
 * Real-time search with debouncing.
 */

import React, { useState, useCallback, useEffect } from 'react'

interface GuestSearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void
  onClear?: () => void
  placeholder?: string
  debounceMs?: number
  className?: string
}

export interface SearchFilters {
  tier?: string
  status?: string
  visitRange?: [number, number]
  spentRange?: [number, number]
}

/**
 * Guest Search Bar Component
 */
export const GuestSearchBar: React.FC<GuestSearchBarProps> = ({
  onSearch,
  onClear,
  placeholder = 'Поиск гостя...',
  debounceMs = 300,
  className = '',
}) => {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [isExpanded, setIsExpanded] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  // Debounced search
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer)

    const timer = setTimeout(() => {
      onSearch(query, filters)
    }, debounceMs)

    setDebounceTimer(timer)

    return () => clearTimeout(timer)
  }, [query, filters, debounceMs, onSearch])

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  const handleTierChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, tier: e.target.value || undefined }))
  }, [])

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, status: e.target.value || undefined }))
  }, [])

  const handleClear = useCallback(() => {
    setQuery('')
    setFilters({})
    onClear?.()
  }, [onClear])

  const hasFilters = query || Object.values(filters).some((v) => v !== undefined)

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </div>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsExpanded(true)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Поиск гостей"
          />
        </div>
        {hasFilters && (
          <button
            onClick={handleClear}
            className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
            aria-label="Очистить поиск"
          >
            × Очистить
          </button>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
          aria-label="Показать фильтры"
        >
          📄 Фильтры
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid gap-3 rounded-lg bg-gray-50 p-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Tier Filter */}
          <div className="space-y-1">
            <label htmlFor="tier-filter" className="block text-xs font-semibold text-gray-700">
              Уровень
            </label>
            <select
              id="tier-filter"
              value={filters.tier || ''}
              onChange={handleTierChange}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Все уровни</option>
              <option value="bronze">🥉 Bronze</option>
              <option value="silver">🥈 Silver</option>
              <option value="gold">⭐ Gold</option>
              <option value="platinum">💎 Platinum</option>
              <option value="vip">👑 VIP</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label htmlFor="status-filter" className="block text-xs font-semibold text-gray-700">
              Статус
            </label>
            <select
              id="status-filter"
              value={filters.status || ''}
              onChange={handleStatusChange}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
              <option value="blocked">Заблокированные</option>
            </select>
          </div>

          {/* Active Filters Summary */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-700">✓ Активные фильтры</p>
            <div className="flex flex-wrap gap-2">
              {query && (
                <span className="inline-block rounded-full bg-teal-100 px-2 py-1 text-xs text-teal-800">
                  Поиск: {query}
                </span>
              )}
              {filters.tier && (
                <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                  {filters.tier}
                </span>
              )}
              {filters.status && (
                <span className="inline-block rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
                  {filters.status}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestSearchBar
