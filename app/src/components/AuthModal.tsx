import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, GraduationCap, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

declare global {
  interface Window {
    google?: any
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

interface AuthModalProps {
  open: boolean
  onClose: () => void
  mode: 'login' | 'signup'
  onToggleMode: () => void
}

export default function AuthModal({ open, onClose, mode, onToggleMode }: AuthModalProps) {
  const { login, register, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)

  const googleLoginRef = useRef(async (_idToken: string) => {})
  googleLoginRef.current = async (idToken: string) => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle(idToken)
      onClose()
    } catch (err) {
      setError((err as Error).message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    if (window.google?.accounts?.id) {
      setGoogleReady(true)
      return
    }
    if (!GOOGLE_CLIENT_ID) return
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            if (response?.credential) {
              googleLoginRef.current(response.credential)
            }
          },
        })
        setGoogleReady(true)
      }
    }
    document.body.appendChild(script)
  }, [open])

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

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

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

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white/95 dark:bg-slate-900/95 px-2 text-slate-500">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.google?.accounts?.id) {
                  window.google.accounts.id.prompt()
                }
              }}
              disabled={!googleReady || !GOOGLE_CLIENT_ID || loading}
              title={!GOOGLE_CLIENT_ID ? 'Google OAuth not configured' : undefined}
              className="pill-btn w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

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
