import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, GraduationCap, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import AuthModal from './AuthModal'

const navLinks = [
  { label: 'GWA', href: '/gwa-calculator' },
  { label: 'Scholarships', href: '/scholarships' },
  { label: 'Universities', href: '/universities' },
  { label: 'Study', href: '/study' },
  { label: 'Focus', href: '/focus' },
  { label: 'Career', href: '/career' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [mounted, setMounted] = useState(false)
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
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
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[1100px]">
        <nav
          className={`glass-navbar flex items-center justify-between h-13 px-2 sm:px-4 transition-all duration-300 ${
            scrolled ? 'shadow-lg' : ''
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 pl-2 select-none">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-500">
              <GraduationCap size={16} className="text-slate-900" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight">Lapis</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-yellow-400/15 text-yellow-700 dark:text-yellow-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 pr-1">
            {/* Dark Mode Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-1 ml-1">
              <button
                onClick={openLogin}
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Log In
              </button>
              <button onClick={openSignup} className="pill-btn pill-btn-primary text-sm py-2 px-4">
                Sign Up
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40"
              onClick={() => setMobileOpen(false)}
            >
              <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute right-0 top-0 h-full w-[280px] rounded-l-3xl p-6 pt-20 flex flex-col gap-1"
                style={{
                  background: 'var(--bg-header)',
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
                        ? 'bg-yellow-400/15 text-yellow-700 dark:text-yellow-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => { setMobileOpen(false); openLogin() }}
                    className="w-full text-center py-3 rounded-2xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
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
            </motion.div>
          )}
        </AnimatePresence>
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
