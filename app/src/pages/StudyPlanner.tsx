import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Plus, Trash2, Send, BookOpen, Lightbulb, RotateCcw } from 'lucide-react'
import { api } from '../lib/api'

interface Subject {
  id: string
  name: string
  priority: 'high' | 'medium' | 'low'
}

interface StudySession {
  day: string
  duration: string
  focus: string
  resources?: string[]
}

interface StudyPlanResult {
  plan: { subject: string; sessions: StudySession[] }[]
  tips: string[]
  source: string
}

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: '', priority: 'medium' },
  ])
  const [examDate, setExamDate] = useState('')
  const [hoursPerDay, setHoursPerDay] = useState(4)
  const [usePomodoro, setUsePomodoro] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StudyPlanResult | null>(null)
  const [error, setError] = useState('')

  const addSubject = () => {
    setSubjects((prev) => [...prev, { id: Date.now().toString(), name: '', priority: 'medium' }])
  }

  const updateSubject = (id: string, field: keyof Subject, value: string) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const removeSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id))
  }

  const handleGenerate = async () => {
    const validSubjects = subjects.filter((s) => s.name.trim())
    if (validSubjects.length === 0) {
      setError('Please add at least one subject.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const data = await api.aiStudyPlan(
        validSubjects.map((s) => ({ name: s.name, priority: s.priority })),
        examDate,
        hoursPerDay,
        { pomodoro: usePomodoro }
      )
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Failed to generate study plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const priorityColors = {
    high: '#ef4444',
    medium: '#f5a623',
    low: '#22c55e',
  }

  return (
    <div className="min-h-[100dvh] pt-28 pb-20 px-4 md:px-6" style={{ background: '#f5f2eb' }}>
      <div className="max-w-[900px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>AI POWERED</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">AI Study Planner</h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Generate a personalized study schedule based on your subjects, exam dates, and daily availability.
          </p>
        </motion.div>

        {/* Input Form */}
        {!result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass-card p-5 mb-5">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <BookOpen size={14} /> Subjects
              </h3>
              <div className="flex flex-col gap-3">
                {subjects.map((subject, i) => (
                  <div key={subject.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Subject ${i + 1}`}
                      value={subject.name}
                      onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                      className="flex-1 text-sm px-4 py-2.5 rounded-2xl outline-none"
                      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}
                    />
                    <select
                      value={subject.priority}
                      onChange={(e) => updateSubject(subject.id, 'priority', e.target.value)}
                      className="text-sm px-3 py-2.5 rounded-2xl outline-none"
                      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    {subjects.length > 1 && (
                      <button
                        onClick={() => removeSubject(subject.id)}
                        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addSubject}
                className="mt-3 text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Plus size={12} /> Add Subject
              </button>
            </div>

            <div className="glass-card p-5 mb-5">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Clock size={14} /> Schedule Preferences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                    Exam Date (optional)
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-2xl outline-none"
                    style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                    Hours Per Day: {hoursPerDay}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pomodoro"
                  checked={usePomodoro}
                  onChange={(e) => setUsePomodoro(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="pomodoro" className="text-sm">Use Pomodoro technique (25 min focus + 5 min break)</label>
              </div>
            </div>

            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="pill-btn pill-btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send size={14} /> Generate Study Plan
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Your Study Plan</h2>
              <button
                onClick={() => { setResult(null); setError('') }}
                className="pill-btn pill-btn-ghost text-xs flex items-center gap-1"
              >
                <RotateCcw size={12} /> New Plan
              </button>
            </div>

            {result.plan.map((subjectPlan) => (
              <div key={subjectPlan.subject} className="glass-card p-5 mb-4">
                <h3 className="text-sm font-bold mb-3">{subjectPlan.subject}</h3>
                <div className="flex flex-col gap-2">
                  {subjectPlan.sessions.map((session, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-2xl"
                      style={{ background: '#f5f2eb' }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ background: '#f6e336' }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold">{session.day}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                          {session.duration} · {session.focus}
                        </p>
                        {session.resources && session.resources.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {session.resources.map((r) => (
                              <span key={r} className="text-[9px] px-2 py-0.5 rounded-full bg-white">{r}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Tips */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={16} style={{ color: '#f5a623' }} />
                <h3 className="text-sm font-bold">Study Tips</h3>
              </div>
              <ul className="flex flex-col gap-2">
                {result.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" style={{ background: '#f6e33630' }}>
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {result.source === 'fallback' && (
              <p className="text-xs text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
                Smart plan generated. Add GROQ_API_KEY for AI-optimized study schedules.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
