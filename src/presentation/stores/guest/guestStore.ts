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
  async function createGuest(data: CreateGuestRequest) {
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

  async function fetchGuest(guestId: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const guest = await container.getGuestUseCase.execute(guestId);
      currentGuest.value = guest;
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

  async function fetchStatistics(guestId: string) {
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

  function selectGuest(guest: Guest) {
    selectedGuest.value = guest;
  }

  function clearSelection() {
    selectedGuest.value = null;
  }

  function clearError() {
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
