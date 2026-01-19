/**
 * Toast Notification Utilities
 * Using browser's native Notification API as fallback
 * Ready to integrate with react-hot-toast or similar library
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastOptions {
  duration?: number
  position?: 'top' | 'bottom' | 'center'
  dismissible?: boolean
}

const DEFAULT_DURATION = 4000 // 4 seconds
const TOAST_ELEMENT_ID = 'toast-container'

/**
 * Initialize toast container
 */
const initializeContainer = (): HTMLElement => {
  let container = document.getElementById(TOAST_ELEMENT_ID)
  if (!container) {
    container = document.createElement('div')
    container.id = TOAST_ELEMENT_ID
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
    `
    document.body.appendChild(container)
  }
  return container
}

/**
 * Create toast element
 */
const createToastElement = (
  message: string,
  type: ToastType,
  dismissible: boolean
): HTMLElement => {
  const toast = document.createElement('div')
  const colors: Record<ToastType, { bg: string; border: string; icon: string }> = {
    success: {
      bg: '#d4edda',
      border: '#28a745',
      icon: '✓',
    },
    error: {
      bg: '#f8d7da',
      border: '#dc3545',
      icon: '✕',
    },
    info: {
      bg: '#d1ecf1',
      border: '#17a2b8',
      icon: 'ℹ',
    },
    warning: {
      bg: '#fff3cd',
      border: '#ffc107',
      icon: '⚠',
    },
  }

  const color = colors[type]

  toast.style.cssText = `
    background-color: ${color.bg};
    border-left: 4px solid ${color.border};
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    min-width: 300px;
    pointer-events: auto;
    animation: slideIn 0.3s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  `

  const content = document.createElement('div')
  content.style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  `

  const icon = document.createElement('span')
  icon.textContent = color.icon
  icon.style.cssText = `
    font-size: 20px;
    font-weight: bold;
    color: ${color.border};
    flex-shrink: 0;
  `

  const text = document.createElement('span')
  text.textContent = message
  text.style.cssText = `
    font-size: 14px;
    color: #333;
    word-break: break-word;
  `

  content.appendChild(icon)
  content.appendChild(text)
  toast.appendChild(content)

  if (dismissible) {
    const closeBtn = document.createElement('button')
    closeBtn.textContent = '×'
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      color: ${color.border};
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
      opacity: 0.7;
      transition: opacity 0.2s;
    `
    closeBtn.onmouseover = () => {
      closeBtn.style.opacity = '1'
    }
    closeBtn.onmouseout = () => {
      closeBtn.style.opacity = '0.7'
    }
    closeBtn.onclick = () => {
      removeToast(toast)
    }
    toast.appendChild(closeBtn)
  }

  return toast
}

/**
 * Remove toast element with animation
 */
const removeToast = (element: HTMLElement): void => {
  element.style.animation = 'slideOut 0.3s ease-in-out'
  setTimeout(() => {
    element.remove()
  }, 300)
}

/**
 * Add CSS animations to document
 */
const addAnimations = (): void => {
  if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style')
    style.id = 'toast-animations'
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }
}

/**
 * Show toast notification
 */
const showToast = (
  message: string,
  type: ToastType = 'info',
  options: ToastOptions = {}
): void => {
  const { duration = DEFAULT_DURATION, dismissible = true } = options

  addAnimations()
  const container = initializeContainer()
  const toastElement = createToastElement(message, type, dismissible)
  container.appendChild(toastElement)

  if (duration > 0) {
    setTimeout(() => {
      removeToast(toastElement)
    }, duration)
  }
}

/**
 * Convenience functions
 */
export const toast = {
  success: (message: string, options?: ToastOptions) =>
    showToast(message, 'success', options),
  error: (message: string, options?: ToastOptions) =>
    showToast(message, 'error', options),
  info: (message: string, options?: ToastOptions) =>
    showToast(message, 'info', options),
  warning: (message: string, options?: ToastOptions) =>
    showToast(message, 'warning', options),
}

export default toast
