import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsync, useAsyncPaginated } from '../useAsync';

describe('useAsync Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useAsync', () => {
    it('should load data on mount', async () => {
      const mockData = { id: 1, name: 'Test' };
      const asyncFn = vi.fn().mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useAsync(asyncFn));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      const asyncFn = vi.fn().mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAsync(asyncFn));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toEqual(error);
    });

    it('should not load immediately if immediate is false', () => {
      const asyncFn = vi.fn();

      const { result } = renderHook(() =>
        useAsync(asyncFn, { immediate: false })
      );

      expect(result.current.loading).toBe(false);
      expect(asyncFn).not.toHaveBeenCalled();
    });

    it('should execute manually when execute is called', async () => {
      const mockData = { id: 1 };
      const asyncFn = vi.fn().mockResolvedValueOnce(mockData);

      const { result } = renderHook(() =>
        useAsync(asyncFn, { immediate: false })
      );

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toEqual(mockData);
    });

    it('should retry on error', async () => {
      const asyncFn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Error 1'))
        .mockResolvedValueOnce({ id: 1 });

      const { result } = renderHook(() => useAsync(asyncFn));

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      await act(async () => {
        await result.current.retry();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual({ id: 1 });
    });
  });

  describe('useAsyncPaginated', () => {
    it('should load first page on mount', async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      const asyncFn = vi
        .fn()
        .mockResolvedValueOnce({ data: mockData, total: 100 });

      const { result } = renderHook(() =>
        useAsyncPaginated(asyncFn, 20)
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.page).toBe(1);
      expect(result.current.hasMore).toBe(true);
    });

    it('should go to next page', async () => {
      const page1Data = [{ id: 1 }];
      const page2Data = [{ id: 2 }];
      const asyncFn = vi
        .fn()
        .mockResolvedValueOnce({ data: page1Data, total: 100 })
        .mockResolvedValueOnce({ data: page2Data, total: 100 });

      const { result } = renderHook(() =>
        useAsyncPaginated(asyncFn, 20)
      );

      await waitFor(() => {
        expect(result.current.page).toBe(1);
      });

      await act(async () => {
        result.current.nextPage();
      });

      await waitFor(() => {
        expect(result.current.page).toBe(2);
        expect(result.current.data).toEqual(page2Data);
      });
    });

    it('should not go past last page', async () => {
      const mockData = [{ id: 1 }];
      const asyncFn = vi
        .fn()
        .mockResolvedValueOnce({ data: mockData, total: 10 });

      const { result } = renderHook(() =>
        useAsyncPaginated(asyncFn, 20)
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.hasMore).toBe(false);
    });
  });
});
