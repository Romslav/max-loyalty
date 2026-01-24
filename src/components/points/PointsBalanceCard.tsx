/**
 * PointsBalanceCard Component
 * 
 * Displays guest's current points balance with visual indicators.
 * Shows earned and redeemed points breakdown.
 * Production-ready with accessibility features.
 */

import React, { useMemo } from 'react'
import { usePointsOperations } from '../../hooks/usePointsOperations'

export interface PointsBalanceCardProps {
  guestId: string
  showDetails?: boolean
  showHistory?: boolean
  className?: string
}

/**
 * Card displaying points balance information
 */
export const PointsBalanceCard: React.FC<PointsBalanceCardProps> = ({
  guestId,
  showDetails = true,
  showHistory = false,
  className = '',
}) => {
  const {
    balance,
    totalEarned,
    totalRedeemed,
    loading,
    error,
    isLoading,
    operationsCount,
  } = usePointsOperations(guestId)

  // Calculate percentage used
  const percentageUsed = useMemo(() => {
    if (totalEarned === 0) return 0
    return Math.round((totalRedeemed / totalEarned) * 100)
  }, [totalEarned, totalRedeemed])

  // Calculate visual progress
  const progressWidth = useMemo(() => {
    if (totalEarned === 0) return 0
    return Math.min((balance / totalEarned) * 100, 100)
  }, [balance, totalEarned])

  if (error) {
    return (
      <div className={`points-card points-card--error ${className}`} role="alert">
        <p className="points-card__error-message">{error}</p>
      </div>
    )
  }

  return (
    <div className={`points-card ${isLoading ? 'points-card--loading' : ''} ${className}`}>
      {/* Main Balance Display */}
      <div className="points-card__main">
        <div className="points-card__header">
          <h3 className="points-card__title">Ваши баллы</h3>
          {isLoading && <span className="points-card__loading-indicator" aria-label="Загрузка">⟳</span>}
        </div>

        {/* Large Balance Number */}
        <div className="points-card__balance-container">
          <div className="points-card__balance">
            <span className="points-card__balance-value" aria-label={`${balance} баллов`}>
              {loading ? '...' : balance.toLocaleString('ru-RU')}
            </span>
            <span className="points-card__balance-label">баллов</span>
          </div>

          {/* Visual Progress Bar */}
          <div className="points-card__progress" aria-label={`Использовано ${percentageUsed}% баллов`}>
            <div
              className="points-card__progress-bar"
              style={{
                width: `${progressWidth}%`,
                transition: isLoading ? 'none' : 'width 0.3s ease-in-out',
              }}
              role="progressbar"
              aria-valuenow={Math.round(progressWidth)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      {/* Details Section */}
      {showDetails && (
        <div className="points-card__details">
          {/* Earned */}
          <div className="points-card__detail-item points-card__detail-item--earned">
            <span className="points-card__detail-label">Заработано</span>
            <span className="points-card__detail-value" aria-label={`Заработано ${totalEarned} баллов`}>
              +{totalEarned.toLocaleString('ru-RU')}
            </span>
          </div>

          {/* Used Divider */}
          <div className="points-card__divider" />

          {/* Redeemed */}
          <div className="points-card__detail-item points-card__detail-item--redeemed">
            <span className="points-card__detail-label">Потрачено</span>
            <span className="points-card__detail-value" aria-label={`Потрачено ${totalRedeemed} баллов`}>
              -{totalRedeemed.toLocaleString('ru-RU')}
            </span>
          </div>

          {/* Percentage */}
          <div className="points-card__divider" />
          <div className="points-card__detail-item">
            <span className="points-card__detail-label">Использовано</span>
            <span className="points-card__detail-value" aria-label={`Использовано ${percentageUsed} процентов`}>
              {percentageUsed}%
            </span>
          </div>
        </div>
      )}

      {/* History Footer */}
      {showHistory && (
        <div className="points-card__footer">
          <p className="points-card__history-label" aria-label={`Всего операций: ${operationsCount}`}>
            Операций: <strong>{operationsCount}</strong>
          </p>
        </div>
      )}
    </div>
  )
}

export default PointsBalanceCard
