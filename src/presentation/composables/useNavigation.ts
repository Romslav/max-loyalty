/**
 * Composable для работы с навигацией
 */

import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/application/stores/useAuthStore';
import { getNavigation, userNavigation, guestNavigation } from '@/presentation/router/navigation';
import { NavigationLink } from '@/presentation/router/types';

export function useNavigation() {
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const isMobileMenuOpen = ref(false);

  /**
   * Генерируют навигационные линки
   */
  const navigationLinks = computed<NavigationLink[]>(() => {
    return getNavigation(authStore.isAuthenticated);
  });

  /**
   * Количество пользователю
   */
  const userMenuItems = computed<NavigationLink[]>(() => {
    return userNavigation.sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  /**
   * Навигация для гостей
   */
  const guestMenuItems = computed<NavigationLink[]>(() => {
    return guestNavigation;
  });

  /**
   * Определить открыт навигационный элемент
   */
  const isActive = (name: string): boolean => {
    return route.name === name;
  };

  /**
   * Удалить активный мобильный uня при навигации
   */
  const navigate = async (to: string | { name: string; params?: any }): Promise<void> => {
    isMobileMenuOpen.value = false;
    await router.push(to);
  };

  /**
   * Назад равно
   */
  const goBack = (): void => {
    router.back();
  };

  /**
   * Вперед равно
   */
  const goForward = (): void => {
    router.forward();
  };

  /**
   * Поперечи решение мобильного меню
   */
  const toggleMobileMenu = (): void => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };

  /**
   * Закрыть мобильное меню
   */
  const closeMobileMenu = (): void => {
    isMobileMenuOpen.value = false;
  };

  /**
   * Открыть мобильное меню
   */
  const openMobileMenu = (): void => {
    isMobileMenuOpen.value = true;
  };

  return {
    navigationLinks,
    userMenuItems,
    guestMenuItems,
    isMobileMenuOpen,
    isActive,
    navigate,
    goBack,
    goForward,
    toggleMobileMenu,
    closeMobileMenu,
    openMobileMenu,
  };
}
