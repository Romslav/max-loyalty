/**
 * GuestManagementPage Component
 * 
 * Main page for guest management.
 * Integrates all guest components into a cohesive interface.
 * Handles routing, state management, and user interactions.
 */

import React, { useState, useCallback, useEffect } from 'react'
import { GuestProfileCard } from '../components/guest/GuestProfileCard'
import { GuestRegistrationForm } from '../components/guest/GuestRegistrationForm'
import { GuestStatsPanel } from '../components/guest/GuestStatsPanel'
import { ReferralDialog, ReferralBanner } from '../components/guest/ReferralDialog'
import { useGuestStore, type GuestProfile } from '../../stores/guestStore'

type PageView = 'profile' | 'registration' | 'management'

interface GuestManagementPageProps {
  initialView?: PageView
  guestId?: string
}

/**
 * Guest Management Page Component
 */
export const GuestManagementPage: React.FC<GuestManagementPageProps> = ({
  initialView = 'profile',
  guestId,
}) => {
  const { profile, loading, error, loadProfile, clearError } = useGuestStore()
  const [currentView, setCurrentView] = useState<PageView>(initialView)
  const [referralDialogOpen, setReferralDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)

  // Load profile on mount if guestId provided
  useEffect(() => {
    if (guestId) {
      loadProfile(guestId).catch((err) => {
        console.error('Failed to load profile:', err)
      })
    }
  }, [guestId, loadProfile])

  const handleRegistrationSuccess = useCallback(
    (newGuestId: string) => {
      loadProfile(newGuestId).then(() => {
        setCurrentView('profile')
      })
    },
    [loadProfile],
  )

  const handleEditClick = useCallback(() => {
    setEditingProfile(true)
  }, [])

  const handleViewDetails = useCallback(() => {
    setCurrentView('management')
  }, [])

  const handleReferClick = useCallback(() => {
    setReferralDialogOpen(true)
  }, [])

  const handleError = useCallback(
    (errorMsg: string) => {
      console.error(errorMsg)
    },
    [],
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎈 Осни</h1>
              <p className="mt-2 text-gray-600">Менеджмент плана верности гостей</p>
            </div>
            <div className="flex items-center gap-3">
              {profile && (
                <button
                  onClick={() => clearError()}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  aria-label="Открыть понижение доступа"
                >
                  🛍️
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <nav className="mt-6 flex gap-4 border-t border-gray-200 pt-4">
            <TabButton
              active={currentView === 'profile'}
              onClick={() => setCurrentView('profile')}
              disabled={!profile}
            >
              📄 Профиль
            </TabButton>
            <TabButton
              active={currentView === 'management'}
              onClick={() => setCurrentView('management')}
              disabled={!profile}
            >
              📊 Аналитика
            </TabButton>
            <TabButton
              active={currentView === 'registration'}
              onClick={() => setCurrentView('registration')}
            >
              🎉 Новый гость
            </TabButton>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
            <p className="font-semibold">Ошибка</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={clearError}
              className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
            >
              Ок
            </button>
          </div>
        )}

        {/* Profile View */}
        {currentView === 'profile' && profile && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-white shadow-lg">
              <h2 className="text-2xl font-bold">🎆 Привет, {profile.firstName}!</h2>
              <p className="mt-2">Вы высокоценный член нашей программы верности</p>
            </div>

            {/* Profile Card */}
            <GuestProfileCard
              profile={profile}
              currentPoints={2500}
              maxPoints={3500}
              onEditClick={handleEditClick}
              onViewDetailsClick={handleViewDetails}
              onReferClick={handleReferClick}
              loading={loading}
            />

            {/* Referral Banner */}
            <ReferralBanner
              referralCode={profile.referralCode}
              guestName={profile.firstName}
              onShareClick={handleReferClick}
            />
          </div>
        )}

        {/* Management View */}
        {currentView === 'management' && profile && (
          <div className="space-y-6">
            <GuestStatsPanel
              totalVisits={profile.totalVisits}
              totalSpent={profile.totalSpent}
              lastVisit={profile.lastVisit}
              currentTier={profile.tier}
              pointsBalance={2500}
              averageSpendPerVisit={profile.totalSpent / Math.max(profile.totalVisits, 1)}
              visitsThisMonth={5}
              spentThisMonth={250}
            />
          </div>
        )}

        {/* Registration View */}
        {currentView === 'registration' && (
          <div className="mx-auto max-w-md">
            <GuestRegistrationForm
              onSuccess={handleRegistrationSuccess}
              onError={handleError}
              showReferralField={true}
            />
          </div>
        )}

        {/* Empty State */}
        {!profile && currentView === 'profile' && (
          <div className="rounded-lg border border-gray-300 bg-white p-12 text-center">
            <p className="mb-4 text-xl text-gray-600">Но профиля не загружен</p>
            <button
              onClick={() => setCurrentView('registration')}
              className="rounded-lg bg-teal-600 px-6 py-3 font-medium text-white hover:bg-teal-700"
            >
              Создать новый профиль
            </button>
          </div>
        )}
      </main>

      {/* Referral Dialog */}
      {profile && (
        <ReferralDialog
          referralCode={profile.referralCode}
          guestName={profile.firstName}
          isOpen={referralDialogOpen}
          onClose={() => setReferralDialogOpen(false)}
        />
      )}
    </div>
  )
}

interface TabButtonProps {
  active: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}

const TabButton: React.FC<TabButtonProps> = ({ active, disabled, onClick, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`whitespace-nowrap px-4 py-2 font-medium transition-colors ${
      active
        ? 'border-b-2 border-teal-600 text-teal-600'
        : disabled
          ? 'cursor-not-allowed text-gray-400'
          : 'text-gray-600 hover:text-gray-900'
    }`}
    aria-current={active ? 'page' : undefined}
  >
    {children}
  </button>
)

export default GuestManagementPage
