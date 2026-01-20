import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage, useLocalStorageJSON, useLocalStorageBoolean } from '../useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('useLocalStorage', () => {
    it('should initialize with default value', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default')
      );

      expect(result.current.value).toBe('default');
    });

    it('should read from localStorage if value exists', () => {
      localStorage.setItem('test-key', 'stored-value');

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default')
      );

      expect(result.current.value).toBe('stored-value');
    });

    it('should update localStorage when value changes', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      );

      act(() => {
        result.current.setValue('new-value');
      });

      expect(result.current.value).toBe('new-value');
      expect(localStorage.getItem('test-key')).toBe('new-value');
    });

    it('should remove value from localStorage', () => {
      localStorage.setItem('test-key', 'value');

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default')
      );

      act(() => {
        result.current.removeValue();
      });

      expect(result.current.value).toBe('default');
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('should support function update', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 0)
      );

      act(() => {
        result.current.setValue((prev) => prev + 1);
      });

      expect(result.current.value).toBe(1);
    });
  });

  describe('useLocalStorageJSON', () => {
    it('should store and retrieve JSON objects', () => {
      const initialObj = { name: 'test', age: 25 };

      const { result } = renderHook(() =>
        useLocalStorageJSON('user', initialObj)
      );

      act(() => {
        result.current.setValue({ name: 'updated', age: 30 });
      });

      expect(result.current.value).toEqual({ name: 'updated', age: 30 });
      expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual({
        name: 'updated',
        age: 30,
      });
    });

    it('should store arrays', () => {
      const initialArray = [1, 2, 3];

      const { result } = renderHook(() =>
        useLocalStorageJSON('numbers', initialArray)
      );

      act(() => {
        result.current.setValue([1, 2, 3, 4]);
      });

      expect(result.current.value).toEqual([1, 2, 3, 4]);
    });
  });

  describe('useLocalStorageBoolean', () => {
    it('should store boolean as 0 or 1', () => {
      const { result } = renderHook(() =>
        useLocalStorageBoolean('flag', false)
      );

      act(() => {
        result.current.setValue(true);
      });

      expect(result.current.value).toBe(true);
      expect(localStorage.getItem('flag')).toBe('1');
    });

    it('should read boolean from 0 or 1', () => {
      localStorage.setItem('flag', '1');

      const { result } = renderHook(() =>
        useLocalStorageBoolean('flag', false)
      );

      expect(result.current.value).toBe(true);
    });

    it('should handle false value', () => {
      localStorage.setItem('flag', '0');

      const { result } = renderHook(() =>
        useLocalStorageBoolean('flag', true)
      );

      expect(result.current.value).toBe(false);
      expect(localStorage.getItem('flag')).toBe('0');
    });
  });
});
