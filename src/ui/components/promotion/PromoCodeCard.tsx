/**
 * PromoCodeCard Component
 * 
 * Card display for individual promo codes.
 * Shows usage stats, copy functionality, and status.
 */

import React, { useState } from 'react'

export interface PromoCode {
  code: string
  discount: number
  discountType: 'percentage' | 'fixed'
  used: number
  maxUses?: number
  status: 'active' | 'inactive' | 'expired'
  createdAt: Date
  expiresAt?: Date
}

interface PromoCodeCardProps {
  code: PromoCode
  onCopy?: (code: string) => void
  onDeactivate?: (code: string) => void
  onViewDetails?: (code: string) => void
  className?: string
}

/**
 * PromoCodeCard Component
 */
export const PromoCodeCard: React.FC<PromoCodeCardProps> = ({
  code,
  onCopy,
  onDeactivate,
  onViewDetails,
  className = '',
}) => {
  const [copied, setCopied] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code.code)
    setCopied(true)
    onCopy?.(code.code)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDeactivate = async () => {
    if (confirm(`\u0412\u044b \u0443\u0432\u0435\u0440\u0435\u043d\u044b, \u0447\u0442\u043e \u0445\u043e\u0442\u0438\u0442\u0435 \u0434\u0435\u0430\u043a\u0442\u0438\u0432\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043a\u043e\u0434 ${code.code}?`)) {
      setIsDeactivating(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        onDeactivate?.(code.code)
      } finally {
        setIsDeactivating(false)
      }
    }
  }

  const usagePercentage = code.maxUses ? (code.used / code.maxUses) * 100 : 0
  const discountText =
    code.discountType === 'percentage' ? `${code.discount}%` : `\u20bd${code.discount}`

  const statusColor = {
    active: 'bg-green-100 text-green-800 border-green-300',
    inactive: 'bg-gray-100 text-gray-800 border-gray-300',
    expired: 'bg-red-100 text-red-800 border-red-300',
  }

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-mono text-lg font-bold text-gray-900">{code.code}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {new Date(code.createdAt).toLocaleDateString('ru-RU')}
          </p>
        </div>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium border ${
            statusColor[code.status]
          }`}
        >
          {code.status === 'active' && '\u2705 Active'}
          {code.status === 'inactive' && '\u23f8\ufe0f Inactive'}
          {code.status === 'expired' && '\u26a0\ufe0f Expired'}
        </span>
      </div>

      {/* Discount Info */}
      <div className="mt-3 rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 p-3">
        <p className="text-center text-3xl font-bold text-teal-600">{discountText}</p>
        <p className="text-center text-xs text-teal-700">\ud83d\udcb0 \u0421\u043a\u0438\u0434\u043a\u0430</p>
      </div>

      {/* Usage Stats */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">\ud83d\udcb3 \u041e\u0441\u0442\u0430\u043b\u043e\u0441\u044c п\u0440\u0438\u043c\u0435\u043d\u0435\u043d\u0438\u0439:</span>
          <span className="font-medium text-gray-900">
            {code.maxUses ? `${code.used} / ${code.maxUses}` : '\u041d\u0435 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u043e'}
          </span>
        </div>
        {code.maxUses && (
          <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-full transition-all ${
                usagePercentage > 80
                  ? 'bg-red-500'
                  : usagePercentage > 50
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Expiration */}
      {code.expiresAt && (
        <div className="mt-3 rounded-lg bg-blue-50 p-2 text-center text-xs text-blue-800">
          \ud83d\udcc5 \u041e\u043a\u043e\u043d\u0447\u0438\u0442 {new Date(code.expiresAt).toLocaleDateString('ru-RU')}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 rounded-lg border border-teal-300 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
          aria-label="\u041a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c к\u043e\u0434"
        >
          {copied ? '\u2705 \u041a\u043e\u043f\u0438\u044f!' : '\ud83d\udccb \u041a\u043e\u043f\u0438\u044f'}
        </button>
        {code.status === 'active' && (
          <button
            onClick={handleDeactivate}
            disabled={isDeactivating}
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="\u0414\u0435\u0430\u043a\u0442\u0438\u0432\u0438\u0440\u043e\u0432\u0430\u0442\u044c"
          >
            {isDeactivating ? '\u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430...' : '\ud83d\udeab \u041e\u0442\u043a\u043b\u044e\u0447'}
          </button>
        )}
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(code.code)}
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            aria-label="\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435"
          >
            \ud83d\udcc8 \u0414\u0435\u0442\u0430\u043b\u0438
          </button>
        )}
      </div>
    </div>
  )
}

export default PromoCodeCard
