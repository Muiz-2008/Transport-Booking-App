import { Link } from 'react-router-dom'
import { MdDirectionsBus, MdPhone, MdEmail, MdLocationOn } from 'react-icons/md'
import { FaTwitter, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <MdDirectionsBus className="text-white text-lg" />
              </div>
              <span className="font-bold text-xl text-white">Swift<span className="text-orange-500">Ride</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Nigeria's most reliable inter-city transport booking platform. Book your seat, travel in comfort.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaTwitter, href: '#' },
                { icon: FaFacebook, href: '#' },
                { icon: FaInstagram, href: '#' },
                { icon: FaWhatsapp, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-500 transition-colors"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/buses', label: 'Find a Bus' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/register', label: 'Create Account' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-orange-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="font-semibold text-white mb-4">Popular Routes</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                'Lagos → Abuja',
                'Lagos → Ibadan',
                'Abuja → Kaduna',
                'Port Harcourt → Enugu',
                'Lagos → Benin City',
                'Kano → Abuja',
              ].map(route => (
                <li key={route}>
                  <Link
                    to="/buses"
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {route}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MdLocationOn className="text-orange-500 text-lg mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">14 Victoria Island, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <MdPhone className="text-orange-500 text-lg flex-shrink-0" />
                <a href="tel:+2348122241081" className="text-gray-400 hover:text-orange-400">+234 8122241081</a>
              </li>
              <li className="flex items-center gap-3">
                <MdEmail className="text-orange-500 text-lg flex-shrink-0" />
                <a href="mailto:hello@swiftride.ng" className="text-gray-400 hover:text-orange-400">hello@swiftride.ng</a>
              </li>
            </ul>
            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2">Customer Support Hours</p>
              <p className="text-xs text-gray-400">Mon - Sat: 7:00 AM – 9:00 PM</p>
              <p className="text-xs text-gray-400">Sunday: 9:00 AM – 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SwiftRide. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
            <a href="#" className="hover:text-gray-400">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
