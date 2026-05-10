import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Layers,
  Wand2,
  BookOpen,
  ArrowRight,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  ChevronLeft,
  Loader2,
  Search,
  PenTool,
  Calendar,
} from 'lucide-react'
import { api } from '../lib/api'
import { decodeHtml } from '../lib/utils'
import BackButton from '../components/BackButton'

interface Flashcard {
  id: string
  front: string
  back: string
}

const tools = [
  {
    id: 'flashcards',
    icon: Layers,
    title: 'Flashcards',
    description: 'Create, share, and study with spaced repetition.',
    color: '#f6e336',
  },
  {
    id: 'aiquiz',
    icon: Wand2,
    title: 'Trivia Quiz',
    description: 'Test your knowledge with real trivia questions from Open Trivia DB.',
    color: '#7cf0bd',
  },
  {
    id: 'dictionary',
    icon: BookOpen,
    title: 'Dictionary',
    description: 'Look up definitions, pronunciations, and examples.',
    color: '#d2f754',
  },
]

const aiTools = [
  {
    icon: PenTool,
    title: 'AI Essay Grader',
    description: 'Get instant AI feedback on your essays — structure, grammar, argument, and vocabulary.',
    color: '#f6e336',
    href: '/essay-grader',
  },
  {
    icon: Calendar,
    title: 'AI Study Planner',
    description: 'Generate a personalized study schedule based on your subjects and exam dates.',
    color: '#7cf0bd',
    href: '/study-planner',
  },
]

export default function StudyTools() {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: '1', front: 'What is the powerhouse of the cell?', back: 'Mitochondria' },
    { id: '2', front: 'Solve: d/dx (x^2)', back: '2x' },
  ])
  const [studyMode, setStudyMode] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [showBack, setShowBack] = useState(false)

  const addFlashcard = () => {
    setFlashcards((prev) => [...prev, { id: Date.now().toString(), front: '', back: '' }])
  }

  const updateCard = (id: string, field: 'front' | 'back', value: string) => {
    setFlashcards((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const deleteCard = (id: string) => {
    setFlashcards((prev) => prev.filter((c) => c.id !== id))
  }

  if (activeTool === 'flashcards') {
    return (
      <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-[700px] mx-auto">
          <button onClick={() => setActiveTool(null)} className="flex items-center gap-1 text-sm mb-4 hover:text-yellow-700 transition-colors">
            <ChevronLeft size={16} /> Back to Tools
          </button>

          {!studyMode ? (
            <>
              <h2 className="text-2xl font-bold mb-1">Flashcards</h2>
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Create and study your flashcard decks</p>

              <div className="flex flex-col gap-3 mb-5">
                {flashcards.map((card) => (
                  <div key={card.id} className="glass-card p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Front" value={card.front} onChange={(e) => updateCard(card.id, 'front', e.target.value)} className="input-pill text-xs" />
                      <input type="text" placeholder="Back" value={card.back} onChange={(e) => updateCard(card.id, 'back', e.target.value)} className="input-pill text-xs" />
                    </div>
                    <button onClick={() => deleteCard(card.id)} className="mt-2 text-[10px] text-red-500 hover:text-red-700 flex items-center gap-1">
                      <Trash2 size={10} /> Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={addFlashcard} className="pill-btn pill-btn-ghost text-xs"><Plus size={14} className="mr-1" /> Add Card</button>
                {flashcards.length > 0 && (
                  <button onClick={() => { setStudyMode(true); setCurrentCard(0); setShowBack(false) }} className="pill-btn pill-btn-primary text-xs">
                    <Play size={14} className="mr-1" /> Study Now
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Card {currentCard + 1} of {flashcards.length}</p>
                <button onClick={() => setStudyMode(false)} className="pill-btn pill-btn-ghost text-xs"><RotateCcw size={13} className="mr-1" /> Exit</button>
              </div>

              <div
                className="glass-card p-10 min-h-[300px] flex items-center justify-center cursor-pointer text-center"
                onClick={() => setShowBack(!showBack)}
              >
                <motion.div
                  key={showBack ? 'back' : 'front'}
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-lg font-medium">{showBack ? flashcards[currentCard].back : flashcards[currentCard].front}</p>
                  <p className="text-[10px] mt-3" style={{ color: 'var(--text-secondary)' }}>
                    {showBack ? 'Answer' : 'Tap to reveal answer'}
                  </p>
                </motion.div>
              </div>

              <div className="flex justify-between mt-5">
                <button
                  onClick={() => { setCurrentCard((p) => Math.max(0, p - 1)); setShowBack(false) }}
                  disabled={currentCard === 0}
                  className="pill-btn pill-btn-ghost text-xs disabled:opacity-40"
                >Previous</button>
                <button
                  onClick={() => {
                    if (currentCard < flashcards.length - 1) { setCurrentCard((p) => p + 1); setShowBack(false) }
                    else setStudyMode(false)
                  }}
                  className="pill-btn pill-btn-primary text-xs"
                >{currentCard < flashcards.length - 1 ? 'Next' : 'Finish'}</button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  if (activeTool === 'aiquiz') {
    return <TriviaView onBack={() => setActiveTool(null)} />
  }

  if (activeTool === 'dictionary') {
    return <DictionaryView onBack={() => setActiveTool(null)} />
  }

  return (
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1100px] mx-auto">
        <BackButton className="mb-4" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>STUDY</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Study Smarter</h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>AI-powered tools to help you learn faster</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 cursor-pointer group"
              onClick={() => setActiveTool(tool.id)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${tool.color}30` }}>
                  <tool.icon size={22} style={{ color: '#333' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-yellow-700 transition-colors">{tool.title}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{tool.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all">
                    Open Tool <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Tools */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 size={16} style={{ color: '#f5a623' }} />
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#f5a623' }}>AI Powered Tools</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiTools.map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <Link
                  to={tool.href}
                  className="glass-card p-6 block group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${tool.color}30` }}>
                      <tool.icon size={22} style={{ color: '#333' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1 group-hover:text-yellow-700 transition-colors">{tool.title}</h3>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{tool.description}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all">
                        Open Tool <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trivia Preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-8 mt-6 text-center">
          <Wand2 size={28} className="mx-auto mb-3" style={{ color: '#f5a623' }} />
          <h3 className="text-lg font-bold mb-2">Trivia Quiz</h3>
          <p className="text-sm mb-4 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Test your knowledge with real trivia questions from the Open Trivia Database. Choose from multiple categories and difficulty levels.
          </p>
          <button onClick={() => setActiveTool('aiquiz')} className="pill-btn pill-btn-primary text-xs">Start Quiz</button>
        </motion.div>
      </div>
    </div>
  )
}

function TriviaView({ onBack }: { onBack: () => void }) {
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
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[700px] mx-auto">
        <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4 hover:text-yellow-700 transition-colors">
          <ChevronLeft size={16} /> Back to Tools
        </button>
        <h2 className="text-2xl font-bold mb-1">Trivia Quiz</h2>
        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Powered by Open Trivia Database</p>
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
                {allAnswers.map((ans: string) => {
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
            <p className="text-sm text-gray-500">
              {correctCount === questions.length ? 'Perfect score!' : correctCount >= questions.length / 2 ? 'Good job!' : 'Keep practicing!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function DictionaryView({ onBack }: { onBack: () => void }) {
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
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[700px] mx-auto">
        <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4 hover:text-yellow-700 transition-colors">
          <ChevronLeft size={16} /> Back to Tools
        </button>
        <h2 className="text-2xl font-bold mb-1">Dictionary</h2>
        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Powered by Free Dictionary API</p>
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
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Search
          </button>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h3 className="text-xl font-bold mb-1">{result.word}</h3>
            {result.phonetic && <p className="text-sm text-gray-500 mb-3">{result.phonetic}</p>}
            {result.meanings?.map((m: any, i: number) => (
              <div key={i} className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-600 mb-1">{m.partOfSpeech}</p>
                {m.definitions?.slice(0, 3).map((d: any, j: number) => (
                  <div key={j} className="mb-2">
                    <p className="text-sm">{j + 1}. {d.definition}</p>
                    {d.example && <p className="text-xs text-gray-500 italic mt-0.5">"{d.example}"</p>}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
