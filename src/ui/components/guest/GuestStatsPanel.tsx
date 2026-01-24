/**
 * GuestStatsPanel Component
 * 
 * Analytics and statistics panel showing guest activity.
 * Charts, trends, and performance metrics.
 * Responsive design with detailed breakdowns.
 */

import React, { useMemo } from 'react'

interface StatMetric {
  label: string
  value: string
  trend?: 'up' | 'down' | 'stable'
  change?: string
  icon: string
}

interface GuestStatsPanelProps {
  totalVisits: number
  totalSpent: number
  lastVisit?: Date
  currentTier: string
  pointsBalance: number
  averageSpendPerVisit?: number
  visitsThisMonth?: number
  spentThisMonth?: number
  className?: string
}

/**
 * Guest Stats Panel Component
 */
export const GuestStatsPanel: React.FC<GuestStatsPanelProps> = ({
  totalVisits,
  totalSpent,
  lastVisit,
  currentTier,
  pointsBalance,
  averageSpendPerVisit = 0,
  visitsThisMonth = 0,
  spentThisMonth = 0,
  className = '',
}) => {
  const stats: StatMetric[] = useMemo(
    () => [
      {
        label: 'Общие визиты',
        value: totalVisits.toString(),
        trend: 'up',
        change: `+${visitsThisMonth} этом месяце`,
        icon: '📍',
      },
      {
        label: 'Общие траты',
        value: `$${totalSpent.toFixed(2)}`,
        trend: 'up',
        change: `+$${spentThisMonth.toFixed(2)} этом месяце`,
        icon: '💳',
      },
      {
        label: 'Появление в среднем',
        value: `$${averageSpendPerVisit.toFixed(2)}`,
        trend: 'stable',
        icon: '📊',
      },
      {
        label: 'Остаток покупок',
        value: pointsBalance.toString(),
        trend: 'up',
        icon: '🌟',
      },
    ],
    [totalVisits, totalSpent, visitsThisMonth, spentThisMonth, averageSpendPerVisit, pointsBalance],
  )

  const lastVisitText = useMemo(() => {
    if (!lastVisit) return 'Никогда'
    const date = new Date(lastVisit)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Сегодня'
    if (diffDays === 1) return 'Вчера'
    if (diffDays < 7) return `${diffDays} дней назад`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`
    return `${Math.floor(diffDays / 30)} месяцев назад`
  }, [lastVisit])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Предыдущая деятельность</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <ActivityItem
            icon="📍"
            label="Последнее посещение"
            value={lastVisitText}
          />
          <ActivityItem
            icon="🌟"
            label="Экономиям уровня"
            value={currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
          />
        </div>
      </div>

      {/* Tier Breakdown */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Основные мотрики</h3>
        <div className="grid gap-3">
          <MetricRow
            icon="💳"
            label="Общие траты"
            value={`$${totalSpent.toFixed(2)}`}
            percentage={(spentThisMonth / Math.max(totalSpent, 1)) * 100}
          />
          <MetricRow
            icon="📍"
            label="Общие визиты"
            value={totalVisits.toString()}
            percentage={(visitsThisMonth / Math.max(totalVisits, 1)) * 100}
          />
          <MetricRow
            icon="⏱️"
            label="Средняя появление"
            value={`$${averageSpendPerVisit.toFixed(2)}`}
            percentage={(averageSpendPerVisit / 1000) * 100} // Max $1000
          />
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  stat: StatMetric
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600',
  }[stat.trend || 'stable']

  const trendIcon = {
    up: '↗️',
    down: '↘️',
    stable: '→️',
  }[stat.trend || 'stable']

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600">{stat.label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
          {stat.change && (
            <p className={`mt-1 text-xs ${trendColor}`}>
              {trendIcon} {stat.change}
            </p>
          )}
        </div>
        <span className="text-2xl">{stat.icon}</span>
      </div>
    </div>
  )
}

interface ActivityItemProps {
  icon: string
  label: string
  value: string
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
)

interface MetricRowProps {
  icon: string
  label: string
  value: string
  percentage: number
}

const MetricRow: React.FC<MetricRowProps> = ({ icon, label, value, percentage }) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm text-gray-600">{label}</span>
        </div>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-teal-500 transition-all duration-300"
          style={{ width: `${clampedPercentage}%` }}
          role="progressbar"
          aria-valuenow={clampedPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="text-xs text-gray-500">{clampedPercentage.toFixed(0)}% этот месяц</p>
    </div>
  )
}

export default GuestStatsPanel
