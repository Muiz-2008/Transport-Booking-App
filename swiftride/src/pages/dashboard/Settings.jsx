import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  MdDarkMode, MdNotifications, MdSecurity, MdLanguage,
  MdDeleteOutline, MdChevronRight
} from 'react-icons/md'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

export default function Settings() {
  const { dark, toggle } = useTheme()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    promo: false,
  })

  const handleDeleteAccount = () => {
    if (!confirm('Are you sure? This will permanently delete your account.')) return
    toast('Account deletion requested. Contact support to proceed.', { icon: 'ℹ️' })
  }

  const settingSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: MdDarkMode,
          label: 'Dark Mode',
          description: 'Use dark theme across the app',
          control: <Toggle checked={dark} onChange={toggle} />,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: MdNotifications,
          label: 'Email Notifications',
          description: 'Booking confirmations and updates',
          control: <Toggle checked={notifications.email} onChange={v => setNotifications(p => ({ ...p, email: v }))} />,
        },
        {
          icon: MdNotifications,
          label: 'SMS Alerts',
          description: 'Receive departure reminders via SMS',
          control: <Toggle checked={notifications.sms} onChange={v => setNotifications(p => ({ ...p, sms: v }))} />,
        },
        {
          icon: MdNotifications,
          label: 'Push Notifications',
          description: 'In-app notifications and alerts',
          control: <Toggle checked={notifications.push} onChange={v => setNotifications(p => ({ ...p, push: v }))} />,
        },
        {
          icon: MdNotifications,
          label: 'Promotional Emails',
          description: 'Deals, offers and travel tips',
          control: <Toggle checked={notifications.promo} onChange={v => setNotifications(p => ({ ...p, promo: v }))} />,
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          icon: MdSecurity,
          label: 'Change Password',
          description: 'Update your account password',
          control: <button className="text-orange-500 text-sm font-medium" onClick={() => toast('Password change coming soon')}>Update</button>,
        },
        {
          icon: MdSecurity,
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          control: <button className="text-orange-500 text-sm font-medium" onClick={() => toast('2FA coming soon')}>Enable</button>,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: MdLanguage,
          label: 'Language',
          description: 'App display language',
          control: <span className="text-sm text-gray-500">English (NG)</span>,
        },
      ],
    },
  ]

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your preferences and account settings</p>
      </div>

      <div className="space-y-5">
        {settingSections.map(({ title, items }) => (
          <div key={title} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.map(({ icon: Icon, label, description, control }) => (
                <div key={label} className="flex items-center justify-between px-5 py-4 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{label}</p>
                      <p className="text-xs text-gray-400 truncate">{description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">{control}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger zone */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/30 overflow-hidden">
          <div className="px-5 py-3 border-b border-red-100 dark:border-red-900/30">
            <h3 className="font-semibold text-red-600 text-sm">Danger Zone</h3>
          </div>
          <div className="p-5 space-y-3">
            <button
              onClick={() => { logout(); navigate('/') }}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-orange-400 transition-colors"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">Sign out of all devices</span>
              <MdChevronRight className="text-gray-400" />
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-between px-4 py-3 border border-red-200 dark:border-red-900/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
            >
              <span className="text-sm text-red-600 flex items-center gap-2">
                <MdDeleteOutline /> Delete Account
              </span>
              <MdChevronRight className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
