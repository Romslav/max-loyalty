import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { authService } from '../services/authService'
import { logger } from '../services/loggerService'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: Error) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token || '')
    }
  })
  failedQueue = []
}

/**
 * Setup axios interceptors for JWT authentication
 */
export const setupAuthInterceptor = (axiosInstance: AxiosInstance) => {
  /**
   * Request interceptor: Add JWT token to headers
   */
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = authService.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: AxiosError) => {
      logger.error('Request interceptor error', { error })
      return Promise.reject(error)
    }
  )

  /**
   * Response interceptor: Handle token expiration and auto-refresh
   */
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      // Handle 401 Unauthorized - Token might be expired
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Queue request while token is being refreshed
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                resolve(axiosInstance(originalRequest))
              },
              reject: (err: Error) => reject(err),
            })
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          logger.info('Token expired, attempting to refresh')
          const { accessToken } = await authService.refreshToken()
          isRefreshing = false
          processQueue(null, accessToken)
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          isRefreshing = false
          processQueue(refreshError as Error, null)
          logger.error('Token refresh failed, redirecting to login')
          // Redirect to login
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }

      // Handle 403 Forbidden - Insufficient permissions
      if (error.response?.status === 403) {
        logger.warn('Access denied - insufficient permissions', {
          url: originalRequest.url,
        })
      }

      // Handle 404 Not Found
      if (error.response?.status === 404) {
        logger.warn('Resource not found', { url: originalRequest.url })
      }

      // Handle 500 Server Error
      if (error.response?.status === 500) {
        logger.error('Server error', {
          url: originalRequest.url,
          data: error.response.data,
        })
      }

      return Promise.reject(error)
    }
  )
}

export default setupAuthInterceptor
