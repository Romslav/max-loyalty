/**
 * User Store - управление пользователями
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { container } from '@/infrastructure';
import { isAppError } from '@/application';
import type { User } from '@/domain/entities';
import type { UpdateUserRequest } from './types';

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([]);
  const currentUser = ref<User | null>(null);
  const selectedUser = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const totalCount = ref(0);

  // Getters
  const userCount = computed(() => users.value.length);
  const hasUsers = computed(() => users.value.length > 0);

  // Actions
  async function fetchUser(userId: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await container.getUserUseCase.execute(userId);
      currentUser.value = result;
    } catch (err) {
      if (isAppError(err)) {
        error.value = err.message;
      } else {
        error.value = 'Failed to fetch user';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUser(userId: string, data: UpdateUserRequest) {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await container.updateUserUseCase.execute({
        userId,
        ...data,
      });

      currentUser.value = result.user;

      return result;
    } catch (err) {
      if (isAppError(err)) {
        error.value = err.message;
      } else {
        error.value = 'Failed to update user';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function selectUser(user: User) {
    selectedUser.value = user;
  }

  function clearSelection() {
    selectedUser.value = null;
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    users,
    currentUser,
    selectedUser,
    isLoading,
    error,
    totalCount,
    // Getters
    userCount,
    hasUsers,
    // Actions
    fetchUser,
    updateUser,
    selectUser,
    clearSelection,
    clearError,
  };
});
