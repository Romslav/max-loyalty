/**
 * Типы маршрутизатора
 */

import { RouteRecordRaw } from 'vue-router';

/**
 * Расширенные метаданные маршрута
 */
export interface RouteMeta {
  title?: string;
  description?: string;
  requiresAuth?: boolean;
  requiresGuest?: boolean;
  layout?: 'default' | 'guest' | 'auth' | 'empty';
  icon?: string;
  breadcrumb?: string;
  order?: number;
  children?: RouteMeta[];
}

/**
 * Расширенная запись маршрута
 */
export interface ExtendedRouteRecord extends RouteRecordRaw {
  meta?: RouteMeta;
  children?: ExtendedRouteRecord[];
}

/**
 * Типы ролей пользователя
 */
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  PREMIUM = 'premium',
  ADMIN = 'admin',
}

/**
 * Статусы навигации
 */
export enum NavigationStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success',
}

/**
 * Интерфейс состояния навигации
 */
export interface NavigationState {
  status: NavigationStatus;
  error?: string;
  isTransitioning: boolean;
}

/**
 * Интерфейс ссылки навигации
 */
export interface NavigationLink {
  name: string;
  path: string;
  icon?: string;
  label: string;
  requiresAuth?: boolean;
  children?: NavigationLink[];
  order?: number;
}
