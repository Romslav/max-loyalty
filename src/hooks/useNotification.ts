import { useEffect, useCallback, useState } from 'react'
import { notificationService } from '../services/notificationService'

/**
 * Hook for managing notifications
 */
export const useNotification = () => {
  const [enabled, setEnabled] = useState(notificationService.isEnabled())
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    'Notification' in window ? Notification.permission : 'unsupported'
  )

  const requestPermission = useCallback(async () => {
    const granted = await notificationService.requestPermission()
    setEnabled(granted)
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
    return granted
  }, [])

  const showSuccess = useCallback(
    async (title: string, message?: string) => {
      return notificationService.success(title, message)
    },
    []
  )

  const showError = useCallback(
    async (title: string, message?: string) => {
      return notificationService.error(title, message)
    },
    []
  )

  const showWarning = useCallback(
    async (title: string, message?: string) => {
      return notificationService.warning(title, message)
    },
    []
  )

  const showInfo = useCallback(
    async (title: string, message?: string) => {
      return notificationService.info(title, message)
    },
    []
  )

  return {
    enabled,
    permission,
    requestPermission,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}

/**
 * Hook for notification permission status
 */
export const useNotificationPermission = () => {
  const [status, setStatus] = useState(() => notificationService.getPermissionStatus())

  const requestPermission = useCallback(async () => {
    const granted = await notificationService.requestPermission()
    setStatus(notificationService.getPermissionStatus())
    return granted
  }, [])

  return {
    ...status,
    requestPermission,
  }
}

/**
 * Hook to request notification permission on component mount
 */
export const useRequestNotificationPermission = () => {
  const { requestPermission } = useNotification()

  useEffect(() => {
    // Auto-request permission on mount if not determined
    if ('Notification' in window && Notification.permission === 'default') {
      requestPermission()
    }
  }, [requestPermission])
}
