import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Send, RotateCcw, Award, BookOpen, PenTool, MessageSquare, CheckCircle } from 'lucide-react'
import { api } from '../lib/api'
import BackButton from '../components/BackButton'

interface GradeResult {
  overall: number
  categories: {
    structure: number
    grammar: number
    argument: number
    vocabulary: number
  }
  feedback: string[]
  suggestions: string[]
  source: string
}

export default function EssayGrader() {
  const [essay, setEssay] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GradeResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (essay.trim().length < 50) {
      setError('Please write at least 50 characters for meaningful feedback.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const data = await api.aiEssayGrade(essay)
      setResult(data)
    } catch (e) {
      setError(e.message || 'Failed to grade essay. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#22c55e'
    if (score >= 70) return '#f6e336'
    if (score >= 60) return '#f97316'
    return '#ef4444'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Needs Work'
  }

  return (
    <div className="min-h-[100dvh] pt-28 pb-20 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[900px] mx-auto">
        <BackButton className="mb-4" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <PenTool size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>AI POWERED</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">AI Essay Grader</h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Paste your essay and get instant AI-powered feedback on structure, grammar, argument strength, and vocabulary.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <FileText size={14} /> Your Essay
            </label>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {essay.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Paste your essay here (minimum 50 characters)..."
            className="w-full h-64 p-4 rounded-2xl text-sm resize-none outline-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-yellow-400 transition-colors"
          />
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={loading || essay.trim().length < 50}
              className="pill-btn pill-btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Grading...
                </>
              ) : (
                <>
                  <Send size={14} /> Grade My Essay
                </>
              )}
            </button>
            {result && (
              <button
                onClick={() => { setResult(null); setEssay(''); setError('') }}
                className="pill-btn pill-btn-ghost text-sm flex items-center gap-2"
              >
                <RotateCcw size={14} /> New Essay
              </button>
            )}
          </div>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {/* Overall Score */}
            <div className="glass-card p-6 mb-5 text-center">
              <Award size={32} className="mx-auto mb-2" style={{ color: getScoreColor(result.overall) }} />
              <p className="text-5xl font-extrabold" style={{ color: getScoreColor(result.overall) }}>
                {Math.round(result.overall)}
              </p>
              <p className="text-lg font-semibold mt-1">{getScoreLabel(result.overall)}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {result.source === 'fallback' ? 'Smart analysis (add GROQ_API_KEY for AI grading)' : 'AI-powered grading'}
              </p>
            </div>

            {/* Category Scores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {Object.entries(result.categories).map(([cat, score]) => (
                <div key={cat} className="glass-card p-4 text-center">
                  <p className="text-2xl font-bold" style={{ color: getScoreColor(score) }}>
                    {Math.round(score)}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mt-1">{cat}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Feedback */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={16} style={{ color: '#f5a623' }} />
                  <h3 className="text-sm font-bold">Feedback</h3>
                </div>
                <ul className="flex flex-col gap-2">
                  {result.feedback.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={12} className="mt-0.5 flex-shrink-0 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={16} style={{ color: '#f5a623' }} />
                  <h3 className="text-sm font-bold">Improvement Tips</h3>
                </div>
                <ul className="flex flex-col gap-2">
                  {result.suggestions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" style={{ background: '#f6e33630' }}>
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
