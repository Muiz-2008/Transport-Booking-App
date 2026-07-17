import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import {
  MdDirectionsBus, MdPerson, MdEmail, MdPhone,
  MdLock, MdVisibility, MdVisibilityOff,
  MdCheckCircle, MdLightMode, MdDarkMode
} from 'react-icons/md'

const strengthLevels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColors = ['bg-red-400', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500']

function getPasswordStrength(pass) {
  let score = 0
  if (!pass) return 0
  if (pass.length >= 8) score++
  if (/[A-Z]/.test(pass)) score++
  if (/[0-9]/.test(pass)) score++
  if (/[^A-Za-z0-9]/.test(pass)) score++
  if (pass.length >= 12) score++
  return Math.min(score, 4)
}

export default function Register() {
  const { register } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const strength = getPasswordStrength(form.password)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    else if (form.name.trim().length < 3) e.name = 'Name too short'

    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'

    if (!form.phone) e.phone = 'Phone number is required'
    else if (!/^(\+234|0)[789][01]\d{8}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Enter a valid Nigerian phone number'

    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters'

    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    await new Promise(r => setTimeout(r, 900))

    const result = register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    })

    if (result.error) {
      toast.error(result.error)
      setErrors({ email: result.error })
    } else {
      toast.success('Account created successfully! Welcome to SwiftRide 🎉')
      navigate('/dashboard')
    }
    setLoading(false)
  }

  const field = (key, label, type = 'text', icon, placeholder, extra = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">{icon}</span>
        <input
          type={type}
          value={form[key]}
          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          placeholder={placeholder}
          className={`w-full pl-10 ${extra.rightPad || 'pr-4'} py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm outline-none transition-colors ${
            errors[key]
              ? 'border-red-400 focus:border-red-500'
              : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'
          }`}
        />
        {extra.toggle && (
          <button type="button" onClick={extra.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {extra.showPass ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
          </button>
        )}
      </div>
      {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <div className="hidden lg:flex lg:w-[45%] gradient-hero flex-col justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-orange-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <Link to="/" className="flex items-center gap-3 mb-16 relative">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <MdDirectionsBus className="text-white text-xl" />
          </div>
          <span className="font-bold text-2xl text-white">Swift<span className="text-orange-400">Ride</span></span>
        </Link>
        <div className="relative">
          <h1 className="text-3xl font-bold text-white mb-4">Join 500,000+<br />happy travellers</h1>
          <p className="text-gray-300 mb-10">Create your free account and start booking bus tickets across Nigeria in seconds.</p>
          <ul className="space-y-3">
            {[
              'Book seats instantly online',
              'Track your trips in real time',
              'Get e-tickets on your phone',
              'Earn rewards on every trip',
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-gray-200">
                <MdCheckCircle className="text-orange-400 text-lg flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <MdDirectionsBus className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Swift<span className="text-orange-500">Ride</span></span>
          </Link>
          <button onClick={toggle} className="ml-auto p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            {dark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create account</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Fill in the form below to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {field('name', 'Full Name', 'text', <MdPerson />, 'Bola John')}
              {field('email', 'Email Address', 'email', <MdEmail />, 'you@example.com')}
              {field('phone', 'Phone Number', 'tel', <MdPhone />, '+234 8122241081')}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Min. 8 characters"
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm outline-none transition-colors ${
                      errors.password ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'
                    }`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-gray-200 dark:bg-gray-700'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">{strengthLevels[strength]}</p>
                  </div>
                )}
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Repeat password"
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm outline-none transition-colors ${
                      errors.confirmPassword ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirm ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                By creating an account you agree to our{' '}
                <a href="#" className="text-orange-500 hover:underline">Terms</a> and{' '}
                <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-500 font-medium hover:text-orange-600">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
