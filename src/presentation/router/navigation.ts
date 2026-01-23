/**
 * Конфигурация навигации
 */

import { NavigationLink } from './types';

/**
 * Пункты меню для гостей
 */
export const guestNavigation: NavigationLink[] = [
  {
    name: 'login',
    path: '/login',
    label: 'Вход',
    icon: '🔐',
  },
  {
    name: 'register',
    path: '/register',
    label: 'Регистрация',
    icon: '✍️',
  },
];

/**
 * Пункты меню для пользователя
 */
export const userNavigation: NavigationLink[] = [
  {
    name: 'dashboard',
    path: '/dashboard',
    label: 'Кабинет',
    icon: '🏘️',
    order: 1,
  },
  {
    name: 'rewards',
    path: '/rewards',
    label: 'Награды',
    icon: '🎁',
    order: 2,
  },
  {
    name: 'transactions',
    path: '/transactions',
    label: 'Листория',
    icon: '💳',
    order: 3,
  },
  {
    name: 'profile',
    path: '/profile',
    label: 'Профиль',
    icon: '👤',
    order: 4,
  },
];

/**
 * Мобильное меню
 */
export const mobileNavigation: NavigationLink[] = userNavigation;

/**
 * Навигация среднео
 */
export const getNavigation = (isAuthenticated: boolean): NavigationLink[] => {
  return isAuthenticated ? userNavigation : guestNavigation;
};
