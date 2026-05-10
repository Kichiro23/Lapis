import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Calculator,
  Search,
  GraduationCap,
  BookOpen,
  Timer,
  Briefcase,
  ChevronDown,
  Check,
  ArrowRight,
  Zap,
  Shield,
  Globe,
} from 'lucide-react'
import SafeCanvas from '../components/SafeCanvas'

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const features = [
  {
    icon: Calculator,
    title: 'GWA Calculator',
    description: 'Track grades, predict honors standing, and export PDF transcripts.',
    link: '/gwa-calculator',
    gradient: 'from-yellow-400/10 to-amber-500/5',
    iconBg: 'bg-yellow-400/15',
  },
  {
    icon: Search,
    title: 'Scholarship Finder',
    description: 'Discover scholarships matched to your course, grades, and location.',
    link: '/scholarships',
    gradient: 'from-emerald-400/10 to-teal-500/5',
    iconBg: 'bg-emerald-400/15',
  },
  {
    icon: GraduationCap,
    title: 'University Finder',
    description: 'Compare universities worldwide by tuition, courses, and rankings.',
    link: '/universities',
    gradient: 'from-sky-400/10 to-blue-500/5',
    iconBg: 'bg-sky-400/15',
  },
  {
    icon: BookOpen,
    title: 'Study Tools',
    description: 'Flashcards, AI quizzes, dictionary, and focused study sessions.',
    link: '/study',
    gradient: 'from-violet-400/10 to-purple-500/5',
    iconBg: 'bg-violet-400/15',
  },
  {
    icon: Timer,
    title: 'Focus Timer',
    description: 'Pomodoro timer with session tracking and productivity insights.',
    link: '/focus',
    gradient: 'from-rose-400/10 to-pink-500/5',
    iconBg: 'bg-rose-400/15',
  },
  {
    icon: Briefcase,
    title: 'Career Hub',
    description: 'Explore career paths, salaries, and build your resume.',
    link: '/career',
    gradient: 'from-orange-400/10 to-amber-500/5',
    iconBg: 'bg-orange-400/15',
  },
]

const steps = [
  { num: '01', title: 'Pick a Tool', description: 'Choose from calculators, finders, timers, and more.' },
  { num: '02', title: 'Use It Free', description: 'No account required. All core tools are free forever.' },
  { num: '03', title: 'Achieve More', description: 'Track progress, stay organized, and reach your goals.' },
]

const trustBadges = [
  { icon: Check, text: 'Free Forever' },
  { icon: Shield, text: 'No Credit Card' },
  { icon: Globe, text: 'Global Access' },
  { icon: Zap, text: 'AI Powered' },
]

export default function HomePage() {
  const [scholarshipCount, setScholarshipCount] = useState(0)
  const [uniCount, setUniCount] = useState(0)

  useEffect(() => {
    fetch('/api/scholarships')
      .then(r => r.json().catch(() => []))
      .then(data => setScholarshipCount(data.length || 0))
      .catch(() => {})
    fetch('/api/ph-universities')
      .then(r => r.json().catch(() => []))
      .then(data => setUniCount(data.length || 0))
      .catch(() => {})
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* 3D Canvas Background - decoration only */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
        <SafeCanvas />
      </div>
      {/* Mobile gradient fallback */}
      <div className="absolute inset-0 z-0 md:hidden bg-gradient-to-br from-yellow-50/50 via-slate-50 to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

      {/* Hero Section */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col justify-center">
        <div className="section-container pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-600 dark:text-yellow-400 text-xs font-semibold mb-6">
              <Zap size={12} />
              Free All-in-One Student Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5">
              Everything You Need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">
                Succeed
              </span>{' '}
              as a Student
            </h1>

            <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              GWA calculator, scholarship finder, university database, career tools, study aids, and AI assistants — all in one place, free for every student.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {trustBadges.map((badge) => (
                <span
                  key={badge.text}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm"
                >
                  <badge.icon size={12} className="text-yellow-500" />
                  {badge.text}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/gwa-calculator" className="pill-btn pill-btn-primary">
                Get Started Free <ArrowRight size={14} className="ml-1.5" />
              </Link>
              <Link to="/study" className="pill-btn pill-btn-secondary">
                Explore Tools
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-slate-400" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 sm:py-28" id="features">
        <div className="section-container">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-yellow-600 dark:text-yellow-400">
              All-in-One Platform
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              One Platform. Every Tool.
            </h2>
            <p className="text-base max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Stop juggling apps. Lapis brings everything you need into one seamless experience.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((feat, i) => (
              <Reveal key={feat.title} delay={i * 0.06}>
                <Link to={feat.link} className="block h-full">
                  <div className={`feature-tile h-full bg-gradient-to-br ${feat.gradient}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${feat.iconBg}`}>
                      <feat.icon size={20} className="text-slate-700 dark:text-slate-200" />
                    </div>
                    <h3 className="text-base font-bold mb-1.5">{feat.title}</h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {feat.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-600 dark:text-yellow-400 group-hover:gap-2 transition-all">
                      Explore <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 sm:py-28">
        <div className="section-container">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-yellow-600 dark:text-yellow-400">
              Simple as 1-2-3
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Get Started in Minutes
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.12}>
                <div className="glass-card p-6 sm:p-8 text-center h-full">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-mono font-bold text-lg bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-900">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="relative z-10 py-16 sm:py-20">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: '6+', label: 'Free Tools' },
              { value: `${scholarshipCount || 8}+`, label: 'Scholarships Tracked' },
              { value: `${uniCount || 10}+`, label: 'Universities Listed' },
              { value: '100%', label: 'Free Access' },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <div className="glass-card p-5 sm:p-6 text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold font-mono text-yellow-600 dark:text-yellow-400">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 py-20 sm:py-28">
        <div className="section-container">
          <Reveal>
            <div className="glass-card p-8 sm:p-12 text-center bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 border-slate-700/50">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
                Ready to Take Control of Your Student Life?
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-md mx-auto">
                Join students worldwide using Lapis to achieve more — completely free.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/gwa-calculator" className="pill-btn pill-btn-primary">
                  Start Free — No Signup
                </Link>
                <Link to="/scholarships" className="pill-btn text-white border border-white/20 hover:bg-white/10">
                  Find Scholarships
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
