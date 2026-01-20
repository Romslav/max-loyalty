import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePermissions } from '../usePermissions';
import * as store from '@/stores/useStore';

vi.mock('@/stores/useStore');

describe('usePermissions Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hasPermission', () => {
    it('should return true if user has permission', () => {
      vi.spyOn(store, 'useStore').mockReturnValueOnce({
        user: { id: '1', role: 'admin' },
      } as any);

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasPermission('manage_restaurants')).toBe(true);
    });

    it('should return false if user does not have permission', () => {
      vi.spyOn(store, 'useStore').mockReturnValueOnce({
        user: { id: '1', role: 'guest' },
      } as any);

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasPermission('manage_restaurants')).toBe(false);
    });

    it('should return false if user is not authenticated', () => {
      vi.spyOn(store, 'useStore').mockReturnValueOnce({
        user: null,
      } as any);

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasPermission('manage_restaurants')).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true if user has the specified role', () => {
      vi.spyOn(store, 'useStore').mockReturnValueOnce({
        user: { id: '1', role: 'admin' },
      } as any);

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasRole('admin')).toBe(true);
    });

    it('should return true if user has one of the specified roles', () => {
      vi.spyOn(store, 'useStore').mockReturnValueOnce({
        user: { id: '1', role: 'admin' },
      } as any);

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasRole(['guest', 'admin'])).toBe(true);
    });

    it('should return false if user does not have the role', () => {
      vi.spyOn(store, 'useStore').mockReturnValueOnce({
        user: { id: '1', role: 'guest' },
      } as any);

      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasRole('admin')).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true if user is admin', () => {
      vi.spyOn(store, 'useStore').mockReturnValueOnce({
        user: { id: '1', role: 'admin' },
      } as any);

      const { result } = renderHook(() => usePermissions());
      expect(result.current.isAdmin()).toBe(true);
    });

    it('should return false if user is not admin', () => {
      vi.spyOn(store, 'useStore').mockReturnValueOnce({
        user: { id: '1', role: 'guest' },
      } as any);

      const { result } = renderHook(() => usePermissions());
      expect(result.current.isAdmin()).toBe(false);
    });
  });

  describe('canPerformAction', () => {
    it('should allow admin to perform any action', () => {
      vi.spyOn(store, 'useStore').mockReturnValueOnce({
        user: { id: '1', role: 'admin' },
      } as any);

      const { result } = renderHook(() => usePermissions());
      expect(result.current.canPerformAction('delete_user')).toBe(true);
    });

    it('should prevent non-owner from editing entity', () => {
      vi.spyOn(store, 'useStore').mockReturnValueOnce({
        user: { id: '1', role: 'restaurant' },
      } as any);

      const { result } = renderHook(() => usePermissions());
      expect(result.current.canPerformAction('edit_restaurant', '2')).toBe(false);
    });
  });
});
