/**
 * useUser composable - работа с пользователями
 */

import { computed } from 'vue';
import { useUserStore } from '@/presentation/stores';
import type { UpdateUserRequest } from '@/presentation/stores/user/types';

export function useUser() {
  const userStore = useUserStore();

  const currentUser = computed(() => userStore.currentUser);
  const users = computed(() => userStore.users);
  const selectedUser = computed(() => userStore.selectedUser);
  const isLoading = computed(() => userStore.isLoading);
  const error = computed(() => userStore.error);
  const userCount = computed(() => userStore.userCount);

  async function fetchUser(userId: string) {
    try {
      await userStore.fetchUser(userId);
      return true;
    } catch (err) {
      return false;
    }
  }

  async function updateUser(userId: string, data: UpdateUserRequest) {
    try {
      await userStore.updateUser(userId, data);
      return true;
    } catch (err) {
      return false;
    }
  }

  function selectUser(userId: string) {
    const user = users.value.find((u) => u.id === userId);
    if (user) {
      userStore.selectUser(user);
    }
  }

  function clearSelection() {
    userStore.clearSelection();
  }

  function clearError() {
    userStore.clearError();
  }

  return {
    currentUser,
    users,
    selectedUser,
    isLoading,
    error,
    userCount,
    fetchUser,
    updateUser,
    selectUser,
    clearSelection,
    clearError,
  };
}
