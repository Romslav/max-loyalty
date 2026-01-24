/**
 * GuestProfileCard Component
 * 
 * Comprehensive guest profile display card.
 * Shows name, tier, stats, and actions.
 * Responsive design with interactive elements.
 */

import React, { useMemo } from 'react'
import { GuestTierBadge, GuestTierBadgeWithProgress } from './GuestTierBadge'
import { type GuestProfile } from '../../../stores/guestStore'

interface GuestProfileCardProps {
  profile: GuestProfile
  currentPoints?: number
  maxPoints?: number
  onEditClick?: () => void
  onViewDetailsClick?: () => void
  onReferClick?: () => void
  loading?: boolean
  className?: string
}

/**
 * Main GuestProfileCard component
 */
export const GuestProfileCard: React.FC<GuestProfileCardProps> = ({
  profile,
  currentPoints = 0,
  maxPoints = 10000,
  onEditClick,
  onViewDetailsClick,
  onReferClick,
  loading = false,
  className = '',
}) => {
  const joinedDate = useMemo(() => {
    return profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString('ru-RU') : '—'
  }, [profile.joinedAt])

  const lastVisitDate = useMemo(() => {
    if (!profile.lastVisit) return '—'
    const date = new Date(profile.lastVisit)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Сегодня'
    if (diffDays === 1) return 'Вчера'
    return `${diffDays} дней назад`
  }, [profile.lastVisit])

  if (loading) {
    return (
      <div className={`rounded-lg bg-white p-6 shadow-md ${className}`}>
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg bg-white shadow-md ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-teal-50 to-blue-50 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
            <p className="mt-1 text-sm text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-600">{profile.phone}</p>
          </div>
          <div className="text-right">
            <GuestTierBadge tier={profile.tier as any} size="lg" />
          </div>
        </div>
      </div>

      {/* Tier Progress */}
      <div className="border-b border-gray-200 p-6">
        <GuestTierBadgeWithProgress
          tier={profile.tier as any}
          currentPoints={currentPoints}
          maxPoints={maxPoints}
          showProgression={true}
          showDescription={true}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 border-b border-gray-200 p-6 md:grid-cols-4">
        <StatItem label="Визиты" value={profile.totalVisits.toString()} icon="📍" />
        <StatItem label="Потрачено" value={`$${profile.totalSpent.toFixed(2)}`} icon="💳" />
        <StatItem label="Присоединился" value={joinedDate} icon="📅" />
        <StatItem label="Последний визит" value={lastVisitDate} icon="⏱️" />
      </div>

      {/* Referral Code */}
      <div className="border-b border-gray-200 p-6">
        <h3 className="mb-3 font-semibold text-gray-900">Ваш реферальный код</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg bg-gray-100 px-4 py-2 font-mono text-sm font-medium text-gray-900">
            {profile.referralCode}
          </div>
          <button
            onClick={onReferClick}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:bg-teal-800"
            aria-label="Поделиться реферальным кодом"
          >
            📤 Поделиться
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Статус аккаунта</span>
          <StatusBadge status={profile.status} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 bg-gray-50 p-6">
        <button
          onClick={onEditClick}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center font-medium text-gray-700 transition-colors hover:bg-gray-100"
          aria-label="Редактировать профиль"
        >
          ✏️ Редактировать
        </button>
        <button
          onClick={onViewDetailsClick}
          className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-teal-700"
          aria-label="Посмотреть подробности"
        >
          👁️ Подробнее
        </button>
      </div>
    </div>
  )
}

interface StatItemProps {
  label: string
  value: string
  icon?: string
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon }) => (
  <div className="text-center">
    {icon && <span className="block text-2xl">{icon}</span>}
    <p className="mt-2 text-sm text-gray-600">{label}</p>
    <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
  </div>
)

interface StatusBadgeProps {
  status: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    active: { label: 'Активный', color: 'bg-green-100 text-green-800' },
    inactive: { label: 'Неактивный', color: 'bg-gray-100 text-gray-800' },
    blocked: { label: 'Заблокирован', color: 'bg-red-100 text-red-800' },
    pending_verification: { label: 'На проверке', color: 'bg-yellow-100 text-yellow-800' },
  } as Record<string, { label: string; color: string }>

  const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' }

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  )
}

export default GuestProfileCard
