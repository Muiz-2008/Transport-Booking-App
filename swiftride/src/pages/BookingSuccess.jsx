import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { formatCurrency, formatShortDate } from '../utils/helpers'
import { MdCheckCircle, MdDownload, MdPrint, MdHome, MdHistory, MdDirectionsBus } from 'react-icons/md'

export default function BookingSuccess() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const ticketRef = useRef(null)
  const booking = state?.booking

  useEffect(() => {
    if (!booking) navigate('/dashboard')
  }, [booking])

  if (!booking) return null

  const handlePrint = () => window.print()

  const qrValue = JSON.stringify({
    ref: booking.reference,
    from: booking.from,
    to: booking.to,
    date: booking.date,
    seats: booking.seats,
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success header */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 dark:text-gray-400">Your ticket has been booked successfully. Have a safe trip!</p>
        </motion.div>

        {/* Ticket */}
        <motion.div
          ref={ticketRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-5"
        >
          {/* Ticket header */}
          <div className="gradient-hero p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <MdDirectionsBus className="text-white text-xl" />
              </div>
              <div>
                <p className="text-white font-bold">SwiftRide</p>
                <p className="text-gray-300 text-xs">E-Ticket</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-xs mb-1">Booking Ref</p>
              <p className="text-orange-300 font-bold text-lg tracking-wider">{booking.reference}</p>
            </div>
          </div>

          {/* Ticket body */}
          <div className="p-6">
            {/* Route */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{booking.departure}</p>
                <p className="font-semibold text-gray-700 dark:text-gray-300">{booking.from}</p>
              </div>
              <div className="flex-1 mx-4 flex flex-col items-center">
                <div className="text-xs text-gray-400 mb-1">Direct</div>
                <div className="w-full flex items-center">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <div className="flex-1 border-t-2 border-dashed border-gray-200 dark:border-gray-600" />
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{booking.arrival}</p>
                <p className="font-semibold text-gray-700 dark:text-gray-300">{booking.to}</p>
              </div>
            </div>

            {/* Dashed divider */}
            <div className="relative my-5">
              <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700" />
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 dark:bg-gray-950 rounded-full border-r-2 border-dashed border-gray-200 dark:border-gray-700" />
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 dark:bg-gray-950 rounded-full border-l-2 border-dashed border-gray-200 dark:border-gray-700" />
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Passenger', value: booking.passenger?.name },
                { label: 'Travel Date', value: booking.date ? new Date(booking.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                { label: 'Bus Company', value: booking.busName },
                { label: 'Bus Type', value: booking.busType },
                { label: 'Seat(s)', value: booking.seats?.map(s => `Seat ${s}`).join(', ') },
                { label: 'Total Paid', value: formatCurrency(booking.totalAmount), highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className={`font-semibold text-sm ${highlight ? 'text-orange-500 text-base' : 'text-gray-900 dark:text-white'}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* QR code */}
            <div className="flex flex-col items-center gap-2 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
              <QRCodeSVG
                value={qrValue}
                size={120}
                bgColor="transparent"
                fgColor={document.documentElement.classList.contains('dark') ? '#fff' : '#111'}
                level="M"
              />
              <p className="text-xs text-gray-400">Scan at the terminal gate</p>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 px-6 py-3 text-xs text-center text-orange-700 dark:text-orange-400">
            Please arrive at the terminal at least 30 minutes before departure
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:border-orange-400 transition-colors"
          >
            <MdPrint /> Print Ticket
          </button>
          <button
            onClick={() => {
              const svg = ticketRef.current?.querySelector('svg')
              toast?.('Download feature coming soon', { icon: '📥' })
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:border-orange-400 transition-colors"
          >
            <MdDownload /> Download Ticket
          </button>
        </div>

        <div className="flex gap-3 mt-3">
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <MdHome /> Back to Home
          </Link>
          <Link
            to="/dashboard/bookings"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
          >
            <MdHistory /> View Bookings
          </Link>
        </div>
      </div>
    </div>
  )
}
