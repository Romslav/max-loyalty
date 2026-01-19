import { apiClient } from '../config/apiClient'

interface Guest {
  id: string
  name: string
  email: string
  phone?: string
  points: number
  status: 'active' | 'inactive' | 'blocked'
  createdAt: string
  lastActivity?: string
}

interface GuestsResponse {
  guests: Guest[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface GetGuestsParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 👤 Guest Service
 * All guest-related API calls
 */
export const guestService = {
  /**
   * Get list of guests with pagination
   * GET /api/guests?page=1&limit=20&search=...
   */
  async getGuests(params: GetGuestsParams = {}): Promise<GuestsResponse> {
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 20,
        ...(params.search && { search: params.search }),
        ...(params.status && { status: params.status }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortOrder && { sortOrder: params.sortOrder }),
      }

      const response = await apiClient.get<GuestsResponse>('/guests', {
        params: queryParams,
      })

      console.log(
        `✅ Loaded ${response.data.guests.length}/${response.data.total} guests (page ${response.data.page})`
      )
      return response.data
    } catch (error) {
      console.error('❌ Failed to load guests:', error)
      throw error
    }
  },

  /**
   * Get single guest by ID
   * GET /api/guests/:id
   */
  async getGuestById(id: string): Promise<Guest> {
    try {
      const response = await apiClient.get<Guest>(`/guests/${id}`)
      return response.data
    } catch (error) {
      console.error(`❌ Failed to load guest ${id}:`, error)
      throw error
    }
  },

  /**
   * Get guest history/activity
   * GET /api/guests/:id/history
   */
  async getGuestHistory(id: string) {
    try {
      const response = await apiClient.get(`/guests/${id}/history`)
      return response.data
    } catch (error) {
      console.error(`❌ Failed to load guest history for ${id}:`, error)
      throw error
    }
  },

  /**
   * Create new guest
   * POST /api/guests
   */
  async createGuest(data: Omit<Guest, 'id' | 'createdAt'>) {
    try {
      const response = await apiClient.post<Guest>('/guests', data)
      console.log('✅ Guest created:', response.data.id)
      return response.data
    } catch (error) {
      console.error('❌ Failed to create guest:', error)
      throw error
    }
  },

  /**
   * Update guest
   * PUT /api/guests/:id
   */
  async updateGuest(id: string, data: Partial<Guest>) {
    try {
      const response = await apiClient.put<Guest>(`/guests/${id}`, data)
      console.log(`✅ Guest ${id} updated`)
      return response.data
    } catch (error) {
      console.error(`❌ Failed to update guest ${id}:`, error)
      throw error
    }
  },

  /**
   * Delete guest
   * DELETE /api/guests/:id
   */
  async deleteGuest(id: string) {
    try {
      await apiClient.delete(`/guests/${id}`)
      console.log(`✅ Guest ${id} deleted`)
    } catch (error) {
      console.error(`❌ Failed to delete guest ${id}:`, error)
      throw error
    }
  },

  /**
   * Bulk import guests
   * POST /api/guests/bulk
   */
  async bulkImportGuests(file: File) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await apiClient.post('/guests/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('✅ Bulk import completed:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Bulk import failed:', error)
      throw error
    }
  },
}
