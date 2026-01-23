/**
 * Основные маршруты
 */

import { ExtendedRouteRecord } from '../types';
import { defineAsyncComponent } from 'vue';

const NotFoundPage = defineAsyncComponent(() => import('@/presentation/pages/core/NotFoundPage.vue'));
const ErrorPage = defineAsyncComponent(() => import('@/presentation/pages/core/ErrorPage.vue'));

export const coreRoutes: ExtendedRouteRecord[] = [
  {
    path: '/error',
    name: 'error',
    component: ErrorPage,
    meta: {
      title: 'Ошибка',
      layout: 'empty',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: NotFoundPage,
    meta: {
      title: 'Страница не найдена',
      layout: 'empty',
    },
  },
];
