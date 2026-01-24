/**
 * PointsStatsPanel Component
 * 
 * Displays comprehensive statistics about points usage.
 * Shows trends, calculations, and key metrics.
 * Production-ready with loading states.
 */

import React, { useMemo, useCallback } from 'react'
import { usePointsOperations } from '../../hooks/usePointsOperations'

export interface PointsStatsPanelProps {
  guestId: string
  showTrend?: boolean
  showEstimates?: boolean
  className?: string
}

interface StatsData {
  balance: number
  earned: number
  redeemed: number
  percentageUsed: number
  pendingOperations: number
  averageEarn: number
  averageRedeem: number
}

/**
 * Statistics panel for points
 */
export const PointsStatsPanel: React.FC<PointsStatsPanelProps> = ({
  guestId,
  showTrend = true,
  showEstimates = true,
  className = '',
}) => {
  const { balance, totalEarned, totalRedeemed, history, loading, error } = usePointsOperations(guestId)

  // Calculate statistics
  const stats = useMemo<StatsData>(() => {
    const earned = totalEarned
    const redeemed = totalRedeemed
    const percentageUsed = earned === 0 ? 0 : Math.round((redeemed / earned) * 100)
    const pendingOps = history.filter((op) => op.status === 'pending').length
    const addOps = history.filter((op) => op.operationType === 'add')
    const redeemOps = history.filter((op) => op.operationType === 'redeem')

    const averageEarn = addOps.length > 0 ? Math.round(earned / addOps.length) : 0
    const averageRedeem = redeemOps.length > 0 ? Math.round(redeemed / redeemOps.length) : 0

    return {
      balance,
      earned,
      redeemed,
      percentageUsed,
      pendingOperations: pendingOps,
      averageEarn,
      averageRedeem,
    }
  }, [balance, totalEarned, totalRedeemed, history])

  // Determine trend status
  const trendStatus = useCallback(() => {
    if (stats.percentageUsed > 75) return 'high' // Lots of redemptions
    if (stats.percentageUsed > 50) return 'medium'
    return 'low' // Accumulating points
  }, [stats.percentageUsed])

  // Get trend label
  const getTrendLabel = useCallback((trend: string) => {
    const labels: Record<string, string> = {
      high: 'Активно тратите баллы',
      medium: 'Мерно используете баллы',
      low: 'Отлично! Накопливаются баллы',
    }
    return labels[trend] || labels.medium
  }, [])

  if (error) {
    return (
      <div className={`points-stats points-stats--error ${className}`} role="alert">
        <p>{error}</p>
      </div>
    )
  }

  const trend = trendStatus()

  return (
    <div className={`points-stats ${className}`}>
      <div className="points-stats__header">
        <h3 className="points-stats__title">Ваша статистика</h3>
        {loading && <span className="points-stats__loading" aria-label="Загружаются">⟳</span>}
      </div>

      {/* Main Stats Grid */}
      <div className="points-stats__grid">
        {/* Balance Stat */}
        <div className="points-stats__card points-stats__card--primary">
          <div className="points-stats__card-label">Баланс</div>
          <div className="points-stats__card-value" aria-label={`${stats.balance} баллов`}>
            {loading ? '...' : stats.balance.toLocaleString('ru-RU')}
          </div>
          <div className="points-stats__card-unit">баллов</div>
        </div>

        {/* Earned Stat */}
        <div className="points-stats__card points-stats__card--success">
          <div className="points-stats__card-label">Начислено</div>
          <div className="points-stats__card-value" aria-label={`${stats.earned} баллов`}>
            {loading ? '...' : `+${stats.earned.toLocaleString('ru-RU')}`}
          </div>
          <div className="points-stats__card-unit">всего</div>
        </div>

        {/* Redeemed Stat */}
        <div className="points-stats__card points-stats__card--warning">
          <div className="points-stats__card-label">Оставлено</div>
          <div className="points-stats__card-value" aria-label={`${stats.redeemed} баллов`}>
            {loading ? '...' : `-${stats.redeemed.toLocaleString('ru-RU')}`}
          </div>
          <div className="points-stats__card-unit">всего</div>
        </div>

        {/* Usage Percentage */}
        <div className="points-stats__card points-stats__card--info">
          <div className="points-stats__card-label">От начислений</div>
          <div className="points-stats__card-value" aria-label={`${stats.percentageUsed} процентов`}>
            {loading ? '...' : `${stats.percentageUsed}%`}
          </div>
          <div className="points-stats__card-unit">тратили</div>
        </div>
      </div>

      {/* Trend Section */}
      {showTrend && (
        <div className={`points-stats__trend points-stats__trend--${trend}`}>
          <div className="points-stats__trend-icon">📈</div>
          <div className="points-stats__trend-content">
            <p className="points-stats__trend-label">Trend:</p>
            <p className="points-stats__trend-value">{getTrendLabel(trend)}</p>
          </div>
        </div>
      )}

      {/* Average Operations */}
      {showEstimates && (
        <div className="points-stats__averages">
          <h4 className="points-stats__averages-title">Средние значения</h4>
          <div className="points-stats__averages-grid">
            <div className="points-stats__average-item">
              <span className="points-stats__average-label">По начислению</span>
              <span className="points-stats__average-value" aria-label={`${stats.averageEarn} баллов в среднем`}>
                {loading ? '...' : `${stats.averageEarn.toLocaleString('ru-RU')}`}
              </span>
            </div>
            <div className="points-stats__average-item">
              <span className="points-stats__average-label">По трате</span>
              <span className="points-stats__average-value" aria-label={`${stats.averageRedeem} баллов в среднем`}>
                {loading ? '...' : `${stats.averageRedeem.toLocaleString('ru-RU')}`}
              </span>
            </div>
            <div className="points-stats__average-item">
              <span className="points-stats__average-label">От КОПЕНДИНГ</span>
              <span className="points-stats__average-value" aria-label={`${stats.pendingOperations} в ожидании`}>
                {loading ? '...' : stats.pendingOperations}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      <p className="points-stats__note">
        📬 Последняя обновление: {new Date().toLocaleTimeString('ru-RU')}
      </p>
    </div>
  )
}

export default PointsStatsPanel
