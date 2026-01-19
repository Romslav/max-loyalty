import { create } from 'zustand'

interface UIStore {
  isLoading: boolean
  error: string | null
  success: string | null
  sidebarOpen: boolean
  modals: { [key: string]: boolean }
  notifications: any[]

  // Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSuccess: (success: string | null) => void
  toggleSidebar: () => void
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  closeAllModals: () => void
  addNotification: (notification: any) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isLoading: false,
  error: null,
  success: null,
  sidebarOpen: true,
  modals: {},
  notifications: [],

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  openModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: true },
    })),

  closeModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: false },
    })),

  closeAllModals: () => set({ modals: {} }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: Date.now().toString() },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () =>
    set({
      isLoading: false,
      error: null,
      success: null,
      modals: {},
      notifications: [],
    }),
}))
