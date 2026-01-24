/**
 * PointsHistoryList Component
 * 
 * Displays history of points operations with filtering and sorting.
 * Includes empty states and loading indicators.
 * Production-ready with accessibility support.
 */

import React, { useMemo, useState, useCallback } from 'react'
import { usePointsOperations } from '../../hooks/usePointsOperations'
import { PointsOperationDTO } from '../../infrastructure/repositories/http/HttpPointsRepository'

export interface PointsHistoryListProps {
  guestId: string
  limit?: number
  filter?: 'all' | 'add' | 'redeem' | 'transfer'
  onFilterChange?: (filter: 'all' | 'add' | 'redeem' | 'transfer') => void
  className?: string
}

type OperationType = 'add' | 'redeem' | 'transfer'

interface FilteredOperation extends PointsOperationDTO {
  displayAmount: string
  displayType: string
  displayStatus: string
  amountColor: string
}

/**
 * List of points operations with filtering
 */
export const PointsHistoryList: React.FC<PointsHistoryListProps> = ({
  guestId,
  limit = 20,
  filter = 'all',
  onFilterChange,
  className = '',
}) => {
  const { history, loading, error, isEmpty } = usePointsOperations(guestId)
  const [localFilter, setLocalFilter] = useState<'all' | 'add' | 'redeem' | 'transfer'>(filter)

  // Type labels
  const typeLabels = useMemo(
    () => ({
      add: 'Начисление',
      redeem: 'Трата',
      transfer: 'Перевод',
    }),
    [],
  )

  // Status labels
  const statusLabels = useMemo(
    () => ({
      pending: 'Ожидание',
      completed: 'Окончена',
      failed: 'Ошибка',
      cancelled: 'Отменена',
    }),
    [],
  )

  // Filter and map operations
  const filteredOperations = useMemo(() => {
    return history
      .filter((op) => localFilter === 'all' || op.operationType === localFilter)
      .slice(0, limit)
      .map((op): FilteredOperation => {
        const amount = op.operationType === 'add' ? op.amount : -op.amount
        const displayAmount = `${amount > 0 ? '+' : ''}${amount.toLocaleString('ru-RU')}`
        const amountColor = amount > 0 ? 'color-success' : 'color-error'

        return {
          ...op,
          displayAmount,
          displayType: typeLabels[op.operationType as OperationType],
          displayStatus: statusLabels[op.status as keyof typeof statusLabels],
          amountColor,
        }
      })
  }, [history, localFilter, limit, typeLabels, statusLabels])

  // Handle filter change
  const handleFilterChange = useCallback(
    (newFilter: 'all' | 'add' | 'redeem' | 'transfer') => {
      setLocalFilter(newFilter)
      onFilterChange?.(newFilter)
    },
    [onFilterChange],
  )

  // Format date
  const formatDate = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) return 'Право что'
      if (minutes < 60) return `${minutes} мин назад`
      if (hours < 24) return `${hours} час назад`
      if (days < 7) return `${days} дней назад`
      return date.toLocaleDateString('ru-RU')
    } catch {
      return dateString
    }
  }, [])

  // Error state
  if (error) {
    return (
      <div className={`points-history points-history--error ${className}`} role="alert">
        <p className="points-history__error-message">{error}</p>
      </div>
    )
  }

  return (
    <div className={`points-history ${className}`}>
      {/* Header */}
      <div className="points-history__header">
        <h3 className="points-history__title">Недавние операции</h3>
        {loading && <span className="points-history__loading" aria-label="Загружаются данные">⟳</span>}
      </div>

      {/* Filters */}
      <div className="points-history__filters" role="group" aria-label="Фильтр операций">
        {(['all', 'add', 'redeem', 'transfer'] as const).map((f) => (
          <button
            key={f}
            className={`points-history__filter-btn ${localFilter === f ? 'points-history__filter-btn--active' : ''}`}
            onClick={() => handleFilterChange(f)}
            disabled={loading}
            aria-pressed={localFilter === f}
          >
            {f === 'all' ? 'Все' : typeLabels[f]}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {isEmpty && !loading && (
        <div className="points-history__empty" role="status" aria-live="polite">
          <p className="points-history__empty-text">Операций нет</p>
          <p className="points-history__empty-hint">Начните с первого анчисления</p>
        </div>
      )}

      {/* Operations List */}
      {!isEmpty && filteredOperations.length > 0 && (
        <ul className="points-history__list" role="list" aria-label="Лист операций">
          {filteredOperations.map((op) => (
            <li key={op.id} className="points-history__item" role="listitem">
              <div className="points-history__item-main">
                <div className="points-history__item-type">
                  <span className="points-history__type-label" aria-label={`Тип: ${op.displayType}`}>
                    {op.displayType}
                  </span>
                  <span
                    className={`points-history__status-badge points-history__status-${op.status}`}
                    aria-label={`Статус: ${op.displayStatus}`}
                  >
                    {op.displayStatus}
                  </span>
                </div>

                <p className="points-history__description" title={op.description}>
                  {op.description}
                </p>
              </div>

              <div className="points-history__item-meta">
                <span
                  className={`points-history__amount ${op.amountColor}`}
                  aria-label={`${op.displayAmount} баллов`}
                >
                  {op.displayAmount}
                </span>
                <time
                  className="points-history__time"
                  dateTime={op.createdAt}
                  title={new Date(op.createdAt).toLocaleString('ru-RU')}
                >
                  {formatDate(op.createdAt)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* No filtered results */}
      {!isEmpty && filteredOperations.length === 0 && !loading && (
        <div className="points-history__empty" role="status" aria-live="polite">
          <p className="points-history__empty-text">Операций этого типа нет</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="points-history__loading-state" role="status" aria-live="polite" aria-busy="true">
          <div className="spinner" aria-label="Загружаются данные"></div>
          <p>Загружаются данные...</p>
        </div>
      )}
    </div>
  )
}

export default PointsHistoryList
