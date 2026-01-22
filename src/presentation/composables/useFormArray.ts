/**
 * useFormArray composable - Manage arrays of form data (dynamic fields)
 */

import { ref, computed } from 'vue';
import type { Ref, ComputedRef } from 'vue';

/**
 * useFormArray composable
 */
export function useFormArray<T extends Record<string, any>>(
  initialItems: T[] = []
) {
  // State
  const items = ref<T[]>(initialItems);

  /**
   * Add item
   */
  function addItem(item: T): void {
    items.value.push(item);
  }

  /**
   * Add multiple items
   */
  function addItems(newItems: T[]): void {
    items.value.push(...newItems);
  }

  /**
   * Remove item by index
   */
  function removeItem(index: number): void {
    items.value.splice(index, 1);
  }

  /**
   * Update item at index
   */
  function updateItem(index: number, updates: Partial<T>): void {
    items.value[index] = { ...items.value[index], ...updates };
  }

  /**
   * Replace item at index
   */
  function replaceItem(index: number, item: T): void {
    items.value[index] = item;
  }

  /**
   * Move item
   */
  function moveItem(fromIndex: number, toIndex: number): void {
    const item = items.value[fromIndex];
    items.value.splice(fromIndex, 1);
    items.value.splice(toIndex, 0, item);
  }

  /**
   * Reset items
   */
  function reset(): void {
    items.value = initialItems;
  }

  /**
   * Clear all items
   */
  function clear(): void {
    items.value = [];
  }

  /**
   * Get item by index
   */
  function getItem(index: number): T | undefined {
    return items.value[index];
  }

  /**
   * Find item
   */
  function findItem(predicate: (item: T) => boolean): T | undefined {
    return items.value.find(predicate);
  }

  /**
   * Filter items
   */
  function filterItems(predicate: (item: T) => boolean): T[] {
    return items.value.filter(predicate);
  }

  /**
   * Computed - item count
   */
  const itemCount = computed((): number => items.value.length);

  /**
   * Computed - is empty
   */
  const isEmpty = computed((): boolean => items.value.length === 0);

  return {
    // State
    items,
    // Computed
    itemCount,
    isEmpty,
    // Methods
    addItem,
    addItems,
    removeItem,
    updateItem,
    replaceItem,
    moveItem,
    reset,
    clear,
    getItem,
    findItem,
    filterItems,
  };
}
