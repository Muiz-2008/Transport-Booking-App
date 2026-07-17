import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import { formatCurrency, formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'
import {
  MdArrowBack, MdCreditCard, MdAccountBalance,
  MdAccountBalanceWallet, MdLock, MdPerson,
  MdEmail, MdPhone, MdDirectionsBus
} from 'react-icons/md'

const PAYMENT_METHODS = [
  { id: 'card', label: 'Debit / Credit Card', icon: MdCreditCard },
  { id: 'bank', label: 'Bank Transfer', icon: MdAccountBalance },
  { id: 'wallet', label: 'SwiftRide Wallet', icon: MdAccountBalanceWallet },
]

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentBooking, selectedSeats, saveBooking, clearBooking } = useBooking()

  const [payMethod, setPayMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [passenger, setPassenger] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: '',
  })
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [errors, setErrors] = useState({})

  if (!currentBooking || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">😕</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No booking in progress</h2>
          <button onClick={() => navigate('/buses')} className="text-orange-500 font-medium">
            ← Browse buses
          </button>
        </div>
      </div>
    )
  }

  const { bus, search } = currentBooking
  const totalPrice = selectedSeats.length * bus.price

  const validate = () => {
    const e = {}
    if (!passenger.name.trim()) e.name = 'Required'
    if (!passenger.email || !/\S+@\S+\.\S+/.test(passenger.email)) e.email = 'Valid email required'
    if (!passenger.phone) e.phone = 'Required'
    if (!passenger.gender) e.gender = 'Required'

    if (payMethod === 'card') {
      if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) e.cardNumber = 'Valid card number required'
      if (!cardDetails.expiry) e.expiry = 'Required'
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) e.cvv = 'Required'
      if (!cardDetails.name) e.cardName = 'Required'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fix the errors above')
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))

    const booking = saveBooking({
      userId: user.id,
      busId: bus.id,
      busName: bus.company,
      busType: bus.type,
      from: bus.from,
      to: bus.to,
      departure: bus.departure,
      arrival: bus.arrival,
      date: search?.date || new Date().toISOString().split('T')[0],
      seats: [...selectedSeats],
      passenger: { ...passenger },
      paymentMethod: payMethod,
      totalAmount: totalPrice,
    })

    toast.success('Booking confirmed! 🎉')
    setLoading(false)
    navigate('/booking-success', { state: { booking } })
  }

  const formatCardNumber = (val) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 text-sm font-medium"
        >
          <MdArrowBack /> Back to seat selection
        </button>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Passenger info */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Passenger Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', icon: MdPerson, type: 'text', placeholder: 'As on ID card' },
                  { key: 'email', label: 'Email', icon: MdEmail, type: 'email', placeholder: 'For e-ticket' },
                  { key: 'phone', label: 'Phone Number', icon: MdPhone, type: 'tel', placeholder: '+234 8122241081' },
                ].map(({ key, label, icon: Icon, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={type}
                        value={passenger[key]}
                        onChange={e => setPassenger(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none transition-colors ${errors[key] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'}`}
                      />
                    </div>
                    {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
                  <select
                    value={passenger.gender}
                    onChange={e => setPassenger(p => ({ ...p, gender: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none ${errors.gender ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'}`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Prefer not to say</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h2>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPayMethod(id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors text-center ${
                      payMethod === id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`text-2xl ${payMethod === id ? 'text-orange-500' : 'text-gray-400'}`} />
                    <span className={`text-xs font-medium ${payMethod === id ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {payMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={e => setCardDetails(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none font-mono ${errors.cardNumber ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'}`}
                    />
                    {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Expiry</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={e => setCardDetails(p => ({ ...p, expiry: e.target.value }))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none font-mono ${errors.expiry ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'}`}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">CVV</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={e => setCardDetails(p => ({ ...p, cvv: e.target.value.slice(0, 4) }))}
                        placeholder="•••"
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none font-mono ${errors.cvv ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={e => setCardDetails(p => ({ ...p, name: e.target.value }))}
                      placeholder="Name on card"
                      className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none ${errors.cardName ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'}`}
                    />
                  </div>
                </div>
              )}

              {payMethod === 'bank' && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p className="font-medium text-gray-900 dark:text-white">Transfer Details</p>
                  <p>Bank: <strong>GTBank</strong></p>
                  <p>Account No: <strong>0123456789</strong></p>
                  <p>Account Name: <strong>SwiftRide Nigeria Ltd</strong></p>
                  <p>Amount: <strong>{formatCurrency(totalPrice)}</strong></p>
                  <p className="text-xs text-gray-400 mt-2">Use your booking reference as the narration. Your ticket will be issued after payment confirmation.</p>
                </div>
              )}

              {payMethod === 'wallet' && (
                <div className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Wallet Balance</span>
                    <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(50000)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600 dark:text-gray-400">Amount to pay</span>
                    <span className="font-bold text-orange-600">{formatCurrency(totalPrice)}</span>
                  </div>
                  {50000 >= totalPrice ? (
                    <p className="text-xs text-green-600 mt-2">✓ Sufficient balance</p>
                  ) : (
                    <p className="text-xs text-red-500 mt-2">Insufficient balance. Please top up or use another method.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Summary sidebar */}
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sticky top-20">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Trip Summary</h3>

              <div className="flex items-center gap-3 mb-4 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <MdDirectionsBus className="text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{bus.company}</p>
                  <p className="text-xs text-gray-500">{bus.type}</p>
                </div>
              </div>

              <div className="space-y-2.5 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Route</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bus.from} → {bus.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {search?.date ? new Date(search.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Departure</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bus.departure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Seats</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedSeats.sort((a, b) => a - b).map(s => `Seat ${s}`).join(', ')}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({selectedSeats.length} × {formatCurrency(bus.price)})</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service Fee</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-orange-500">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <MdLock className="text-lg" />
                    Pay {formatCurrency(totalPrice)}
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
                <MdLock className="text-xs" /> Secured by 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
