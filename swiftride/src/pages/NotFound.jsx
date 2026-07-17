import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdHome, MdDirectionsBus } from 'react-icons/md'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-9xl font-black text-gray-100 dark:text-gray-800 leading-none mb-2">404</div>
        <div className="relative -mt-16 mb-6">
          <MdDirectionsBus className="text-6xl text-orange-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Looks like you took a wrong turn
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:border-orange-400 transition-colors"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 justify-center"
          >
            <MdHome /> Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  )
}
