import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  MdDashboard, MdDirectionsBus, MdBookmark,
  MdRoute, MdLogout, MdMenu, MdAdminPanelSettings
} from 'react-icons/md'

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: MdDashboard, end: true },
  { to: '/admin/buses', label: 'Manage Buses', icon: MdDirectionsBus },
  { to: '/admin/bookings', label: 'Bookings', icon: MdBookmark },
  { to: '/admin/routes', label: 'Routes', icon: MdRoute },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-30 transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 p-6 border-b border-gray-700">
            <MdAdminPanelSettings className="text-orange-400 text-2xl" />
            <div>
              <p className="font-bold text-white text-sm">SwiftRide</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {adminNav.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Icon className="text-lg flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => { logout(); navigate('/') }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-800 w-full"
            >
              <MdLogout className="text-lg" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <MdMenu className="text-2xl" />
          </button>
          <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
