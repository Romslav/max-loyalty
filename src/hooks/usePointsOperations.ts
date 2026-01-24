/**
 * usePointsOperations Hook
 * 
 * Custom hook for managing points operations in React components.
 * Provides loading, error states, and memoized selectors.
 * Production-ready with proper TypeScript types.
 */

import { useCallback, useEffect, useMemo } from 'react'
import { usePointsStore } from '../stores/pointsStore'
import { CreatePointsOperationInput } from '../application/validators/PointsOperationValidator'
import { CreatePointsOperationOutput } from '../application/use-cases/points/CreatePointsOperationUseCase'

export interface UsePointsOperationsReturn {
  // State
  balance: number
  totalEarned: number
  totalRedeemed: number
  history: any[]
  loading: boolean
  error: string | null
  lastOperation: CreatePointsOperationOutput | null

  // Actions
  createOperation: (input: CreatePointsOperationInput) => Promise<CreatePointsOperationOutput>
  fetchBalance: (guestId: string) => Promise<void>
  fetchHistory: (guestId: string, limit?: number) => Promise<void>
  clearError: () => void
  resetStore: () => void

  // Computed
  availablePoints: number
  operationsCount: number
  lastOperationTime: Date | null
  isLoading: boolean
  hasError: boolean
  isEmpty: boolean
}

/**
 * Hook for managing points operations
 * @param guestId Optional initial guest ID
 * @returns Points operations state and actions
 */
export function usePointsOperations(guestId?: string): UsePointsOperationsReturn {
  const store = usePointsStore()

  // Auto-fetch balance and history when guestId changes
  useEffect(() => {
    if (guestId) {
      store.fetchBalance(guestId)
      store.fetchHistory(guestId)
    }
  }, [guestId, store])

  // Memoize computed values to prevent unnecessary re-renders
  const computed = useMemo(
    () => ({
      availablePoints: store.balance,
      operationsCount: store.history.length,
      lastOperationTime: store.lastOperation ? new Date(store.lastOperation.createdAt) : null,
      isLoading: store.loading,
      hasError: !!store.error,
      isEmpty: store.history.length === 0,
    }),
    [store.balance, store.history.length, store.lastOperation, store.loading, store.error],
  )

  // Memoize callbacks to prevent infinite loops
  const memoizedCreateOperation = useCallback(
    (input: CreatePointsOperationInput) => store.createOperation(input),
    [store],
  )

  const memoizedFetchBalance = useCallback((gid: string) => store.fetchBalance(gid), [store])

  const memoizedFetchHistory = useCallback(
    (gid: string, limit?: number) => store.fetchHistory(gid, limit),
    [store],
  )

  const memoizedClearError = useCallback(() => store.clearError(), [store])

  const memoizedResetStore = useCallback(() => store.resetStore(), [store])

  return {
    // State
    balance: store.balance,
    totalEarned: store.totalEarned,
    totalRedeemed: store.totalRedeemed,
    history: store.history,
    loading: store.loading,
    error: store.error,
    lastOperation: store.lastOperation,

    // Actions
    createOperation: memoizedCreateOperation,
    fetchBalance: memoizedFetchBalance,
    fetchHistory: memoizedFetchHistory,
    clearError: memoizedClearError,
    resetStore: memoizedResetStore,

    // Computed
    availablePoints: computed.availablePoints,
    operationsCount: computed.operationsCount,
    lastOperationTime: computed.lastOperationTime,
    isLoading: computed.isLoading,
    hasError: computed.hasError,
    isEmpty: computed.isEmpty,
  }
}
