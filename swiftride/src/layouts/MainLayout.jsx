import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

export default function MainLayout() {
  const { pathname } = useLocation()
  const hideFooter = ['/checkout', '/seats', '/booking-success'].some(p => pathname.startsWith(p))

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}
