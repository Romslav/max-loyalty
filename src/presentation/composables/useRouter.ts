/**
 * Composable для работы с маршрутизатором
 */

import { computed } from 'vue';
import { useRouter, useRoute, RouteLocationRaw } from 'vue-router';

export function useRouterComposable() {
  const router = useRouter();
  const route = useRoute();

  /**
   * Текущая рута
   */
  const currentPath = computed(() => route.path);
  const currentName = computed(() => route.name);
  const currentParams = computed(() => route.params);
  const currentQuery = computed(() => route.query);

  /**
   * Навигировать на нужные маршруты
   */
  const navigateTo = (to: RouteLocationRaw): Promise<any> => {
    return router.push(to);
  };

  /**
   * Навигировать на главную
   */
  const goHome = (): Promise<any> => {
    return router.push({ name: 'dashboard' });
  };

  /**
   * Навигировать на вход
   */
  const goLogin = (): Promise<any> => {
    return router.push({ name: 'login' });
  };

  /**
   * Навигировать на регистрацию
   */
  const goRegister = (): Promise<any> => {
    return router.push({ name: 'register' });
  };

  /**
   * Определить автентифицирован
   */
  const isAuthenticated = computed((): boolean => {
    return !!route.meta.requiresAuth;
  });

  /**
   * Проверить аставок
   */
  const canGoBack = computed((): boolean => {
    return window.history.length > 1;
  });

  return {
    currentPath,
    currentName,
    currentParams,
    currentQuery,
    navigateTo,
    goHome,
    goLogin,
    goRegister,
    isAuthenticated,
    canGoBack,
  };
}
