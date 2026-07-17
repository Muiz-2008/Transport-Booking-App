import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { MdPerson, MdEmail, MdPhone, MdEdit, MdSave } from 'react-icons/md'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone) e.phone = 'Phone is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    updateProfile(form)
    toast.success('Profile updated!')
    setEditing(false)
    setSaving(false)
  }

  const handleCancel = () => {
    setForm({ name: user?.name, email: user?.email, phone: user?.phone })
    setErrors({})
    setEditing(false)
  }

  const fields = [
    { key: 'name', label: 'Full Name', icon: MdPerson, type: 'text' },
    { key: 'email', label: 'Email Address', icon: MdEmail, type: 'email' },
    { key: 'phone', label: 'Phone Number', icon: MdPhone, type: 'tel' },
  ]

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your personal information</p>
      </div>

      {/* Avatar section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-2xl font-bold">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
            <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 capitalize">
              {user?.role || 'user'}
            </span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-lg font-medium transition-colors"
            >
              <MdEdit /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-60"
              >
                {saving ? <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <MdSave />}
                Save
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {fields.map(({ key, label, icon: Icon, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
              {editing ? (
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none transition-colors ${
                      errors[key] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'
                    }`}
                  />
                  {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Icon className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white text-sm">{user?.[key] || '—'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Account info */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mt-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Account ID</span>
            <span className="font-mono text-gray-900 dark:text-white text-xs">{user?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Member Since</span>
            <span className="text-gray-900 dark:text-white">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }) : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Account Type</span>
            <span className="text-gray-900 dark:text-white capitalize">{user?.role || 'Standard'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
