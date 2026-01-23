/**
 * useError Composable - Обработка ошибок
 */

import { ref, computed } from 'vue';
import { AppError, ErrorType, isAppError } from '@/shared/exceptions/app-error';
import { errorHandler } from '@/shared/exceptions/error-handler';
import { useUIStore } from '@/application/stores/useUIStore';

export interface ErrorOptions {
  showNotification?: boolean;
  logError?: boolean;
  throwError?: boolean;
}

export const useError = () => {
  const uiStore = useUIStore();
  const currentError = ref<AppError | null>(null);
  const errorHistory = ref<AppError[]>([]);
  const errorCount = ref(0);

  // Computed
  const hasError = computed(() => currentError.value !== null);

  const errorMessage = computed(() => {
    return currentError.value?.message || '';
  });

  const errorCode = computed(() => {
    return currentError.value?.code || '';
  });

  const errorType = computed(() => {
    return currentError.value?.type || ErrorType.UNKNOWN;
  });

  /**
   * Обработать ошибку
   */
  const handleError = async (
    error: unknown,
    options: ErrorOptions = {}
  ): Promise<AppError> => {
    const {
      showNotification = true,
      logError = true,
      throwError = false,
    } = options;

    // Normalize error
    const appError = errorHandler.normalize(error);

    // Store in state
    currentError.value = appError;
    errorHistory.value.push(appError);
    errorCount.value++;

    // Log if needed
    if (logError) {
      await errorHandler.handle(appError);
    }

    // Show notification if needed
    if (showNotification) {
      showErrorNotification(appError);
    }

    // Throw if needed
    if (throwError) {
      throw appError;
    }

    return appError;
  };

  /**
   * Показать нотификацию об ошибке
   */
  const showErrorNotification = (error: AppError) => {
    const title = `Error: ${error.code}`;
    const message = error.message;

    switch (error.severity) {
      case 'critical':
        uiStore.showError(message, title);
        break;
      case 'high':
        uiStore.showError(message, title);
        break;
      case 'medium':
        uiStore.showWarning(message, title);
        break;
      case 'low':
        uiStore.showInfo(message, title);
        break;
    }
  };

  /**
   * Очистить текущую ошибку
   */
  const clearError = () => {
    currentError.value = null;
  };

  /**
   * Очистить историю
   */
  const clearHistory = () => {
    errorHistory.value = [];
    errorCount.value = 0;
  };

  /**
   * Проверить тип ошибки
   */
  const isErrorType = (type: ErrorType): boolean => {
    return currentError.value?.type === type;
  };

  /**
   * Циклическая обработка с retry
   */
  const withErrorHandling = async <T>(
    fn: () => Promise<T>,
    options: ErrorOptions & { retries?: number; delay?: number } = {}
  ): Promise<T | null> => {
    const { retries = 1, delay = 1000, ...errorOptions } = options;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === retries - 1) {
          await handleError(error, errorOptions);
          return null;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return null;
  };

  /**
   * Обычная обработка
   */
  const wrap = async <T>(
    fn: () => Promise<T>,
    options: ErrorOptions = {}
  ): Promise<[T | null, AppError | null]> => {
    try {
      const result = await fn();
      return [result, null];
    } catch (error) {
      const appError = await handleError(error, options);
      return [null, appError];
    }
  };

  return {
    // State
    currentError,
    errorHistory,
    errorCount,
    // Computed
    hasError,
    errorMessage,
    errorCode,
    errorType,
    // Methods
    handleError,
    clearError,
    clearHistory,
    isErrorType,
    withErrorHandling,
    wrap,
  };
};
