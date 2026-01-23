/**
 * Маршруты пользователя
 */

import { ExtendedRouteRecord } from '../types';
import { defineAsyncComponent } from 'vue';

const DashboardPage = defineAsyncComponent(() => import('@/presentation/pages/user/DashboardPage.vue'));
const ProfilePage = defineAsyncComponent(() => import('@/presentation/pages/user/ProfilePage.vue'));
const RewardsPage = defineAsyncComponent(() => import('@/presentation/pages/user/RewardsPage.vue'));
const TransactionsPage = defineAsyncComponent(() => import('@/presentation/pages/user/TransactionsPage.vue'));

export const userRoutes: ExtendedRouteRecord[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: {
      title: 'Кабинет',
      requiresAuth: true,
      layout: 'default',
      icon: '🏘️',
      order: 1,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: {
      title: 'Профиль',
      requiresAuth: true,
      layout: 'default',
      icon: '👤',
      order: 4,
    },
  },
  {
    path: '/rewards',
    name: 'rewards',
    component: RewardsPage,
    meta: {
      title: 'Награды',
      requiresAuth: true,
      layout: 'default',
      icon: '🎁',
      order: 2,
    },
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: TransactionsPage,
    meta: {
      title: 'Листория',
      requiresAuth: true,
      layout: 'default',
      icon: '💳',
      order: 3,
    },
  },
];
