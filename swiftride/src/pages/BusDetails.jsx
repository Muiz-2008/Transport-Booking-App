import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import { getBusById } from '../data/buses'
import { formatCurrency } from '../utils/helpers'
import toast from 'react-hot-toast'
import {
  MdArrowBack, MdAccessTime, MdStar, MdAirlineSeatReclineExtra,
  MdWifi, MdElectricBolt, MdAcUnit, MdWc, MdBed,
  MdLocationOn, MdArrowForward, MdPeople, MdVerified
} from 'react-icons/md'

const amenityConfig = {
  'AC': { icon: MdAcUnit, label: 'Air Conditioning' },
  'WiFi': { icon: MdWifi, label: 'Free WiFi' },
  'USB Charging': { icon: MdElectricBolt, label: 'USB Charging' },
  'Reclining Seats': { icon: MdAirlineSeatReclineExtra, label: 'Reclining Seats' },
  'Onboard Toilet': { icon: MdWc, label: 'Onboard Toilet' },
  'Blanket': { icon: MdBed, label: 'Blanket Provided' },
}

export default function BusDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { startBooking } = useBooking()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const bus = getBusById(id)

  if (!bus) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">🚌</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bus not found</h2>
        <button onClick={() => navigate('/buses')} className="text-orange-500 font-medium">← Back to listing</button>
      </div>
    </div>
  )

  const available = bus.totalSeats - bus.bookedSeats.length

  const handleSelectSeat = () => {
    if (!user) {
      toast('Please log in to book a ticket', { icon: '🔒' })
      navigate('/login', { state: { from: `/seats/${bus.id}` } })
      return
    }
    startBooking(bus, { date })
    navigate(`/seats/${bus.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-5 text-sm font-medium"
        >
          <MdArrowBack /> Back to results
        </button>

        {/* Bus image */}
        <div className="rounded-2xl overflow-hidden h-56 sm:h-72 mb-6 relative">
          <img src={bus.image} alt={bus.company} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
            <div>
              <p className="text-white font-bold text-xl">{bus.company}</p>
              <span className="text-sm text-gray-300">{bus.type} • {bus.busNumber}</span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <MdStar className="text-yellow-400" />
                <span className="text-white font-semibold">{bus.rating}</span>
              </div>
              <p className="text-gray-300 text-xs">{bus.reviews} reviews</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Route timeline */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Route Details</h3>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{bus.departure}</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300 mt-1">{bus.from}</p>
                  <p className="text-xs text-gray-400 mt-0.5 max-w-[130px] mx-auto">{bus.fromTerminal}</p>
                </div>

                <div className="flex-1 mx-6 flex flex-col items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MdAccessTime className="text-orange-500" />
                    {bus.duration}
                  </div>
                  <div className="w-full flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
                    <div className="flex-1 border-t-2 border-dashed border-gray-200 dark:border-gray-700" />
                    <div className="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Direct Route</p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{bus.arrival}</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300 mt-1">{bus.to}</p>
                  <p className="text-xs text-gray-400 mt-0.5 max-w-[130px] mx-auto">{bus.toTerminal}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {bus.amenities.map(a => {
                  const config = amenityConfig[a] || { icon: MdVerified, label: a }
                  const Icon = config.icon
                  return (
                    <div key={a} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="w-9 h-9 bg-orange-50 dark:bg-orange-950/30 rounded-lg flex items-center justify-center">
                        <Icon className="text-orange-500 text-lg" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{config.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Policies</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {[
                  'Board at least 30 minutes before departure',
                  'Cancellation allowed up to 24 hours before travel',
                  '20kg luggage allowance per passenger',
                  'No smoking or alcohol on board',
                  'Keep your booking reference/e-ticket ready',
                ].map(p => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 sticky top-20">
              <div className="text-center mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
                <p className="text-3xl font-bold text-orange-500">{formatCurrency(bus.price)}</p>
                <p className="text-sm text-gray-500">per seat</p>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Available Seats</span>
                  <span className={`font-semibold ${available < 10 ? 'text-red-500' : 'text-green-600'}`}>
                    {available} left
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Bus Type</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bus.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total Seats</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bus.totalSeats}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">Travel Date</label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400"
                />
              </div>

              <button
                onClick={handleSelectSeat}
                disabled={available === 0}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
              >
                {available === 0 ? 'Fully Booked' : 'Select Seat'}
              </button>

              <p className="text-xs text-center text-gray-400 mt-3">
                Free cancellation up to 24hrs before travel
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
