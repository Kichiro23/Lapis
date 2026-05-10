import { Link } from 'react-router-dom'
import { GraduationCap, Github, Mail } from 'lucide-react'

const toolLinks = [
  { label: 'GWA Calculator', href: '/gwa-calculator' },
  { label: 'Scholarships', href: '/scholarships' },
  { label: 'Universities', href: '/universities' },
  { label: 'Study Tools', href: '/study' },
  { label: 'Focus Timer', href: '/focus' },
  { label: 'Career Hub', href: '/career' },
  { label: 'Resume Builder', href: '/resume' },
]

const aiLinks = [
  { label: 'AI Detector', href: '/ai-detector' },
  { label: 'AI Humanizer', href: '/humanizer' },
  { label: 'Auto-Corrector', href: '/corrector' },
  { label: 'Essay Grader', href: '/essay-grader' },
]

const infoLinks = [
  { label: 'About', href: '/about' },
  { label: 'Support Us', href: '/support' },
  { label: 'Subscribe', href: '/subscribe' },
]

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="section-container py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-500">
                <GraduationCap size={16} className="text-slate-900" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg tracking-tight">Lapis</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              Free all-in-one platform for students worldwide. Built with passion.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/Kichiro23"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
              >
                <Github size={14} />
              </a>
              <a
                href="mailto:rommeld216@gmail.com"
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
              >
                <Mail size={14} />
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>
              Tools
            </h4>
            <ul className="flex flex-col gap-2.5">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>
              AI Tools
            </h4>
            <ul className="flex flex-col gap-2.5">
              {aiLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>
              Info
            </h4>
            <ul className="flex flex-col gap-2.5">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>
              Developer
            </h4>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Rommel Andrei De Leon
            </p>
            <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
              rommeld216@gmail.com
            </p>
            <Link
              to="/about"
              className="text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:underline"
            >
              About the Developer →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            &copy; {new Date().getFullYear()} Lapis. Open source. Free forever.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Built by <a href="https://github.com/Kichiro23" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">Rommel Andrei De Leon</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
