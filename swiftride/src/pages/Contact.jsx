import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { MdPhone, MdEmail, MdLocationOn, MdWhatsapp, MdSend } from 'react-icons/md'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Message sent! We\'ll respond within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  const contacts = [
    { icon: MdPhone, label: 'Phone', value: '+234 8122241081', href: 'tel:+2348122241081' },
    { icon: MdEmail, label: 'Email', value: 'hello@swiftride.ng', href: 'mailto:hello@swiftride.ng' },
    { icon: MdWhatsapp, label: 'WhatsApp', value: '+234 8122241081', href: '#' },
    { icon: MdLocationOn, label: 'Address', value: '14 Victoria Island, Lagos', href: '#' },
  ]

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero */}
      <div className="gradient-hero py-14 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-3">Contact Us</h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          Have a question or need help? Our support team is available 7 days a week.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Get in Touch</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We're available Monday – Saturday, 7AM to 9PM. Sunday 9AM to 6PM.
              </p>
            </div>

            {contacts.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-800 transition-colors group"
              >
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="text-orange-500 text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{value}</p>
                </div>
              </a>
            ))}

            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50 rounded-2xl p-4">
              <p className="font-semibold text-orange-700 dark:text-orange-400 text-sm mb-1">Live Chat</p>
              <p className="text-xs text-orange-600 dark:text-orange-500">Chat with us directly on our website. Usually responds in under 2 minutes.</p>
              <button className="mt-3 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg">
                Start Live Chat
              </button>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
            >
              <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-5">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Your Name *</label>
                    <input
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Bola John"
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:border-orange-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:border-orange-400"
                  >
                    <option value="">Select a topic</option>
                    <option value="booking">Booking Issue</option>
                    <option value="refund">Refund Request</option>
                    <option value="partner">Bus Company Partnership</option>
                    <option value="technical">Technical Problem</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Message *</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us what we can help you with..."
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:border-orange-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <MdSend />
                  )}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
