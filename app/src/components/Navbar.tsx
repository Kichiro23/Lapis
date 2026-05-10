import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, GraduationCap, Heart } from 'lucide-react'
import AuthModal from './AuthModal'

const navLinks = [
  { label: 'GWA Calculator', href: '/gwa-calculator' },
  { label: 'Scholarships', href: '/scholarships' },
  { label: 'Universities', href: '/universities' },
  { label: 'Study Tools', href: '/study' },
  { label: 'Focus', href: '/focus' },
  { label: 'Career', href: '/career' },
  { label: 'Converters', href: '/converters' },
  { label: 'Resources', href: '/resources' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const openLogin = () => { setAuthMode('login'); setAuthOpen(true) }
  const openSignup = () => { setAuthMode('signup'); setAuthOpen(true) }

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[1100px] transition-all duration-300">
        <nav
          className={`glass-navbar flex items-center justify-between h-14 px-2 transition-all duration-300 ${
            scrolled ? 'shadow-lg' : ''
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 pl-3 select-none">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-yellow)' }}>
              <GraduationCap size={18} color="#333" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Lapis
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2 pr-1">
            <Link
              to="/support"
              className="text-sm font-medium text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 flex items-center gap-1"
            >
              <Heart size={14} /> Support
            </Link>
            <button
              onClick={openLogin}
              className="text-sm font-medium text-gray-500 hover:text-gray-800 px-4 py-1.5 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              Log In
            </button>
            <button onClick={openSignup} className="pill-btn pill-btn-primary text-sm">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-[300px] rounded-l-3xl p-6 pt-20 flex flex-col gap-2"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(24px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-base font-medium px-4 py-3 rounded-2xl transition-all ${
                    location.pathname === link.href
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/support"
                className={`text-base font-medium px-4 py-3 rounded-2xl transition-all flex items-center gap-2 ${
                  location.pathname === '/support'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart size={16} /> Support Us
              </Link>
              <Link
                to="/about"
                className={`text-base font-medium px-4 py-3 rounded-2xl transition-all ${
                  location.pathname === '/about'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                About
              </Link>
              <div className="mt-auto flex flex-col gap-2 pt-4 border-t">
                <button
                  onClick={() => { setMobileOpen(false); openLogin() }}
                  className="w-full text-center py-3 rounded-2xl text-gray-600 font-medium hover:bg-gray-100 transition-all"
                >
                  Log In
                </button>
                <button
                  onClick={() => { setMobileOpen(false); openSignup() }}
                  className="pill-btn pill-btn-primary w-full"
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </header>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
      />
    </>
  )
}
