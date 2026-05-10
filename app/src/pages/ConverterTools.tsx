import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, FileSpreadsheet, Download, Loader2, ArrowLeft, Type, BookOpen } from 'lucide-react'
import { api, downloadBlob } from '../lib/api'
import { decodeHtml } from '../lib/utils'
import BackButton from '../components/BackButton'

interface ConverterCardProps {
  icon: React.ElementType
  title: string
  description: string
  color: string
  onClick: () => void
}

function ConverterCard({ icon: Icon, title, description, color, onClick }: ConverterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}30` }}>
          <Icon size={22} style={{ color: '#333' }} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1 group-hover:text-yellow-700 transition-colors">{title}</h3>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{description}</p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all">
            Open Tool <ArrowLeft size={12} className="rotate-180" />
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function PdfGenerator() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    if (!title.trim() || !content.trim()) return
    setError(null)
    setLoading(true)
    try {
      const res = await api.generatePdf(title, content)
      const blob = await res.blob()
      downloadBlob(blob, `${title.replace(/\s+/g, '_')}.pdf`)
    } catch (e) {
      setError('Failed to generate PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="text-2xl font-bold mb-1">PDF Generator</h2>
      <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Create and download PDF documents instantly</p>
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-pill"
        />
        <textarea
          placeholder="Enter your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input-pill min-h-[200px] resize-y"
          style={{ borderRadius: 20, padding: 16 }}
        />
        <button
          onClick={generate}
          disabled={loading || !title.trim() || !content.trim()}
          className="pill-btn pill-btn-primary w-fit flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Generate PDF
        </button>
      </div>
    </div>
  )
}

function WordGenerator() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    if (!title.trim() || !content.trim()) return
    setError(null)
    setLoading(true)
    try {
      const res = await api.generateWord(title, content)
      const blob = await res.blob()
      downloadBlob(blob, `${title.replace(/\s+/g, '_')}.docx`)
    } catch (e) {
      setError('Failed to generate Word document')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="text-2xl font-bold mb-1">Word Document Generator</h2>
      <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Create and download DOCX documents instantly</p>
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-pill"
        />
        <textarea
          placeholder="Enter your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input-pill min-h-[200px] resize-y"
          style={{ borderRadius: 20, padding: 16 }}
        />
        <button
          onClick={generate}
          disabled={loading || !title.trim() || !content.trim()}
          className="pill-btn pill-btn-primary w-fit flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Generate Word
        </button>
      </div>
    </div>
  )
}

function DictionaryTool() {
  const [word, setWord] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async () => {
    if (!word.trim()) return
    setError(null)
    setLoading(true)
    try {
      const data = await api.getDefinition(word.trim().toLowerCase())
      setResult(data[0])
    } catch (e) {
      setResult(null)
      setError('Word not found')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="text-2xl font-bold mb-1">Dictionary</h2>
      <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Look up definitions, pronunciations, and examples</p>
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Enter a word..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          className="input-pill flex-1"
        />
        <button onClick={search} disabled={loading} className="pill-btn pill-btn-primary flex items-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <BookOpen size={14} />}
          Search
        </button>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="text-xl font-bold mb-1">{result.word}</h3>
          {result.phonetic && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{result.phonetic}</p>}
          {result.meanings?.map((m: any, i: number) => (
            <div key={i} className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400 mb-1">{m.partOfSpeech}</p>
              {m.definitions?.slice(0, 3).map((d: any, j: number) => (
                <div key={j} className="mb-2">
                  <p className="text-sm dark:text-gray-200">{j + 1}. {d.definition}</p>
                  {d.example && <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-0.5">"{d.example}"</p>}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function TriviaTool() {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await api.getTrivia(5)
      setQuestions(data.results || [])
      setAnswers({})
      setShowResults(false)
    } catch (e) {
      setError('Failed to load trivia')
    } finally {
      setLoading(false)
    }
  }

  const selectAnswer = (qIndex: number, answer: string) => {
    if (showResults) return
    setAnswers((prev) => ({ ...prev, [qIndex]: answer }))
  }

  const correctCount = questions.filter((q, i) => answers[i] === q.correct_answer).length

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="text-2xl font-bold mb-1">Trivia Quiz</h2>
      <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Test your knowledge with real trivia questions</p>
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <button onClick={load} disabled={loading} className="pill-btn pill-btn-primary mb-5 flex items-center gap-2 disabled:opacity-50">
        {loading ? <Loader2 size={14} className="animate-spin" /> : 'Load New Questions'}
      </button>

      {questions.map((q, i) => {
        const allAnswers = [q.correct_answer, ...q.incorrect_answers].sort()
        return (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5 mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-yellow-600 mb-2">{q.category}</p>
            <p className="text-sm font-medium mb-3">{i + 1}. {decodeHtml(q.question)}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allAnswers.map((ans) => {
                const isSelected = answers[i] === ans
                const isCorrect = showResults && ans === q.correct_answer
                const isWrong = showResults && isSelected && ans !== q.correct_answer
                return (
                  <button
                    key={ans}
                    onClick={() => selectAnswer(i, ans)}
                    className={`text-xs font-medium px-3 py-2 rounded-xl text-left transition-all ${
                      isCorrect ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700' :
                      isWrong ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700' :
                      isSelected ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700' :
                      'bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 dark:text-gray-300'
                    }`}
                    {decodeHtml(ans)}
                  />
                )
              })}
            </div>
          </motion.div>
        )
      })}

      {questions.length > 0 && !showResults && (
        <button onClick={() => setShowResults(true)} className="pill-btn pill-btn-primary w-full mt-2">
          Check Answers
        </button>
      )}

      {showResults && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5 text-center mt-3">
          <p className="text-lg font-bold">{correctCount} / {questions.length} Correct</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {correctCount === questions.length ? 'Perfect score!' : correctCount >= questions.length / 2 ? 'Good job!' : 'Keep practicing!'}
          </p>
        </motion.div>
      )}
    </div>
  )
}

function CurrencyConverter() {
  const [amount, setAmount] = useState(1)
  const [from, setFrom] = useState('PHP')
  const [to, setTo] = useState('USD')
  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRates = async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await api.getExchangeRates(from)
      setRates(data.rates || {})
    } catch (e) {
      setError('Failed to load exchange rates')
    } finally {
      setLoading(false)
    }
  }

  const converted = rates[to] ? (amount * rates[to]).toFixed(2) : '---'
  const popular = ['PHP', 'USD', 'EUR', 'JPY', 'GBP', 'KRW', 'CNY', 'SGD', 'AUD', 'CAD']

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="text-2xl font-bold mb-1">Currency Converter</h2>
      <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Real-time exchange rates powered by exchangerate-api.com</p>
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="input-pill text-center"
            min={0}
          />
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="input-pill appearance-none cursor-pointer">
            {popular.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="self-center text-sm font-bold">to</span>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="input-pill appearance-none cursor-pointer">
            {popular.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={loadRates} disabled={loading} className="pill-btn pill-btn-primary w-full mb-4 flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 size={14} className="animate-spin" /> : 'Get Rate'}
        </button>
        {rates[to] && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-4 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20">
            <p className="text-2xl font-extrabold dark:text-yellow-300">{converted} {to}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">1 {from} = {rates[to]} {to}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

const tools = [
  { id: 'pdf', icon: FileText, title: 'PDF Generator', description: 'Create professional PDF documents from text.', color: '#f6e336' },
  { id: 'word', icon: FileSpreadsheet, title: 'Word Generator', description: 'Generate DOCX documents instantly.', color: '#d2f754' },
  { id: 'dictionary', icon: BookOpen, title: 'Dictionary', description: 'Look up word definitions and examples.', color: '#7cf0bd' },
  { id: 'trivia', icon: Type, title: 'Trivia Quiz', description: 'Test your knowledge with real trivia questions.', color: '#f6e336' },
  { id: 'currency', icon: FileSpreadsheet, title: 'Currency Converter', description: 'Convert currencies with real-time exchange rates.', color: '#d2f754' },
]

export default function ConverterTools() {
  const [activeTool, setActiveTool] = useState<string | null>(null)

  if (activeTool === 'pdf') return (
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <PdfGenerator />
    </div>
  )
  if (activeTool === 'word') return (
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <WordGenerator />
    </div>
  )
  if (activeTool === 'dictionary') return (
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <DictionaryTool />
    </div>
  )
  if (activeTool === 'trivia') return (
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <TriviaTool />
    </div>
  )
  if (activeTool === 'currency') return (
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <CurrencyConverter />
    </div>
  )

  return (
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1100px] mx-auto">
        <BackButton className="mb-4" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>TOOLS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Converters & Utilities</h1>
          <p className="text-base dark:text-gray-400" style={{ color: 'var(--text-secondary)' }}>PDF, Word, Dictionary, Trivia, and Currency tools</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool, i) => (
            <ConverterCard key={tool.id} {...tool} onClick={() => setActiveTool(tool.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
