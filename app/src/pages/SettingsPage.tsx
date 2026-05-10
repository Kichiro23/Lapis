import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  User,
  Palette,
  GraduationCap,
  Shield,
  Info,
  ChevronRight,
  Moon,
  Globe,
  Bell,
  Download,
  Trash2,
} from 'lucide-react'

const settingsSections = [
  {
    id: 'profile',
    icon: User,
    title: 'Profile',
    description: 'Name, school, course, year level',
  },
  {
    id: 'preferences',
    icon: Palette,
    title: 'Preferences',
    description: 'Theme, language, notifications',
  },
  {
    id: 'academic',
    icon: GraduationCap,
    title: 'Academic',
    description: 'Default university, grading system',
  },
  {
    id: 'privacy',
    icon: Shield,
    title: 'Privacy',
    description: 'Data export, delete account, anonymous mode',
  },
  {
    id: 'about',
    icon: Info,
    title: 'About',
    description: 'Version, credits, feedback',
  },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [language, setLanguage] = useState<'en' | 'fil'>('en')
  const [notifs, setNotifs] = useState(true)
  const [anonymous, setAnonymous] = useState(true)

  return (
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[700px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Settings size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>SETTINGS</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Customize your Lapis experience</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {settingsSections.map((section) => (
            <div key={section.id} className="mb-3">
              <button
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className="w-full glass-card p-4 flex items-center gap-3 text-left hover:translate-y-0 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#f6e33630' }}>
                  <section.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold">{section.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{section.description}</p>
                </div>
                <ChevronRight size={16} className={`transition-transform flex-shrink-0 ${activeSection === section.id ? 'rotate-90' : ''}`} style={{ color: 'var(--text-secondary)' }} />
              </button>

              {/* Expanded Content */}
              {activeSection === section.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-4 pb-4 pt-2"
                >
                  {section.id === 'profile' && (
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--text-secondary)' }}>Display Name (Optional)</label>
                        <input type="text" placeholder="Juan Dela Cruz" className="input-pill" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--text-secondary)' }}>School</label>
                        <input type="text" placeholder="University of the Philippines" className="input-pill" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--text-secondary)' }}>Course</label>
                          <input type="text" placeholder="BS Computer Science" className="input-pill" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--text-secondary)' }}>Year Level</label>
                          <select className="input-pill appearance-none cursor-pointer">
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                            <option>Graduate</option>
                          </select>
                        </div>
                      </div>
                      <button className="pill-btn pill-btn-primary text-xs w-fit mt-1">Save Changes</button>
                    </div>
                  )}

                  {section.id === 'preferences' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Moon size={14} />
                          <span className="text-sm">Theme</span>
                        </div>
                        <div className="flex gap-1 p-0.5 rounded-full bg-gray-100">
                          <button onClick={() => setTheme('light')} className={`text-[10px] font-medium px-3 py-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Light</button>
                          <button onClick={() => setTheme('dark')} className={`text-[10px] font-medium px-3 py-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Dark</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe size={14} />
                          <span className="text-sm">Language</span>
                        </div>
                        <div className="flex gap-1 p-0.5 rounded-full bg-gray-100">
                          <button onClick={() => setLanguage('en')} className={`text-[10px] font-medium px-3 py-1.5 rounded-full transition-all ${language === 'en' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>English</button>
                          <button onClick={() => setLanguage('fil')} className={`text-[10px] font-medium px-3 py-1.5 rounded-full transition-all ${language === 'fil' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Filipino</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell size={14} />
                          <span className="text-sm">Notifications</span>
                        </div>
                        <button
                          onClick={() => setNotifs(!notifs)}
                          className={`w-11 h-6 rounded-full transition-all relative ${notifs ? 'bg-[#f6e336]' : 'bg-gray-300'}`}
                        >
                          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${notifs ? 'left-[22px]' : 'left-0.5'}`} />
                        </button>
                      </div>
                    </div>
                  )}

                  {section.id === 'academic' && (
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--text-secondary)' }}>Default University</label>
                        <select className="input-pill appearance-none cursor-pointer">
                          <option>University of the Philippines</option>
                          <option>Ateneo de Manila University</option>
                          <option>De La Salle University</option>
                          <option>University of Santo Tomas</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--text-secondary)' }}>Grading System</label>
                        <select className="input-pill appearance-none cursor-pointer">
                          <option>1.00 - 5.00 (UP System)</option>
                          <option>4.00 Scale</option>
                          <option>Percentage (0-100%)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {section.id === 'privacy' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">Anonymous Mode</p>
                          <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Hide all personal data in UI</p>
                        </div>
                        <button
                          onClick={() => setAnonymous(!anonymous)}
                          className={`w-11 h-6 rounded-full transition-all relative ${anonymous ? 'bg-[#f6e336]' : 'bg-gray-300'}`}
                        >
                          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${anonymous ? 'left-[22px]' : 'left-0.5'}`} />
                        </button>
                      </div>
                      <div className="border-t pt-3" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                        <button className="flex items-center gap-2 text-sm hover:text-yellow-700 transition-colors">
                          <Download size={14} /> Export All Data (JSON/CSV)
                        </button>
                      </div>
                      <div className="border-t pt-3" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                        <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors">
                          <Trash2 size={14} /> Delete All Data
                        </button>
                      </div>
                    </div>
                  )}

                  {section.id === 'about' && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Version</span>
                        <span className="text-xs font-mono px-2 py-1 rounded-full bg-gray-100">1.0.0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Developer</span>
                        <span className="text-xs">Rommel Andrei De Leon</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email</span>
                        <span className="text-xs">rommeld216@gmail.com</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">GitHub</span>
                        <a href="#" className="text-xs hover:underline">github.com/Kichiro23</a>
                      </div>
                      <div className="mt-2 p-3 rounded-2xl text-center text-xs" style={{ background: '#f6e33620' }}>
                        <p className="font-semibold">Built with love in the Philippines</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
