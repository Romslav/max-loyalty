import { loggerService } from './loggerService'
import { realtimeService } from './realtimeService'

/**
 * Notification Types
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Notification Payload
 */
export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: Record<string, any>
  requireInteraction?: boolean
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

/**
 * Push Notification Service
 * Handles Desktop push notifications and permission management
 */
class NotificationService {
  private permissionGranted = false
  private notificationQueue: NotificationPayload[] = []

  /**
   * Initialize notification service
   */
  async init(): Promise<void> {
    try {
      // Check if Notifications API is supported
      if (!('Notification' in window)) {
        loggerService.warn('Notifications API not supported in this browser')
        return
      }

      // Check existing permission
      if (Notification.permission === 'granted') {
        this.permissionGranted = true
        loggerService.info('Notification permission already granted')
      }

      // Request permission if not determined
      if (Notification.permission === 'default') {
        await this.requestPermission()
      }

      // Setup real-time notification listeners
      this.setupRealtimeListeners()
    } catch (error) {
      loggerService.error('Failed to initialize notification service', error as Error)
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (!('Notification' in window)) {
        return false
      }

      const permission = await Notification.requestPermission()
      this.permissionGranted = permission === 'granted'

      if (this.permissionGranted) {
        loggerService.info('Notification permission granted')
        // Send any queued notifications
        this.processQueue()
      } else {
        loggerService.info('Notification permission denied')
      }

      return this.permissionGranted
    } catch (error) {
      loggerService.error('Failed to request notification permission', error as Error)
      return false
    }
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled(): boolean {
    return (
      this.permissionGranted &&
      'Notification' in window &&
      Notification.permission === 'granted'
    )
  }

  /**
   * Show notification
   */
  async show(
    title: string,
    options?: Partial<NotificationPayload>
  ): Promise<Notification | null> {
    try {
      if (!this.isEnabled()) {
        loggerService.warn('Notifications not enabled, queueing notification')
        this.notificationQueue.push({
          title,
          body: options?.body || '',
          ...options,
        })
        return null
      }

      const notification = new Notification(title, {
        icon: options?.icon,
        badge: options?.badge,
        tag: options?.tag,
        body: options?.body,
        data: options?.data,
        requireInteraction: options?.requireInteraction ?? false,
        actions: options?.actions,
      })

      // Auto-close after 5 seconds (unless requireInteraction is true)
      if (!options?.requireInteraction) {
        setTimeout(() => notification.close(), 5000)
      }

      // Setup click handler
      notification.onclick = () => {
        window.focus()
        notification.close()

        // Emit event for notification click
        if (options?.data) {
          realtimeService.emit('notification:clicked', options.data)
        }
      }

      // Setup action handlers
      notification.onaction = (event: Event) => {
        const { action } = event as any
        if (options?.data) {
          realtimeService.emit('notification:action', {
            action,
            data: options.data,
          })
        }
      }

      loggerService.info(`Notification shown: ${title}`)
      return notification
    } catch (error) {
      loggerService.error('Failed to show notification', error as Error)
      return null
    }
  }

  /**
   * Show success notification
   */
  async success(
    title: string,
    message?: string,
    options?: Partial<NotificationPayload>
  ): Promise<Notification | null> {
    return this.show(title, {
      body: message,
      badge: '✅',
      ...options,
    })
  }

  /**
   * Show error notification
   */
  async error(
    title: string,
    message?: string,
    options?: Partial<NotificationPayload>
  ): Promise<Notification | null> {
    return this.show(title, {
      body: message,
      badge: '❌',
      requireInteraction: true,
      ...options,
    })
  }

  /**
   * Show warning notification
   */
  async warning(
    title: string,
    message?: string,
    options?: Partial<NotificationPayload>
  ): Promise<Notification | null> {
    return this.show(title, {
      body: message,
      badge: '⚠️',
      ...options,
    })
  }

  /**
   * Show info notification
   */
  async info(
    title: string,
    message?: string,
    options?: Partial<NotificationPayload>
  ): Promise<Notification | null> {
    return this.show(title, {
      body: message,
      badge: 'ℹ️',
      ...options,
    })
  }

  /**
   * Show guest created notification
   */
  async notifyGuestCreated(guestName: string, guestEmail: string): Promise<Notification | null> {
    return this.success(
      '👥 New Guest Created',
      `${guestName} (${guestEmail}) joined the loyalty program!`,
      {
        tag: 'guest-created',
        data: {
          type: 'guest-created',
          guestEmail,
        },
      }
    )
  }

  /**
   * Show operation completed notification
   */
  async notifyOperationCompleted(
    guestName: string,
    points: number,
    type: 'earn' | 'redeem'
  ): Promise<Notification | null> {
    const title = type === 'earn' ? '⭐ Points Earned' : '🎁 Points Redeemed'
    return this.success(
      title,
      `${guestName} ${type === 'earn' ? 'earned' : 'redeemed'} ${points} points!`,
      {
        tag: 'operation-completed',
        data: {
          type: 'operation-completed',
          guestName,
          points,
          operationType: type,
        },
      }
    )
  }

  /**
   * Show billing notification
   */
  async notifyBillingUpdate(
    invoiceId: string,
    status: string,
    amount?: number
  ): Promise<Notification | null> {
    const statusText = status === 'paid' ? '✅ Paid' : `${status.toUpperCase()}`
    return this.info(
      `💳 Invoice ${statusText}`,
      amount ? `Invoice #${invoiceId} - Amount: $${amount.toFixed(2)}` : `Invoice #${invoiceId}`,
      {
        tag: 'billing-update',
        data: {
          type: 'billing-update',
          invoiceId,
          status,
          amount,
        },
      }
    )
  }

  /**
   * Show support ticket notification
   */
  async notifyTicketUpdate(
    ticketId: string,
    title: string,
    status: string
  ): Promise<Notification | null> {
    return this.info(
      `🎫 Support Ticket #${ticketId}`,
      `Status updated: ${status.toUpperCase()}. ${title}`,
      {
        tag: 'ticket-update',
        data: {
          type: 'ticket-update',
          ticketId,
          status,
        },
      }
    )
  }

  /**
   * Show system alert
   */
  async notifySystemAlert(
    severity: 'info' | 'warning' | 'error',
    message: string
  ): Promise<Notification | null> {
    const titles: Record<string, string> = {
      info: '🔹 System Alert',
      warning: '⚠️ System Warning',
      error: '🔴 System Error',
    }

    const method = severity === 'error' ? 'error' : severity === 'warning' ? 'warning' : 'info'

    return this[method](
      titles[severity],
      message,
      {
        tag: 'system-alert',
        data: {
          type: 'system-alert',
          severity,
        },
      }
    )
  }

  /**
   * Process queued notifications
   */
  private async processQueue(): Promise<void> {
    while (this.notificationQueue.length > 0) {
      const notification = this.notificationQueue.shift()
      if (notification) {
        await this.show(notification.title, notification)
      }
    }
  }

  /**
   * Setup real-time notification listeners
   */
  private setupRealtimeListeners(): void {
    // Listen for new notifications from server
    realtimeService.onNotificationNew((payload: any) => {
      const { type, title, message, data } = payload

      switch (type) {
        case 'guest-created':
          this.notifyGuestCreated(data.guestName, data.guestEmail)
          break

        case 'operation-completed':
          this.notifyOperationCompleted(data.guestName, data.points, data.type)
          break

        case 'billing-update':
          this.notifyBillingUpdate(data.invoiceId, data.status, data.amount)
          break

        case 'ticket-update':
          this.notifyTicketUpdate(data.ticketId, data.title, data.status)
          break

        case 'system-alert':
          this.notifySystemAlert(data.severity, data.message)
          break

        default:
          this.show(title, { body: message, data })
      }
    })
  }

  /**
   * Get permission status
   */
  getPermissionStatus(): {
    enabled: boolean
    permission: NotificationPermission | 'unsupported'
  } {
    if (!('Notification' in window)) {
      return {
        enabled: false,
        permission: 'unsupported',
      }
    }

    return {
      enabled: this.permissionGranted,
      permission: Notification.permission,
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
export default notificationService
