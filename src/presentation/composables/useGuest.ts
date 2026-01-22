/**
 * useGuest composable - работа с гостями
 */

import { computed } from 'vue';
import { useGuestStore } from '@/presentation/stores';
import type { CreateGuestRequest } from '@/presentation/stores/guest/types';

export function useGuest() {
  const guestStore = useGuestStore();

  const currentGuest = computed(() => guestStore.currentGuest);
  const guests = computed(() => guestStore.guests);
  const selectedGuest = computed(() => guestStore.selectedGuest);
  const statistics = computed(() => guestStore.statistics);
  const isLoading = computed(() => guestStore.isLoading);
  const error = computed(() => guestStore.error);
  const guestCount = computed(() => guestStore.guestCount);
  const totalLoyaltyPoints = computed(() => guestStore.totalLoyaltyPoints);

  async function createGuest(data: CreateGuestRequest) {
    try {
      await guestStore.createGuest(data);
      return true;
    } catch (err) {
      return false;
    }
  }

  async function fetchGuest(guestId: string) {
    try {
      await guestStore.fetchGuest(guestId);
      return true;
    } catch (err) {
      return false;
    }
  }

  async function fetchStatistics(guestId: string) {
    try {
      await guestStore.fetchStatistics(guestId);
      return true;
    } catch (err) {
      return false;
    }
  }

  async function earnPoints(guestId: string, points: number, reason?: string) {
    try {
      await guestStore.earnPoints(guestId, points, reason);
      return true;
    } catch (err) {
      return false;
    }
  }

  async function redeemPoints(guestId: string, points: number, rewardType: string) {
    try {
      await guestStore.redeemPoints(guestId, points, rewardType);
      return true;
    } catch (err) {
      return false;
    }
  }

  function selectGuest(guestId: string) {
    const guest = guests.value.find((g) => g.id === guestId);
    if (guest) {
      guestStore.selectGuest(guest);
    }
  }

  function clearSelection() {
    guestStore.clearSelection();
  }

  function clearError() {
    guestStore.clearError();
  }

  return {
    currentGuest,
    guests,
    selectedGuest,
    statistics,
    isLoading,
    error,
    guestCount,
    totalLoyaltyPoints,
    createGuest,
    fetchGuest,
    fetchStatistics,
    earnPoints,
    redeemPoints,
    selectGuest,
    clearSelection,
    clearError,
  };
}
