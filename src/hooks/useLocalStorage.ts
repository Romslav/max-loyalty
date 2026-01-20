import { useState, useCallback, useEffect, useRef } from 'react';

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  syncData?: boolean;
}

/**
 * Основной хук для работы с localStorage
 */
export const useLocalStorage = <T,>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
) => {
  const { serializer = JSON.stringify, deserializer = JSON.parse, syncData = true } = options;

  const isMountedRef = useRef(true);

  // От нициализируем, геттер для шления localStorage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      console.warn(`Failed to read localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, deserializer]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Сохраняем в localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serializer(valueToStore));
          // Триггер евент для синхронизации между компонентами
          window.dispatchEvent(new Event('local-storage', { bubbles: true }));
        }
      } catch (error) {
        console.warn(`Failed to set localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serializer]
  );

  // Удаляем из localStorage
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
        window.dispatchEvent(new Event('local-storage', { bubbles: true }));
      }
    } catch (error) {
      console.warn(`Failed to remove localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Обновляем при изменении localStorage в другом табе или фрейме
  useEffect(() => {
    if (!syncData || typeof window === 'undefined') return;

    const handleStorageChange = () => {
      if (isMountedRef.current) {
        setStoredValue(readValue());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [syncData, readValue]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    value: storedValue,
    setValue,
    removeValue,
  };
};

/**
 * Хук для простого localStorage с одним значением
 */
export const useLocalStorageString = (key: string, defaultValue: string = '') => {
  const { value, setValue, removeValue } = useLocalStorage(key, defaultValue, {
    serializer: (val) => val,
    deserializer: (val) => val,
  });

  return [value, setValue, removeValue] as const;
};

/**
 * Хук для работы с объектами/массивами в localStorage
 */
export const useLocalStorageJSON = <T,>(key: string, defaultValue: T) => {
  return useLocalStorage(key, defaultValue, {
    serializer: JSON.stringify,
    deserializer: JSON.parse,
  });
};

/**
 * Хук для работы с boolean в localStorage
 */
export const useLocalStorageBoolean = (key: string, defaultValue: boolean = false) => {
  const { value, setValue, removeValue } = useLocalStorage(key, defaultValue, {
    serializer: (val) => (val ? '1' : '0'),
    deserializer: (val) => val === '1',
  });

  return [value, setValue, removeValue] as const;
};

/**
 * Оптимизированный хук для работы с болюшими объектами с дебоунсом
 */
export const useLocalStorageDebounced = <T,>(
  key: string,
  initialValue: T,
  debounceDelay: number = 500
) => {
  const [value, setValue] = useState<T>(initialValue);
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const { value: storedValue, setValue: setStoredValue } = useLocalStorage(key, initialValue);

  useEffect(() => {
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setStoredValue(value);
    }, debounceDelay);

    return () => clearTimeout(debounceTimerRef.current);
  }, [value, debounceDelay, setStoredValue]);

  return [value, setValue, storedValue] as const;
};

/**
 * Обобщенный хук для работы с несколькими значениями в localStorage
 */
export const useLocalStorageObject = <T extends Record<string, any>>(
  key: string,
  initialValue: T
) => {
  const { value, setValue, removeValue } = useLocalStorage(key, initialValue);

  const updateField = useCallback(
    (fieldKey: keyof T, fieldValue: any) => {
      setValue((prevValue) => ({
        ...prevValue,
        [fieldKey]: fieldValue,
      }));
    },
    [setValue]
  );

  const removeField = useCallback(
    (fieldKey: keyof T) => {
      setValue((prevValue) => {
        const newValue = { ...prevValue };
        delete newValue[fieldKey];
        return newValue;
      });
    },
    [setValue]
  );

  return {
    value,
    setValue,
    removeValue,
    updateField,
    removeField,
  };
};
