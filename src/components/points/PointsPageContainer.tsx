/**
 * PointsPageContainer Component
 * 
 * Main container component orchestrating all points-related UI.
 * Handles layout, orchestration, and user interactions.
 * Production-ready with error boundaries and loading states.
 */

import React, { useState, useCallback } from 'react'
import { PointsBalanceCard } from './PointsBalanceCard'
import { PointsOperationForm } from './PointsOperationForm'
import { PointsHistoryList } from './PointsHistoryList'
import { PointsStatsPanel } from './PointsStatsPanel'
import { usePointsOperations } from '../../hooks/usePointsOperations'

export interface PointsPageContainerProps {
  guestId: string
  className?: string
  showForm?: boolean
  showStats?: boolean
  showHistory?: boolean
}

interface NotificationState {
  type: 'success' | 'error' | null
  message: string
}

/**
 * Main points page container
 */
export const PointsPageContainer: React.FC<PointsPageContainerProps> = ({
  guestId,
  className = '',
  showForm = true,
  showStats = true,
  showHistory = true,
}) => {
  const { balance, loading, error, clearError } = usePointsOperations(guestId)
  const [notification, setNotification] = useState<NotificationState>({
    type: null,
    message: '',
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'operations' | 'stats'>('overview')

  // Handle operation success
  const handleOperationSuccess = useCallback((operationId: string) => {
    setNotification({
      type: 'success',
      message: 'Операция успешно сохранена',
    })
    setTimeout(() => {
      setNotification({ type: null, message: '' })
    }, 3000)
  }, [])

  // Handle operation error
  const handleOperationError = useCallback((errorMsg: string) => {
    setNotification({
      type: 'error',
      message: errorMsg,
    })
  }, [])

  // Clear notification
  const clearNotification = useCallback(() => {
    setNotification({ type: null, message: '' })
  }, [])

  return (
    <div className={`points-page ${className}`}>
      {/* Header */}
      <div className="points-page__header">
        <h1 className="points-page__title">Ваши баллы лояльности</h1>
        <p className="points-page__subtitle">Управляйте своими баллами и зарабатывайте внаграды</p>
      </div>

      {/* Global Error */}
      {error && (
        <div className="alert alert--error alert--dismissible" role="alert">
          <p>{error}</p>
          <button
            className="alert__close"
            onClick={clearError}
            aria-label="Нажмите чтобы закрыть это сообщение"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Notification */}
      {notification.type === 'success' && (
        <div className="alert alert--success alert--dismissible" role="alert" aria-live="polite">
          <p>✔ {notification.message}</p>
          <button
            className="alert__close"
            onClick={clearNotification}
            aria-label="Нажмите чтобы закрыть"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="points-page__content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="points-page__section" role="tabpanel" aria-labelledby="tab-overview">
            {/* Balance Card */}
            <PointsBalanceCard guestId={guestId} showDetails showHistory />

            {/* Form Section */}
            {showForm && (
              <div className="points-page__form-section">
                <h2 className="points-page__section-title">Новая операция</h2>
                <PointsOperationForm
                  guestId={guestId}
                  onSuccess={handleOperationSuccess}
                  onError={handleOperationError}
                />
              </div>
            )}
          </div>
        )}

        {/* Operations Tab */}
        {activeTab === 'operations' && (
          <div className="points-page__section" role="tabpanel" aria-labelledby="tab-operations">
            {showHistory && (
              <PointsHistoryList
                guestId={guestId}
                limit={50}
                filter="all"
              />
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="points-page__section" role="tabpanel" aria-labelledby="tab-stats">
            {showStats && (
              <PointsStatsPanel
                guestId={guestId}
                showTrend
                showEstimates
              />
            )}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="points-page__nav" role="tablist" aria-label="Навигация">
        <button
          id="tab-overview"
          role="tab"
          aria-selected={activeTab === 'overview'}
          aria-controls="panel-overview"
          className={`points-page__tab ${activeTab === 'overview' ? 'points-page__tab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Обзор
        </button>
        <button
          id="tab-operations"
          role="tab"
          aria-selected={activeTab === 'operations'}
          aria-controls="panel-operations"
          className={`points-page__tab ${activeTab === 'operations' ? 'points-page__tab--active' : ''}`}
          onClick={() => setActiveTab('operations')}
        >
          🐻 Операции
        </button>
        <button
          id="tab-stats"
          role="tab"
          aria-selected={activeTab === 'stats'}
          aria-controls="panel-stats"
          className={`points-page__tab ${activeTab === 'stats' ? 'points-page__tab--active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📈 Статистика
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="points-page__overlay" aria-busy="true" aria-live="polite">
          <div className="spinner" />
          <p>Загружаются данные...</p>
        </div>
      )}
    </div>
  )
}

export default PointsPageContainer
