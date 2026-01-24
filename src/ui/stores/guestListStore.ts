/**
 * Guest List Store
 * 
 * Zustand store for managing guest list state.
 * Search, filtering, pagination, selection.
 * Real-time updates and synchronization.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface GuestListItem {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'blocked' | 'pending_verification'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip'
  points: number
  lastActivityDate: Date
  createdAt: Date
}

export interface GuestListFilters {
  search: string
  tiers: string[]
  statuses: string[]
  minPoints?: number
  maxPoints?: number
  hasReferrals?: boolean
}

export interface GuestListState {
  // Data
  guests: GuestListItem[]
  filteredGuests: GuestListItem[]
  selectedGuestIds: Set<string>
  
  // Filters
  filters: GuestListFilters
  
  // Pagination
  currentPage: number
  itemsPerPage: number
  
  // Loading states
  isLoading: boolean
  error: string | null
  
  // Actions
  setGuests: (guests: GuestListItem[]) => void
  applyFilters: (filters: Partial<GuestListFilters>) => void
  resetFilters: () => void
  
  // Selection
  selectGuest: (guestId: string) => void
  deselectGuest: (guestId: string) => void
  selectAll: (guests: GuestListItem[]) => void
  clearSelection: () => void
  
  // Pagination
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
  
  // Loading
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  
  // Utils
  getPaginatedGuests: () => GuestListItem[]
  getTotalPages: () => number
}

/**
 * Guest List Store
 */
export const useGuestListStore = create<GuestListState>(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        guests: [],
        filteredGuests: [],
        selectedGuestIds: new Set(),
        filters: {
          search: '',
          tiers: [],
          statuses: [],
        },
        currentPage: 1,
        itemsPerPage: 20,
        isLoading: false,
        error: null,
        
        // Set guests
        setGuests: (guests) => {
          set({ guests })
          // Re-apply filters
          const state = get()
          state.applyFilters({})
        },
        
        // Apply filters
        applyFilters: (newFilters) => {
          set((state) => {
            const filters = { ...state.filters, ...newFilters }
            
            // Filter guests
            let filtered = state.guests
            
            // Search
            if (filters.search) {
              const query = filters.search.toLowerCase()
              filtered = filtered.filter(
                (g) =>
                  g.firstName.toLowerCase().includes(query) ||
                  g.lastName.toLowerCase().includes(query) ||
                  g.email.toLowerCase().includes(query) ||
                  g.phone.includes(query),
              )
            }
            
            // Tier filter
            if (filters.tiers.length > 0) {
              filtered = filtered.filter((g) => filters.tiers.includes(g.tier))
            }
            
            // Status filter
            if (filters.statuses.length > 0) {
              filtered = filtered.filter((g) => filters.statuses.includes(g.status))
            }
            
            // Points range
            if (filters.minPoints !== undefined) {
              filtered = filtered.filter((g) => g.points >= filters.minPoints!)
            }
            if (filters.maxPoints !== undefined) {
              filtered = filtered.filter((g) => g.points <= filters.maxPoints!)
            }
            
            return {
              filters,
              filteredGuests: filtered,
              currentPage: 1, // Reset to first page when filters change
            }
          })
        },
        
        // Reset filters
        resetFilters: () => {
          set({
            filters: {
              search: '',
              tiers: [],
              statuses: [],
            },
            filteredGuests: get().guests,
            currentPage: 1,
          })
        },
        
        // Select guest
        selectGuest: (guestId) => {
          set((state) => {
            const newSelection = new Set(state.selectedGuestIds)
            newSelection.add(guestId)
            return { selectedGuestIds: newSelection }
          })
        },
        
        // Deselect guest
        deselectGuest: (guestId) => {
          set((state) => {
            const newSelection = new Set(state.selectedGuestIds)
            newSelection.delete(guestId)
            return { selectedGuestIds: newSelection }
          })
        },
        
        // Select all
        selectAll: (guests) => {
          const ids = new Set(guests.map((g) => g.id))
          set({ selectedGuestIds: ids })
        },
        
        // Clear selection
        clearSelection: () => {
          set({ selectedGuestIds: new Set() })
        },
        
        // Set current page
        setCurrentPage: (page) => {
          set({ currentPage: Math.max(1, page) })
        },
        
        // Set items per page
        setItemsPerPage: (items) => {
          set({ itemsPerPage: Math.max(1, items), currentPage: 1 })
        },
        
        // Set loading
        setLoading: (isLoading) => {
          set({ isLoading })
        },
        
        // Set error
        setError: (error) => {
          set({ error })
        },
        
        // Get paginated guests
        getPaginatedGuests: () => {
          const state = get()
          const start = (state.currentPage - 1) * state.itemsPerPage
          const end = start + state.itemsPerPage
          return state.filteredGuests.slice(start, end)
        },
        
        // Get total pages
        getTotalPages: () => {
          const state = get()
          return Math.ceil(state.filteredGuests.length / state.itemsPerPage)
        },
      }),
      {
        name: 'guest-list-store',
        partialize: (state) => ({
          filters: state.filters,
          itemsPerPage: state.itemsPerPage,
        }),
      },
    ),
  ),
)

export default useGuestListStore
