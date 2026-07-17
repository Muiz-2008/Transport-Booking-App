import { motion } from 'framer-motion'
import { MdDirectionsBus, MdVerified, MdGroups, MdTrendingUp } from 'react-icons/md'

const team = [
  { name: 'Chidi Okafor', role: 'CEO & Co-Founder', initials: 'CO', bio: '10+ years in Nigerian logistics and transport.' },
  { name: 'Amina Ibrahim', role: 'CTO', initials: 'AI', bio: 'Ex-Andela engineer with a passion for scalable systems.' },
  { name: 'Tunde Adeyemi', role: 'Head of Operations', initials: 'TA', bio: 'Former transport manager with deep industry knowledge.' },
  { name: 'Ngozi Eze', role: 'Product Designer', initials: 'NE', bio: 'Obsessed with creating intuitive user experiences.' },
]

export default function About() {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="gradient-hero py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-orange-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 text-sm px-4 py-1.5 rounded-full mb-6">
              <MdDirectionsBus /> About SwiftRide
            </span>
            <h1 className="text-4xl font-bold text-white mb-5">
              Making Nigerian Transport<br />Accessible for Everyone
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              SwiftRide was founded in 2026 as a school project with one simple mission: to make it easy, safe, and convenient for Nigerians to book inter-city bus travel from their phones.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-12 px-4 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '500K+', label: 'Happy Travellers' },
            { value: '10K+', label: 'Bus Operators' },
            { value: '200+', label: 'Routes Covered' },
            { value: '2026', label: 'Year Founded' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-orange-500">{value}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                It started with a frustrating experience. Our founder missed an important family event because he couldn't get a bus ticket in time — he spent hours at a terminal only to find out the bus was fully booked.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                He asked a simple question: why isn't this online? And that question became SwiftRide — Nigeria's first dedicated inter-city bus booking platform.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Today, we partner with over 10,000 bus companies nationwide and have helped half a million Nigerians travel safely and comfortably.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MdVerified, title: 'Verified Operators', desc: 'Every bus company is verified before listing on our platform.' },
                { icon: MdGroups, title: 'Customer First', desc: 'We exist to serve travelers, not just to sell tickets.' },
                { icon: MdTrendingUp, title: 'Always Improving', desc: 'We ship new features every month based on user feedback.' },
                { icon: MdDirectionsBus, title: 'Pan-Nigeria', desc: 'From Lagos to Maiduguri, we cover every major route.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                  <Icon className="text-orange-500 text-2xl mb-2" />
                  <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Meet the Team</h2>
            <p className="text-gray-500 dark:text-gray-400">The people behind SwiftRide</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {team.map(({ name, role, initials, bio }) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-5 text-center border border-gray-100 dark:border-gray-800"
              >
                <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {initials}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{name}</p>
                <p className="text-xs text-orange-500 mt-0.5 mb-2">{role}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
