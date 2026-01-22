/**
 * useFormState composable - Advanced form state management with local storage sync
 */

import { ref, computed, watch } from 'vue';
import type { Ref, ComputedRef } from 'vue';

/**
 * Form state configuration
 */
export interface FormStateConfig {
  persistKey?: string; // Optional localStorage key
  persistOnChange?: boolean; // Persist on every change
}

/**
 * useFormState composable
 */
export function useFormState<T extends Record<string, any>>(
  initialData: T,
  config?: FormStateConfig
) {
  // State
  const data = ref<T>(initialData);
  const originalData = ref<T>(JSON.parse(JSON.stringify(initialData)));
  const isModified = ref(false);

  /**
   * Load from localStorage if available
   */
  function loadFromStorage(): void {
    if (!config?.persistKey) return;
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(config.persistKey);
    if (stored) {
      try {
        data.value = JSON.parse(stored);
        isModified.value = false;
      } catch (err) {
        console.error('Failed to parse stored form data', err);
      }
    }
  }

  /**
   * Save to localStorage
   */
  function saveToStorage(): void {
    if (!config?.persistKey) return;
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(config.persistKey, JSON.stringify(data.value));
    } catch (err) {
      console.error('Failed to save form data to storage', err);
    }
  }

  /**
   * Update field
   */
  function setField<K extends keyof T>(field: K, value: T[K]): void {
    data.value[field] = value;
    isModified.value = true;

    if (config?.persistOnChange) {
      saveToStorage();
    }
  }

  /**
   * Update multiple fields
   */
  function setFields(fields: Partial<T>): void {
    data.value = { ...data.value, ...fields };
    isModified.value = true;

    if (config?.persistOnChange) {
      saveToStorage();
    }
  }

  /**
   * Get field value
   */
  function getField<K extends keyof T>(field: K): T[K] {
    return data.value[field];
  }

  /**
   * Reset to original data
   */
  function reset(): void {
    data.value = JSON.parse(JSON.stringify(originalData.value));
    isModified.value = false;
  }

  /**
   * Reset to specific data
   */
  function resetTo(newData: T): void {
    originalData.value = JSON.parse(JSON.stringify(newData));
    data.value = JSON.parse(JSON.stringify(newData));
    isModified.value = false;
  }

  /**
   * Clear storage
   */
  function clearStorage(): void {
    if (!config?.persistKey) return;
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(config.persistKey);
    } catch (err) {
      console.error('Failed to clear form storage', err);
    }
  }

  /**
   * Computed - has changes
   */
  const hasChanges = computed((): boolean => {
    return JSON.stringify(data.value) !== JSON.stringify(originalData.value);
  });

  /**
   * Computed - changes
   */
  const changes = computed((): Partial<T> => {
    const result: Partial<T> = {};
    for (const key in data.value) {
      if (data.value[key] !== originalData.value[key]) {
        result[key] = data.value[key];
      }
    }
    return result;
  });

  // Load from storage on init if configured
  if (config?.persistKey && typeof window !== 'undefined') {
    loadFromStorage();
  }

  return {
    // State
    data,
    originalData,
    isModified,
    // Computed
    hasChanges,
    changes,
    // Methods
    setField,
    setFields,
    getField,
    reset,
    resetTo,
    saveToStorage,
    loadFromStorage,
    clearStorage,
  };
}
