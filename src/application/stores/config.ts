/**
 * Конфигурация Pinia
 */

import { createPinia } from 'pinia';

/**
 * Создание инстанци Pinia
 */
const pinia = createPinia();

/**
 * Плагин для расширенного логирования
 */
pinia.use(({ store }) => {
  // Log store state changes in development
  if (import.meta.env.DEV) {
    console.log(`[Pinia] Store ${store.$id} initialized`);
  }
});

export { pinia };

/**
 * Настройка при инициализации аппликации
 */
export const setupStores = (app: any) => {
  app.use(pinia);
};
