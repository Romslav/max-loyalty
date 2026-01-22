/**
 * Guest Store - управление гостями
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { container } from '@/infrastructure';
import { isAppError } from '@/application';
import type { Guest, GuestStatistics } from '@/domain/entities';
import type { CreateGuestRequest } from './types';

export const useGuestStore = defineStore('guest', () => {
  // State
  const guests = ref<Guest[]>([]);
  const currentGuest = ref<Guest | null>(null);
  const selectedGuest = ref<Guest | null>(null);
  const statistics = ref<GuestStatistics | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const totalCount = ref(0);

  // Getters
  const guestCount = computed(() => guests.value.length);
  const hasGuests = computed(() => guests.value.length > 0);
  const totalLoyaltyPoints = computed(() => currentGuest.value?.loyaltyBalance ?? 0);

  // Actions
  /**
   * Создать нового гостя
   */
  async function createGuest(data: CreateGuestRequest): Promise<Guest> {
    isLoading.value = true;
    error.value = null;

    try {
      const guest = await container.createGuestUseCase.execute(data);
      guests.value.push(guest);
      currentGuest.value = guest;
      totalCount.value++;

      return guest;
    } catch (err) {
      if (isAppError(err)) {
        error.value = err.message;
      } else {
        error.value = 'Failed to create guest';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Получить гостя по ID
   */
  async function fetchGuest(guestId: string): Promise<Guest> {
    isLoading.value = true;
    error.value = null;

    try {
      const guest = await container.getGuestUseCase.execute(guestId);
      currentGuest.value = guest;
      return guest;
    } catch (err) {
      if (isAppError(err)) {
        error.value = err.message;
      } else {
        error.value = 'Failed to fetch guest';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Получить статистику гостя
   */
  async function fetchStatistics(guestId: string): Promise<GuestStatistics> {
    isLoading.value = true;
    error.value = null;

    try {
      const stats = await container.getGuestStatisticsUseCase.execute({ guestId });
      statistics.value = stats;

      return stats;
    } catch (err) {
      if (isAppError(err)) {
        error.value = err.message;
      } else {
        error.value = 'Failed to fetch statistics';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Заработать баллы
   */
  async function earnPoints(guestId: string, points: number, reason?: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await container.earnPointsUseCase.execute({
        guestId,
        points,
        reason,
      });

      currentGuest.value = result.guest;

      return result;
    } catch (err) {
      if (isAppError(err)) {
        error.value = err.message;
      } else {
        error.value = 'Failed to earn points';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Потратить баллы
   */
  async function redeemPoints(guestId: string, points: number, rewardType: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await container.redeemPointsUseCase.execute({
        guestId,
        points,
        rewardType,
      });

      currentGuest.value = result.guest;

      return result;
    } catch (err) {
      if (isAppError(err)) {
        error.value = err.message;
      } else {
        error.value = 'Failed to redeem points';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Выбрать гостя
   */
  function selectGuest(guest: Guest): void {
    selectedGuest.value = guest;
  }

  /**
   * Очистить выбор
   */
  function clearSelection(): void {
    selectedGuest.value = null;
  }

  /**
   * Очистить ошибки
   */
  function clearError(): void {
    error.value = null;
  }

  return {
    // State
    guests,
    currentGuest,
    selectedGuest,
    statistics,
    isLoading,
    error,
    totalCount,
    // Getters
    guestCount,
    hasGuests,
    totalLoyaltyPoints,
    // Actions
    createGuest,
    fetchGuest,
    fetchStatistics,
    earnPoints,
    redeemPoints,
    selectGuest,
    clearSelection,
    clearError,
  };
});
