import { motion } from 'framer-motion'
import { Heart, Coffee, BookOpen, GraduationCap, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const tiers = [
  { icon: Coffee, label: 'Coffee', amount: '₱50', desc: 'Buy us a coffee to keep us energized' },
  { icon: BookOpen, label: 'Textbook', amount: '₱500', desc: 'Help us buy resources to improve Lapis' },
  { icon: GraduationCap, label: 'Semester', amount: '₱2,000', desc: 'Fund a full month of development' },
]

const methods = [
  {
    name: 'GCash / Maya',
    detail: '09627905910',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    name: 'PayPal',
    detail: 'rommeld216@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 11l5-9 5 9H7z" />
        <path d="M7 13h10v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6z" />
      </svg>
    ),
  },
  {
    name: 'Google Pay',
    detail: 'rommeld216@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M2 12h20" />
      </svg>
    ),
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
      title="Copy"
    >
      {copied ? <CheckCircle size={14} className="text-green-600" /> : <Copy size={14} className="text-gray-400" />}
    </button>
  )
}

export default function SupportPage() {
  return (
    <div className="min-h-[100dvh] pt-28 pb-20 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[800px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#f6e33630' }}>
            <Heart size={24} style={{ color: '#e74c3c' }} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            Help Us Keep Lapis Free
          </h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Lapis is built and maintained by a solo Filipino developer. Your support helps keep the platform running and growing for thousands of students.
          </p>
        </motion.div>

        {/* Donation Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          {tiers.map((tier) => (
            <div key={tier.label} className="glass-card p-5 text-center">
              <tier.icon size={24} className="mx-auto mb-2" style={{ color: '#f5a623' }} />
              <p className="text-2xl font-extrabold">{tier.amount}</p>
              <p className="text-sm font-semibold">{tier.label}</p>
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>{tier.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-10"
        >
          <h2 className="text-lg font-bold mb-4">Payment Methods</h2>
          <div className="flex flex-col gap-4">
            {methods.map((m) => (
              <div key={m.name} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: '#f5f2eb' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white">
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-xs font-mono flex items-center" style={{ color: 'var(--text-secondary)' }}>
                    {m.detail}
                    <CopyButton text={m.detail} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 text-center"
        >
          <p className="text-sm font-semibold mb-2">Monthly Donation Goal</p>
          <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden mb-2">
            <div className="h-full rounded-full" style={{ width: '35%', background: '#f6e336' }} />
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            ₱3,500 raised of ₱10,000 goal · 12 supporters this month
          </p>
        </motion.div>

        {/* Wall of Thanks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#f5a623' }}>
            Wall of Thanks
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Anonymous', 'Juan D.', 'Mika R.', 'Sophia T.', 'Carlos M.', 'Anonymous', 'Anna L.'].map((name) => (
              <span
                key={name}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border"
                style={{ borderColor: 'rgba(0,0,0,0.06)' }}
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
