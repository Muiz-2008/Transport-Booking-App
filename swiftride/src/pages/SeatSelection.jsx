import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useBooking } from '../context/BookingContext'
import { getBusById } from '../data/buses'
import { formatCurrency } from '../utils/helpers'
import toast from 'react-hot-toast'
import { MdArrowBack, MdArrowForward, MdAirlineSeatReclineExtra } from 'react-icons/md'

function Seat({ number, status, onClick }) {
  const seatClass =
    status === 'booked' ? 'seat-booked' :
    status === 'selected' ? 'seat-selected' : 'seat-available'

  return (
    <motion.button
      whileHover={status === 'available' ? { scale: 1.08 } : {}}
      whileTap={status !== 'booked' ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={status === 'booked'}
      className={`w-10 h-10 rounded-t-lg rounded-b-sm flex items-center justify-center text-xs font-semibold relative ${seatClass}`}
      title={`Seat ${number}${status === 'booked' ? ' (Booked)' : ''}`}
    >
      {number}
      {/* seat back indicator */}
      <div className={`absolute -top-1 left-0 right-0 h-1 rounded-t-lg ${
        status === 'selected' ? 'bg-orange-600' :
        status === 'booked' ? 'bg-gray-300' : 'bg-gray-200 dark:bg-gray-600'
      }`} />
    </motion.button>
  )
}

export default function SeatSelection() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentBooking, selectedSeats, toggleSeat, startBooking } = useBooking()

  const bus = getBusById(id)

  useEffect(() => {
    if (!bus) return
    if (!currentBooking || currentBooking.bus.id !== id) {
      // re-initialize if they navigated directly
      startBooking(bus, { date: new Date().toISOString().split('T')[0] })
    }
  }, [id])

  if (!bus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Bus not found.</p>
      </div>
    )
  }

  const getSeatStatus = (n) => {
    if (bus.bookedSeats.includes(n)) return 'booked'
    if (selectedSeats.includes(n)) return 'selected'
    return 'available'
  }

  // build rows: 4-aisle layout (2+2), with driver seat up front
  // seats per row: left pair + right pair
  const totalSeats = bus.totalSeats
  const seatsPerRow = 4
  const rows = Math.ceil(totalSeats / seatsPerRow)

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat')
      return
    }
    navigate('/checkout')
  }

  const totalPrice = selectedSeats.length * bus.price

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white mb-5 text-sm font-medium"
        >
          <MdArrowBack /> Back
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Select Your Seat</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {bus.company} • {bus.from} → {bus.to} • {bus.departure}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bus layout */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              {/* Legend */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                {[
                  { label: 'Available', cls: 'seat-available' },
                  { label: 'Selected', cls: 'seat-selected' },
                  { label: 'Booked', cls: 'seat-booked' },
                ].map(({ label, cls }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-t-lg rounded-b-sm ${cls}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                  </div>
                ))}
              </div>

              {/* Bus outline */}
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                {/* Driver area */}
                <div className="bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MdAirlineSeatReclineExtra className="text-lg" />
                    <span>Driver</span>
                  </div>
                  <div className="text-xs text-gray-400">Front of Bus</div>
                  <div className="w-12 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500">🚗</span>
                  </div>
                </div>

                {/* Seats grid */}
                <div className="p-5">
                  <div className="space-y-3">
                    {Array.from({ length: rows }, (_, rowIdx) => {
                      const leftA = rowIdx * seatsPerRow + 1
                      const leftB = rowIdx * seatsPerRow + 2
                      const rightC = rowIdx * seatsPerRow + 3
                      const rightD = rowIdx * seatsPerRow + 4

                      return (
                        <div key={rowIdx} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-6 text-right">{rowIdx + 1}</span>
                          <div className="flex gap-1.5">
                            {leftA <= totalSeats && (
                              <Seat number={leftA} status={getSeatStatus(leftA)} onClick={() => toggleSeat(leftA)} />
                            )}
                            {leftB <= totalSeats && (
                              <Seat number={leftB} status={getSeatStatus(leftB)} onClick={() => toggleSeat(leftB)} />
                            )}
                          </div>

                          {/* Aisle */}
                          <div className="w-8 flex items-center justify-center">
                            <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-700" />
                          </div>

                          <div className="flex gap-1.5">
                            {rightC <= totalSeats && (
                              <Seat number={rightC} status={getSeatStatus(rightC)} onClick={() => toggleSeat(rightC)} />
                            )}
                            {rightD <= totalSeats && (
                              <Seat number={rightD} status={getSeatStatus(rightD)} onClick={() => toggleSeat(rightD)} />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Back */}
                <div className="bg-gray-100 dark:bg-gray-800 p-3 border-t-2 border-gray-200 dark:border-gray-700 text-center text-xs text-gray-400">
                  Back of Bus
                </div>
              </div>
            </div>
          </div>

          {/* Summary panel */}
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sticky top-20">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Booking Summary</h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Route</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bus.from} → {bus.to}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Departure</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bus.departure}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price/Seat</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(bus.price)}</span>
                </div>
              </div>

              {/* Selected seats */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Seats</p>
                  <span className="text-xs text-gray-400">{selectedSeats.length} seat(s)</span>
                </div>

                {selectedSeats.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeats.sort((a, b) => a - b).map(s => (
                      <span key={s} className="px-2 py-1 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-lg">
                        Seat {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No seats selected yet</p>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-4 mb-5">
                <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-orange-500">{formatCurrency(totalPrice)}</span>
              </div>

              <button
                onClick={handleProceed}
                disabled={selectedSeats.length === 0}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <MdArrowForward />
              </button>

              <p className="text-xs text-center text-gray-400 mt-3">
                Your seat is held for 10 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
