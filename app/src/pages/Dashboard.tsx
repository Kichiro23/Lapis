import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Calculator,
  Search,
  GraduationCap,
  BookOpen,
  Clock,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Award,
  Bell,
  FileText,
} from 'lucide-react'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: Calculator, label: 'GWA', href: '/gwa-calculator' },
  { icon: Search, label: 'Scholarships', href: '/scholarships' },
  { icon: GraduationCap, label: 'Universities', href: '/universities' },
  { icon: BookOpen, label: 'Study', href: '/study' },
  { icon: Clock, label: 'Focus', href: '/focus' },
  { icon: Briefcase, label: 'Career', href: '/career' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

const quickActions = [
  { icon: Calculator, label: 'Calculate GWA', href: '/gwa-calculator', color: '#f6e336' },
  { icon: Search, label: 'Find Scholarships', href: '/scholarships', color: '#d2f754' },
  { icon: Clock, label: 'Start Focus Timer', href: '/focus', color: '#7cf0bd' },
  { icon: BookOpen, label: 'Study Flashcards', href: '/study', color: '#f6e336' },
  { icon: FileText, label: 'PDF Tools', href: '/converters', color: '#d2f754' },
]

const [deadlines, setDeadlines] = useState([
  { title: 'DOST Scholarship Application', date: 'Aug 30', daysLeft: 15, urgent: true },
  { title: 'Midterm Exams Week', date: 'Sep 12', daysLeft: 28, urgent: false },
  { title: 'UP Law Application', date: 'Oct 1', daysLeft: 47, urgent: false },
])

const [recentActivity, setRecentActivity] = useState([
  { action: 'Calculated GWA', detail: 'Result: 1.75 — Cum Laude standing', time: '2h ago' },
  { action: 'Found 4 scholarships', detail: 'Matching your STEM profile', time: '5h ago' },
  { action: 'Completed Focus Session', detail: '25 min Pomodoro — Physics study', time: '1d ago' },
])

const [scholarshipCount, setScholarshipCount] = useState(0)
const [uniCount, setUniCount] = useState(0)

useEffect(() => {
  fetch('/api/scholarships')
    .then((r) => r.json())
    .then((data) => setScholarshipCount(data.length))
    .catch(() => {})
  fetch('/api/ph-universities')
    .then((r) => r.json())
    .then((data) => setUniCount(data.length))
    .catch(() => {})
}, [])

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false)
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  })

  return (
    <div className="min-h-[100dvh] flex" style={{ background: '#f5f2eb' }}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-[100dvh] z-30 border-r transition-all duration-300 flex flex-col ${
          collapsed ? 'w-16' : 'w-60'
        }`}
        style={{
          background: '#fff',
          borderColor: 'rgba(0,0,0,0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 h-14 px-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-yellow)' }}>
            <GraduationCap size={16} color="#333" strokeWidth={2.5} />
          </div>
          {!collapsed && <span className="font-bold text-sm">Lapis</span>}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all text-sm ${
                item.active
                  ? 'font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
              style={item.active ? { background: '#f6e33630', color: '#333' } : {}}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-10 flex items-center justify-center border-t hover:bg-gray-50 transition-colors"
          style={{ borderColor: 'rgba(0,0,0,0.06)' }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 pt-20 lg:pt-6 pb-10 px-4 md:px-6">
        <div className="max-w-[900px] mx-auto">
          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Sun size={16} style={{ color: '#f5a623' }} />
              <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: '#f5a623' }}>
                {greeting}
              </p>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, Student!</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Here's what's happening with your academic journey.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { icon: Calculator, label: 'Current GWA', value: '1.75', color: '#f6e336' },
              { icon: Award, label: 'Scholarships', value: `${scholarshipCount}+ Available`, color: '#d2f754' },
              { icon: Clock, label: 'Focus This Week', value: '3h 25m', color: '#7cf0bd' },
              { icon: Bell, label: 'Deadlines', value: '3 Upcoming', color: '#ffb347' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: `${stat.color}30` }}>
                  <stat.icon size={15} />
                </div>
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
              <div className="glass-card p-5">
                <h3 className="text-sm font-bold mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickActions.map((a) => (
                    <Link
                      key={a.href}
                      to={a.href}
                      className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:scale-[1.02] transition-transform text-center"
                      style={{ background: `${a.color}20` }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${a.color}40` }}>
                        <a.icon size={18} />
                      </div>
                      <p className="text-[11px] font-semibold">{a.label}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-card p-5 mt-4">
                <h3 className="text-sm font-bold mb-3">Recent Activity</h3>
                <div className="flex flex-col gap-3">
                  {recentActivity.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#f6e336' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold">{a.action}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{a.detail}</p>
                      </div>
                      <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Upcoming Deadlines */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="glass-card p-5">
                <h3 className="text-sm font-bold mb-3">Upcoming Deadlines</h3>
                <div className="flex flex-col gap-3">
                  {deadlines.map((d, i) => (
                    <div key={i} className="p-3 rounded-2xl" style={{ background: d.urgent ? '#ffe5e5' : '#f5f2eb' }}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold">{d.title}</p>
                        {d.urgent && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">URGENT</span>}
                      </div>
                      <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                        {d.date} · {d.daysLeft} days left
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
