import axios from 'axios'

export interface Guest {
  id: string
  name: string
  email: string
  phone: string
  restaurantId: string
  totalPoints: number
  usedPoints: number
  joinedAt: string
  lastVisit?: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  status: 'active' | 'inactive' | 'blocked'
}

export interface CreateGuestDTO {
  name: string
  email: string
  phone: string
  restaurantId: string
}

export interface UpdateGuestDTO {
  name?: string
  email?: string
  phone?: string
  status?: 'active' | 'inactive' | 'blocked'
}

export interface GuestsResponse {
  data: Guest[]
  total: number
  page: number
  limit: number
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const apiClient = axios.create({
  baseURL: API_URL,
})

class GuestService {
  /**
   * Get all guests with pagination
   */
  async getGuests(page: number = 1, limit: number = 10, search?: string): Promise<GuestsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (search) {
        params.append('search', search)
      }

      const response = await apiClient.get<GuestsResponse>(
        `/guests?${params.toString()}`
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get guest by ID
   */
  async getGuestById(id: string): Promise<Guest> {
    try {
      const response = await apiClient.get<{ data: Guest }>(`/guests/${id}`)
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Create new guest
   */
  async createGuest(data: CreateGuestDTO): Promise<Guest> {
    try {
      const response = await apiClient.post<{ data: Guest }>('/guests', data)
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update guest
   */
  async updateGuest(id: string, data: UpdateGuestDTO): Promise<Guest> {
    try {
      const response = await apiClient.put<{ data: Guest }>(`/guests/${id}`, data)
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Delete guest
   */
  async deleteGuest(id: string): Promise<void> {
    try {
      await apiClient.delete(`/guests/${id}`)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get guest transaction history
   */
  async getGuestHistory(
    id: string,
    page: number = 1,
    limit: number = 20
  ): Promise<any> {
    try {
      const response = await apiClient.get(
        `/guests/${id}/history?page=${page}&limit=${limit}`
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      return new Error(message || 'An error occurred')
    }
    return error instanceof Error ? error : new Error('An unknown error occurred')
  }
}

export const guestService = new GuestService()
