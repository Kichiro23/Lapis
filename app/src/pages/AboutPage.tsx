import { motion } from 'framer-motion'
import { Github, Mail, ExternalLink, Code2, Heart, Rocket, Users } from 'lucide-react'

const stack = [
  { name: 'React 18', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Vite', category: 'Build' },
  { name: 'Framer Motion', category: 'Animation' },
  { name: 'Express', category: 'Backend' },
  { name: 'Vercel', category: 'Hosting' },
]

const values = [
  {
    icon: Heart,
    title: 'Built with Love',
    desc: 'Every feature is designed with students in mind. No corporate BS, just genuine care.',
  },
  {
    icon: Rocket,
    title: 'Always Improving',
    desc: 'New features, better UX, and real API integrations are added continuously based on student feedback.',
  },
  {
    icon: Users,
    title: 'Student-First',
    desc: 'No paywalls on essential tools. Free access to GWA calculator, scholarships, and university data forever.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] pt-28 pb-20 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[800px] mx-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div
            className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl font-bold"
            style={{ background: '#f6e336', color: '#333' }}
          >
            RD
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Rommel Andrei De Leon
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Developer · Building Tools for Students Worldwide
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <a
              href="https://github.com/Kichiro23"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-yellow-50 transition-colors"
              style={{ borderColor: 'rgba(0,0,0,0.1)' }}
            >
              <Github size={16} />
            </a>
            <a
              href="mailto:rommeld216@gmail.com"
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-yellow-50 transition-colors"
              style={{ borderColor: 'rgba(0,0,0,0.1)' }}
            >
              <Mail size={16} />
            </a>
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-lg font-bold mb-3">Why I Built Lapis</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            As a student, I experienced firsthand the struggle of finding reliable academic tools. Scholarship info was scattered across websites, GWA calculators were either paid or broken, and university data was outdated.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            Lapis was born from that frustration. I wanted to build a single platform where every student could access powerful, free tools to succeed in their academic journey.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Today, Lapis serves thousands of students with real data, real APIs, and zero cost. My mission is simple: <strong>empower every Filipino student with the tools they deserve.</strong>
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {values.map((v) => (
            <div key={v.title} className="glass-card p-5">
              <v.icon size={20} className="mb-2" style={{ color: '#f5a623' }} />
              <h3 className="text-sm font-bold mb-1">{v.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Code2 size={18} style={{ color: '#f5a623' }} />
            <h2 className="text-lg font-bold">Tech Stack</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {stack.map((s) => (
              <span
                key={s.name}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border"
                style={{ borderColor: 'rgba(0,0,0,0.06)' }}
              >
                {s.name} <span className="text-gray-400">· {s.category}</span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            Want to contribute or report a bug?
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://github.com/Kichiro23/Lapis"
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn pill-btn-primary text-sm flex items-center gap-2"
            >
              <Github size={14} /> View on GitHub <ExternalLink size={12} />
            </a>
            <a
              href="mailto:rommeld216@gmail.com"
              className="pill-btn pill-btn-ghost text-sm flex items-center gap-2"
            >
              <Mail size={14} /> Contact Me
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
