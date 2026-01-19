import { create } from 'zustand'
import { Restaurant } from '@types/index'

interface RestaurantStore {
  currentRestaurant: Restaurant | null
  restaurants: Restaurant[]
  loading: boolean
  error: string | null

  // Actions
  setCurrentRestaurant: (restaurant: Restaurant | null) => void
  setRestaurants: (restaurants: Restaurant[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addRestaurant: (restaurant: Restaurant) => void
  updateRestaurant: (id: string, data: Partial<Restaurant>) => void
  deleteRestaurant: (id: string) => void
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  currentRestaurant: null,
  restaurants: [],
  loading: false,
  error: null,

  setCurrentRestaurant: (restaurant) => set({ currentRestaurant: restaurant }),
  setRestaurants: (restaurants) => set({ restaurants }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addRestaurant: (restaurant) => {
    set((state) => ({
      restaurants: [...state.restaurants, restaurant],
    }))
  },

  updateRestaurant: (id, data) => {
    set((state) => ({
      restaurants: state.restaurants.map((r) =>
        r.id === id ? { ...r, ...data } : r
      ),
      currentRestaurant:
        state.currentRestaurant?.id === id
          ? { ...state.currentRestaurant, ...data }
          : state.currentRestaurant,
    }))
  },

  deleteRestaurant: (id) => {
    set((state) => ({
      restaurants: state.restaurants.filter((r) => r.id !== id),
      currentRestaurant:
        state.currentRestaurant?.id === id ? null : state.currentRestaurant,
    }))
  },
}))
