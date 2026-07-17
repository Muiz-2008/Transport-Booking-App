import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getInitials } from '../utils/helpers'
import {
  MdDashboard, MdHistory, MdPerson, MdSettings,
  MdDirectionsBus, MdLogout, MdMenu, MdClose
} from 'react-icons/md'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: MdDashboard, end: true },
  { to: '/dashboard/bookings', label: 'My Bookings', icon: MdHistory },
  { to: '/dashboard/profile', label: 'Profile', icon: MdPerson },
  { to: '/dashboard/settings', label: 'Settings', icon: MdSettings },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
      {/* mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-30 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-800">
            <MdDirectionsBus className="text-orange-500 text-2xl" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">SwiftRide</span>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold text-sm">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`
                }
              >
                <Icon className="text-lg flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 w-full transition-colors"
            >
              <MdLogout className="text-lg" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 dark:text-gray-400">
            <MdMenu className="text-2xl" />
          </button>
          <span className="font-bold text-gray-900 dark:text-white">Dashboard</span>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
