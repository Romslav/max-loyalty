import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import { authService } from '../services/authService'

interface ResponseError extends AxiosError {
  config: any
}

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  isRefreshing = false
  failedQueue = []
}

export const setupAxiosInterceptors = (apiClient: AxiosInstance) => {
  // Request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      const token = authService.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    async (error: ResponseError) => {
      const originalRequest = error.config

      // Handle 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return apiClient(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const response = await authService.refreshToken()
          const token = response.token
          authService.setAuthToken(token)
          originalRequest.headers.Authorization = `Bearer ${token}`
          processQueue(null, token)
          return apiClient(originalRequest)
        } catch (err) {
          processQueue(err, null)
          authService.logout()
          window.location.href = '/login'
          return Promise.reject(err)
        }
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        window.location.href = '/unauthorized'
        return Promise.reject(error)
      }

      return Promise.reject(error)
    }
  )
}
