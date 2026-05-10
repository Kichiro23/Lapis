import { Link } from 'react-router-dom'
import { GraduationCap, Github, Mail, Twitter, Heart } from 'lucide-react'

const footerLinks = {
  Tools: [
    { label: 'GWA Calculator', href: '/gwa-calculator' },
    { label: 'Scholarship Finder', href: '/scholarships' },
    { label: 'University Finder', href: '/universities' },
    { label: 'Study Tools', href: '/study' },
    { label: 'Focus Timer', href: '/focus' },
    { label: 'Career Hub', href: '/career' },
    { label: 'Task Manager', href: '/tasks' },
    { label: 'Grade Tracker', href: '/grades' },
    { label: 'Resource Hub', href: '/resources' },
    { label: 'Converters', href: '/converters' },
  ],
  Account: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/settings' },
    { label: 'Subscribe', href: '/subscribe' },
  ],
  About: [
    { label: 'About the Developer', href: '/about' },
    { label: 'Support Us', href: '/support' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative z-10 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)', background: '#f5f2eb' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-yellow)' }}>
                <GraduationCap size={18} color="#333" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg">Lapis</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Your Launchpad to Success. Built with love in the Philippines for Filipino students.
            </p>
            <div className="flex items-center gap-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-yellow-100 transition-colors" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                <Twitter size={14} />
              </a>
              <a href="https://github.com/Kichiro23" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-yellow-100 transition-colors" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                <Github size={14} />
              </a>
              <a href="mailto:rommeld216@gmail.com" className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-yellow-100 transition-colors" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                <Mail size={14} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Lapis — Student Success Platform. Built with <Heart size={10} className="inline text-red-400" /> in the Philippines.
          </p>
          <p className="text-xs text-gray-400">
            Developer: <a href="/about" className="hover:text-gray-600 transition-colors">Rommel Andrei De Leon</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
