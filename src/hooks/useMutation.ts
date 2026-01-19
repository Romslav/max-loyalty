import { useState, useCallback } from 'react'

export interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onFinally?: () => void
}

export interface UseMutationResult<T, V> {
  mutate: (variables: V) => Promise<T | undefined>
  data: T | null
  loading: boolean
  error: Error | null
  reset: () => void
}

export const useMutation = <T, V = void>(
  mutationFn: (variables: V) => Promise<T>,
  options?: UseMutationOptions<T>
): UseMutationResult<T, V> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { onSuccess, onError, onFinally } = options || {}

  const mutate = useCallback(
    async (variables: V): Promise<T | undefined> => {
      setLoading(true)
      setError(null)

      try {
        const result = await mutationFn(variables)
        setData(result)
        onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        onError?.(error)
        throw error
      } finally {
        setLoading(false)
        onFinally?.()
      }
    },
    [mutationFn, onSuccess, onError, onFinally]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    mutate,
    data,
    loading,
    error,
    reset,
  }
}
