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

  it('should handle errors', async () => {
    const errorMessage = 'Network error'
    const queryFn = async () => {
      throw new Error(errorMessage)
    }
    const { result } = renderHook(() => useQuery(queryFn, { retryCount: 1, retryDelay: 100 }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error?.message).toBe(errorMessage)
    expect(result.current.data).toBe(null)
  })

  it('should retry on failure', async () => {
    let attemptCount = 0
    const queryFn = async () => {
      attemptCount++
      if (attemptCount < 3) {
        throw new Error('Temporary error')
      }
      return 'success'
    }

    const { result } = renderHook(() =>
      useQuery(queryFn, { retryCount: 3, retryDelay: 100 })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(attemptCount).toBeGreaterThanOrEqual(3)
    expect(result.current.data).toBe('success')
  })

  it('should call onSuccess callback on successful fetch', async () => {
    const onSuccess = vi.fn()
    const expectedData = { id: 1 }
    const queryFn = async () => expectedData

    const { result } = renderHook(() => useQuery(queryFn, { onSuccess }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(onSuccess).toHaveBeenCalledWith(expectedData)
  })

  it('should call onError callback on fetch failure', async () => {
    const onError = vi.fn()
    const error = new Error('Fetch failed')
    const queryFn = async () => {
      throw error
    }

    const { result } = renderHook(() =>
      useQuery(queryFn, { retryCount: 1, retryDelay: 100, onError })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

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
    let callCount = 0
    const queryFn = async () => {
      callCount++
      return callCount
    }

    renderHook(() => useQuery(queryFn, { refreshInterval: 100 }))

    await waitFor(
      () => {
        expect(callCount).toBeGreaterThanOrEqual(2)
      },
      { timeout: 300 }
    )
  })

  it('should update when dependencies change', async () => {
    let value = 1
    const queryFn = async () => value
    const { result, rerender } = renderHook(
      ({ dep }) => useQuery(queryFn, { dependencies: [dep] }),
      {
        initialProps: { dep: value },
      }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe(1)

    value = 2
    rerender({ dep: value })

    await waitFor(() => {
      expect(result.current.data).toBe(2)
    })
  })
})
