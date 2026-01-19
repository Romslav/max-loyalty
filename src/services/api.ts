import axios, { AxiosInstance, AxiosError } from 'axios'
import { ApiResponse } from '@types/index'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error.response?.data || error.message)
  }
)

// API Methods
export const apiClient = {
  // Auth
  auth: {
    login: (email: string, password: string) =>
      api.post<any, ApiResponse>('/auth/login', { email, password }),
    register: (data: any) =>
      api.post<any, ApiResponse>('/auth/register', data),
    refresh: () =>
      api.post<any, ApiResponse>('/auth/refresh'),
  },

  // Guests
  guests: {
    getProfile: () =>
      api.get<any, ApiResponse>('/guests/profile'),
    updateProfile: (data: any) =>
      api.put<any, ApiResponse>('/guests/profile', data),
    getCard: (restaurantId: string) =>
      api.get<any, ApiResponse>(`/guests/cards/${restaurantId}`),
    getHistory: (limit: number = 20) =>
      api.get<any, ApiResponse>('/guests/operations', { params: { limit } }),
  },

  // Restaurants
  restaurants: {
    getList: () =>
      api.get<any, ApiResponse>('/restaurants'),
    getById: (id: string) =>
      api.get<any, ApiResponse>(`/restaurants/${id}`),
    create: (data: any) =>
      api.post<any, ApiResponse>('/restaurants', data),
    update: (id: string, data: any) =>
      api.put<any, ApiResponse>(`/restaurants/${id}`, data),
  },

  // Loyalty Cards
  cards: {
    create: (restaurantId: string, data: any) =>
      api.post<any, ApiResponse>(`/restaurants/${restaurantId}/cards`, data),
    scan: (code: string) =>
      api.post<any, ApiResponse>('/cards/scan', { code }),
    credit: (cardId: string, amount: number) =>
      api.post<any, ApiResponse>(`/cards/${cardId}/credit`, { amount }),
    debit: (cardId: string, amount: number) =>
      api.post<any, ApiResponse>(`/cards/${cardId}/debit`, { amount }),
  },

  // Operations
  operations: {
    getList: (restaurantId: string) =>
      api.get<any, ApiResponse>(`/restaurants/${restaurantId}/operations`),
    create: (data: any) =>
      api.post<any, ApiResponse>('/operations', data),
  },
}

export default api
