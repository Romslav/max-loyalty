import { renderHook } from '@testing-library/react'
import { useRefresh } from '../useRefresh'

describe('useRefresh Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should call callback at specified interval', () => {
    const callback = vi.fn()
    const interval = 5000

    renderHook(() => useRefresh(callback, interval))

    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(interval)
    expect(callback).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(interval)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should use default interval of 30000ms', () => {
    const callback = vi.fn()

    renderHook(() => useRefresh(callback))

    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(30000)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should clear interval on unmount', () => {
    const callback = vi.fn()
    const interval = 5000

    const { unmount } = renderHook(() => useRefresh(callback, interval))

    vi.advanceTimersByTime(interval)
    expect(callback).toHaveBeenCalledTimes(1)

    unmount()

    vi.advanceTimersByTime(interval)
    expect(callback).toHaveBeenCalledTimes(1) // Should not be called again
  })

  it('should handle invalid interval values', () => {
    const callback = vi.fn()

    renderHook(() => useRefresh(callback, 0))
    vi.advanceTimersByTime(10000)

    expect(callback).not.toHaveBeenCalled()
  })

  it('should handle negative interval values', () => {
    const callback = vi.fn()

    renderHook(() => useRefresh(callback, -1000))
    vi.advanceTimersByTime(10000)

    expect(callback).not.toHaveBeenCalled()
  })

  it('should return a cleanup function', () => {
    const callback = vi.fn()
    const interval = 5000

    const { result } = renderHook(() => useRefresh(callback, interval))

    vi.advanceTimersByTime(interval)
    expect(callback).toHaveBeenCalledTimes(1)

    // Call the cleanup function returned by the hook
    result.current()

    vi.advanceTimersByTime(interval)
    expect(callback).toHaveBeenCalledTimes(1) // Should not be called again
  })

  it('should update callback when changed', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()
    const interval = 5000

    const { rerender } = renderHook(
      ({ cb }) => useRefresh(cb, interval),
      {
        initialProps: { cb: callback1 },
      }
    )

    vi.advanceTimersByTime(interval)
    expect(callback1).toHaveBeenCalledTimes(1)

    rerender({ cb: callback2 })

    vi.advanceTimersByTime(interval)
    expect(callback1).toHaveBeenCalledTimes(1) // Old callback should not be called
    expect(callback2).toHaveBeenCalledTimes(1) // New callback should be called
  })
})
