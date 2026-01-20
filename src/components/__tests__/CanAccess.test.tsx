import { render, screen } from '@testing-library/react'
import { CanAccess } from '../CanAccess'
import * as usePermissionsModule from '../../hooks/usePermissions'

describe('CanAccess Component', () => {
  const mockHasPermission = vi.fn()
  const mockHasRole = vi.fn()

  beforeEach(() => {
    mockHasPermission.mockClear()
    mockHasRole.mockClear()

    vi.spyOn(usePermissionsModule, 'usePermissions').mockReturnValue({
      hasPermission: mockHasPermission,
      hasRole: mockHasRole,
      permissions: [],
      roles: [],
    } as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render children when permission is granted', () => {
    mockHasPermission.mockReturnValue(true)

    render(
      <CanAccess permission="user:read">
        <button>View User</button>
      </CanAccess>
    )

    expect(screen.getByText('View User')).toBeInTheDocument()
  })

  it('should not render children when permission is denied', () => {
    mockHasPermission.mockReturnValue(false)

    render(
      <CanAccess permission="user:write">
        <button>Edit User</button>
      </CanAccess>
    )

    expect(screen.queryByText('Edit User')).not.toBeInTheDocument()
  })

  it('should render fallback when permission is denied', () => {
    mockHasPermission.mockReturnValue(false)

    render(
      <CanAccess permission="user:admin" fallback={<div>Access Denied</div>}>
        <button>Admin Panel</button>
      </CanAccess>
    )

    expect(screen.getByText('Access Denied')).toBeInTheDocument()
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
  })

  it('should check single permission', () => {
    mockHasPermission.mockReturnValue(true)

    render(
      <CanAccess permission="user:read">
        <span>Allowed</span>
      </CanAccess>
    )

    expect(mockHasPermission).toHaveBeenCalledWith('user:read')
    expect(screen.getByText('Allowed')).toBeInTheDocument()
  })

  it('should check multiple permissions (ALL required)', () => {
    mockHasPermission
      .mockReturnValueOnce(true) // user:read
      .mockReturnValueOnce(true) // user:write

    render(
      <CanAccess permission={['user:read', 'user:write']}>
        <span>Full Access</span>
      </CanAccess>
    )

    expect(mockHasPermission).toHaveBeenCalledWith('user:read')
    expect(mockHasPermission).toHaveBeenCalledWith('user:write')
    expect(screen.getByText('Full Access')).toBeInTheDocument()
  })

  it('should deny access if not all permissions are granted', () => {
    mockHasPermission
      .mockReturnValueOnce(true) // user:read
      .mockReturnValueOnce(false) // user:write

    render(
      <CanAccess permission={['user:read', 'user:write']} fallback={<div>Denied</div>}>
        <span>Full Access</span>
      </CanAccess>
    )

    expect(screen.getByText('Denied')).toBeInTheDocument()
    expect(screen.queryByText('Full Access')).not.toBeInTheDocument()
  })

  it('should check single role', () => {
    mockHasRole.mockReturnValue(true)

    render(
      <CanAccess role="admin">
        <span>Admin Content</span>
      </CanAccess>
    )

    expect(mockHasRole).toHaveBeenCalledWith('admin')
    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })

  it('should check multiple roles (ANY required)', () => {
    mockHasRole
      .mockReturnValueOnce(false) // admin
      .mockReturnValueOnce(true) // moderator

    render(
      <CanAccess role={['admin', 'moderator']}>
        <span>Staff Content</span>
      </CanAccess>
    )

    expect(mockHasRole).toHaveBeenCalledWith('admin')
    expect(mockHasRole).toHaveBeenCalledWith('moderator')
    expect(screen.getByText('Staff Content')).toBeInTheDocument()
  })

  it('should check both permission and role', () => {
    mockHasPermission.mockReturnValue(true)
    mockHasRole.mockReturnValue(true)

    render(
      <CanAccess permission="user:manage" role="admin">
        <span>Admin Management</span>
      </CanAccess>
    )

    expect(mockHasPermission).toHaveBeenCalledWith('user:manage')
    expect(mockHasRole).toHaveBeenCalledWith('admin')
    expect(screen.getByText('Admin Management')).toBeInTheDocument()
  })

  it('should deny access if permission is granted but role is not', () => {
    mockHasPermission.mockReturnValue(true)
    mockHasRole.mockReturnValue(false)

    render(
      <CanAccess permission="user:manage" role="admin" fallback={<div>Denied</div>}>
        <span>Admin Management</span>
      </CanAccess>
    )

    expect(screen.getByText('Denied')).toBeInTheDocument()
    expect(screen.queryByText('Admin Management')).not.toBeInTheDocument()
  })

  it('should render children with no permission/role checks', () => {
    render(<CanAccess><span>Public Content</span></CanAccess>)

    expect(screen.getByText('Public Content')).toBeInTheDocument()
    expect(mockHasPermission).not.toHaveBeenCalled()
    expect(mockHasRole).not.toHaveBeenCalled()
  })
})
