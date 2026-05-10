import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Free',
    price: '₱0',
    period: 'forever',
    icon: Sparkles,
    color: '#f5f2eb',
    features: [
      'GWA Calculator',
      'Scholarship Finder (basic)',
      'University Database',
      'Focus Timer',
      'Basic Study Flashcards',
      'PDF & Word Generator',
    ],
    cta: 'Get Started',
    href: '/gwa-calculator',
    primary: false,
  },
  {
    name: 'Pro',
    price: '₱99',
    period: '/month',
    icon: Zap,
    color: '#f6e336',
    features: [
      'Everything in Free',
      'AI Quiz Generator',
      'Advanced Analytics',
      'Resume Builder',
      'Cloud Sync',
      'Priority Support',
      'AI Essay Grader',
    ],
    cta: 'Upgrade to Pro',
    href: '#',
    primary: true,
    badge: 'Best Value',
  },
  {
    name: 'Pro+',
    price: '₱199',
    period: '/month',
    icon: Crown,
    color: '#7cf0bd',
    features: [
      'Everything in Pro',
      '1-on-1 Career Counseling',
      'AI Essay Review & Feedback',
      'Mock Interview Practice',
      'Early Access to New Features',
      'Dedicated Support Channel',
    ],
    cta: 'Go Pro+',
    href: '#',
    primary: false,
  },
]

export default function SubscribePage() {
  return (
    <div className="min-h-[100dvh] pt-28 pb-20 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#f5a623' }}>
            PRICING
          </p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            Simple, Student-Friendly Pricing
          </h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Invest in your future. All plans are designed to be affordable for Filipino students.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-[32px] p-7 flex flex-col h-full ${
                plan.primary ? 'ring-2 ring-black/10' : ''
              }`}
              style={{ background: plan.primary ? plan.color : '#fff' }}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black text-white">
                  {plan.badge}
                </span>
              )}

              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: plan.primary ? 'rgba(0,0,0,0.1)' : `${plan.color}40` }}
                >
                  <plan.icon size={18} />
                </div>
                <h3 className="text-lg font-bold">{plan.name}</h3>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-sm text-black/60">{plan.period}</span>
              </div>

              <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={14} className={plan.primary ? 'text-black/70' : 'text-green-600'} />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.primary ? (
                <button className="pill-btn w-full text-center bg-black text-white hover:bg-black/80">
                  {plan.cta}
                </button>
              ) : (
                <Link to={plan.href} className="pill-btn pill-btn-ghost w-full text-center">
                  {plan.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            All prices in Philippine Peso (PHP). Cancel anytime. No hidden fees.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
