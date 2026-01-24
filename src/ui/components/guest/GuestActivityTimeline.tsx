/**
 * GuestActivityTimeline Component
 * 
 * Visual timeline of guest activities.
 * Shows visits, purchases, tier changes, referrals.
 * Chronological display with detailed information.
 */

import React, { useMemo } from 'react'

export type ActivityType = 'visit' | 'purchase' | 'tier_upgrade' | 'referral' | 'registration'

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: Date
  amount?: number
  metadata?: Record<string, any>
}

interface GuestActivityTimelineProps {
  activities: Activity[]
  maxItems?: number
  className?: string
}

const ACTIVITY_CONFIG = {
  visit: {
    icon: '📍',
    color: 'bg-blue-100 text-blue-700',
    title: 'Посещение',
  },
  purchase: {
    icon: '💳',
    color: 'bg-green-100 text-green-700',
    title: 'Приобретение',
  },
  tier_upgrade: {
    icon: '💆',
    color: 'bg-purple-100 text-purple-700',
    title: 'Повышение уровня',
  },
  referral: {
    icon: '👥',
    color: 'bg-yellow-100 text-yellow-700',
    title: 'Пригласил друга',
  },
  registration: {
    icon: '🌟',
    color: 'bg-teal-100 text-teal-700',
    title: 'Поддержка программы',
  },
}

/**
 * Guest Activity Timeline Component
 */
export const GuestActivityTimeline: React.FC<GuestActivityTimelineProps> = ({
  activities,
  maxItems = 20,
  className = '',
}) => {
  const sortedActivities = useMemo(
    () => [...activities].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, maxItems),
    [activities, maxItems],
  )

  if (activities.length === 0) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-gray-50 p-8 text-center ${className}`}>
        <p className="text-gray-600">Нет активности</p>
      </div>
    )
  }

  return (
    <div className={`space-y-0 ${className}`}>
      <div className="space-y-4">
        {sortedActivities.map((activity, index) => {
          const config = ACTIVITY_CONFIG[activity.type]
          const isLast = index === sortedActivities.length - 1

          return (
            <div key={activity.id} className="flex gap-4">
              {/* Timeline marker */}
              <div className="flex flex-col items-center">
                {/* Dot */}
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.color}`}>
                  <span className="text-lg">{config.icon}</span>
                </div>
                {/* Line */}
                {!isLast && <div className="h-12 w-0.5 bg-gray-200" />}
              </div>

              {/* Activity content */}
              <div className="flex-1 pb-4">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                      <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                      {activity.amount !== undefined && (
                        <p className="mt-2 text-sm font-medium text-teal-600">
                          {activity.type === 'purchase' ? '-' : '+'} {Math.abs(activity.amount)}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-xs text-gray-500">{formatTime(activity.timestamp)}</p>
                      <p className="mt-1 text-xs font-medium text-gray-700">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>

                  {/* Metadata */}
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <div className="mt-3 space-y-1 border-t border-gray-100 pt-3">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs text-gray-600">
                          <span className="capitalize">{key}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Load more hint */}
      {activities.length > maxItems && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Показываотся выпоследние {maxItems} из {activities.length} событий
          </p>
        </div>
      )}
    </div>
  )
}

interface ActivityFilterProps {
  activities: Activity[]
  selectedTypes: ActivityType[]
  onFilterChange: (types: ActivityType[]) => void
}

/**
 * Activity filter control
 */
export const ActivityFilter: React.FC<ActivityFilterProps> = ({
  activities,
  selectedTypes,
  onFilterChange,
}) => {
  const activityTypes: ActivityType[] = ['visit', 'purchase', 'tier_upgrade', 'referral', 'registration']
  const typeCounts = useMemo(() => {
    const counts: Record<ActivityType, number> = {
      visit: 0,
      purchase: 0,
      tier_upgrade: 0,
      referral: 0,
      registration: 0,
    }
    activities.forEach((a) => counts[a.type]++)
    return counts
  }, [activities])

  const handleTypeToggle = (type: ActivityType) => {
    if (selectedTypes.includes(type)) {
      onFilterChange(selectedTypes.filter((t) => t !== type))
    } else {
      onFilterChange([...selectedTypes, type])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activityTypes.map((type) => {
        const config = ACTIVITY_CONFIG[type]
        const count = typeCounts[type]
        const isSelected = selectedTypes.includes(type)

        return (
          <button
            key={type}
            onClick={() => handleTypeToggle(type)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-colors ${
              isSelected
                ? config.color
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={isSelected}
          >
            <span>{config.icon}</span>
            <span>{config.title}</span>
            {count > 0 && <span className="font-medium">({count})</span>}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Format timestamp to time string
 */
function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * Format timestamp to date string
 */
function formatDate(date: Date): string {
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Сегодня'
  if (diffDays === 1) return 'Вчера'
  if (diffDays < 7) return `${diffDays} дней назад`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} месяцев назад`

  return date.toLocaleDateString('ru-RU')
}

export default GuestActivityTimeline
