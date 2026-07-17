import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdSearch, MdFilterList, MdSort, MdLocationOn, MdAccessTime,
  MdAirlineSeatReclineExtra, MdWifi, MdElectricBolt, MdAcUnit,
  MdStar, MdArrowForward, MdClose, MdSwapHoriz, MdDateRange, MdPeople
} from 'react-icons/md'
import { buses, CITIES } from '../data/buses'
import { formatCurrency } from '../utils/helpers'

const amenityIcons = {
  'AC': MdAcUnit,
  'WiFi': MdWifi,
  'USB Charging': MdElectricBolt,
  'Reclining Seats': MdAirlineSeatReclineExtra,
}

function BusCard({ bus }) {
  const navigate = useNavigate()
  const available = bus.totalSeats - bus.bookedSeats.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
              <span className="text-orange-600 dark:text-orange-400 font-bold text-xs">{bus.companyLogo}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{bus.company}</p>
              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{bus.type}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <MdStar className="text-yellow-400" />
            <span className="font-medium text-gray-900 dark:text-white">{bus.rating}</span>
            <span className="text-gray-400 text-xs">({bus.reviews})</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{bus.departure}</p>
            <p className="text-xs text-gray-500 mt-0.5 max-w-[100px]">{bus.from}</p>
          </div>

          <div className="flex-1 mx-4 flex flex-col items-center">
            <div className="text-xs text-gray-400 mb-1">{bus.duration}</div>
            <div className="w-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
              <div className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-600" />
              <MdArrowForward className="text-orange-500 flex-shrink-0" />
              <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Direct</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{bus.arrival}</p>
            <p className="text-xs text-gray-500 mt-0.5 max-w-[100px]">{bus.to}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {bus.amenities.slice(0, 4).map(a => {
            const Icon = amenityIcons[a]
            return (
              <span key={a} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                {Icon && <Icon className="text-sm text-gray-400" />}
                {a}
              </span>
            )
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-2xl font-bold text-orange-500">{formatCurrency(bus.price)}</p>
            <p className="text-xs text-gray-500">{available} seats left</p>
          </div>
          <button
            onClick={() => navigate(`/buses/${bus.id}`)}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function BusListing() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || new Date().toISOString().split('T')[0],
    passengers: Number(searchParams.get('passengers')) || 1,
    minPrice: 0,
    maxPrice: 50000,
    company: '',
    busType: '',
    departure: '',
  })
  const [sortBy, setSortBy] = useState('price')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    let result = buses.filter(b => {
      if (filters.from && b.from.toLowerCase() !== filters.from.toLowerCase()) return false
      if (filters.to && b.to.toLowerCase() !== filters.to.toLowerCase()) return false
      if (b.price < filters.minPrice || b.price > filters.maxPrice) return false
      if (filters.company && b.company !== filters.company) return false
      if (filters.busType && b.type !== filters.busType) return false
      if (filters.departure === 'morning' && (parseInt(b.departure) < 6 || parseInt(b.departure) >= 12)) return false
      if (filters.departure === 'afternoon' && (parseInt(b.departure) < 12 || parseInt(b.departure) >= 17)) return false
      if (filters.departure === 'evening' && parseInt(b.departure) < 17) return false
      return true
    })

    if (sortBy === 'price') result = [...result].sort((a, b) => a.price - b.price)
    else if (sortBy === 'price_desc') result = [...result].sort((a, b) => b.price - a.price)
    else if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'departure') result = [...result].sort((a, b) => a.departure.localeCompare(b.departure))

    return result
  }, [filters, sortBy])

  const companies = [...new Set(buses.map(b => b.company))]
  const busTypes = [...new Set(buses.map(b => b.type))]

  const handleSearch = (e) => {
    e.preventDefault()
    // just re-trigger the filter
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Search bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-gray-500 mb-1 block">From</label>
              <select
                value={filters.from}
                onChange={e => setFilters(p => ({ ...p, from: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400"
              >
                <option value="">All cities</option>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-gray-500 mb-1 block">To</label>
              <select
                value={filters.to}
                onChange={e => setFilters(p => ({ ...p, to: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400"
              >
                <option value="">All cities</option>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={e => setFilters(p => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 flex items-center gap-2"
            >
              <MdSearch /> Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {filtered.length} bus{filtered.length !== 1 ? 'es' : ''} found
            </h1>
            {(filters.from || filters.to) && (
              <p className="text-sm text-gray-500">
                {filters.from && filters.to ? `${filters.from} → ${filters.to}` : filters.from || filters.to}
                {filters.date && ` • ${new Date(filters.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long' })}`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none"
            >
              <option value="price">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="departure">Earliest Departure</option>
            </select>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:border-orange-400"
            >
              <MdFilterList /> Filters
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-5"
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                  <button
                    onClick={() => setFilters(p => ({ ...p, company: '', busType: '', departure: '', minPrice: 0, maxPrice: 50000 }))}
                    className="text-xs text-orange-500 hover:text-orange-600"
                  >
                    Clear all
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Bus Company</label>
                    <select
                      value={filters.company}
                      onChange={e => setFilters(p => ({ ...p, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none"
                    >
                      <option value="">All Companies</option>
                      {companies.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Bus Type</label>
                    <select
                      value={filters.busType}
                      onChange={e => setFilters(p => ({ ...p, busType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none"
                    >
                      <option value="">All Types</option>
                      {busTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Departure Time</label>
                    <select
                      value={filters.departure}
                      onChange={e => setFilters(p => ({ ...p, departure: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none"
                    >
                      <option value="">Any Time</option>
                      <option value="morning">Morning (6AM – 12PM)</option>
                      <option value="afternoon">Afternoon (12PM – 5PM)</option>
                      <option value="evening">Evening (5PM+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Max Price</label>
                    <input
                      type="range"
                      min={0}
                      max={50000}
                      step={500}
                      value={filters.maxPrice}
                      onChange={e => setFilters(p => ({ ...p, maxPrice: Number(e.target.value) }))}
                      className="w-full accent-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Up to {formatCurrency(filters.maxPrice)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚌</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No buses found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => setFilters(p => ({ ...p, from: '', to: '', company: '', busType: '' }))}
              className="px-6 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(bus => <BusCard key={bus.id} bus={bus} />)}
          </div>
        )}
      </div>
    </div>
  )
}
