import { useState, useEffect, useCallback, useRef } from 'react'

interface UseQueryOptions<T> {
  retryCount?: number
  retryDelay?: number
  refreshInterval?: number
  dependencies?: unknown[]
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseQueryResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * 🔄 Production-ready useQuery hook
 * Handles fetching, retrying, refreshing, and error management
 */
export function useQuery<T>(
  queryFn: () => Promise<T>,
  options: UseQueryOptions<T> = {}
): UseQueryResult<T> {
  const {
    retryCount = 3,
    retryDelay = 1000,
    refreshInterval = undefined,
    dependencies = [],
    onSuccess,
    onError,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const retryCountRef = useRef(0)
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // 🗑 Exponential backoff retry delay
  const getRetryDelay = useCallback(() => {
    return retryDelay * Math.pow(2, retryCountRef.current - 1)
  }, [retryDelay])

  // 🔄 Fetch with retry logic
  const fetchWithRetry = useCallback(async () => {
    retryCountRef.current = 0
    setLoading(true)
    setError(null)

    const attemptFetch = async (): Promise<void> => {
      try {
        const result = await queryFn()
        if (isMountedRef.current) {
          setData(result)
          setError(null)
          setLoading(false)
          onSuccess?.(result)
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))

        if (retryCountRef.current < retryCount) {
          retryCountRef.current += 1
          const delay = getRetryDelay()
          console.warn(
            `⚠️ Retry attempt ${retryCountRef.current}/${retryCount} in ${delay}ms`,
            error.message
          )
          await new Promise((resolve) => setTimeout(resolve, delay))
          return attemptFetch()
        }

        if (isMountedRef.current) {
          setError(error)
          setLoading(false)
          onError?.(error)
        }
      }
    }

    await attemptFetch()
  }, [queryFn, retryCount, getRetryDelay, onSuccess, onError])

  // 🔄 Initial fetch and dependency tracking
  useEffect(() => {
    isMountedRef.current = true
    fetchWithRetry()

    return () => {
      isMountedRef.current = false
    }
  }, [fetchWithRetry, ...dependencies]) // ⚠️ Critical: dependency tracking

  // ⏳ Auto-refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      refreshTimerRef.current = setInterval(() => {
        if (isMountedRef.current) {
          fetchWithRetry()
        }
      }, refreshInterval)

      return () => {
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current)
        }
      }
    }
  }, [refreshInterval, fetchWithRetry])

  return {
    data,
    loading,
    error,
    refetch: fetchWithRetry,
  }
}
