/**
 * useFetch composable - генеричная логика для API запросов
 */

import { ref, computed } from 'vue';
import { isAppError } from '@/application';

export function useFetch<T>() {
  const data = ref<T | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isError = computed(() => error.value !== null);

  async function execute<R>(promise: Promise<R>): Promise<R | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await promise;
      data.value = result as any;
      return result;
    } catch (err) {
      if (isAppError(err)) {
        error.value = err.message;
      } else if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'An unexpected error occurred';
      }
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function reset() {
    data.value = null;
    error.value = null;
    isLoading.value = false;
  }

  return {
    data,
    isLoading,
    error,
    isError,
    execute,
    clearError,
    reset,
  };
}
