/**
 * ReferralManagementPage Component
 * 
 * Complete referral program management.
 * Tracking, analytics, commission management.
 * Real-time referral network visualization.
 */

import React, { useState, useMemo } from 'react'
import {
  GuestActivityTimeline,
  ActivityFilter,
  type Activity,
  type ActivityType,
} from '../components/guest/GuestActivityTimeline'

interface ReferredGuest {
  id: string
  firstName: string
  lastName: string
  email: string
  joinedDate: Date
  status: 'active' | 'inactive' | 'pending'
  pointsEarned: number
}

interface ReferrerStats {
  guestId: string
  firstName: string
  lastName: string
  email: string
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  referrals: ReferredGuest[]
}

interface ReferralManagementPageProps {
  onNavigate?: (path: string) => void
}

/**
 * Referral Management Page Component
 */
export const ReferralManagementPage: React.FC<ReferralManagementPageProps> = ({ onNavigate }) => {
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<ActivityType[]>([
    'referral',
  ])
  const [sortBy, setSortBy] = useState<'earnings' | 'referrals' | 'active'>('earnings')
  const [showOnly, setShowOnly] = useState<'all' | 'active' | 'pending'>('all')

  // Mock data
  const referralStats: ReferrerStats[] = [
    {
      guestId: '1',
      firstName: 'Иван',
      lastName: 'Петров',
      email: 'ivan@example.com',
      totalReferrals: 12,
      activeReferrals: 8,
      totalEarnings: 4800,
      referrals: [
        {
          id: 'r1',
          firstName: 'Мария',
          lastName: 'Кольова',
          email: 'maria@example.com',
          joinedDate: new Date('2024-06-01'),
          status: 'active',
          pointsEarned: 800,
        },
        {
          id: 'r2',
          firstName: 'Петр',
          lastName: 'Еванов',
          email: 'petr@example.com',
          joinedDate: new Date('2024-07-15'),
          status: 'active',
          pointsEarned: 600,
        },
      ],
    },
    {
      guestId: '2',
      firstName: 'Александр',
      lastName: 'Смирнов',
      email: 'alex@example.com',
      totalReferrals: 8,
      activeReferrals: 5,
      totalEarnings: 3200,
      referrals: [
        {
          id: 'r3',
          firstName: 'Ольга',
          lastName: 'Николаева',
          email: 'olga@example.com',
          joinedDate: new Date('2024-08-20'),
          status: 'pending',
          pointsEarned: 0,
        },
      ],
    },
  ]

  const activities: Activity[] = referralStats.flatMap((stats) =>
    stats.referrals.map((ref) => ({
      id: ref.id,
      type: 'referral' as ActivityType,
      title: `${ref.firstName} ${ref.lastName} приглашен через ${stats.firstName}`,
      description: `Email: ${ref.email}, статус: ${ref.status}`,
      timestamp: ref.joinedDate,
      amount: ref.pointsEarned,
      metadata: {
        'Пригласивший': `${stats.firstName} ${stats.lastName}`,
        'Статус': ref.status,
      },
    })),
  )

  const sortedReferrers = useMemo(() => {
    let result = [...referralStats]

    if (showOnly !== 'all') {
      result = result.filter((r) => {
        if (showOnly === 'active') return r.activeReferrals > 0
        if (showOnly === 'pending')
          return (
            r.referrals.some((ref) => ref.status === 'pending') &&
            r.activeReferrals < r.totalReferrals
          )
        return true
      })
    }

    return result.sort((a, b) => {
      if (sortBy === 'earnings') return b.totalEarnings - a.totalEarnings
      if (sortBy === 'referrals') return b.totalReferrals - a.totalReferrals
      return b.activeReferrals - a.activeReferrals
    })
  }, [sortBy, showOnly])

  const totalStats = useMemo(
    () => ({
      totalReferrers: referralStats.length,
      totalReferrals: referralStats.reduce((sum, r) => sum + r.totalReferrals, 0),
      totalEarnings: referralStats.reduce((sum, r) => sum + r.totalEarnings, 0),
      activeReferrals: referralStats.reduce((sum, r) => sum + r.activeReferrals, 0),
    }),
    [],
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">👥 Менеджмент реферралов</h1>
        <p className="mt-2 text-gray-600">Уследите реферральные события и заработки</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Всего реферреров</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalStats.totalReferrers}</p>
          <p className="mt-1 text-xs text-gray-500">Active referral programs</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Общее кол-во реферралов</p>
          <p className="mt-2 text-3xl font-bold text-teal-600">{totalStats.totalReferrals}</p>
          <p className="mt-1 text-xs text-gray-500">All referred guests</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Активные реферралы</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{totalStats.activeReferrals}</p>
          <p className="mt-1 text-xs text-gray-500">Currently active</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Общие заработки</p>
          <p className="mt-2 text-3xl font-bold text-teal-600">₽{totalStats.totalEarnings.toLocaleString()}</p>
          <p className="mt-1 text-xs text-gray-500">Commission earned</p>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-gray-900">📈 Активность реферралов</h2>
        <ActivityFilter
          activities={activities}
          selectedTypes={selectedActivityTypes}
          onFilterChange={setSelectedActivityTypes}
        />
        <div className="mt-6">
          <GuestActivityTimeline
            activities={activities.filter((a) => selectedActivityTypes.includes(a.type))}
            maxItems={20}
          />
        </div>
      </div>

      {/* Top Referrers */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">🌟 Наиболее активные реферреры</h2>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="earnings">По заработкам</option>
              <option value="referrals">По кол-ву реферралов</option>
              <option value="active">По активным</option>
            </select>
            <select
              value={showOnly}
              onChange={(e) => setShowOnly(e.target.value as any)}
              className="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="all">Все</option>
              <option value="active">Все активные</option>
              <option value="pending">Ожидаются активации</option>
            </select>
          </div>
        </div>

        {/* Referrers Grid */}
        <div className="grid gap-4">
          {sortedReferrers.map((referrer) => (
            <div
              key={referrer.guestId}
              className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {referrer.firstName} {referrer.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{referrer.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-teal-600">+₽{referrer.totalEarnings}</p>
                  <p className="text-xs text-gray-500">Total earnings</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded bg-blue-50 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{referrer.totalReferrals}</p>
                  <p className="text-xs text-blue-600">Всего</p>
                </div>
                <div className="rounded bg-green-50 p-2 text-center">
                  <p className="text-lg font-bold text-green-600">{referrer.activeReferrals}</p>
                  <p className="text-xs text-green-600">Активных</p>
                </div>
                <div className="rounded bg-orange-50 p-2 text-center">
                  <p className="text-lg font-bold text-orange-600">
                    {referrer.totalReferrals - referrer.activeReferrals}
                  </p>
                  <p className="text-xs text-orange-600">Неактивных</p>
                </div>
              </div>

              {/* Recent referrals preview */}
              {referrer.referrals.length > 0 && (
                <div className="mt-3 border-t border-gray-200 pt-3">
                  <p className="text-xs font-medium text-gray-600">Последние реферралы:</p>
                  <div className="mt-2 space-y-1">
                    {referrer.referrals.slice(0, 3).map((ref) => (
                      <div key={ref.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">
                          {ref.firstName} {ref.lastName}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            ref.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : ref.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {ref.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReferralManagementPage
