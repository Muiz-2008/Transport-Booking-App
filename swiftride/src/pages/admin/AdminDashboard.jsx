import { useMemo } from 'react'
import { buses } from '../../data/buses'
import { formatCurrency } from '../../utils/helpers'
import {
  MdPeople, MdDirectionsBus, MdBookmark, MdAttachMoney,
  MdTrendingUp, MdRoute
} from 'react-icons/md'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function MiniChart({ data, color }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.6 }}
        />
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const allBookings = JSON.parse(localStorage.getItem('swiftride_bookings') || '[]')
  const allUsers = JSON.parse(localStorage.getItem('swiftride_users') || '[]')

  const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
  const confirmedBookings = allBookings.filter(b => b.status === 'confirmed').length
  const activeRoutes = [...new Set(buses.map(b => `${b.from}-${b.to}`))].length

  const revenueByMonth = useMemo(() => {
    const data = new Array(7).fill(0)
    allBookings.forEach(b => {
      if (!b.createdAt) return
      const monthIdx = new Date(b.createdAt).getMonth()
      const currentMonth = new Date().getMonth()
      const diff = (currentMonth - monthIdx + 12) % 12
      if (diff < 7) data[6 - diff] += b.totalAmount || 0
    })
    return data
  }, [allBookings])

  const bookingsByMonth = useMemo(() => {
    const data = new Array(7).fill(0)
    allBookings.forEach(b => {
      if (!b.createdAt) return
      const monthIdx = new Date(b.createdAt).getMonth()
      const currentMonth = new Date().getMonth()
      const diff = (currentMonth - monthIdx + 12) % 12
      if (diff < 7) data[6 - diff]++
    })
    return data
  }, [allBookings])

  const recentBookings = [...allBookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)

  const stats = [
    { label: 'Total Users', value: allUsers.length + 2, icon: MdPeople, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Total Bookings', value: allBookings.length, icon: MdBookmark, color: 'bg-orange-500', trend: '+8%' },
    { label: 'Revenue', value: formatCurrency(totalRevenue), icon: MdAttachMoney, color: 'bg-green-500', trend: '+15%' },
    { label: 'Active Routes', value: activeRoutes, icon: MdRoute, color: 'bg-purple-500', trend: '+2' },
  ]

  const popularBuses = [...buses].sort((a, b) => b.bookedSeats.length - a.bookedSeats.length).slice(0, 4)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Platform overview and analytics</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="text-white text-xl" />
              </div>
              <span className="text-xs text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                <MdTrendingUp className="text-xs" />{trend}
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Revenue chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Revenue (Last 7 Months)</h3>
          <p className="text-sm text-gray-400 mb-4">{formatCurrency(totalRevenue)} total</p>
          {revenueByMonth.every(v => v === 0) ? (
            <div className="h-16 flex items-center justify-center text-sm text-gray-400">
              No revenue data yet
            </div>
          ) : (
            <MiniChart data={revenueByMonth.length ? revenueByMonth : [0,0,0,0,0,0,allBookings.length * 10000]} color="#f97316" />
          )}
          <div className="flex justify-between mt-2">
            {Array.from({ length: 7 }, (_, i) => {
              const m = (new Date().getMonth() - (6 - i) + 12) % 12
              return <span key={i} className="text-xs text-gray-400">{MONTHS[m]}</span>
            })}
          </div>
        </div>

        {/* Bookings chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Bookings (Last 7 Months)</h3>
          <p className="text-sm text-gray-400 mb-4">{allBookings.length} total</p>
          {bookingsByMonth.every(v => v === 0) ? (
            <div className="h-16 flex items-center justify-center text-sm text-gray-400">
              No booking data yet
            </div>
          ) : (
            <MiniChart data={bookingsByMonth} color="#3b82f6" />
          )}
          <div className="flex justify-between mt-2">
            {Array.from({ length: 7 }, (_, i) => {
              const m = (new Date().getMonth() - (6 - i) + 12) % 12
              return <span key={i} className="text-xs text-gray-400">{MONTHS[m]}</span>
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent bookings */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
          </div>
          {recentBookings.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">No bookings yet</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentBookings.map(b => (
                <div key={b.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{b.from} → {b.to}</p>
                    <p className="text-xs text-gray-400">{b.reference} • {b.passenger?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(b.totalAmount)}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      b.status === 'confirmed' ? 'bg-green-50 text-green-600 dark:bg-green-950/20' :
                      b.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                    }`}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular buses */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Bus Occupancy</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {popularBuses.map(b => {
              const pct = Math.round((b.bookedSeats.length / b.totalSeats) * 100)
              return (
                <div key={b.id} className="px-5 py-3">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{b.company}</p>
                    <p className="text-xs text-gray-500">{b.from} → {b.to}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct > 80 ? 'bg-red-400' : pct > 50 ? 'bg-orange-400' : 'bg-green-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
