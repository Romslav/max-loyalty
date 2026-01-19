import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePermissions } from '../usePermissions'
import { useAuthStore } from '../../stores/authStore'

describe('usePermissions Hook', () => {
  beforeEach(() => {
    // Reset auth store
    const { setUser } = useAuthStore.getState()
    setUser(null)
  })

  it('should return false for permissions when user is not authenticated', () => {
    const { result } = renderHook(() => usePermissions())
    expect(result.current.hasPermission('user:read')).toBe(false)
  })

  it('should grant admin all permissions', () => {
    useAuthStore.getState().setUser({
      id: 'admin-1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      permissions: [],
    })

    const { result } = renderHook(() => usePermissions())
    expect(result.current.hasPermission('user:read')).toBe(true)
    expect(result.current.hasPermission('user:write')).toBe(true)
    expect(result.current.hasPermission('settings:write')).toBe(true)
  })

  it('should check role-based permissions for restaurant', () => {
    useAuthStore.getState().setUser({
      id: 'rest-1',
      email: 'restaurant@example.com',
      name: 'Restaurant Owner',
      role: 'restaurant',
      permissions: [],
    })

    const { result } = renderHook(() => usePermissions())
    expect(result.current.hasPermission('restaurant:read')).toBe(true)
    expect(result.current.hasPermission('guest:read')).toBe(true)
    expect(result.current.hasPermission('user:delete')).toBe(false)
  })

  it('should check multiple permissions with hasAnyPermission', () => {
    useAuthStore.getState().setUser({
      id: 'guest-1',
      email: 'guest@example.com',
      name: 'Guest User',
      role: 'guest',
      permissions: [],
    })

    const { result } = renderHook(() => usePermissions())
    expect(
      result.current.hasAnyPermission(['guest:read', 'user:write'])
    ).toBe(true)
    expect(
      result.current.hasAnyPermission(['user:write', 'user:delete'])
    ).toBe(false)
  })

  it('should check multiple permissions with hasAllPermissions', () => {
    useAuthStore.getState().setUser({
      id: 'guest-1',
      email: 'guest@example.com',
      name: 'Guest User',
      role: 'guest',
      permissions: ['guest:read', 'profile:read'],
    })

    const { result } = renderHook(() => usePermissions())
    expect(
      result.current.hasAllPermissions(['guest:read', 'profile:read'])
    ).toBe(true)
    expect(
      result.current.hasAllPermissions(['guest:read', 'user:write'])
    ).toBe(false)
  })

  it('should check role correctly', () => {
    useAuthStore.getState().setUser({
      id: 'cashier-1',
      email: 'cashier@example.com',
      name: 'Cashier',
      role: 'cashier',
      permissions: [],
    })

    const { result } = renderHook(() => usePermissions())
    expect(result.current.hasRole('cashier')).toBe(true)
    expect(result.current.hasRole('admin')).toBe(false)
    expect(result.current.hasRole(['cashier', 'admin'])).toBe(true)
  })

  it('should return correct role identification', () => {
    useAuthStore.getState().setUser({
      id: 'admin-1',
      email: 'admin@example.com',
      name: 'Admin',
      role: 'admin',
      permissions: [],
    })

    const { result } = renderHook(() => usePermissions())
    expect(result.current.isAdmin()).toBe(true)
    expect(result.current.isRestaurant()).toBe(false)
    expect(result.current.isCashier()).toBe(false)
    expect(result.current.isGuest()).toBe(false)
  })

  it('should return user permissions', () => {
    useAuthStore.getState().setUser({
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
      role: 'guest',
      permissions: ['guest:read', 'profile:read', 'profile:write'],
    })

    const { result } = renderHook(() => usePermissions())
    const perms = result.current.getUserPermissions()
    expect(perms).toContain('guest:read')
    expect(perms).toContain('profile:read')
    expect(perms).toContain('profile:write')
  })
})
