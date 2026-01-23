/**
 * useInput Composable - Обработка ввода данных
 */

import { ref, computed } from 'vue';

export interface InputOptions<T = string> {
  initialValue?: T;
  format?: (value: T) => T;
  transform?: (value: T) => T;
  debounce?: number;
}

export const useInput = <T = string>(options: InputOptions<T> = {}) => {
  const {
    initialValue = '' as T,
    format,
    transform,
    debounce: debounceMs = 0,
  } = options;

  // State
  const value = ref<T>(initialValue);
  const isFocused = ref(false);
  const isDirty = ref(false);
  let debounceTimer: NodeJS.Timeout | null = null;

  // Computed
  const isEmpty = computed(() => {
    if (typeof value.value === 'string') return value.value.trim() === '';
    if (Array.isArray(value.value)) return value.value.length === 0;
    return value.value === null || value.value === undefined;
  });

  const isTrimmed = computed(() => {
    if (typeof value.value === 'string') {
      return value.value === value.value.trim();
    }
    return true;
  });

  /**
   * Остановить значение
   */
  const setValue = (newValue: T, silent: boolean = false) => {
    let finalValue = newValue;

    if (transform) {
      finalValue = transform(finalValue);
    }

    value.value = finalValue;

    if (!silent) {
      isDirty.value = true;
    }
  };

  /**
   * Очистить встроенными пробелами
   */
  const trim = () => {
    if (typeof value.value === 'string') {
      setValue(value.value.trim() as T);
    }
  };

  /**
   * Очистить все пробелы
   */
  const removeWhitespace = () => {
    if (typeof value.value === 'string') {
      setValue(value.value.replace(/\s+/g, '') as T);
    }
  };

  /**
   * Трансформировать в нижние буквы
   */
  const toLower = () => {
    if (typeof value.value === 'string') {
      setValue(value.value.toLowerCase() as T);
    }
  };

  /**
   * Трансформировать в верхние буквы
   */
  const toUpper = () => {
    if (typeof value.value === 'string') {
      setValue(value.value.toUpperCase() as T);
    }
  };

  /**
   * Капитализировать первую букву
   */
  const capitalize = () => {
    if (typeof value.value === 'string' && value.value.length > 0) {
      const str = value.value as string;
      setValue((str.charAt(0).toUpperCase() + str.slice(1)) as T);
    }
  };

  /**
   * Обработчик для focus
   */
  const handleFocus = () => {
    isFocused.value = true;
  };

  /**
   * Обработчик для blur
   */
  const handleBlur = () => {
    isFocused.value = false;
    trim();
  };

  /**
   * Обработчик для input с debounce
   */
  const handleInput = (newValue: T, callback?: (value: T) => void) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      setValue(newValue);
      callback?.(value.value);
    }, debounceMs);
  };

  /**
   * Отменить несколько символов
   */
  const backspace = (count: number = 1) => {
    if (typeof value.value === 'string') {
      setValue(value.value.slice(0, -count) as T);
    }
  };

  /**
   * На это символ в конце (добавить символ)
   */
  const append = (text: string) => {
    if (typeof value.value === 'string') {
      setValue(value.value + text as T);
    }
  };

  /**
   * Очистить внесенные символы
   */
  const clear = () => {
    setValue('' as T);
    isDirty.value = false;
  };

  /**
   * Остановить начальное значение
   */
  const reset = () => {
    setValue(initialValue, true);
    isDirty.value = false;
  };

  /**
   * Отформатировать значение
   */
  const formatted = computed(() => {
    return format ? format(value.value) : value.value;
  });

  /**
   * Получить длину
   */
  const length = computed(() => {
    if (typeof value.value === 'string') return value.value.length;
    if (Array.isArray(value.value)) return value.value.length;
    return 0;
  });

  return {
    // State
    value,
    isFocused,
    isDirty,
    // Computed
    isEmpty,
    isTrimmed,
    formatted,
    length,
    // Methods
    setValue,
    trim,
    removeWhitespace,
    toLower,
    toUpper,
    capitalize,
    handleFocus,
    handleBlur,
    handleInput,
    backspace,
    append,
    clear,
    reset,
  };
};
