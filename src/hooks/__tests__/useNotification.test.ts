import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotification } from '../useNotification';
import toast from 'react-hot-toast';

vi.mock('react-hot-toast');

describe('useNotification Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('success', () => {
    it('should call toast.success with message', () => {
      const { result } = renderHook(() => useNotification());
      const message = 'Operation successful';

      act(() => {
        result.current.success(message);
      });

      expect(toast.success).toHaveBeenCalledWith(message, expect.any(Object));
    });
  });

  describe('error', () => {
    it('should call toast.error with message', () => {
      const { result } = renderHook(() => useNotification());
      const message = 'Operation failed';

      act(() => {
        result.current.error(message);
      });

      expect(toast.error).toHaveBeenCalledWith(message, expect.any(Object));
    });
  });

  describe('asyncNotify', () => {
    it('should handle successful async operation', async () => {
      const { result } = renderHook(() => useNotification());
      const asyncFn = vi.fn().mockResolvedValueOnce({ id: '1' });

      const response = await act(async () =>
        result.current.asyncNotify(asyncFn, {
          loading: 'Loading',
          success: 'Success',
          error: 'Error',
        })
      );

      expect(response.success).toBe(true);
      expect(response.data).toEqual({ id: '1' });
      expect(toast.loading).toHaveBeenCalled();
    });

    it('should handle failed async operation', async () => {
      const { result } = renderHook(() => useNotification());
      const asyncFn = vi.fn().mockRejectedValueOnce(new Error('Test error'));

      const response = await act(async () =>
        result.current.asyncNotify(asyncFn, {
          loading: 'Loading',
          success: 'Success',
          error: 'Error',
        })
      );

      expect(response.success).toBe(false);
      expect(response.error).toBe('Test error');
    });
  });

  describe('dismiss', () => {
    it('should call toast.dismiss', () => {
      const { result } = renderHook(() => useNotification());

      act(() => {
        result.current.dismiss('toast-123');
      });

      expect(toast.dismiss).toHaveBeenCalledWith('toast-123');
    });

    it('should dismiss all toasts if no id provided', () => {
      const { result } = renderHook(() => useNotification());

      act(() => {
        result.current.dismissAll();
      });

      expect(toast.dismiss).toHaveBeenCalled();
    });
  });
});
