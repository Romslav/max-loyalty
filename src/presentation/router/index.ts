/**
 * Основная конфигурация маршрутизатора
 */

import { createRouter, createWebHistory, Router } from 'vue-router';
import { allRoutes } from './routes';
import { registerGuards } from './guards';

/**
 * Создание раутера
 */
const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

/**
 * Перед загрузкой
 */
router.beforeEach((to, from, next) => {
  // Начало навигации
  console.log(`Навигация: ${from.path} -> ${to.path}`);
  next();
});

/**
 * После загрузки
 */
router.afterEach((to, from) => {
  // Конец навигации
  console.log(`Навигация завершена: ${to.path}`);
});

/**
 * Обработка ошибок
 */
router.onError((error) => {
  console.error('Ошибка маршрутизатора:', error);
});

/**
 * Регистрация гвардов
 */
registerGuards(router);

export default router;
export { router };
