import React, { useState } from 'react'
import { Menu, X, LogOut, Settings, Bell, User } from 'lucide-react'
import Button from '../common/Button'
import Avatar from '../common/Avatar'

interface HeaderProps {
  onMenuClick?: () => void
  sidebarOpen?: boolean
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarOpen = true }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side */}
        <div className="flex items-center gap-6">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden sm:flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              ML
            </div>
            <div>
              <h1 className="font-bold text-lg text-neutral-900">Max Loyalty</h1>
              <p className="text-xs text-neutral-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-neutral-100 rounded-lg transition">
            <Bell size={20} className="text-neutral-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition"
            >
              <Avatar name="Admin User" size="sm" />
              <span className="hidden md:inline text-sm font-medium text-neutral-900">
                Admin
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
                <button className="w-full px-4 py-2 text-left hover:bg-neutral-50 flex items-center gap-2 border-b border-neutral-200">
                  <User size={16} />
                  <span>Профиль</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-neutral-50 flex items-center gap-2 border-b border-neutral-200">
                  <Settings size={16} />
                  <span>Настройки</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-error/10 flex items-center gap-2 text-error">
                  <LogOut size={16} />
                  <span>Выход</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
