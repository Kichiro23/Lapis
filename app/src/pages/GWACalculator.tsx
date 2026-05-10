import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calculator,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  Share2,
  Trophy,
  Award,
  Sparkles,
  ChevronDown,
} from 'lucide-react'
import RubikShuffleCounter from '../components/RubikShuffleCounter'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { api, downloadBlob } from '../lib/api'

interface Course {
  id: string
  name: string
  units: number
  grade: number
}

interface ScholarshipMatch {
  name: string
  amount: string
  match: number
}

const UNIVERSITIES = [
  { name: 'University of the Philippines', system: '1.00-5.00', honors: { summa: 1.20, magna: 1.45, cumLaude: 1.75 } },
  { name: 'Ateneo de Manila University', system: '4.00', honors: { first: 3.80, second: 3.60, third: 3.40 } },
  { name: 'De La Salle University', system: '4.00', honors: { first: 3.80, second: 3.60, third: 3.40 } },
  { name: 'University of Santo Tomas', system: '1.00-5.00', honors: { summa: 1.20, magna: 1.45, cumLaude: 1.75 } },
  { name: 'Polytechnic University of the Philippines', system: '1.00-5.00', honors: { summa: 1.20, magna: 1.45, cumLaude: 1.75 } },
  { name: 'Other (Custom)', system: '1.00-5.00', honors: { summa: 1.20, magna: 1.45, cumLaude: 1.75 } },
]

const SCHOLARSHIPS: ScholarshipMatch[] = [
  { name: 'DOST-SEI Merit Scholarship', amount: '₱40,000/yr', match: 98 },
  { name: 'SM Foundation Scholarship', amount: '₱30,000/yr', match: 92 },
  { name: 'CHED TDP', amount: '₱60,000/yr', match: 88 },
  { name: 'Megaworld Foundation', amount: '₱50,000/yr', match: 85 },
  { name: 'Metrobank Foundation', amount: '₱40,000/yr', match: 80 },
  { name: 'Jollibee Foundation', amount: '₱25,000/yr', match: 75 },
]

const COLORS = ['#f6e336', '#d2f754', '#7cf0bd', '#ffb347', '#ff6b6b']

export default function GWACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', units: 3, grade: 0 },
    { id: '2', name: '', units: 3, grade: 0 },
  ])
  const [selectedUni, setSelectedUni] = useState(0)
  const [calculated, setCalculated] = useState(false)
  const [shuffleTrigger, setShuffleTrigger] = useState(false)
  const [gwa, setGwa] = useState('0.0000')
  const [honors, setHonors] = useState('')
  const [gradeDist, setGradeDist] = useState<{ name: string; value: number }[]>([])

  const addCourse = useCallback(() => {
    setCourses((prev) => [...prev, { id: Date.now().toString(), name: '', units: 3, grade: 0 }])
  }, [])

  const removeCourse = useCallback((id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
    setCalculated(false)
  }, [])

  const updateCourse = useCallback((id: string, field: keyof Course, value: string | number) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
    setCalculated(false)
  }, [])

  const calculateGWA = useCallback(() => {
    const valid = courses.filter((c) => c.units > 0 && c.grade > 0)
    if (valid.length === 0) return

    const totalUnits = valid.reduce((sum, c) => sum + c.units, 0)
    const weighted = valid.reduce((sum, c) => sum + c.grade * c.units, 0)
    const result = (weighted / totalUnits).toFixed(4)

    setGwa(result)
    setShuffleTrigger(true)

    // Determine honors
    const gwaNum = parseFloat(result)
    const uni = UNIVERSITIES[selectedUni]
    const honors = (uni.honors as unknown) as Record<string, number>
    if (uni.system === '1.00-5.00') {
      if (gwaNum <= honors.summa) setHonors('Summa Cum Laude')
      else if (gwaNum <= honors.magna) setHonors('Magna Cum Laude')
      else if (gwaNum <= honors.cumLaude) setHonors('Cum Laude')
      else setHonors('Keep pushing!')
    } else {
      if (gwaNum >= honors.first) setHonors('First Honors')
      else if (gwaNum >= honors.second) setHonors('Second Honors')
      else if (gwaNum >= honors.third) setHonors('Third Honors')
      else setHonors('Keep pushing!')
    }

    // Grade distribution
    const dist = [
      { name: 'A (1.0-1.5)', value: valid.filter((c) => c.grade <= 1.5).length },
      { name: 'B (1.51-2.0)', value: valid.filter((c) => c.grade > 1.5 && c.grade <= 2.0).length },
      { name: 'C (2.01-3.0)', value: valid.filter((c) => c.grade > 2.0 && c.grade <= 3.0).length },
      { name: 'D (3.01-4.0)', value: valid.filter((c) => c.grade > 3.0 && c.grade <= 4.0).length },
      { name: 'F (4.0+)', value: valid.filter((c) => c.grade > 4.0).length },
    ].filter((d) => d.value > 0)
    setGradeDist(dist)

    setTimeout(() => setCalculated(true), 2600)
  }, [courses, selectedUni])

  const clearAll = useCallback(() => {
    setCourses([
      { id: '1', name: '', units: 3, grade: 0 },
      { id: '2', name: '', units: 3, grade: 0 },
    ])
    setCalculated(false)
    setGwa('0.0000')
    setShuffleTrigger(false)
    setHonors('')
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) calculateGWA()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [calculateGWA])

  return (
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6" style={{ background: '#f5f2eb' }}>
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Calculator size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>
              TOOLS
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">GWA Calculator</h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Track, predict, and optimize your academic performance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel - Calculator */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-5 md:p-6"
            >
              {/* University Selector */}
              <div className="mb-5">
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                  University / Grading System
                </label>
                <div className="relative">
                  <select
                    value={selectedUni}
                    onChange={(e) => setSelectedUni(Number(e.target.value))}
                    className="input-pill appearance-none pr-10 cursor-pointer"
                  >
                    {UNIVERSITIES.map((u, i) => (
                      <option key={i} value={i}>
                        {u.name} ({u.system})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
                </div>
              </div>

              {/* Course Rows */}
              <div className="flex flex-col gap-2 mb-4">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Course name"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      className="input-pill flex-1 min-w-0"
                    />
                    <input
                      type="number"
                      placeholder="Units"
                      value={course.units || ''}
                      onChange={(e) => updateCourse(course.id, 'units', Number(e.target.value))}
                      className="input-pill w-20 text-center"
                      min={1}
                      max={12}
                    />
                    <input
                      type="number"
                      placeholder="Grade"
                      value={course.grade || ''}
                      onChange={(e) => updateCourse(course.id, 'grade', Number(e.target.value))}
                      className="input-pill w-24 text-center"
                      min={1}
                      max={5}
                      step={0.01}
                    />
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={addCourse} className="pill-btn pill-btn-ghost text-xs">
                  <Plus size={14} className="mr-1" /> Add Course
                </button>
                <button onClick={calculateGWA} className="pill-btn pill-btn-primary text-xs">
                  <Calculator size={14} className="mr-1" /> Calculate GWA
                </button>
                <button onClick={clearAll} className="pill-btn text-xs text-gray-400 hover:text-gray-600">
                  <RotateCcw size={14} className="mr-1" /> Clear
                </button>
                <span className="text-[10px] text-gray-400 ml-auto hidden md:inline">Ctrl+Enter to calculate</span>
              </div>
            </motion.div>

            {/* What-If Scenario */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-5 md:p-6 mt-5"
            >
              <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                <Sparkles size={16} style={{ color: '#f5a623' }} /> What-If Scenario
              </h3>
              <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                See how a future grade would affect your GWA
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">If I get</span>
                <input
                  type="number"
                  placeholder="1.5"
                  className="input-pill w-20 text-center"
                  min={1}
                  max={5}
                  step={0.01}
                />
                <span className="text-sm whitespace-nowrap">in a</span>
                <input
                  type="number"
                  placeholder="3"
                  className="input-pill w-20 text-center"
                  min={1}
                  max={12}
                />
                <span className="text-sm whitespace-nowrap">unit course...</span>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <div className="text-center mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Your GWA
                </p>
                <RubikShuffleCounter target={gwa} trigger={shuffleTrigger} />
              </div>

              {calculated && honors && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center mb-5"
                >
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      background: honors !== 'Keep pushing!' ? '#f6e33630' : '#f5f2eb',
                      color: honors !== 'Keep pushing!' ? '#333' : 'var(--text-secondary)',
                    }}
                  >
                    <Trophy size={14} />
                    {honors}
                  </div>
                </motion.div>
              )}

              {/* Grade Distribution */}
              {calculated && gradeDist.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Grade Distribution
                  </p>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={gradeDist} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name }) => name}>
                          {gradeDist.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* Export */}
              <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <button
                  onClick={async () => {
                    const res = await api.generateGwaPdf({
                      studentName: 'Student',
                      university: UNIVERSITIES[selectedUni].name,
                      courses: courses.filter((c) => c.units > 0 && c.grade > 0),
                      gwa,
                      honors,
                      semester: new Date().toLocaleDateString(),
                    })
                    const blob = await res.blob()
                    downloadBlob(blob, 'GWA_Report.pdf')
                  }}
                  className="flex-1 pill-btn pill-btn-ghost text-xs flex items-center justify-center gap-1"
                >
                  <Download size={13} /> PDF
                </button>
                <button className="flex-1 pill-btn pill-btn-ghost text-xs flex items-center justify-center gap-1">
                  <Share2 size={13} /> Share
                </button>
              </div>
            </motion.div>

            {/* Scholarship Eligibility */}
            {calculated && parseFloat(gwa) <= 2.5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-5 mt-5"
              >
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Award size={14} style={{ color: '#f5a623' }} /> Scholarship Matches
                </h3>
                <div className="flex flex-col gap-2">
                  {SCHOLARSHIPS.slice(0, 4).map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between p-3 rounded-2xl"
                      style={{ background: '#f5f2eb' }}
                    >
                      <div>
                        <p className="text-xs font-semibold">{s.name}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{s.amount}</p>
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded-full"
                        style={{ background: '#f6e33630', color: '#333' }}
                      >
                        {s.match}% match
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
