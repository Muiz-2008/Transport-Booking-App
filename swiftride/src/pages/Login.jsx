import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import { MdDirectionsBus, MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdLightMode, MdDarkMode } from 'react-icons/md'

export default function Login() {
  const { login } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    // check stored users
    const users = JSON.parse(localStorage.getItem('swiftride_users') || '[]')
    const user = users.find(u => u.email === form.email && u.password === form.password)

    // also allow demo accounts
    let loginUser = user
    if (!loginUser) {
      if (form.email === 'admin@swiftride.ng' && form.password === 'admin123') {
        loginUser = { id: 'admin-1', name: 'Admin User', email: 'admin@swiftride.ng', phone: '+234 8122241081', role: 'admin' }
      } else if (form.email === 'demo@swiftride.ng' && form.password === 'demo123') {
        loginUser = { id: 'demo-1', name: 'Demo User', email: 'demo@swiftride.ng', phone: '+234 8122241081', role: 'user' }
      }
    }

    if (loginUser) {
      login(loginUser)
      toast.success(`Welcome back, ${loginUser.name.split(' ')[0]}!`)
      navigate(loginUser.role === 'admin' ? '/admin' : from)
    } else {
      toast.error('Invalid email or password')
      setErrors({ password: 'Invalid email or password' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Left panel - visible on desktop */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero flex-col justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-orange-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <Link to="/" className="flex items-center gap-3 mb-16 relative">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <MdDirectionsBus className="text-white text-xl" />
          </div>
          <span className="font-bold text-2xl text-white">Swift<span className="text-orange-400">Ride</span></span>
        </Link>

        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your Journey<br />Starts Here
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            Book inter-city bus tickets in seconds. Safe, comfortable, and reliable travel across Nigeria.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '500K+', label: 'Happy Travellers' },
              { value: '50+', label: 'Bus Companies' },
              { value: '200+', label: 'Routes' },
              { value: '4.8★', label: 'App Rating' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-gray-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <MdDirectionsBus className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Swift<span className="text-orange-500">Ride</span></span>
          </Link>
          <div className="ml-auto">
            <button onClick={toggle} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
              {dark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
              <p className="text-gray-500 dark:text-gray-400">Sign in to your SwiftRide account</p>
            </div>

            {/* Demo credentials hint */}
            <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg text-xs text-blue-700 dark:text-blue-400">
              <strong>Demo:</strong> demo@swiftride.ng / demo123 &nbsp;|&nbsp;
              <strong>Admin:</strong> admin@swiftride.ng / admin123
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm outline-none transition-colors ${
                      errors.email
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <a href="#" className="text-xs text-orange-500 hover:text-orange-600">Forgot password?</a>
                </div>
                <div className="relative">
                  <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm outline-none transition-colors ${
                      errors.password
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={form.remember}
                  onChange={e => setForm(p => ({ ...p, remember: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500"
                />
                <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">Remember me</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-500 font-medium hover:text-orange-600">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
