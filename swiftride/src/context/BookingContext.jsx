import { createContext, useContext, useState } from 'react'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [currentBooking, setCurrentBooking] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])

  const startBooking = (busData, searchParams) => {
    setCurrentBooking({ bus: busData, search: searchParams })
    setSelectedSeats([])
  }

  const toggleSeat = (seatNumber) => {
    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    )
  }

  const clearBooking = () => {
    setCurrentBooking(null)
    setSelectedSeats([])
  }

  const saveBooking = (bookingData) => {
    const bookings = JSON.parse(localStorage.getItem('swiftride_bookings') || '[]')
    const ref = `SWR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
    const newBooking = {
      id: Date.now().toString(),
      reference: ref,
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    bookings.push(newBooking)
    localStorage.setItem('swiftride_bookings', JSON.stringify(bookings))
    return newBooking
  }

  const getUserBookings = (userId) => {
    const bookings = JSON.parse(localStorage.getItem('swiftride_bookings') || '[]')
    return bookings.filter(b => b.userId === userId)
  }

  const cancelBooking = (bookingId) => {
    const bookings = JSON.parse(localStorage.getItem('swiftride_bookings') || '[]')
    const updated = bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    )
    localStorage.setItem('swiftride_bookings', JSON.stringify(updated))
  }

  return (
    <BookingContext.Provider value={{
      currentBooking,
      selectedSeats,
      startBooking,
      toggleSeat,
      clearBooking,
      saveBooking,
      getUserBookings,
      cancelBooking,
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)
