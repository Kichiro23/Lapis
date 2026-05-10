import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calculator,
  Search,
  BookOpen,
  Clock,
  Briefcase,
  Award,
  Bell,
  FileText,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const quickActions = [
  { icon: Calculator, label: 'Calculate GWA', href: '/gwa-calculator', desc: 'Track grades' },
  { icon: Search, label: 'Find Scholarships', href: '/scholarships', desc: 'Discover funding' },
  { icon: Clock, label: 'Focus Timer', href: '/focus', desc: 'Stay productive' },
  { icon: BookOpen, label: 'Study Tools', href: '/study', desc: 'Flashcards & quizzes' },
  { icon: FileText, label: 'Build Resume', href: '/resume', desc: 'Create your CV' },
  { icon: Briefcase, label: 'Career Hub', href: '/career', desc: 'Explore paths' },
]

const deadlines = [
  { title: 'DOST Scholarship Application', date: 'Aug 30', daysLeft: 15, urgent: true },
  { title: 'Midterm Exams Week', date: 'Sep 12', daysLeft: 28, urgent: false },
  { title: 'UP Law Application', date: 'Oct 1', daysLeft: 47, urgent: false },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  })
  const [scholarshipCount, setScholarshipCount] = useState(0)
  const [uniCount, setUniCount] = useState(0)

  useEffect(() => {
    fetch('/api/scholarships')
      .then((r) => r.json().catch(() => []))
      .then((data) => setScholarshipCount(data.length || 0))
      .catch(() => {})
    fetch('/api/ph-universities')
      .then((r) => r.json().catch(() => []))
      .then((data) => setUniCount(data.length || 0))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-[100dvh] pt-24 pb-20 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1100px] mx-auto">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-yellow-500" />
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-yellow-600 dark:text-yellow-400">
              {greeting}
            </p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Welcome to Lapis'}
          </h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            Here's what's happening with your academic journey.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          {[
            { icon: TrendingUp, label: 'Current GWA', value: '—', color: 'text-yellow-500' },
            { icon: Award, label: 'Scholarships', value: `${scholarshipCount}+ Available`, color: 'text-emerald-500' },
            { icon: BookOpen, label: 'Universities', value: `${uniCount}+ Listed`, color: 'text-sky-500' },
            { icon: Bell, label: 'Deadlines', value: `${deadlines.filter(d => d.urgent).length} Urgent`, color: 'text-rose-500' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 bg-slate-100 dark:bg-slate-800`}>
                <stat.icon size={15} className={stat.color} />
              </div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickActions.map((a) => (
                  <Link
                    key={a.href}
                    to={a.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-yellow-400/10 dark:hover:bg-yellow-400/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-700 shadow-sm group-hover:scale-110 transition-transform">
                      <a.icon size={18} className="text-slate-700 dark:text-slate-200" />
                    </div>
                    <p className="text-[11px] font-semibold text-center">{a.label}</p>
                    <p className="text-[9px] text-slate-400 text-center">{a.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Upcoming Deadlines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold mb-4">Upcoming Deadlines</h3>
              <div className="flex flex-col gap-3">
                {deadlines.map((d, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl ${
                      d.urgent
                        ? 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800'
                        : 'bg-slate-100/50 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold">{d.title}</p>
                      {d.urgent && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                          URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {d.date} · {d.daysLeft} days left
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
