/**
 * GuestTierBadge Component
 * 
 * Visual indicator for guest loyalty tier.
 * Shows tier name, level indicator, and progression.
 * Responsive and accessible.
 */

import React, { useMemo } from 'react'
import { type GuestTier } from '../../../domain'

interface GuestTierBadgeProps {
  tier: GuestTier
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showLabel?: boolean
  interactive?: boolean
  className?: string
  onClick?: () => void
}

const TIER_CONFIG = {
  bronze: {
    label: 'Bronze',
    color: 'bg-amber-100 text-amber-900',
    borderColor: 'border-amber-300',
    icon: '🥉',
    description: 'Новый участник',
    nextTier: 'silver',
    threshold: 0,
    nextThreshold: 500,
  },
  silver: {
    label: 'Silver',
    color: 'bg-gray-100 text-gray-900',
    borderColor: 'border-gray-300',
    icon: '🥈',
    description: 'Постоянный клиент',
    nextTier: 'gold',
    threshold: 500,
    nextThreshold: 1500,
  },
  gold: {
    label: 'Gold',
    color: 'bg-yellow-100 text-yellow-900',
    borderColor: 'border-yellow-300',
    icon: '⭐',
    description: 'Ценный участник',
    nextTier: 'platinum',
    threshold: 1500,
    nextThreshold: 3500,
  },
  platinum: {
    label: 'Platinum',
    color: 'bg-blue-100 text-blue-900',
    borderColor: 'border-blue-300',
    icon: '💎',
    description: 'Premium участник',
    nextTier: 'vip',
    threshold: 3500,
    nextThreshold: 7000,
  },
  vip: {
    label: 'VIP',
    color: 'bg-purple-100 text-purple-900',
    borderColor: 'border-purple-300',
    icon: '👑',
    description: 'Элитный участник',
    nextTier: null,
    threshold: 7000,
    nextThreshold: null,
  },
} as const

const SIZE_CLASSES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2 text-base',
} as const

const ICON_SIZES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
} as const

/**
 * GuestTierBadge Component
 * Displays visual representation of guest tier
 */
export const GuestTierBadge: React.FC<GuestTierBadgeProps> = ({
  tier,
  size = 'md',
  showIcon = true,
  showLabel = true,
  interactive = false,
  className = '',
  onClick,
}) => {
  const config = TIER_CONFIG[tier]

  const sizeClass = SIZE_CLASSES[size]
  const iconSize = ICON_SIZES[size]

  const badge = useMemo(
    () => (
      <div
        className={`
          inline-flex items-center gap-2
          ${sizeClass}
          rounded-full
          border border-current
          font-medium
          transition-all duration-200
          ${config.color}
          ${config.borderColor}
          ${interactive ? 'cursor-pointer hover:shadow-md' : ''}
          ${className}
        `}
        onClick={onClick}
        role="status"
        aria-label={`${config.label} tier: ${config.description}`}
        title={config.description}
      >
        {showIcon && <span className={`${iconSize} leading-none`}>{config.icon}</span>}
        {showLabel && <span className="font-semibold">{config.label}</span>}
      </div>
    ),
    [tier, size, showIcon, showLabel, interactive, className, onClick],
  )

  return badge
}

interface GuestTierBadgeGroupProps {
  tier: GuestTier
  currentPoints?: number
  maxPoints?: number
  showProgression?: boolean
  showDescription?: boolean
  className?: string
}

/**
 * Extended component showing tier with progression info
 */
export const GuestTierBadgeWithProgress: React.FC<GuestTierBadgeGroupProps> = ({
  tier,
  currentPoints = 0,
  maxPoints = 10000,
  showProgression = true,
  showDescription = true,
  className = '',
}) => {
  const config = TIER_CONFIG[tier]
  const progressPercentage = (currentPoints / maxPoints) * 100

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <GuestTierBadge tier={tier} size="lg" showLabel={true} showIcon={true} />
        {showDescription && <p className="text-sm text-gray-600">{config.description}</p>}
      </div>

      {showProgression && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Прогресс</span>
            <span className="font-semibold text-gray-900">
              {currentPoints.toLocaleString()} / {maxPoints.toLocaleString()} точек
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(progressPercentage, 100)}%`,
                backgroundColor: config.color.split(' ')[0].replace('bg-', 'bg-').substring(0, 20),
              }}
              role="progressbar"
              aria-valuenow={currentPoints}
              aria-valuemin={0}
              aria-valuemax={maxPoints}
            />
          </div>

          {config.nextTier && (
            <p className="text-xs text-gray-500">
              {config.nextThreshold! - currentPoints} точек до {TIER_CONFIG[config.nextTier].label}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

interface TierListProps {
  currentTier: GuestTier
  className?: string
}

/**
 * Display all available tiers
 */
export const TierList: React.FC<TierListProps> = ({ currentTier, className = '' }) => {
  const tiers: GuestTier[] = ['bronze', 'silver', 'gold', 'platinum', 'vip']

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="font-semibold text-gray-900">Доступные уровни</h3>
      <div className="grid gap-3">
        {tiers.map((tier) => (
          <div key={tier} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <div className="flex items-center gap-3">
              <GuestTierBadge tier={tier} size="sm" />
              <div>
                <p className="font-medium text-gray-900">{TIER_CONFIG[tier].label}</p>
                <p className="text-xs text-gray-500">От {TIER_CONFIG[tier].threshold.toLocaleString()} точек</p>
              </div>
            </div>
            {tier === currentTier && (
              <span className="text-xs font-semibold text-teal-600">Текущий уровень</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GuestTierBadge
