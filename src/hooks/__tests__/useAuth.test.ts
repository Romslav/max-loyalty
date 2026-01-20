import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import * as api from '@/services/api';

vi.mock('@/services/api');
vi.mock('react-hot-toast');

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = { id: '1', name: 'John', email: 'john@example.com', role: 'admin' };
      const mockToken = 'test-token';

      vi.spyOn(api, 'post').mockResolvedValueOnce({
        data: { user: mockUser, token: mockToken },
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const response = await result.current.login({
          email: 'john@example.com',
          password: 'password123',
        });

        expect(response.success).toBe(true);
        expect(response.user).toEqual(mockUser);
        expect(localStorage.getItem('auth_token')).toBe(mockToken);
      });
    });

    it('should handle login error', async () => {
      const errorMessage = 'Invalid credentials';
      vi.spyOn(api, 'post').mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const response = await result.current.login({
          email: 'john@example.com',
          password: 'wrong',
        });

        expect(response.success).toBe(false);
        expect(response.error).toBe(errorMessage);
      });
    });
  });

  describe('logout', () => {
    it('should clear auth data on logout', async () => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('user', '{"id":"1"}');

      vi.spyOn(api, 'post').mockResolvedValueOnce({});

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      vi.spyOn(api, 'patch').mockResolvedValueOnce({});

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const response = await result.current.changePassword('old123', 'new456');
        expect(response.success).toBe(true);
      });
    });
  });
});
