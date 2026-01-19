import { useEffect, useRef } from 'react'

/**
 * 🔄 useRefresh Hook
 * Automatically calls a function at specified intervals
 * Useful for auto-refreshing data in dashboards
 */
export function useRefresh(callback: () => void, interval: number = 30000) {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!interval || interval <= 0) return

    // Set up the interval
    timerRef.current = setInterval(() => {
      callback()
    }, interval)

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [callback, interval])

  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }
}
