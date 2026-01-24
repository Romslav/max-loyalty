/**
 * Points Store
 * 
 * Zustand store for managing points operations state.
 * Handles balance, history, operations creation, and error states.
 * Production-ready with proper loading and error handling.
 */

import { create } from 'zustand'
import { CreatePointsOperationUseCase, CreatePointsOperationOutput } from '../application/use-cases/points/CreatePointsOperationUseCase'
import { PointsOperationValidator, CreatePointsOperationInput } from '../application/validators/PointsOperationValidator'
import { HttpPointsRepository, PointsOperationDTO } from '../infrastructure/repositories/http/HttpPointsRepository'
import { HttpClient } from '../infrastructure/http/HttpClient'
import { ApplicationError } from '../application/errors/PointsErrors'

export interface PointsStoreState {
  // State
  balance: number
  totalEarned: number
  totalRedeemed: number
  history: PointsOperationDTO[]
  loading: boolean
  error: string | null
  lastOperation: CreatePointsOperationOutput | null

  // Actions
  createOperation: (input: CreatePointsOperationInput) => Promise<CreatePointsOperationOutput>
  fetchBalance: (guestId: string) => Promise<void>
  fetchHistory: (guestId: string, limit?: number) => Promise<void>
  clearError: () => void
  resetStore: () => void
}

/**
 * Create points store with state management
 */
export const usePointsStore = create<PointsStoreState>((set, get) => {
  // Initialize repositories
  const httpClient = new HttpClient()
  const repository = new HttpPointsRepository(httpClient)
  const validator = new PointsOperationValidator()
  const useCase = new CreatePointsOperationUseCase(repository, validator)

  return {
    // Initial state
    balance: 0,
    totalEarned: 0,
    totalRedeemed: 0,
    history: [],
    loading: false,
    error: null,
    lastOperation: null,

    /**
     * Create a new points operation
     * Validates input, executes use case, updates state
     */
    createOperation: async (input: CreatePointsOperationInput) => {
      try {
        set({ loading: true, error: null })

        // Validate input
        const validationErrors = validator.validate(input)
        if (validationErrors.length > 0) {
          const errorMap = validationErrors.reduce(
            (map, error) => {
              map[error.field] = error.message
              return map
            },
            {} as Record<string, string>,
          )
          throw new Error(`Validation failed: ${JSON.stringify(errorMap)}`)
        }

        // Execute use case
        const result = await useCase.execute(input)

        // Update state
        set((state) => ({
          loading: false,
          lastOperation: result,
          // Refresh balance if it's add operation
          balance: input.operationType === 'add' ? state.balance + input.amount : state.balance,
        }))

        return result
      } catch (error: any) {
        const errorMessage = error instanceof ApplicationError ? error.message : error?.message || 'Failed to create operation'
        set({ loading: false, error: errorMessage })
        throw error
      }
    },

    /**
     * Fetch current balance for a guest
     */
    fetchBalance: async (guestId: string) => {
      try {
        set({ loading: true, error: null })

        const balance = await repository.getBalance(guestId)
        const totalEarned = await repository.getTotalEarned(guestId)
        const totalRedeemed = await repository.getTotalRedeemed(guestId)

        set({
          balance,
          totalEarned,
          totalRedeemed,
          loading: false,
        })
      } catch (error: any) {
        const errorMessage = error instanceof ApplicationError ? error.message : error?.message || 'Failed to fetch balance'
        set({ loading: false, error: errorMessage })
        throw error
      }
    },

    /**
     * Fetch operation history for a guest
     */
    fetchHistory: async (guestId: string, limit: number = 20) => {
      try {
        set({ loading: true, error: null })

        const operations = await repository.getHistory(guestId, limit, 0)
        set({
          history: operations.map((op) => ({
            id: op.id,
            guestId: op.guestId,
            restaurantId: op.restaurantId,
            operationType: op.operationType,
            amount: op.amount,
            description: op.description,
            status: op.status,
            recipientGuestId: op.recipientGuestId,
            metadata: op.metadata,
            createdAt: op.createdAt.toISOString(),
            updatedAt: op.updatedAt.toISOString(),
            completedAt: op.completedAt?.toISOString(),
          })),
          loading: false,
        })
      } catch (error: any) {
        const errorMessage = error instanceof ApplicationError ? error.message : error?.message || 'Failed to fetch history'
        set({ loading: false, error: errorMessage })
        throw error
      }
    },

    /**
     * Clear error message
     */
    clearError: () => {
      set({ error: null })
    },

    /**
     * Reset store to initial state
     */
    resetStore: () => {
      set({
        balance: 0,
        totalEarned: 0,
        totalRedeemed: 0,
        history: [],
        loading: false,
        error: null,
        lastOperation: null,
      })
    },
  }
})
