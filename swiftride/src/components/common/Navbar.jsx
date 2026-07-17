import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { getInitials } from '../../utils/helpers'
import {
  MdDirectionsBus, MdMenu, MdClose, MdDarkMode,
  MdLightMode, MdDashboard, MdLogout, MdPerson,
  MdAdminPanelSettings
} from 'react-icons/md'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/buses', label: 'Find Bus' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white dark:bg-gray-900 shadow-md'
        : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm'
    } border-b border-gray-100 dark:border-gray-800`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <MdDirectionsBus className="text-white text-lg" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              Swift<span className="text-orange-500">Ride</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/30'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {dark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-semibold">
                    {getInitials(user.name)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block max-w-[100px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-20 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <MdDashboard /> Dashboard
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <MdPerson /> Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                        >
                          <MdAdminPanelSettings /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 w-full border-t border-gray-100 dark:border-gray-700"
                      >
                        <MdLogout /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-2">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/30'
                    : 'text-gray-600 dark:text-gray-400'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          {!user && (
            <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
