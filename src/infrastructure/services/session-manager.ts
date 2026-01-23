/**
 * Session Manager - Управление сессией
 */

import { tokenManager } from './token-manager';
import { useAuthStore } from '@/application/stores/useAuthStore';

interface SessionConfig {
  idleTimeout: number; // ms
  warningTimeout: number; // ms
  persistenceKey: string;
}

class SessionManager {
  private idleTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private lastActivityTime: number = Date.now();
  private isWarningShown: boolean = false;
  private config: SessionConfig;

  constructor(config: Partial<SessionConfig> = {}) {
    this.config = {
      idleTimeout: 30 * 60 * 1000, // 30 min
      warningTimeout: 25 * 60 * 1000, // 25 min
      persistenceKey: 'session_last_activity',
      ...config,
    };
  }

  /**
   * Начать сессию
   */
  start() {
    this.setupActivityListeners();
    this.resetTimers();
  }

  /**
   * Установить listeners активности
   */
  private setupActivityListeners() {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => this.handleActivity(), {
        passive: true,
      });
    });
  }

  /**
   * Обработать активность
   */
  private handleActivity() {
    const now = Date.now();
    const timeSinceLastActivity = now - this.lastActivityTime;

    // Throttle updates (max once per second)
    if (timeSinceLastActivity < 1000) return;

    this.lastActivityTime = now;
    this.persistActivity();
    this.resetTimers();
  }

  /**
   * Остановить timers
   */
  private resetTimers() {
    this.clearTimers();
    this.isWarningShown = false;

    // Warning timer
    this.warningTimer = setTimeout(() => {
      this.showSessionWarning();
    }, this.config.warningTimeout);

    // Idle timer
    this.idleTimer = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.config.idleTimeout);
  }

  /**
   * Очистить timers
   */
  private clearTimers() {
    if (this.warningTimer) clearTimeout(this.warningTimer);
    if (this.idleTimer) clearTimeout(this.idleTimer);
  }

  /**
   * Показать предупреждение
   */
  private showSessionWarning() {
    if (this.isWarningShown) return;
    this.isWarningShown = true;
    window.dispatchEvent(
      new CustomEvent('session:warning', {
        detail: { timeRemaining: this.config.idleTimeout - this.config.warningTimeout },
      })
    );
  }

  /**
   * Обработать timeout
   */
  private handleSessionTimeout() {
    this.end();
    window.dispatchEvent(new CustomEvent('session:timeout'));
  }

  /**
   * Сохранить активность
   */
  private persistActivity() {
    sessionStorage.setItem(this.config.persistenceKey, Date.now().toString());
  }

  /**
   * Получить прослоенное время
   */
  getElapsedIdleTime(): number {
    return Date.now() - this.lastActivityTime;
  }

  /**
   * Получить оставшееся время
   */
  getRemainingTime(): number {
    const remaining = this.config.idleTimeout - this.getElapsedIdleTime();
    return Math.max(0, remaining);
  }

  /**
   * Касаюсь в признаки есть новая активность
   */
  ping() {
    this.handleActivity();
  }

  /**
   * Завершить сессию
   */
  end() {
    this.clearTimers();
    const authStore = useAuthStore();
    authStore.setUser(null);
    tokenManager.clearTokens();
    sessionStorage.removeItem(this.config.persistenceKey);
  }
}

export const sessionManager = new SessionManager();
export { SessionManager };
