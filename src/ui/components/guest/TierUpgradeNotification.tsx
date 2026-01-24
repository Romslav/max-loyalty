/**
 * TierUpgradeNotification Component
 * 
 * Celebratory notification for tier upgrades.
 * Shows benefits, next tier requirements, achievements.
 * Animation and sound support.
 */

import React, { useEffect, useState } from 'react'

export interface TierUpgradeData {
  previousTier: string
  newTier: string
  pointsEarned: number
  benefitsGained: string[]
  nextTierRequirement?: {
    tier: string
    pointsNeeded: number
  }
}

interface TierUpgradeNotificationProps {
  isOpen: boolean
  data: TierUpgradeData
  onClose: () => void
  autoCloseDuration?: number
  playSound?: boolean
}

const TIER_CONFIG = {
  bronze: {
    icon: '🥉',
    color: 'bg-orange-100 text-orange-900 border-orange-300',
    badge: 'text-orange-600',
    title: 'Bronze',
  },
  silver: {
    icon: '🥈',
    color: 'bg-slate-100 text-slate-900 border-slate-300',
    badge: 'text-slate-600',
    title: 'Silver',
  },
  gold: {
    icon: '⭐',
    color: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    badge: 'text-yellow-600',
    title: 'Gold',
  },
  platinum: {
    icon: '💎',
    color: 'bg-blue-100 text-blue-900 border-blue-300',
    badge: 'text-blue-600',
    title: 'Platinum',
  },
  vip: {
    icon: '👑',
    color: 'bg-purple-100 text-purple-900 border-purple-300',
    badge: 'text-purple-600',
    title: 'VIP',
  },
}

/**
 * Tier Upgrade Notification Component
 */
export const TierUpgradeNotification: React.FC<TierUpgradeNotificationProps> = ({
  isOpen,
  data,
  onClose,
  autoCloseDuration = 8000,
  playSound = true,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsAnimating(true)

      if (playSound) {
        playNotificationSound()
      }

      const timer = setTimeout(() => {
        handleClose()
      }, autoCloseDuration)

      return () => clearTimeout(timer)
    }
  }, [isOpen, autoCloseDuration, playSound])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 300)
  }

  if (!isVisible) return null

  const newTierConfig = TIER_CONFIG[data.newTier as keyof typeof TIER_CONFIG]
  const previousTierConfig = TIER_CONFIG[data.previousTier as keyof typeof TIER_CONFIG]

  return (
    <div
      className={`fixed right-4 top-4 w-full max-w-md transform transition-all duration-300 ${
        isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-96 opacity-0'
      }`}
      role="alert"
      aria-live="assertive"
      aria-label="Объявление о повышении уровня"
    >
      {/* Confetti background */}
      <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-2xl blur opacity-20" />

      {/* Card */}
      <div className={`relative overflow-hidden rounded-xl border-2 shadow-2xl ${newTierConfig.color}`}>
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 animate-pulse" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/20 animate-pulse" />
        </div>

        {/* Content */}
        <div className="relative space-y-4 px-6 py-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="text-sm font-medium opacity-75">🌟 Повышение уровня!</div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{previousTierConfig.icon}</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <span className="text-4xl">{newTierConfig.icon}</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>

          {/* Main title */}
          <h3 className="text-2xl font-bold">
            Вы достигли уровня <span className={newTierConfig.badge}>{newTierConfig.title}</span>!
          </h3>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-white/20 p-4 backdrop-blur">
            <div className="text-center">
              <p className="text-xs opacity-75">+Очков</p>
              <p className="text-2xl font-bold">{data.pointsEarned.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-75">Новые привилегии</p>
              <p className="text-2xl font-bold">{data.benefitsGained.length}</p>
            </div>
          </div>

          {/* Benefits */}
          {data.benefitsGained.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold opacity-75">🌟 Новые привилегии:</p>
              <div className="grid grid-cols-2 gap-2">
                {data.benefitsGained.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next tier */}
          {data.nextTierRequirement && (
            <div className="border-t border-white/30 pt-4 text-sm">
              <p className="opacity-75">📈 Следующий объектив:</p>
              <p className="mt-1 font-semibold">
                {data.nextTierRequirement.pointsNeeded.toLocaleString()} очков до {data.nextTierRequirement.tier}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Play notification sound
 */
function playNotificationSound(): void {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    // Silently fail if audio context is not available
  }
}

/**
 * Multiple Notifications Container
 */
interface TierUpgradeNotificationContainerProps {
  notifications: TierUpgradeData[]
  onClose: (index: number) => void
}

export const TierUpgradeNotificationContainer: React.FC<TierUpgradeNotificationContainerProps> = ({
  notifications,
  onClose,
}) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div className="pointer-events-auto absolute right-4 top-4 space-y-4">
        {notifications.map((notification, index) => (
          <TierUpgradeNotification
            key={index}
            isOpen={true}
            data={notification}
            onClose={() => onClose(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default TierUpgradeNotification
