import { useEffect, useState, useCallback } from 'react'
import { realtimeService, RealtimeEvent } from '../services/realtimeService'
import { loggerService } from '../services/loggerService'

/**
 * Hook for real-time connection status
 */
export const useRealtimeStatus = () => {
  const [isConnected, setIsConnected] = useState(realtimeService.isConnected())
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Check initial status
    setIsConnected(realtimeService.isConnected())

    // Subscribe to connection events
    const unsubConnect = realtimeService.on(RealtimeEvent.CONNECT, () => {
      setIsConnected(true)
      setError(null)
    })

    const unsubDisconnect = realtimeService.on(RealtimeEvent.DISCONNECT, () => {
      setIsConnected(false)
    })

    const unsubError = realtimeService.on(RealtimeEvent.ERROR, (err: Error) => {
      setError(err)
      setIsConnected(false)
    })

    return () => {
      unsubConnect()
      unsubDisconnect()
      unsubError()
    }
  }, [])

  return { isConnected, error }
}

/**
 * Hook for guest created events
 */
export const useOnGuestCreated = (
  callback: (payload: any) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return

    const unsubscribe = realtimeService.onGuestCreated((payload) => {
      try {
        callback(payload)
      } catch (error) {
        loggerService.error('Error in useOnGuestCreated callback', error as Error)
      }
    })

    return unsubscribe
  }, [callback, enabled])
}

/**
 * Hook for guest updated events
 */
export const useOnGuestUpdated = (
  callback: (payload: any) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return

    const unsubscribe = realtimeService.onGuestUpdated((payload) => {
      try {
        callback(payload)
      } catch (error) {
        loggerService.error('Error in useOnGuestUpdated callback', error as Error)
      }
    })

    return unsubscribe
  }, [callback, enabled])
}

/**
 * Hook for guest deleted events
 */
export const useOnGuestDeleted = (
  callback: (guestId: string) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return

    const unsubscribe = realtimeService.onGuestDeleted((guestId) => {
      try {
        callback(guestId)
      } catch (error) {
        loggerService.error('Error in useOnGuestDeleted callback', error as Error)
      }
    })

    return unsubscribe
  }, [callback, enabled])
}

/**
 * Hook for points changed events
 */
export const useOnGuestPointsChanged = (
  callback: (payload: any) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return

    const unsubscribe = realtimeService.onGuestPointsChanged((payload) => {
      try {
        callback(payload)
      } catch (error) {
        loggerService.error(
          'Error in useOnGuestPointsChanged callback',
          error as Error
        )
      }
    })

    return unsubscribe
  }, [callback, enabled])
}

/**
 * Hook for tier changed events
 */
export const useOnGuestTierChanged = (
  callback: (payload: any) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return

    const unsubscribe = realtimeService.onGuestTierChanged((payload) => {
      try {
        callback(payload)
      } catch (error) {
        loggerService.error(
          'Error in useOnGuestTierChanged callback',
          error as Error
        )
      }
    })

    return unsubscribe
  }, [callback, enabled])
}

/**
 * Hook for operation completed events
 */
export const useOnOperationCompleted = (
  callback: (payload: any) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return

    const unsubscribe = realtimeService.onOperationCompleted((payload) => {
      try {
        callback(payload)
      } catch (error) {
        loggerService.error(
          'Error in useOnOperationCompleted callback',
          error as Error
        )
      }
    })

    return unsubscribe
  }, [callback, enabled])
}

/**
 * Hook for operation failed events
 */
export const useOnOperationFailed = (
  callback: (payload: any) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return

    const unsubscribe = realtimeService.onOperationFailed((payload) => {
      try {
        callback(payload)
      } catch (error) {
        loggerService.error(
          'Error in useOnOperationFailed callback',
          error as Error
        )
      }
    })

    return unsubscribe
  }, [callback, enabled])
}

/**
 * Hook for restaurant stats updated events
 */
export const useOnRestaurantStatsUpdated = (
  callback: (payload: any) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return

    const unsubscribe = realtimeService.onRestaurantStatsUpdated((payload) => {
      try {
        callback(payload)
      } catch (error) {
        loggerService.error(
          'Error in useOnRestaurantStatsUpdated callback',
          error as Error
        )
      }
    })

    return unsubscribe
  }, [callback, enabled])
}

/**
 * Hook for new messages
 */
export const useOnMessageNew = (
  callback: (payload: any) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return

    const unsubscribe = realtimeService.onMessageNew((payload) => {
      try {
        callback(payload)
      } catch (error) {
        loggerService.error('Error in useOnMessageNew callback', error as Error)
      }
    })

    return unsubscribe
  }, [callback, enabled])
}

/**
 * Hook for new notifications
 */
export const useOnNotificationNew = (
  callback: (payload: any) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return

    const unsubscribe = realtimeService.onNotificationNew((payload) => {
      try {
        callback(payload)
      } catch (error) {
        loggerService.error(
          'Error in useOnNotificationNew callback',
          error as Error
        )
      }
    })

    return unsubscribe
  }, [callback, enabled])
}

/**
 * Hook for system alerts
 */
export const useOnSystemAlert = (
  callback: (payload: any) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return

    const unsubscribe = realtimeService.onSystemAlert((payload) => {
      try {
        callback(payload)
      } catch (error) {
        loggerService.error('Error in useOnSystemAlert callback', error as Error)
      }
    })

    return unsubscribe
  }, [callback, enabled])
}

/**
 * Hook for joining guest room
 */
export const useJoinGuestRoom = (guestId: string, enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled || !guestId) return

    realtimeService.joinGuestRoom(guestId)

    return () => {
      realtimeService.leaveGuestRoom(guestId)
    }
  }, [guestId, enabled])
}

/**
 * Hook for joining restaurant room
 */
export const useJoinRestaurantRoom = (
  restaurantId: string,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled || !restaurantId) return

    realtimeService.joinRestaurantRoom(restaurantId)

    return () => {
      realtimeService.leaveRestaurantRoom(restaurantId)
    }
  }, [restaurantId, enabled])
}

/**
 * Hook for joining admin room
 */
export const useJoinAdminRoom = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return

    realtimeService.joinAdminRoom()

    return () => {
      realtimeService.leaveAdminRoom()
    }
  }, [enabled])
}

/**
 * Hook for multiple event subscriptions at once
 */
export const useRealtimeEvents = (
  events: Array<{
    event: string
    callback: (payload: any) => void
  }>,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return

    const unsubscribers = events.map(({ event, callback }) => {
      return realtimeService.on(event, (payload) => {
        try {
          callback(payload)
        } catch (error) {
          loggerService.error(`Error in event handler for ${event}`, error as Error)
        }
      })
    })

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [events, enabled])
}
