/**
 * GuestFilterPanel Component
 * 
 * Advanced filtering system for guests.
 * Multiple filter criteria, date ranges, custom fields.
 * Export and save filter presets.
 */

import React, { useState, useCallback } from 'react'

export interface FilterCriteria {
  tier?: string[]
  status?: string[]
  registrationDate?: { from: Date; to: Date }
  lastActivity?: { from: Date; to: Date }
  minPoints?: number
  maxPoints?: number
  hasReferrals?: boolean
  tags?: string[]
}

interface GuestFilterPanelProps {
  onFilterChange: (filters: FilterCriteria) => void
  onSavePreset?: (name: string, filters: FilterCriteria) => void
  presets?: { name: string; filters: FilterCriteria }[]
  className?: string
}

/**
 * Guest Filter Panel Component
 */
export const GuestFilterPanel: React.FC<GuestFilterPanelProps> = ({
  onFilterChange,
  onSavePreset,
  presets = [],
  className = '',
}) => {
  const [filters, setFilters] = useState<FilterCriteria>({})
  const [isExpanded, setIsExpanded] = useState(false)
  const [presetName, setPresetName] = useState('')

  const handleTierChange = useCallback(
    (tier: string) => {
      setFilters((prev) => {
        const tiers = prev.tier || []
        const updated = tiers.includes(tier) ? tiers.filter((t) => t !== tier) : [...tiers, tier]
        return { ...prev, tier: updated.length > 0 ? updated : undefined }
      })
    },
    [],
  )

  const handleStatusChange = useCallback(
    (status: string) => {
      setFilters((prev) => {
        const statuses = prev.status || []
        const updated = statuses.includes(status)
          ? statuses.filter((s) => s !== status)
          : [...statuses, status]
        return { ...prev, status: updated.length > 0 ? updated : undefined }
      })
    },
    [],
  )

  const handlePointsChange = useCallback((type: 'min' | 'max', value: number) => {
    setFilters((prev) => ({
      ...prev,
      [type === 'min' ? 'minPoints' : 'maxPoints']: value || undefined,
    }))
  }, [])

  const handleHasReferralsChange = useCallback((checked: boolean) => {
    setFilters((prev) => ({ ...prev, hasReferrals: checked ? true : undefined }))
  }, [])

  const handleApplyFilters = useCallback(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleSavePreset = useCallback(() => {
    if (presetName.trim()) {
      onSavePreset?.(presetName, filters)
      setPresetName('')
    }
  }, [presetName, filters, onSavePreset])

  const handleLoadPreset = useCallback(
    (preset: { name: string; filters: FilterCriteria }) => {
      setFilters(preset.filters)
      onFilterChange(preset.filters)
    },
    [onFilterChange],
  )

  const handleReset = useCallback(() => {
    const emptyFilters: FilterCriteria = {}
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }, [onFilterChange])

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined)

  return (
    <div className={`rounded-lg border border-gray-200 bg-white ${className}`}>
      {/* Header */}
      <div
        className="flex cursor-pointer items-center justify-between border-b border-gray-200 px-6 py-4"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🔎</span>
          <h3 className="font-semibold text-gray-900">
            Фильтры
            {hasActiveFilters && <span className="ml-2 text-sm text-teal-600">({Object.keys(filters).length} активных)</span>}
          </h3>
        </div>
        <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="space-y-6 px-6 py-4">
          {/* Tier Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              📈 Уровеньи лояльности
            </label>
            <div className="space-y-2">
              {['bronze', 'silver', 'gold', 'platinum', 'vip'].map((tier) => (
                <label key={tier} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filters.tier?.includes(tier) || false}
                    onChange={(e) => handleTierChange(tier)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {tier === 'bronze' && '🥉 Bronze'}
                    {tier === 'silver' && '🥈 Silver'}
                    {tier === 'gold' && '⭐ Gold'}
                    {tier === 'platinum' && '💎 Platinum'}
                    {tier === 'vip' && '👑 VIP'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              📄 Статус
            </label>
            <div className="space-y-2">
              {['active', 'inactive', 'blocked', 'pending_verification'].map((status) => (
                <label key={status} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filters.status?.includes(status) || false}
                    onChange={(e) => handleStatusChange(status)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {status === 'active' && '✅ Active'}
                    {status === 'inactive' && '⏸️ Inactive'}
                    {status === 'blocked' && '🚫 Blocked'}
                    {status === 'pending_verification' && '⏳ Pending'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Points Range */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              💰 Диапазон очков
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  value={filters.minPoints || ''}
                  onChange={(e) => handlePointsChange('min', parseInt(e.target.value) || 0)}
                  placeholder="Min"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={filters.maxPoints || ''}
                  onChange={(e) => handlePointsChange('max', parseInt(e.target.value) || 0)}
                  placeholder="Max"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Referrals Filter */}
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={filters.hasReferrals || false}
                onChange={(e) => handleHasReferralsChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-teal-600"
              />
              <span className="text-sm font-semibold text-gray-900">
                👥 Открыт реферральные на всех
              </span>
            </label>
          </div>

          {/* Presets */}
          {presets.length > 0 && (
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <label className="block text-sm font-semibold text-gray-900">
                📁 Проприеты
              </label>
              <div className="grid gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleLoadPreset(preset)}
                    className="rounded border border-gray-300 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Save Preset */}
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <label className="block text-sm font-semibold text-gray-900">
              💾 Сохранить текущие фильтры
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Название проприета"
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
                className="rounded bg-teal-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                💾 Сохранить
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-gray-200 pt-4">
            <button
              onClick={handleReset}
              className="flex-1 rounded border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Очистить
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 rounded bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-700"
            >
              Применить
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestFilterPanel
