// Telegram Web App интеграция для гостей
import { apiClient } from './api'
import { useGuestStore } from '@stores/guestStore'
import { useUIStore } from '@stores/uiStore'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            is_bot: boolean
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
            is_premium?: boolean
          }
          auth_date: number
          hash: string
        }
        ready: () => void
        expand: () => void
        close: () => void
        onEvent: (type: string, callback: () => void) => void
        MainButton: {
          text: string
          color: string
          text_color: string
          isVisible: boolean
          isActive: boolean
          setText: (text: string) => void
          onClick: (callback: () => void) => void
          show: () => void
          hide: () => void
          enable: () => void
          disable: () => void
        }
        BackButton: {
          isVisible: boolean
          onClick: (callback: () => void) => void
          show: () => void
          hide: () => void
        }
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
          selectionChanged: () => void
        }
        CloudStorage: {
          getItem: (key: string, callback: (value: string | null) => void) => void
          setItem: (key: string, value: string, callback: () => void) => void
          removeItem: (key: string, callback: () => void) => void
          getKeys: (callback: (keys: string[]) => void) => void
        }
      }
    }
  }
}

class TelegramService {
  private webApp = window.Telegram?.WebApp

  /**
   * Инициализация Telegram Web App
   */
  init() {
    if (!this.webApp) {
      console.warn('⚠️ Telegram Web App SDK не загружена')
      return
    }

    this.webApp.ready()
    this.webApp.expand()

    // Настройка Main Button
    this.webApp.MainButton.color = '#2b8a8a'
    this.webApp.MainButton.text = 'Открыть карту'

    console.log('✅ Telegram Web App инициализирована')
  }

  /**
   * Получить данные пользователя из Telegram
   */
  getUserData() {
    if (!this.webApp?.initDataUnsafe?.user) {
      return null
    }

    return {
      tgId: this.webApp.initDataUnsafe.user.id,
      firstName: this.webApp.initDataUnsafe.user.first_name,
      lastName: this.webApp.initDataUnsafe.user.last_name || '',
      username: this.webApp.initDataUnsafe.user.username || '',
      isPremium: this.webApp.initDataUnsafe.user.is_premium || false,
      languageCode: this.webApp.initDataUnsafe.user.language_code || 'ru',
    }
  }

  /**
   * Авторизация через Telegram
   */
  async authenticateWithTelegram(phoneNumber: string) {
    const userData = this.getUserData()
    if (!userData) {
      throw new Error('Не удалось получить данные Telegram')
    }

    try {
      const setGuest = useGuestStore.getState().setGuest
      const setError = useUIStore.getState().setError

      // Отправляем на backend
      const response = await apiClient.auth.login('', '')
      // Здесь должна быть реальная реализация с бэком

      setGuest({
        id: userData.tgId.toString(),
        phone: phoneNumber,
        email: userData.username || `${userData.tgId}@telegram.local`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        registeredAt: Date.now(),
        status: 'active',
        tgUserId: userData.tgId.toString(),
      } as any)

      console.log('✅ Авторизирован через Telegram:', userData)
    } catch (error) {
      useUIStore.getState().setError('Ошибка авторизации')
      throw error
    }
  }

  /**
   * Показать карточку лояльности в Telegram
   */
  showLoyaltyCard(cardNumber: string, balance: number) {
    if (!this.webApp) return

    this.webApp.MainButton.text = `💳 Карта: ${cardNumber} | ${balance} 💰`
    this.webApp.MainButton.show()
    this.webApp.MainButton.onClick(() => {
      this.hapticFeedback('medium')
      // Открыть полный профиль
      window.open('/guest/card', '_blank')
    })
  }

  /**
   * Haptic feedback (вибрация)
   */
  hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') {
    if (!this.webApp?.HapticFeedback) return

    switch (type) {
      case 'light':
        this.webApp.HapticFeedback.impactOccurred('light')
        break
      case 'medium':
        this.webApp.HapticFeedback.impactOccurred('medium')
        break
      case 'heavy':
        this.webApp.HapticFeedback.impactOccurred('heavy')
        break
      case 'success':
        this.webApp.HapticFeedback.notificationOccurred('success')
        break
      case 'error':
        this.webApp.HapticFeedback.notificationOccurred('error')
        break
      case 'warning':
        this.webApp.HapticFeedback.notificationOccurred('warning')
        break
    }
  }

  /**
   * Сохранить данные в Telegram Cloud Storage
   */
  async saveToCloud(key: string, value: string) {
    return new Promise<void>((resolve, reject) => {
      this.webApp?.CloudStorage.setItem(key, value, () => {
        console.log(`✅ Сохранено в Cloud: ${key}`)
        resolve()
      })
    })
  }

  /**
   * Получить данные из Telegram Cloud Storage
   */
  async getFromCloud(key: string) {
    return new Promise<string | null>((resolve) => {
      this.webApp?.CloudStorage.getItem(key, (value) => {
        resolve(value)
      })
    })
  }

  /**
   * Закрыть Web App
   */
  close() {
    this.webApp?.close()
  }

  /**
   * Показать Back Button
   */
  showBackButton(callback: () => void) {
    if (!this.webApp?.BackButton) return
    this.webApp.BackButton.onClick(callback)
    this.webApp.BackButton.show()
  }

  /**
   * Скрыть Back Button
   */
  hideBackButton() {
    if (!this.webApp?.BackButton) return
    this.webApp.BackButton.hide()
  }
}

export const telegramService = new TelegramService()

// Инициализация при загрузке
if (typeof window !== 'undefined') {
  const script = document.createElement('script')
  script.src = 'https://telegram.org/js/telegram-web-app.js'
  script.onload = () => {
    telegramService.init()
  }
  document.head.appendChild(script)
}
