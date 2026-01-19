import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart3,
  HeadphonesIcon,
  Settings,
  FileText,
} from 'lucide-react'
import classNames from 'classnames'

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ open = true, onClose }) => {
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/admin/dashboard',
      badge: null,
    },
    {
      icon: Building2,
      label: 'Рестораны',
      href: '/admin/restaurants',
      badge: '24',
    },
    {
      icon: Users,
      label: 'Гости',
      href: '/admin/guests',
      badge: '12.8K',
    },
    {
      icon: CreditCard,
      label: 'Биллинг',
      href: '/admin/billing',
      badge: null,
    },
    {
      icon: BarChart3,
      label: 'Аналитика',
      href: '/admin/analytics',
      badge: null,
    },
    {
      icon: FileText,
      label: 'Логи аудита',
      href: '/admin/audit',
      badge: null,
    },
    {
      icon: HeadphonesIcon,
      label: 'Поддержка',
      href: '/admin/support',
      badge: '3',
    },
  ]

  const settingsItems = [
    {
      icon: Settings,
      label: 'Настройки',
      href: '/admin/settings',
    },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={classNames(
          'fixed lg:sticky top-16 left-0 h-[calc(100vh-64px)] w-64 bg-neutral-900 text-white overflow-y-auto transition-transform duration-300 z-30',
          !open && '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-6 space-y-8">
          {/* Main menu */}
          <nav className="space-y-2">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
              Меню
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      'flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs bg-primary-500/30 text-primary-300 px-2 py-1 rounded">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Settings */}
          <nav className="border-t border-neutral-700 pt-6">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
              Другое
            </p>
            {settingsItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    )
                  }
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-neutral-700 bg-neutral-800/50">
          <p className="text-xs text-neutral-400">
            <span className="font-semibold">Max Loyalty</span>
            <br />
            v1.0.0
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
