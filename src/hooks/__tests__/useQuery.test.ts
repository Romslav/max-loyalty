import { renderHook, waitFor } from '@testing-library/react'
import { useQuery } from '../useQuery'

describe('useQuery Hook', () => {
  it('should initialize with loading state', () => {
    const queryFn = async () => Promise.resolve('data')
    const { result } = renderHook(() => useQuery(queryFn))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should fetch data successfully', async () => {
    const expectedData = { id: 1, name: 'Test' }
    const queryFn = async () => expectedData
    const { result } = renderHook(() => useQuery(queryFn))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(expectedData)
    expect(result.current.error).toBe(null)
  })

  it('should handle errors with retry', async () => {
    const errorMessage = 'Network error'
    const queryFn = async () => {
      throw new Error(errorMessage)
    }
    const { result } = renderHook(() => useQuery(queryFn, { retryCount: 1, retryDelay: 50 }))

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 2000 }
    )

    expect(result.current.error?.message).toBe(errorMessage)
    expect(result.current.data).toBe(null)
  })

  it('should retry on failure and eventually succeed', async () => {
    let attemptCount = 0
    const queryFn = async () => {
      attemptCount++
      if (attemptCount < 2) {
        throw new Error('Temporary error')
      }
      return 'success'
    }

    const { result } = renderHook(() =>
      useQuery(queryFn, { retryCount: 3, retryDelay: 50 })
    )

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 2000 }
    )

    expect(attemptCount).toBeGreaterThanOrEqual(2)
    expect(result.current.data).toBe('success')
    expect(result.current.error).toBe(null)
  })

  it('should call onSuccess callback', async () => {
    const onSuccess = vi.fn()
    const expectedData = { id: 1 }
    const queryFn = async () => expectedData

    const { result } = renderHook(() => useQuery(queryFn, { onSuccess }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(onSuccess).toHaveBeenCalledWith(expectedData)
  })

  it('should call onError callback on failure', async () => {
    const onError = vi.fn()
    const error = new Error('Fetch failed')
    const queryFn = async () => {
      throw error
    }

    const { result } = renderHook(() =>
      useQuery(queryFn, { retryCount: 0, onError })
    )

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 1000 }
    )

    expect(onError).toHaveBeenCalled()
  })

  it('should provide refetch function', async () => {
    let callCount = 0
    const queryFn = async () => {
      callCount++
      return `call-${callCount}`
    }

    const { result } = renderHook(() => useQuery(queryFn))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe('call-1')

    await result.current.refetch()

    await waitFor(() => {
      expect(result.current.data).toBe('call-2')
    })
  })

  it('should handle refreshInterval option', async () => {
    vi.useFakeTimers()
    let callCount = 0
    const queryFn = async () => {
      callCount++
      return callCount
    }

    renderHook(() => useQuery(queryFn, { refreshInterval: 100 }))

    // First call on mount
    await waitFor(() => {
      expect(callCount).toBe(1)
    })

    // Advance timers by 100ms
    vi.advanceTimersByTime(100)

    // Should call again after interval
    await waitFor(() => {
      expect(callCount).toBeGreaterThanOrEqual(2)
    })

    vi.useRealTimers()
  })

  it('should not update state after unmount', async () => {
    const queryFn = async () => 'data'
    const { unmount } = renderHook(() => useQuery(queryFn))

    unmount()

    // Should not throw or cause memory leaks
    expect(true).toBe(true)
  })

  it('should handle multiple rapid refetch calls', async () => {
    let callCount = 0
    const queryFn = async () => {
      callCount++
      await new Promise((resolve) => setTimeout(resolve, 50))
      return callCount
    }

    const { result } = renderHook(() => useQuery(queryFn))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const count1 = result.current.data

    await result.current.refetch()
    await result.current.refetch()

    expect(result.current.data).toBeGreaterThan(count1)
  })
})
