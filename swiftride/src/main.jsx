import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Seed demo data on first load
function seedDemoData() {
  const seeded = localStorage.getItem('swiftride_seeded')
  if (seeded) return

  const users = [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@swiftride.ng',
      phone: '+234 8122241081',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-1',
      name: 'Demo User',
      email: 'demo@swiftride.ng',
      phone: '+234 8122241081',
      password: 'demo123',
      role: 'user',
      createdAt: new Date().toISOString(),
    },
  ]

  // Add some sample bookings for demo user
  const bookings = [
    {
      id: 'bk-1',
      reference: 'SWR-2026-48291',
      userId: 'demo-1',
      busId: '1',
      busName: 'GIG Mobility',
      busType: 'Executive',
      from: 'Lagos',
      to: 'Abuja',
      departure: '06:00',
      arrival: '14:30',
      date: '2026-06-15',
      seats: [5, 6],
      passenger: { name: 'Demo User', email: 'demo@swiftride.ng', phone: '08012345678', gender: 'male' },
      paymentMethod: 'card',
      totalAmount: 30000,
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'bk-2',
      reference: 'SWR-2026-73841',
      userId: 'demo-1',
      busId: '3',
      busName: 'Chisco Transport',
      busType: 'Standard',
      from: 'Lagos',
      to: 'Ibadan',
      departure: '07:30',
      arrival: '10:00',
      date: '2026-05-20',
      seats: [12],
      passenger: { name: 'Demo User', email: 'demo@swiftride.ng', phone: '08012345678', gender: 'male' },
      paymentMethod: 'wallet',
      totalAmount: 3500,
      status: 'completed',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  localStorage.setItem('swiftride_users', JSON.stringify(users))
  localStorage.setItem('swiftride_bookings', JSON.stringify(bookings))
  localStorage.setItem('swiftride_seeded', 'true')
}

seedDemoData()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
