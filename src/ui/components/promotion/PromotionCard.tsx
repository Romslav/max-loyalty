/**
 * PromotionCard Component
 * 
 * Display promotion details with status and actions.
 * Shows discount information, usage stats, and tier applicability.
 */

import React from 'react'
import { PromotionType, PromotionStatus } from '../../../domain/entities/promotion/Promotion'

interface PromotionCardProps {
  id: string
  code: string
  name: string
  description: string
  discountType: PromotionType
  discountValue: number
  status: PromotionStatus
  startDate: Date
  endDate: Date
  usageRate: number // 0-100
  applicableTiers: string[]
  onEdit?: () => void
  onView?: () => void
  onPause?: () => void
  onDelete?: () => void
  className?: string
}

const STATUS_CONFIG = {
  [PromotionStatus.DRAFT]: {
    icon: '📝',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    label: 'Draft',
  },
  [PromotionStatus.ACTIVE]: {
    icon: '✅',
    color: 'bg-green-100 text-green-800 border-green-300',
    label: 'Active',
  },
  [PromotionStatus.SCHEDULED]: {
    icon: '🕐',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    label: 'Scheduled',
  },
  [PromotionStatus.PAUSED]: {
    icon: '⏸️',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    label: 'Paused',
  },
  [PromotionStatus.EXPIRED]: {
    icon: '⏰',
    color: 'bg-red-100 text-red-800 border-red-300',
    label: 'Expired',
  },
  [PromotionStatus.ARCHIVED]: {
    icon: '📦',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    label: 'Archived',
  },
}

/**
 * PromotionCard Component
 */
export const PromotionCard: React.FC<PromotionCardProps> = ({
  id,
  code,
  name,
  description,
  discountType,
  discountValue,
  status,
  startDate,
  endDate,
  usageRate,
  applicableTiers,
  onEdit,
  onView,
  onPause,
  onDelete,
  className = '',
}) => {
  const statusConfig = STATUS_CONFIG[status]
  const daysUntilExpiry = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 hover:shadow-lg transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.icon} {statusConfig.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
        <div className="ml-4 flex gap-2">
          {onView && (
            <button
              onClick={onView}
              className="rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label="View"
            >
              👁️
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-lg bg-teal-100 p-2 text-teal-700 hover:bg-teal-200 transition-colors"
              aria-label="Edit"
            >
              ✏️
            </button>
          )}
        </div>
      </div>

      {/* Code & Discount */}
      <div className="mt-3 grid grid-cols-3 gap-3 rounded-lg bg-gray-50 p-3">
        <div>
          <p className="text-xs font-medium text-gray-600">Code</p>
          <p className="mt-1 font-mono text-sm font-bold text-gray-900">{code}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600">Discount</p>
          <p className="mt-1 text-sm font-bold text-teal-600">
            {discountType === PromotionType.PERCENTAGE ? `${discountValue}%` : `$${discountValue}`}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600">Type</p>
          <p className="mt-1 text-sm capitalize text-gray-700">
            {discountType.replace('_', ' ')}
          </p>
        </div>
      </div>

      {/* Usage Progress */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <p className="font-medium text-gray-600">Usage</p>
          <p className="text-gray-700">{usageRate}%</p>
        </div>
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-teal-600 transition-all"
            style={{ width: `${Math.min(100, usageRate)}%` }}
          />
        </div>
      </div>

      {/* Dates & Tiers */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-medium text-gray-600">Started</p>
          <p className="mt-1 text-sm text-gray-700">{startDate.toLocaleDateString('ru-RU')}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600">Expires</p>
          <p className={`mt-1 text-sm font-medium ${
            daysUntilExpiry < 3 ? 'text-red-600' : 'text-gray-700'
          }`}>
            {endDate.toLocaleDateString('ru-RU')}
            {daysUntilExpiry >= 0 && <span className="ml-1 text-xs">({daysUntilExpiry}d)</span>}
          </p>
        </div>
      </div>

      {/* Applicable Tiers */}
      {applicableTiers.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-600">Applicable Tiers</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {applicableTiers.map((tier) => (
              <span
                key={tier}
                className="inline-block rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700 capitalize"
              >
                {tier}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
        {onPause && (
          <button
            onClick={onPause}
            className="flex-1 rounded-lg border border-yellow-300 px-3 py-2 text-center text-sm font-medium text-yellow-700 transition-colors hover:bg-yellow-50"
          >
            ⏸️ {status === PromotionStatus.PAUSED ? 'Resume' : 'Pause'}
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-center text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default PromotionCard
