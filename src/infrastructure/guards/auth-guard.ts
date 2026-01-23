/**
 * Auth Guard - Охрана маршрутов
 */

import { useAuthStore } from '@/application/stores/useAuthStore';
import { tokenManager } from '@/infrastructure/services/token-manager';

type RouteGuardFunction = (to: any, from: any, next: any) => boolean | Promise<boolean> | void;

class AuthGuard {
  /**
   * Юзер авторизован?
   */
  static isAuthenticated(): boolean {
    const authStore = useAuthStore();
    return authStore.isAuthenticated && tokenManager.isValid();
  }

  /**
   * Охрана - основная
   */
  static create(): RouteGuardFunction {
    return (to, from, next) => {
      if (this.isAuthenticated()) {
        next();
      } else {
        next('/login');
      }
    };
  }

  /**
   * Охрана - гость
   */
  static createGuestGuard(): RouteGuardFunction {
    return (to, from, next) => {
      if (!this.isAuthenticated()) {
        next();
      } else {
        next('/dashboard');
      }
    };
  }

  /**
   * Охрана - админ
   */
  static createAdminGuard(): RouteGuardFunction {
    return (to, from, next) => {
      const authStore = useAuthStore();
      if (this.isAuthenticated() && authStore.isAdmin) {
        next();
      } else {
        next('/dashboard');
      }
    };
  }

  /**
   * Охрана - емейл не подтвержден
   */
  static createEmailVerificationGuard(): RouteGuardFunction {
    return (to, from, next) => {
      const authStore = useAuthStore();
      if (this.isAuthenticated() && !authStore.emailVerified) {
        next();
      } else if (this.isAuthenticated() && authStore.emailVerified) {
        next('/dashboard');
      } else {
        next('/login');
      }
    };
  }

  /**
   * Охрана - премиум
   */
  static createPremiumGuard(): RouteGuardFunction {
    return (to, from, next) => {
      const authStore = useAuthStore();
      if (this.isAuthenticated() && authStore.isPremium) {
        next();
      } else {
        next('/premium');
      }
    };
  }

  /**
   * Охрана - кустомная
   */
  static createCustomGuard(
    condition: (authStore: ReturnType<typeof useAuthStore>) => boolean
  ): RouteGuardFunction {
    return (to, from, next) => {
      const authStore = useAuthStore();
      if (this.isAuthenticated() && condition(authStore)) {
        next();
      } else {
        next('/dashboard');
      }
    };
  }
}

export { AuthGuard };
