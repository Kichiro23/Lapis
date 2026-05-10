import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6" style={{ background: '#f5f2eb' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-[120px] font-extrabold leading-none tracking-tighter" style={{ color: '#f6e336' }}>
          404
        </div>
        <h1 className="text-2xl font-bold mb-2 mt-4">Page Not Found</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="pill-btn pill-btn-primary text-sm flex items-center justify-center gap-2">
            <Home size={14} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="pill-btn pill-btn-ghost text-sm flex items-center justify-center gap-2">
            <ArrowLeft size={14} /> Go Back
          </button>
        </div>

        <div className="mt-10 pt-8 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
            Popular Pages
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'GWA Calculator', href: '/gwa-calculator' },
              { label: 'Scholarships', href: '/scholarships' },
              { label: 'Universities', href: '/universities' },
              { label: 'Study Tools', href: '/study' },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border hover:bg-yellow-50 transition-colors"
                style={{ borderColor: 'rgba(0,0,0,0.08)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
