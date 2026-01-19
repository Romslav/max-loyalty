import axios from 'axios'

export interface Restaurant {
  id: string
  name: string
  description: string
  email: string
  phone: string
  address: string
  city: string
  logo?: string
  website?: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  totalGuests: number
  monthlyRevenue: number
}

export interface CreateRestaurantDTO {
  name: string
  description: string
  email: string
  phone: string
  address: string
  city: string
  website?: string
}

export interface UpdateRestaurantDTO {
  name?: string
  description?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  website?: string
  status?: 'active' | 'inactive' | 'suspended'
}

export interface RestaurantsResponse {
  data: Restaurant[]
  total: number
  page: number
  limit: number
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const apiClient = axios.create({
  baseURL: API_URL,
})

class RestaurantService {
  /**
   * Get all restaurants with pagination
   */
  async getRestaurants(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<RestaurantsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (search) {
        params.append('search', search)
      }

      const response = await apiClient.get<RestaurantsResponse>(
        `/restaurants?${params.toString()}`
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get restaurant by ID
   */
  async getRestaurantById(id: string): Promise<Restaurant> {
    try {
      const response = await apiClient.get<{ data: Restaurant }>(
        `/restaurants/${id}`
      )
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Create new restaurant
   */
  async createRestaurant(data: CreateRestaurantDTO): Promise<Restaurant> {
    try {
      const response = await apiClient.post<{ data: Restaurant }>(
        '/restaurants',
        data
      )
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update restaurant
   */
  async updateRestaurant(
    id: string,
    data: UpdateRestaurantDTO
  ): Promise<Restaurant> {
    try {
      const response = await apiClient.put<{ data: Restaurant }>(
        `/restaurants/${id}`,
        data
      )
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Delete restaurant
   */
  async deleteRestaurant(id: string): Promise<void> {
    try {
      await apiClient.delete(`/restaurants/${id}`)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get restaurant's guests
   */
  async getRestaurantGuests(
    id: string,
    page: number = 1,
    limit: number = 20
  ): Promise<any> {
    try {
      const response = await apiClient.get(
        `/restaurants/${id}/guests?page=${page}&limit=${limit}`
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

export const restaurantService = new RestaurantService()
