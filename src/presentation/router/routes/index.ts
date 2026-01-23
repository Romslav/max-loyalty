/**
 * Индекс всех маршрутов
 */

import { ExtendedRouteRecord } from '../types';
import { guestRoutes } from './guest';
import { userRoutes } from './user';
import { coreRoutes } from './core';

/**
 * Коллекция всех маршрутов
 */
export const allRoutes: ExtendedRouteRecord[] = [
  ...guestRoutes,
  ...userRoutes,
  ...coreRoutes,
];

export { guestRoutes, userRoutes, coreRoutes };
