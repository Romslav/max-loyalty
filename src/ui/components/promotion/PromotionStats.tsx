/**
 * PromotionStats Component
 * 
 * Display promotion statistics and KPIs.
 * Usage metrics, earnings, performance analytics.
 */

import React, { useMemo } from 'react'

export interface PromotionStat {
  id: string
  code: string
  name: string
  totalUsages: number
  totalDiscountAmount: number
  averageOrderValue: number
  uniqueGuestsUsed: number
  usagesByTier: Record<string, number>
  conversionRate: number // percentage
}

interface PromotionStatsProps {
  stats: PromotionStat[]
  className?: string
}

/**
 * PromotionStats Component
 */
export const PromotionStats: React.FC<PromotionStatsProps> = ({ stats, className = '' }) => {
  const totals = useMemo(() => ({
    totalPromotions: stats.length,
    totalUsages: stats.reduce((sum, s) => sum + s.totalUsages, 0),
    totalDiscountAmount: stats.reduce((sum, s) => sum + s.totalDiscountAmount, 0),
    averageUsagePerPromotion: Math.round(stats.reduce((sum, s) => sum + s.totalUsages, 0) / Math.max(1, stats.length)),
    uniqueGuestsReached: new Set(stats.flatMap(s => Array.from({ length: s.uniqueGuestsUsed }, (_, i) => i))).size,
  }), [stats])

  const topPerformer = useMemo(
    () => stats.reduce((top, current) => (current.totalUsages > top.totalUsages ? current : top), stats[0] || null),
    [stats],
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-600">🎯 Active</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totals.totalPromotions}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-600">📊 Total Uses</p>
          <p className="mt-2 text-3xl font-bold text-teal-600">{totals.totalUsages.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-600">💰 Discount $</p>
          <p className="mt-2 text-3xl font-bold text-green-600">${totals.totalDiscountAmount.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-600">👥 Guests</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{totals.uniqueGuestsReached}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-600">📈 Avg Usage</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">{totals.averageUsagePerPromotion}</p>
        </div>
      </div>

      {/* Top Performer */}
      {topPerformer && (
        <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">⭐ Top Performer</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{topPerformer.name}</p>
              <p className="mt-1 text-sm text-gray-600">
                Code: <span className="font-mono font-bold text-gray-900">{topPerformer.code}</span>
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-700">
                  📊 Uses: <span className="font-bold">{topPerformer.totalUsages}</span>
                </p>
                <p className="text-sm text-gray-700">
                  💰 Discount: <span className="font-bold">${topPerformer.totalDiscountAmount}</span>
                </p>
              </div>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
        </div>
      )}

      {/* Performance Table */}
      {stats.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Code</th>
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                <th className="border-b border-gray-200 px-4 py-3 text-right font-semibold text-gray-900">Uses</th>
                <th className="border-b border-gray-200 px-4 py-3 text-right font-semibold text-gray-900">Discount</th>
                <th className="border-b border-gray-200 px-4 py-3 text-right font-semibold text-gray-900">Avg Order</th>
                <th className="border-b border-gray-200 px-4 py-3 text-right font-semibold text-gray-900">Guests</th>
              </tr>
            </thead>
            <tbody>
              {stats.sort((a, b) => b.totalUsages - a.totalUsages).map((stat, index) => (
                <tr key={stat.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border-b border-gray-200 px-4 py-3">
                    <code className="font-mono font-bold text-gray-900">{stat.code}</code>
                  </td>
                  <td className="border-b border-gray-200 px-4 py-3 font-medium text-gray-900">{stat.name}</td>
                  <td className="border-b border-gray-200 px-4 py-3 text-right text-gray-700">{stat.totalUsages}</td>
                  <td className="border-b border-gray-200 px-4 py-3 text-right font-semibold text-green-600">
                    ${stat.totalDiscountAmount}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-3 text-right text-gray-700">
                    ${stat.averageOrderValue.toFixed(2)}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-3 text-right text-gray-700">{stat.uniqueGuestsUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {stats.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <p className="text-gray-600">📊 No promotion statistics available yet</p>
        </div>
      )}
    </div>
  )
}

export default PromotionStats
