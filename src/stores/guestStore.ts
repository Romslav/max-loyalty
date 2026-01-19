import { create } from 'zustand'
import { Guest, LoyaltyCard, LoyaltyLevel } from '@types/index'

interface GuestStore {
  guest: Guest | null
  card: LoyaltyCard | null
  family: any[]
  operations: any[]
  loading: boolean
  error: string | null

  // Actions
  setGuest: (guest: Guest | null) => void
  setCard: (card: LoyaltyCard | null) => void
  setFamily: (family: any[]) => void
  setOperations: (operations: any[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Helpers
  getBalance: () => number
  getLevel: () => LoyaltyLevel
  updateBalance: (amount: number) => void
  addOperation: (operation: any) => void
  clear: () => void
}

export const useGuestStore = create<GuestStore>((set, get) => ({
  guest: null,
  card: null,
  family: [],
  operations: [],
  loading: false,
  error: null,

  setGuest: (guest) => set({ guest }),
  setCard: (card) => set({ card }),
  setFamily: (family) => set({ family }),
  setOperations: (operations) => set({ operations }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  getBalance: () => get().card?.balance ?? 0,

  getLevel: () => get().card?.level ?? 'bronze',

  updateBalance: (amount) => {
    set((state) => ({
      card: state.card
        ? { ...state.card, balance: state.card.balance + amount }
        : null,
    }))
  },

  addOperation: (operation) => {
    set((state) => ({
      operations: [operation, ...state.operations],
    }))
  },

  clear: () => {
    set({
      guest: null,
      card: null,
      family: [],
      operations: [],
    })
  },
}))
