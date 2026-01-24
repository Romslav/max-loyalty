/**
 * Guest Store
 * 
 * Zustand store for managing guest state in the loyalty program.
 * Handles authentication, profile, tier management, and referrals.
 * Production-ready with proper error handling.
 */

import { create } from 'zustand'
import { CreateGuestUseCase, CreateGuestOutput } from '../application/use-cases/guest/CreateGuestUseCase'
import { GuestValidator, CreateGuestInput } from '../application/validators/GuestValidator'
import { HttpGuestRepository } from '../infrastructure/repositories/http/HttpGuestRepository'
import { HttpClient } from '../infrastructure/http/HttpClient'
import { ApplicationError } from '../application/errors/PointsErrors'

export interface GuestProfile {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  status: string
  tier: string
  referralCode: string
  joinedAt: Date
  lastVisit?: Date
  totalVisits: number
  totalSpent: number
}

export interface GuestStoreState {
  // State
  profile: GuestProfile | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  referralStats: {
    code: string
    referralsCount: number
    earningsFromReferrals: number
  } | null

  // Actions
  createGuest: (input: CreateGuestInput) => Promise<CreateGuestOutput>
  loadProfile: (guestId: string) => Promise<void>
  updateProfile: (firstName: string, lastName: string, phone: string) => Promise<void>
  upgradeTier: (newTier: string) => Promise<void>
  getReferralStats: () => Promise<void>
  logout: () => void
  clearError: () => void
}

/**
 * Create guest store with state management
 */
export const useGuestStore = create<GuestStoreState>((set, get) => {
  // Initialize repositories
  const httpClient = new HttpClient()
  const repository = new HttpGuestRepository(httpClient)
  const validator = new GuestValidator()
  const useCase = new CreateGuestUseCase(repository, validator)

  return {
    // Initial state
    profile: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    referralStats: null,

    /**
     * Create a new guest account
     */
    createGuest: async (input: CreateGuestInput) => {
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
          profile: {
            id: result.id,
            email: result.email,
            phone: result.phone,
            firstName: result.firstName,
            lastName: result.lastName,
            status: result.status,
            tier: result.tier,
            referralCode: result.referralCode,
            joinedAt: result.joinedAt,
            totalVisits: 0,
            totalSpent: 0,
          },
          isAuthenticated: true,
        }))

        return result
      } catch (error: any) {
        const errorMessage = error instanceof ApplicationError ? error.message : error?.message || 'Failed to create guest'
        set({ loading: false, error: errorMessage })
        throw error
      }
    },

    /**
     * Load guest profile
     */
    loadProfile: async (guestId: string) => {
      try {
        set({ loading: true, error: null })

        const guest = await repository.getById(guestId)
        if (!guest) {
          throw new Error('Guest not found')
        }

        set({
          profile: {
            id: guest.id,
            email: guest.email,
            phone: guest.phone,
            firstName: guest.firstName,
            lastName: guest.lastName,
            status: guest.status,
            tier: guest.tier,
            referralCode: guest.referralCode || '',
            joinedAt: guest.joinedAt,
            lastVisit: guest.lastVisit,
            totalVisits: guest.totalVisits,
            totalSpent: guest.totalSpent,
          },
          isAuthenticated: true,
          loading: false,
        })
      } catch (error: any) {
        const errorMessage = error instanceof ApplicationError ? error.message : error?.message || 'Failed to load profile'
        set({ loading: false, error: errorMessage })
        throw error
      }
    },

    /**
     * Update guest profile
     */
    updateProfile: async (firstName: string, lastName: string, phone: string) => {
      try {
        set({ loading: true, error: null })

        const state = get()
        if (!state.profile) {
          throw new Error('No profile loaded')
        }

        await repository.update(state.profile.id, {
          firstName,
          lastName,
          phone,
        })

        set((state) => ({
          profile: state.profile
            ? { ...state.profile, firstName, lastName, phone }
            : null,
          loading: false,
        }))
      } catch (error: any) {
        const errorMessage = error instanceof ApplicationError ? error.message : error?.message || 'Failed to update profile'
        set({ loading: false, error: errorMessage })
        throw error
      }
    },

    /**
     * Upgrade guest tier (admin operation)
     */
    upgradeTier: async (newTier: string) => {
      try {
        set({ loading: true, error: null })

        const state = get()
        if (!state.profile) {
          throw new Error('No profile loaded')
        }

        await repository.update(state.profile.id, {
          tier: newTier,
        })

        set((state) => ({
          profile: state.profile ? { ...state.profile, tier: newTier } : null,
          loading: false,
        }))
      } catch (error: any) {
        const errorMessage = error instanceof ApplicationError ? error.message : error?.message || 'Failed to upgrade tier'
        set({ loading: false, error: errorMessage })
        throw error
      }
    },

    /**
     * Get referral statistics
     */
    getReferralStats: async () => {
      try {
        set({ loading: true, error: null })

        const state = get()
        if (!state.profile) {
          throw new Error('No profile loaded')
        }

        const referrals = await repository.getReferrals(state.profile.id)
        const referralCount = referrals.length

        // Calculate earnings from referrals (placeholder)
        const earningsFromReferrals = referralCount * 100 // 100 points per referral

        set({
          referralStats: {
            code: state.profile.referralCode,
            referralsCount: referralCount,
            earningsFromReferrals,
          },
          loading: false,
        })
      } catch (error: any) {
        const errorMessage = error instanceof ApplicationError ? error.message : error?.message || 'Failed to get referral stats'
        set({ loading: false, error: errorMessage })
        throw error
      }
    },

    /**
     * Logout guest
     */
    logout: () => {
      set({
        profile: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        referralStats: null,
      })
    },

    /**
     * Clear error message
     */
    clearError: () => {
      set({ error: null })
    },
  }
})
