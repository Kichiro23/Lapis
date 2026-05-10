import { useRef, useEffect, useState } from 'react'
import { api } from '../lib/api'
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
  Star,
  ArrowRight,
  Zap,
  Shield,
  Heart,
} from 'lucide-react'
import NeonCoordinateCanvas from '../components/NeonCoordinateCanvas'

/* ─── Scroll Reveal Wrapper ─── */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Feature Tiles Data ─── */
const features = [
  {
    icon: Calculator,
    title: 'GWA Calculator',
    description: 'Track your grades, predict honors, and plan your semester with precision.',
    link: '/gwa-calculator',
    color: '#f6e336',
  },
  {
    icon: Search,
    title: 'Scholarship Finder',
    description: 'AI-matched scholarships based on your profile, GWA, and course.',
    link: '/scholarships',
    color: '#d2f754',
  },
  {
    icon: GraduationCap,
    title: 'University Finder',
    description: 'Find the perfect university with smart filters and comparisons.',
    link: '/universities',
    color: '#7cf0bd',
  },
  {
    icon: BookOpen,
    title: 'Study Tools',
    description: 'Flashcards, mind maps, and AI-generated quizzes from your notes.',
    link: '/study',
    color: '#f6e336',
  },
  {
    icon: Timer,
    title: 'Focus Timer',
    description: 'Pomodoro sessions, focus analytics, and habit tracking.',
    link: '/focus',
    color: '#d2f754',
  },
  {
    icon: Briefcase,
    title: 'Career Hub',
    description: 'Internships, resume builder, and interview preparation.',
    link: '/career',
    color: '#7cf0bd',
  },
]

/* ─── Steps Data ─── */
const steps = [
  {
    num: '01',
    title: 'Create Your Profile',
    description: 'Set your school, course, and academic goals — completely anonymous.',
  },
  {
    num: '02',
    title: 'Explore & Use Tools',
    description: 'Calculate your GWA, find scholarships, discover universities.',
  },
  {
    num: '03',
    title: 'Achieve Your Goals',
    description: 'Track progress, stay focused, and reach your full potential.',
  },
]

/* ─── Stats ─── */
const stats = [
  { value: '10,000+', label: 'Students' },
  { value: '50+', label: 'Scholarships Available', prefix: '' },
  { value: '2,000+', label: 'Universities Globally', prefix: '' },
  { value: '4.9/5', label: 'Student Rating' },
]

/* ─── Testimonials ─── */
const testimonials = [
  {
    name: 'Mika Reyes',
    school: 'UP Diliman',
    course: 'BS Computer Science',
    quote: 'Lapis helped me find 3 scholarships I never knew existed. My GWA went from 2.5 to 1.75 in one semester!',
    rating: 5,
  },
  {
    name: 'Juan Dela Cruz',
    school: 'De La Salle University',
    course: 'BS Business Management',
    quote: 'The focus timer and study tools are game changers. I actually enjoy studying now.',
    rating: 5,
  },
  {
    name: 'Sophia Tan',
    school: 'UST',
    course: 'BS Architecture',
    quote: 'Found my dream university through the finder tool. The comparison feature saved me weeks of research.',
    rating: 5,
  },
]

/* ─── Trust Badges ─── */
const trustBadges = [
  { icon: Check, text: 'Free Forever' },
  { icon: Shield, text: 'No Credit Card' },
  { icon: Heart, text: 'Anonymous' },
  { icon: Zap, text: '10,000+ Students' },
]

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0)
  const [realStats, setRealStats] = useState(stats)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([api.getScholarships(), api.searchGlobalUniversities('Philippines')])
      .then(([scholars, unis]) => {
        setRealStats((prev) =>
          prev.map((s) =>
            s.label === 'Scholarships Available'
              ? { ...s, value: `${scholars.length}+` }
              : s.label === 'Universities Globally'
              ? { ...s, value: `${unis.length}+` }
              : s
          )
        )
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.3 }
    )
    if (bannerRef.current) observer.observe(bannerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative">
      {/* 3D Canvas Background */}
      <NeonCoordinateCanvas />

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center px-6 z-10 pointer-events-none">
        <div className="max-w-[1200px] mx-auto w-full pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-xl"
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
              style={{ color: '#f5a623' }}
            >
              YOUR LAUNCHPAD TO SUCCESS
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-5" style={{ color: 'var(--text-primary)' }}>
              Everything You Need to Succeed as a Student
            </h1>
            <p className="text-base md:text-lg leading-relaxed mb-7 max-w-md" style={{ color: 'var(--text-secondary)' }}>
              GWA calculator, scholarship finder, university matcher, study tools, and more — all in one beautiful platform built for Filipino students.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {trustBadges.map((badge) => (
                <span
                  key={badge.text}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(246,227,54,0.15)', color: '#333' }}
                >
                  <badge.icon size={12} />
                  {badge.text}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pointer-events-auto">
              <Link to="/gwa-calculator" className="pill-btn pill-btn-primary text-sm">
                Get Started Free
              </Link>
              <Link to="#features" className="pill-btn pill-btn-ghost text-sm">
                Explore Features
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={24} className="text-gray-400" />
        </motion.div>
      </section>

      {/* "A-Ha!" Banner */}
      <section
        ref={bannerRef}
        className="relative z-20 py-28 md:py-36 px-6"
        style={{ background: 'var(--bg-dark)' }}
      >
        <div className="max-w-[900px] mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight">
              The first learning platform built for the{' '}
              <span className="text-[#f6e336]">modern</span>{' '}
              <span className="text-[#f6e336]">Filipino</span>{' '}
              student.
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-6 text-base md:text-lg text-gray-400 max-w-lg mx-auto">
              No more juggling apps. No more missed deadlines. Just one powerful platform that understands what Filipino students need.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Feature Tiles Grid */}
      <section id="features" className="relative z-20 py-24 md:py-32 px-6" style={{ background: '#f5f2eb' }}>
        <div className="max-w-[1200px] mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#f5a623' }}>
              ALL-IN-ONE PLATFORM
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              One Platform. Every Tool.
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Stop juggling apps. Lapis brings everything you need into one seamless experience.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <Reveal key={feat.title} delay={i * 0.08}>
                <Link to={feat.link} className="block">
                  <div className="feature-card group h-full">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{ background: `${feat.color}30` }}
                    >
                      <feat.icon size={22} style={{ color: '#333' }} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {feat.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all" style={{ color: '#333' }}>
                      Explore <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-20 py-24 md:py-32 px-6" style={{ background: '#fff' }}>
        <div className="max-w-[1200px] mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#f5a623' }}>
              SIMPLE AS 1-2-3
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Get Started in Minutes
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.15}>
                <div
                  className={`relative p-8 rounded-[32px] cursor-pointer transition-all duration-300 ${
                    activeStep === i ? 'ring-2' : ''
                  }`}
                  style={{
                    background: activeStep === i ? '#f6e33620' : '#f5f2eb',
                  }}
                  onMouseEnter={() => setActiveStep(i)}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5 font-mono font-bold text-lg"
                    style={{ background: '#f6e336', color: '#333' }}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {step.description}
                  </p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 -right-4 w-8 h-[2px]" style={{ background: '#e9e7e0' }} />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="relative z-20 py-20 px-6" style={{ background: '#f5f2eb' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {realStats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-extrabold font-mono" style={{ color: 'var(--text-primary)' }}>
                    {stat.prefix}{stat.value}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-20 py-24 md:py-32 px-6" style={{ background: '#fff' }}>
        <div className="max-w-[1200px] mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#f5a623' }}>
              TRUSTED BY STUDENTS
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Loved by Thousands</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="glass-card p-6 md:p-8">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} fill="#f5a623" color="#f5a623" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-5 italic" style={{ color: 'var(--text-primary)' }}>
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#f6e336', color: '#333' }}>
                      {t.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {t.school} · {t.course}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Photo Section */}
      <section className="relative z-20 py-24 md:py-32 px-6" style={{ background: '#f5f2eb' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <Reveal>
              <div
                className="w-full h-auto rounded-[32px] object-cover flex items-center justify-center"
                style={{ aspectRatio: '3/2', background: 'linear-gradient(135deg, #f6e33620, #7cf0bd20)' }}
              >
                <GraduationCap size={64} style={{ color: '#f5a623', opacity: 0.5 }} />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#f5a623' }}>
                BUILT FOR YOU
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Designed by students, for students
              </h2>
              <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                We know the struggle — expensive textbooks, confusing scholarship forms, and the endless search for the right university. Lapis was built to solve these problems so you can focus on what matters: learning.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="text-xs font-semibold px-4 py-2 rounded-full" style={{ background: '#f6e33630', color: '#333' }}>
                  No account required
                </span>
                <span className="text-xs font-semibold px-4 py-2 rounded-full" style={{ background: '#7cf0bd30', color: '#333' }}>
                  Free forever
                </span>
                <span className="text-xs font-semibold px-4 py-2 rounded-full" style={{ background: '#d2f75430', color: '#333' }}>
                  Your data stays private
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-20 py-24 md:py-32 px-6" style={{ background: '#fff' }}>
        <div className="max-w-[1200px] mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#f5a623' }}>
              PRICING
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Simple, student-friendly pricing</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
            <Reveal delay={0.1}>
              <div className="glass-card p-8 h-full flex flex-col">
                <h3 className="text-lg font-bold mb-1">Free</h3>
                <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Everything you need to get started</p>
                <p className="text-4xl font-extrabold mb-6">₱0</p>
                <ul className="flex flex-col gap-3 flex-1">
                  {['GWA Calculator', 'Scholarship Finder', 'University Database', 'Focus Timer', 'Basic Study Tools'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/gwa-calculator" className="pill-btn pill-btn-ghost w-full mt-6 text-center">
                  Get Started
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="p-8 h-full flex flex-col rounded-[40px]" style={{ background: '#f6e336' }}>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold">Pro</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/10">Coming Soon</span>
                </div>
                <p className="text-sm mb-5 text-black/60">Supercharge your student life</p>
                <p className="text-4xl font-extrabold mb-6">₱99<span className="text-base font-normal text-black/60">/mo</span></p>
                <ul className="flex flex-col gap-3 flex-1">
                  {['Everything in Free', 'AI Quiz Generator', 'Advanced Analytics', 'Resume Builder', 'Priority Support', 'Cloud Sync'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-black/70" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="pill-btn w-full mt-6 text-center bg-black text-white hover:bg-black/80">
                  Upgrade to Pro
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-20 py-20 md:py-28 px-6" style={{ background: 'var(--bg-dark)' }}>
        <div className="max-w-[700px] mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Ready to Take Control of Your Student Life?
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-base md:text-lg text-gray-400 mb-8">
              Join thousands of Filipino students using Lapis to achieve more.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/gwa-calculator" className="pill-btn pill-btn-primary text-base px-8 py-3">
                Start Your Journey — It's Free
              </Link>
              <Link to="/scholarships" className="pill-btn text-base px-8 py-3 text-white border border-white/20 hover:bg-white/10">
                Explore Scholarships
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
