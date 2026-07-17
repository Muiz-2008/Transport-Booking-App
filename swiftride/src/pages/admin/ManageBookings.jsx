import { useState } from 'react'
import { formatCurrency, getStatusColor } from '../../utils/helpers'
import { MdSearch, MdBookmark } from 'react-icons/md'

export default function ManageBookings() {
  const [bookings, setBookings] = useState(
    JSON.parse(localStorage.getItem('swiftride_bookings') || '[]')
  )
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = bookings.filter(b => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    const matchSearch = search === '' ||
      b.reference?.toLowerCase().includes(search.toLowerCase()) ||
      b.from?.toLowerCase().includes(search.toLowerCase()) ||
      b.to?.toLowerCase().includes(search.toLowerCase()) ||
      b.passenger?.name?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const updateStatus = (id, status) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b)
    setBookings(updated)
    localStorage.setItem('swiftride_bookings', JSON.stringify(updated))
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Bookings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{bookings.length} total bookings</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by reference, route, or passenger..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:border-orange-400"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-sm font-medium capitalize ${
                statusFilter === s ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase">
                <th className="text-left px-5 py-3">Reference</th>
                <th className="text-left px-5 py-3">Passenger</th>
                <th className="text-left px-5 py-3">Route</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Seats</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{b.reference}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900 dark:text-white">{b.passenger?.name || '—'}</p>
                    <p className="text-xs text-gray-400">{b.passenger?.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{b.from} → {b.to}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                    {b.date ? new Date(b.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) : '—'}
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                    {b.seats?.join(', ')}
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">{formatCurrency(b.totalAmount)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={b.status}
                      onChange={e => updateStatus(b.id, e.target.value)}
                      className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none"
                    >
                      <option value="confirmed">Confirm</option>
                      <option value="completed">Complete</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <MdBookmark className="text-4xl mx-auto mb-2" />
              <p>{bookings.length === 0 ? 'No bookings yet' : 'No bookings match your filter'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
