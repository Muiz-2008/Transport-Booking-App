import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'
import { formatCurrency, formatShortDate, getStatusColor } from '../../utils/helpers'
import { MdDirectionsBus, MdCheckCircle, MdPendingActions, MdCancel, MdArrowForward } from 'react-icons/md'

export default function Overview() {
  const { user } = useAuth()
  const { getUserBookings } = useBooking()
  const bookings = getUserBookings(user?.id)

  const confirmed = bookings.filter(b => b.status === 'confirmed').length
  const completed = bookings.filter(b => b.status === 'completed').length
  const cancelled = bookings.filter(b => b.status === 'cancelled').length
  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.date) >= new Date())
  const recent = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: MdDirectionsBus, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
    { label: 'Upcoming', value: upcoming.length, icon: MdPendingActions, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/30' },
    { label: 'Completed', value: completed, icon: MdCheckCircle, color: 'text-green-500 bg-green-50 dark:bg-green-950/30' },
    { label: 'Cancelled', value: cancelled, icon: MdCancel, color: 'text-red-500 bg-red-50 dark:bg-red-950/30' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here's your travel overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="text-xl" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming trips */}
      {upcoming.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Upcoming Trips</h2>
          <div className="space-y-3">
            {upcoming.slice(0, 2).map(b => (
              <div key={b.id} className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-100 mb-1">{b.busName} • {b.busType}</p>
                    <p className="text-xl font-bold">{b.from} → {b.to}</p>
                    <p className="text-sm text-orange-100 mt-1">
                      {b.date ? new Date(b.date).toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' }) : '—'} at {b.departure}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-orange-200 mb-1">Seats</p>
                    <p className="font-bold">{b.seats?.join(', ')}</p>
                    <p className="text-xs text-orange-200 mt-1">{b.reference}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
          <Link to="/dashboard/bookings" className="text-orange-500 text-sm font-medium flex items-center gap-1 hover:text-orange-600">
            View all <MdArrowForward />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-12 text-center">
            <MdDirectionsBus className="text-5xl text-gray-200 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No bookings yet</p>
            <Link to="/buses" className="text-orange-500 text-sm font-medium mt-2 inline-block hover:text-orange-600">
              Book your first trip →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recent.map(b => (
              <div key={b.id} className="px-5 py-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {b.from} → {b.to}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {b.date ? new Date(b.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) : '—'} • {b.busName}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(b.status)}`}>
                    {b.status}
                  </span>
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">
                    {formatCurrency(b.totalAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick action */}
      {bookings.length === 0 && (
        <div className="mt-5 gradient-hero rounded-2xl p-6 text-center">
          <MdDirectionsBus className="text-4xl text-orange-400 mx-auto mb-3" />
          <h3 className="text-white font-bold text-lg mb-2">Ready to travel?</h3>
          <p className="text-gray-300 text-sm mb-4">Book your first bus ticket in under 2 minutes.</p>
          <Link to="/buses" className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors">
            Find a Bus <MdArrowForward />
          </Link>
        </div>
      )}
    </div>
  )
}
