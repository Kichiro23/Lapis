import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, TrendingUp, Award, Download, BookOpen } from 'lucide-react'
import { api, downloadBlob } from '../lib/api'

interface Semester {
  id: string
  name: string
  courses: { name: string; units: number; grade: number }[]
}

export default function GradeTracker() {
  const [semesters, setSemesters] = useState<Semester[]>(() => {
    const saved = localStorage.getItem('lapis_grades')
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: '1st Semester 2025-2026',
        courses: [
          { name: 'Mathematics 101', units: 3, grade: 1.5 },
          { name: 'Physics 101', units: 4, grade: 1.75 },
          { name: 'English 101', units: 3, grade: 1.25 },
        ],
      },
    ]
  })
  const [newSemesterName, setNewSemesterName] = useState('')
  const [showAddSemester, setShowAddSemester] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('lapis_grades', JSON.stringify(semesters))
  }, [semesters])

  const addSemester = () => {
    if (!newSemesterName.trim()) return
    setSemesters((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newSemesterName, courses: [] },
    ])
    setNewSemesterName('')
    setShowAddSemester(false)
  }

  const addCourse = (semId: string) => {
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === semId
          ? { ...s, courses: [...s.courses, { name: '', units: 3, grade: 3.0 }] }
          : s
      )
    )
  }

  const updateCourse = (semId: string, idx: number, field: keyof Semester['courses'][0], value: string | number) => {
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === semId
          ? {
              ...s,
              courses: s.courses.map((c, i) =>
                i === idx ? { ...c, [field]: field === 'name' ? value : Number(value) } : c
              ),
            }
          : s
      )
    )
  }

  const removeCourse = (semId: string, idx: number) => {
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === semId ? { ...s, courses: s.courses.filter((_, i) => i !== idx) } : s
      )
    )
  }

  const removeSemester = (semId: string) => {
    setSemesters((prev) => prev.filter((s) => s.id !== semId))
  }

  const computeGWA = (courses: Semester['courses']) => {
    if (courses.length === 0) return 0
    const total = courses.reduce((sum, c) => sum + c.grade * c.units, 0)
    const units = courses.reduce((sum, c) => sum + c.units, 0)
    return units > 0 ? total / units : 0
  }

  const getHonors = (gwa: number) => {
    if (gwa <= 1.2) return 'Summa Cum Laude'
    if (gwa <= 1.45) return 'Magna Cum Laude'
    if (gwa <= 1.75) return 'Cum Laude'
    return ''
  }

  const overallGWA = computeGWA(semesters.flatMap((s) => s.courses))

  const exportPdf = async (sem: Semester) => {
    setError(null)
    const gwa = computeGWA(sem.courses)
    const honors = getHonors(gwa)
    try {
      const res = await api.generateGwaPdf({
        studentName: 'Student',
        university: '',
        semester: sem.name,
        courses: sem.courses,
        gwa: gwa.toFixed(2),
        honors,
      })
      const blob = await res.blob()
      downloadBlob(blob, `GWA_${sem.name.replace(/\s+/g, '_')}.pdf`)
    } catch (e) {
      setError('PDF export failed. Please try again.')
    }
  }

  return (
    <div className="min-h-[100dvh] pt-28 pb-20 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1000px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>TRACKING</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Grade Tracker</h1>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                Track your grades across semesters and monitor your academic progress.
              </p>
            </div>
            <button
              onClick={() => setShowAddSemester(true)}
              className="pill-btn pill-btn-primary text-sm flex items-center gap-2"
            >
              <Plus size={14} /> Add Semester
            </button>
          </div>
        </motion.div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {/* Overall Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Overall GWA', value: overallGWA > 0 ? overallGWA.toFixed(2) : '—', color: '#f6e336' },
            { label: 'Total Courses', value: semesters.reduce((sum, s) => sum + s.courses.length, 0), color: '#7cf0bd' },
            { label: 'Total Units', value: semesters.reduce((sum, s) => sum + s.courses.reduce((u, c) => u + c.units, 0), 0), color: '#d2f754' },
            { label: 'Standing', value: getHonors(overallGWA) || '—', color: '#f5a623' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <p className="text-xl font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Add Semester */}
        {showAddSemester && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mb-6">
            <h3 className="text-sm font-bold mb-3">Add New Semester</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., 2nd Semester 2025-2026"
                value={newSemesterName}
                onChange={(e) => setNewSemesterName(e.target.value)}
                className="flex-1 text-sm px-4 py-2.5 rounded-2xl outline-none"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}
              />
              <button onClick={addSemester} className="pill-btn pill-btn-primary text-xs">Add</button>
              <button onClick={() => setShowAddSemester(false)} className="pill-btn pill-btn-ghost text-xs">Cancel</button>
            </div>
          </motion.div>
        )}

        {/* Semesters */}
        <div className="flex flex-col gap-5">
          {semesters.map((sem) => {
            const gwa = computeGWA(sem.courses)
            const honors = getHonors(gwa)
            return (
              <motion.div
                key={sem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <BookOpen size={16} style={{ color: '#f5a623' }} />
                    <h3 className="text-base font-bold">{sem.name}</h3>
                    {honors && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">
                        <Award size={10} className="inline mr-0.5" />{honors}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">GWA: {gwa > 0 ? gwa.toFixed(2) : '—'}</span>
                    <button
                      onClick={() => exportPdf(sem)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                      title="Export PDF"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => removeSemester(sem.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Course Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                        <th className="text-left py-2 pr-4 font-semibold text-xs">Course</th>
                        <th className="text-center py-2 px-3 font-semibold text-xs w-20">Units</th>
                        <th className="text-center py-2 px-3 font-semibold text-xs w-20">Grade</th>
                        <th className="text-center py-2 pl-3 font-semibold text-xs w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sem.courses.map((course, idx) => (
                        <tr key={idx} className="border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                          <td className="py-2 pr-4">
                            <input
                              type="text"
                              value={course.name}
                              onChange={(e) => updateCourse(sem.id, idx, 'name', e.target.value)}
                              placeholder="Course name"
                              className="w-full text-sm px-2 py-1 rounded-lg outline-none bg-transparent"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={course.units}
                              onChange={(e) => updateCourse(sem.id, idx, 'units', e.target.value)}
                              min={1}
                              max={10}
                              className="w-full text-sm text-center px-2 py-1 rounded-lg outline-none bg-transparent"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={course.grade}
                              onChange={(e) => updateCourse(sem.id, idx, 'grade', e.target.value)}
                              min={1}
                              max={5}
                              step={0.01}
                              className={`w-full text-sm text-center px-2 py-1 rounded-lg outline-none bg-transparent font-semibold ${
                                course.grade <= 1.5 ? 'text-green-600' : course.grade <= 2.0 ? 'text-yellow-600' : 'text-red-500'
                              }`}
                            />
                          </td>
                          <td className="py-2 pl-3">
                            <button
                              onClick={() => removeCourse(sem.id, idx)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => addCourse(sem.id)}
                  className="mt-3 text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Plus size={12} /> Add Course
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
