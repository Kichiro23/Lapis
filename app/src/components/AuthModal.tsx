import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, GraduationCap, Mail, Lock, User } from 'lucide-react'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  mode: 'login' | 'signup'
  onToggleMode: () => void
}

export default function AuthModal({ open, onClose, mode, onToggleMode }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-[420px] rounded-[32px] p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                style={{ background: 'var(--accent-yellow)' }}
              >
                <GraduationCap size={28} color="#333" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-bold">{mode === 'login' ? 'Welcome Back' : 'Join Lapis'}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {mode === 'login' ? 'Sign in to your account' : 'Create your free account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {mode === 'signup' && (
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-pill pl-10"
                    required
                  />
                </div>
              )}
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-pill pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-pill pl-10"
                  required
                />
              </div>

              <button type="submit" className="pill-btn pill-btn-primary w-full mt-2">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-gray-500">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={onToggleMode}
                  className="font-semibold text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t flex flex-col gap-2">
              <button
                type="button"
                onClick={onClose}
                className="pill-btn pill-btn-ghost w-full text-xs text-gray-400"
              >
                Continue without account — all tools are free
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
