import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  MdSearch, MdLocationOn, MdDateRange, MdPeople,
  MdSwapHoriz, MdFlashOn, MdSecurity, MdAirlineSeatReclineExtra,
  MdSupportAgent, MdStar, MdArrowForward, MdTrendingUp
} from 'react-icons/md'
import { popularRoutes, testimonials, CITIES } from '../data/buses'
import { formatCurrency } from '../utils/helpers'

const today = new Date().toISOString().split('T')[0]

export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState({
    from: '', to: '', date: today, passengers: 1
  })

  const swap = () => setSearch(p => ({ ...p, from: p.to, to: p.from }))

  const handleSearch = (e) => {
    e.preventDefault()
    if (!search.from || !search.to) {
      toast.error('Please select departure and destination cities')
      return
    }
    if (search.from === search.to) {
      toast.error('Departure and destination cannot be the same')
      return
    }
    navigate(`/buses?from=${search.from}&to=${search.to}&date=${search.date}&passengers=${search.passengers}`)
  }

  const handleRouteClick = (route) => {
    setSearch(p => ({ ...p, from: route.from, to: route.to }))
    navigate(`/buses?from=${route.from}&to=${route.to}&date=${today}`)
  }

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <MdTrendingUp className="text-base" />
              Nigeria's #1 Bus Booking Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Travel Smarter,<br />
              <span className="text-orange-400">Book Faster</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Book inter-city bus tickets in seconds. Choose your seat, pay securely, and travel comfortably across Nigeria.
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearch} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                {/* From */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">From</label>
                  <div className="relative">
                    <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 text-lg" />
                    <select
                      value={search.from}
                      onChange={e => setSearch(p => ({ ...p, from: e.target.value }))}
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 appearance-none"
                    >
                      <option value="">Select departure</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Swap button */}
                <div className="flex justify-center md:col-span-1">
                  <button
                    type="button"
                    onClick={swap}
                    className="p-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"
                  >
                    <MdSwapHoriz className="text-xl" />
                  </button>
                </div>

                {/* To */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">To</label>
                  <div className="relative">
                    <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 text-lg" />
                    <select
                      value={search.to}
                      onChange={e => setSearch(p => ({ ...p, to: e.target.value }))}
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 appearance-none"
                    >
                      <option value="">Select destination</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Travel Date</label>
                  <div className="relative">
                    <MdDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 text-lg" />
                    <input
                      type="date"
                      value={search.date}
                      min={today}
                      onChange={e => setSearch(p => ({ ...p, date: e.target.value }))}
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400"
                    />
                  </div>
                </div>

                {/* Passengers */}
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Passengers</label>
                  <div className="relative">
                    <MdPeople className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 text-lg" />
                    <select
                      value={search.passengers}
                      onChange={e => setSearch(p => ({ ...p, passengers: Number(e.target.value) }))}
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 appearance-none"
                    >
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>)}
                    </select>
                  </div>
                </div>

                {/* Search button */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <MdSearch className="text-xl" />
                    Search Buses
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              { label: '500K+ Bookings', sub: 'Completed' },
              { label: '50+ Bus Companies', sub: 'Nationwide' },
              { label: '200+ Routes', sub: 'Available' },
            ].map(({ label, sub }) => (
              <div key={label} className="text-center">
                <p className="text-white font-bold text-lg">{label}</p>
                <p className="text-gray-400 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Routes</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Most booked routes this week</p>
          </div>
          <button
            onClick={() => navigate('/buses')}
            className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-600"
          >
            View all <MdArrowForward />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularRoutes.map((route, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleRouteClick(route)}
              className="group cursor-pointer bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-800"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={route.image}
                  alt={`${route.from} to ${route.to}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <span>{route.from}</span>
                    <MdArrowForward className="text-orange-400" />
                    <span>{route.to}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{route.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                  <p className="font-bold text-orange-500">{formatCurrency(route.price)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Why Choose SwiftRide?</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              We're building the most reliable transport booking experience in Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MdFlashOn,
                title: 'Fast Booking',
                desc: 'Book your ticket in under 2 minutes. No paperwork, no queues, just tap and go.',
                color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30',
              },
              {
                icon: MdSecurity,
                title: 'Secure Payments',
                desc: 'All transactions are encrypted and processed securely. Your data is always safe.',
                color: 'text-green-500 bg-green-50 dark:bg-green-950/30',
              },
              {
                icon: MdAirlineSeatReclineExtra,
                title: 'Comfortable Travel',
                desc: 'Choose from executive, VIP, and premium buses with amenities for a relaxing journey.',
                color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
              },
              {
                icon: MdSupportAgent,
                title: '24/7 Support',
                desc: 'Our customer support team is always available to assist you before and during your trip.',
                color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30',
              },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center"
              >
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="text-2xl" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">What Travellers Say</h2>
          <p className="text-gray-500 dark:text-gray-400">Real reviews from real customers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <MdStar key={j} className="text-yellow-400 text-sm" />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto gradient-hero rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Travel?</h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Join over 500,000 travellers who book their bus tickets with SwiftRide every month.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/buses')}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
              >
                Find a Bus
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
