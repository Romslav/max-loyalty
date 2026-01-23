/**
 * Гварды маршрутов
 */

import { Router, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/application/stores/useAuthStore';

/**
 * Проверить автентификацию
 */
export const checkAuthGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: any
) => {
  const authStore = useAuthStore();

  if (to.meta?.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  if (to.meta?.requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'dashboard' });
  }

  next();
};

/**
 * Проверить пермиссии
 */
export const checkPermissionsGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: any
) => {
  const authStore = useAuthStore();

  // Полюса доста администратору
  if (to.meta?.requiresAdmin && !authStore.isAdmin) {
    return next({ name: '404' });
  }

  next();
};

/**
 * Проверить верификацию электронной почты
 */
export const checkEmailVerificationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: any
) => {
  const authStore = useAuthStore();

  if (to.meta?.requiresEmailVerification && !authStore.emailVerified) {
    return next({ name: 'verifyEmail' });
  }

  next();
};

/**
 * Обновить заголовок страницы
 */
export const updatePageTitleGuard = (to: RouteLocationNormalized) => {
  const title = (to.meta?.title as string) || 'MAX Loyalty';
  const description = (to.meta?.description as string) || '';
  document.title = `${title} | MAX Loyalty`;
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && description) {
    metaDescription.setAttribute('content', description);
  }
};

/**
 * Регистрировать все гварды
 */
export const registerGuards = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    // Проверка автентификации
    await checkAuthGuard(to, from, next);
  });

  router.beforeEach(async (to, from, next) => {
    // Проверка пермиссий
    await checkPermissionsGuard(to, from, next);
  });

  router.beforeEach(async (to, from, next) => {
    // Проверка верификации
    await checkEmailVerificationGuard(to, from, next);
  });

  router.afterEach((to) => {
    // Обновление заголовка
    updatePageTitleGuard(to);
  });
};
