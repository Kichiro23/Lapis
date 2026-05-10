import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, GraduationCap, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  mode: 'login' | 'signup'
  onToggleMode: () => void
}

export default function AuthModal({ open, onClose, mode, onToggleMode }: AuthModalProps) {
  const { login, register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
      onClose()
    } catch (err) {
      setError((err as Error).message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-[420px] rounded-[32px] p-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} aria-label="Close authentication modal" className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X size={18} />
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 bg-gradient-to-br from-yellow-400 to-amber-500">
                <GraduationCap size={28} className="text-slate-900" strokeWidth={2} />
              </div>
              <h2 id="auth-title" className="text-xl font-bold">{mode === 'login' ? 'Welcome Back' : 'Join Lapis'}</h2>
              <p className="text-sm text-slate-500 mt-1">
                {mode === 'login' ? 'Sign in to your account' : 'Create your free account'}
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs mb-4">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {mode === 'signup' && (
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="input-pill pl-10" required />
                </div>
              )}
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="input-pill pl-10" required />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input-pill pl-10" required minLength={6} />
              </div>

              <button type="submit" disabled={loading} className="pill-btn pill-btn-primary w-full mt-2 disabled:opacity-50">
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-slate-500">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={onToggleMode} className="font-semibold text-yellow-600 dark:text-yellow-400 hover:underline transition-colors">
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
              <button type="button" onClick={onClose} className="pill-btn pill-btn-ghost w-full text-xs text-slate-400">
                Continue without account — all tools are free
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
