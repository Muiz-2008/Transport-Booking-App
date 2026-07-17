import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { BookingProvider } from './context/BookingContext'

import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import BusListing from './pages/BusListing'
import BusDetails from './pages/BusDetails'
import SeatSelection from './pages/SeatSelection'
import Checkout from './pages/Checkout'
import BookingSuccess from './pages/BookingSuccess'
import NotFound from './pages/NotFound'

import DashboardOverview from './pages/dashboard/Overview'
import BookingHistory from './pages/dashboard/BookingHistory'
import Profile from './pages/dashboard/Profile'
import Settings from './pages/dashboard/Settings'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManageBuses from './pages/admin/ManageBuses'
import ManageBookings from './pages/admin/ManageBookings'
import ManageRoutes from './pages/admin/ManageRoutes'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/buses" element={<BusListing />} />
        <Route path="/buses/:id" element={<BusDetails />} />
        <Route path="/seats/:id" element={<PrivateRoute><SeatSelection /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/booking-success" element={<PrivateRoute><BookingSuccess /></PrivateRoute>} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<DashboardOverview />} />
        <Route path="bookings" element={<BookingHistory />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="buses" element={<ManageBuses />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="routes" element={<ManageRoutes />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookingProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: { borderRadius: '10px', fontSize: '14px' },
              }}
            />
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
