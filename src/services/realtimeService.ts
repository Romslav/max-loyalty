import io, { Socket } from 'socket.io-client'
import { loggerService } from './loggerService'

/**
 * Real-time Event Types
 */
export enum RealtimeEvent {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
  RECONNECT = 'reconnect',

  // Guest events
  GUEST_CREATED = 'guests:created',
  GUEST_UPDATED = 'guests:updated',
  GUEST_DELETED = 'guests:deleted',
  GUEST_POINTS_CHANGED = 'guests:points:changed',
  GUEST_TIER_CHANGED = 'guests:tier:changed',

  // Operation events
  OPERATION_COMPLETED = 'operations:completed',
  OPERATION_PENDING = 'operations:pending',
  OPERATION_FAILED = 'operations:failed',

  // Restaurant events
  RESTAURANT_STATS_UPDATED = 'restaurants:stats:updated',
  RESTAURANT_GUESTS_COUNT = 'restaurants:guests:count',

  // Message events
  MESSAGE_NEW = 'messages:new',
  NOTIFICATION_NEW = 'notifications:new',

  // System events
  SYSTEM_ALERT = 'system:alert',
}

/**
 * Event payload interfaces
 */
export interface GuestEventPayload {
  id: string
  name: string
  email: string
  phone: string
  tier: string
  points: number
  totalSpent?: number
  timestamp: string
}

export interface OperationEventPayload {
  id: string
  guestId: string
  guestName: string
  type: 'earn' | 'redeem'
  points: number
  status: 'pending' | 'completed' | 'failed'
  description: string
  timestamp: string
}

export interface RestaurantStatsPayload {
  restaurantId: string
  totalGuests: number
  activeGuests: number
  totalPoints: number
  totalRevenue: number
  timestamp: string
}

export interface MessagePayload {
  id: string
  userId: string
  userName: string
  content: string
  channel: string
  timestamp: string
}

export interface NotificationPayload {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  data?: Record<string, any>
  timestamp: string
}

/**
 * Real-time Service
 * Manages WebSocket connection and event subscriptions
 */
class RealtimeService {
  private socket: Socket | null = null
  private listeners: Map<string, Set<Function>> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  /**
   * Initialize WebSocket connection
   */
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        const socketUrl = apiUrl.replace('/api', '')

        this.socket = io(socketUrl, {
          auth: {
            token: token || localStorage.getItem('token'),
          },
          reconnection: true,
          reconnectionDelay: this.reconnectDelay,
          reconnectionAttempts: this.maxReconnectAttempts,
          transports: ['websocket', 'polling'],
        })

        // Handle connection
        this.socket.on(RealtimeEvent.CONNECT, () => {
          this.reconnectAttempts = 0
          loggerService.info('WebSocket connected')
          this.emit(RealtimeEvent.CONNECT)
          resolve()
        })

        // Handle connection error
        this.socket.on(RealtimeEvent.ERROR, (error: Error) => {
          loggerService.error('WebSocket error', error)
          this.emit(RealtimeEvent.ERROR, error)
          reject(error)
        })

        // Handle disconnection
        this.socket.on(RealtimeEvent.DISCONNECT, (reason: string) => {
          loggerService.warn(`WebSocket disconnected: ${reason}`)
          this.emit(RealtimeEvent.DISCONNECT, reason)
        })

        // Handle reconnect attempt
        this.socket.on('reconnect_attempt', () => {
          this.reconnectAttempts++
          loggerService.info(`WebSocket reconnect attempt ${this.reconnectAttempts}`)
        })
      } catch (error) {
        loggerService.error('Failed to initialize WebSocket', error as Error)
        reject(error)
      }
    })
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      loggerService.info('WebSocket disconnected')
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  /**
   * Subscribe to event
   */
  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())

      // Register socket listener if first subscription
      if (this.socket) {
        this.socket.on(event, (data: any) => {
          const callbacks = this.listeners.get(event)
          if (callbacks) {
            callbacks.forEach((cb) => {
              try {
                cb(data)
              } catch (error) {
                loggerService.error(`Error in event listener for ${event}`, error as Error)
              }
            })
          }
        })
      }
    }

    const callbacks = this.listeners.get(event)!
    callbacks.add(callback)

    // Return unsubscribe function
    return () => {
      callbacks.delete(callback)
      if (callbacks.size === 0) {
        this.listeners.delete(event)
      }
    }
  }

  /**
   * Emit event (send to server)
   */
  emit(event: string, data?: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data)
    } else {
      loggerService.warn(
        `WebSocket not connected, cannot emit event: ${event}`
      )
    }
  }

  /**
   * Subscribe to guest created event
   */
  onGuestCreated(callback: (payload: GuestEventPayload) => void): () => void {
    return this.on(RealtimeEvent.GUEST_CREATED, callback)
  }

  /**
   * Subscribe to guest updated event
   */
  onGuestUpdated(callback: (payload: GuestEventPayload) => void): () => void {
    return this.on(RealtimeEvent.GUEST_UPDATED, callback)
  }

  /**
   * Subscribe to guest deleted event
   */
  onGuestDeleted(callback: (guestId: string) => void): () => void {
    return this.on(RealtimeEvent.GUEST_DELETED, callback)
  }

  /**
   * Subscribe to points changed event
   */
  onGuestPointsChanged(
    callback: (payload: { guestId: string; points: number; change: number }) => void
  ): () => void {
    return this.on(RealtimeEvent.GUEST_POINTS_CHANGED, callback)
  }

  /**
   * Subscribe to tier changed event
   */
  onGuestTierChanged(
    callback: (payload: { guestId: string; newTier: string; oldTier: string }) => void
  ): () => void {
    return this.on(RealtimeEvent.GUEST_TIER_CHANGED, callback)
  }

  /**
   * Subscribe to operation completed event
   */
  onOperationCompleted(
    callback: (payload: OperationEventPayload) => void
  ): () => void {
    return this.on(RealtimeEvent.OPERATION_COMPLETED, callback)
  }

  /**
   * Subscribe to operation failed event
   */
  onOperationFailed(
    callback: (payload: OperationEventPayload) => void
  ): () => void {
    return this.on(RealtimeEvent.OPERATION_FAILED, callback)
  }

  /**
   * Subscribe to restaurant stats updated event
   */
  onRestaurantStatsUpdated(
    callback: (payload: RestaurantStatsPayload) => void
  ): () => void {
    return this.on(RealtimeEvent.RESTAURANT_STATS_UPDATED, callback)
  }

  /**
   * Subscribe to new message event
   */
  onMessageNew(callback: (payload: MessagePayload) => void): () => void {
    return this.on(RealtimeEvent.MESSAGE_NEW, callback)
  }

  /**
   * Subscribe to new notification event
   */
  onNotificationNew(
    callback: (payload: NotificationPayload) => void
  ): () => void {
    return this.on(RealtimeEvent.NOTIFICATION_NEW, callback)
  }

  /**
   * Subscribe to system alert
   */
  onSystemAlert(
    callback: (payload: { severity: string; message: string }) => void
  ): () => void {
    return this.on(RealtimeEvent.SYSTEM_ALERT, callback)
  }

  /**
   * Request join guest room (receive updates for specific guest)
   */
  joinGuestRoom(guestId: string): void {
    this.emit('room:join', {
      room: `guest:${guestId}`,
      guestId,
    })
    loggerService.info(`Joined guest room: ${guestId}`)
  }

  /**
   * Request leave guest room
   */
  leaveGuestRoom(guestId: string): void {
    this.emit('room:leave', {
      room: `guest:${guestId}`,
      guestId,
    })
    loggerService.info(`Left guest room: ${guestId}`)
  }

  /**
   * Request join restaurant room (receive stats updates)
   */
  joinRestaurantRoom(restaurantId: string): void {
    this.emit('room:join', {
      room: `restaurant:${restaurantId}`,
      restaurantId,
    })
    loggerService.info(`Joined restaurant room: ${restaurantId}`)
  }

  /**
   * Request leave restaurant room
   */
  leaveRestaurantRoom(restaurantId: string): void {
    this.emit('room:leave', {
      room: `restaurant:${restaurantId}`,
      restaurantId,
    })
    loggerService.info(`Left restaurant room: ${restaurantId}`)
  }

  /**
   * Request join admin room (all events)
   */
  joinAdminRoom(): void {
    this.emit('room:join', {
      room: 'admin',
    })
    loggerService.info('Joined admin room')
  }

  /**
   * Request leave admin room
   */
  leaveAdminRoom(): void {
    this.emit('room:leave', {
      room: 'admin',
    })
    loggerService.info('Left admin room')
  }

  /**
   * Get reconnection status
   */
  getReconnectionStatus(): {
    attempts: number
    maxAttempts: number
    connected: boolean
  } {
    return {
      attempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts,
      connected: this.isConnected(),
    }
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService()
export default realtimeService
