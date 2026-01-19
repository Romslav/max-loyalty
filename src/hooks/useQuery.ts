import { useState, useEffect, useCallback } from 'react'

export interface UseQueryOptions {
  enabled?: boolean
  refetchInterval?: number
  retry?: number
}

export interface UseQueryResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  isRefetching: boolean
}

export const useQuery = <T,>(
  queryFn: () => Promise<T>,
  options?: UseQueryOptions
): UseQueryResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isRefetching, setIsRefetching] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const { enabled = true, refetchInterval, retry = 3 } = options || {}

  const execute = useCallback(async (isRefetch = false) => {
    if (isRefetch) {
      setIsRefetching(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const result = await queryFn()
      setData(result)
      setError(null)
      setRetryCount(0)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)

      // Retry logic
      if (retryCount < retry) {
        setRetryCount((prev) => prev + 1)
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, retryCount) * 1000
        setTimeout(() => {
          execute(isRefetch)
        }, delay)
      }
    } finally {
      if (isRefetch) {
        setIsRefetching(false)
      } else {
        setLoading(false)
      }
    }
  }, [queryFn, retryCount, retry])

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      execute()
    }
  }, [enabled, execute])

  // Polling
  useEffect(() => {
    if (!refetchInterval || !enabled) return

    const interval = setInterval(() => {
      execute(true)
    }, refetchInterval)

    return () => clearInterval(interval)
  }, [refetchInterval, enabled, execute])

  const refetch = useCallback(async () => {
    await execute(true)
  }, [execute])

  return {
    data,
    loading,
    error,
    refetch,
    isRefetching,
  }
}
