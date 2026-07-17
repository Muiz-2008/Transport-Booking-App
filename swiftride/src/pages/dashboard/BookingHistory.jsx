import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'
import { formatCurrency, getStatusColor } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { MdDirectionsBus, MdFilterList, MdClose, MdSearch } from 'react-icons/md'

export default function BookingHistory() {
  const { user } = useAuth()
  const { getUserBookings, cancelBooking } = useBooking()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [cancelling, setCancelling] = useState(null)

  const all = getUserBookings(user?.id)

  const filtered = all.filter(b => {
    const matchStatus = filter === 'all' || b.status === filter
    const matchSearch =
      b.from?.toLowerCase().includes(search.toLowerCase()) ||
      b.to?.toLowerCase().includes(search.toLowerCase()) ||
      b.reference?.toLowerCase().includes(search.toLowerCase()) ||
      b.busName?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking? This cannot be undone.')) return
    setCancelling(id)
    await new Promise(r => setTimeout(r, 600))
    cancelBooking(id)
    toast.success('Booking cancelled')
    setCancelling(null)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{all.length} booking{all.length !== 1 ? 's' : ''} total</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by route, company, or reference..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:border-orange-400"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                filter === s
                  ? 'bg-orange-500 text-white'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 py-16 text-center">
          <MdDirectionsBus className="text-5xl text-gray-200 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {all.length === 0 ? 'No bookings yet' : 'No bookings match your filter'}
          </p>
          {all.length === 0 && (
            <button onClick={() => navigate('/buses')} className="mt-3 text-orange-500 text-sm font-medium hover:text-orange-600">
              Book your first trip →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => (
            <div key={b.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                    <span className="text-xs text-gray-400">{b.reference}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {b.from} → {b.to}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {b.date ? new Date(b.date).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                    {' '} at {b.departure} • {b.busName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Seat{b.seats?.length > 1 ? 's' : ''}: {b.seats?.map(s => `${s}`).join(', ')}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <p className="text-xl font-bold text-orange-500">{formatCurrency(b.totalAmount)}</p>
                  <div className="flex gap-2">
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        disabled={cancelling === b.id}
                        className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {cancelling === b.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                    <button
                      onClick={() => navigate('/booking-success', { state: { booking: b } })}
                      className="px-3 py-1.5 text-xs font-medium bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/40 rounded-lg transition-colors"
                    >
                      View Ticket
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
