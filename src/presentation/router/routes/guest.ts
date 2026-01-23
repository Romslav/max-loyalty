/**
 * Маршруты гостя
 */

import { ExtendedRouteRecord } from '../types';
import { defineAsyncComponent } from 'vue';

const LoginPage = defineAsyncComponent(() => import('@/presentation/pages/guest/LoginPage.vue'));
const RegisterPage = defineAsyncComponent(() => import('@/presentation/pages/guest/RegisterPage.vue'));
const ForgotPasswordPage = defineAsyncComponent(() => import('@/presentation/pages/guest/ForgotPasswordPage.vue'));
const VerifyEmailPage = defineAsyncComponent(() => import('@/presentation/pages/guest/VerifyEmailPage.vue'));

export const guestRoutes: ExtendedRouteRecord[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      title: 'Вход',
      requiresGuest: true,
      layout: 'guest',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: {
      title: 'Регистрация',
      requiresGuest: true,
      layout: 'guest',
    },
  },
  {
    path: '/forgot-password',
    name: 'forgotPassword',
    component: ForgotPasswordPage,
    meta: {
      title: 'Восстановление пароля',
      requiresGuest: true,
      layout: 'guest',
    },
  },
  {
    path: '/verify-email',
    name: 'verifyEmail',
    component: VerifyEmailPage,
    meta: {
      title: 'Подтверждение email',
      layout: 'guest',
    },
  },
];
