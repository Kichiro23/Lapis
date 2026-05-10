import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, GripVertical, CheckCircle2, Circle, Clock, Calendar, Flag } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'inprogress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  createdAt: number
}

const COLUMNS = [
  { id: 'todo' as const, label: 'To Do', color: '#f5f2eb' },
  { id: 'inprogress' as const, label: 'In Progress', color: '#f6e33630' },
  { id: 'done' as const, label: 'Done', color: '#7cf0bd30' },
]

const PRIORITY_COLORS = {
  low: '#22c55e',
  medium: '#f5a623',
  high: '#ef4444',
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('lapis_tasks')
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Apply for DOST Scholarship', description: 'Prepare requirements and submit online', status: 'todo', priority: 'high', dueDate: '2026-08-30', createdAt: Date.now() },
      { id: '2', title: 'Study for Midterm Exam', description: 'Focus on Calculus and Physics', status: 'inprogress', priority: 'high', dueDate: '2026-09-12', createdAt: Date.now() },
      { id: '3', title: 'Update Resume', description: 'Add recent projects and skills', status: 'todo', priority: 'medium', dueDate: '2026-09-01', createdAt: Date.now() },
    ]
  })
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as Task['priority'], dueDate: '' })

  useEffect(() => {
    localStorage.setItem('lapis_tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (!newTask.title.trim()) return
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      createdAt: Date.now(),
    }
    setTasks((prev) => [...prev, task])
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' })
    setNewTaskOpen(false)
  }

  const moveTask = (id: string, status: Task['status']) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date(new Date().toDateString())
  }

  return (
    <div className="min-h-[100dvh] pt-28 pb-20 px-4 md:px-6" style={{ background: '#f5f2eb' }}>
      <div className="max-w-[1200px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>PRODUCTIVITY</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Task Manager</h1>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                Organize your academic tasks with a Kanban board.
              </p>
            </div>
            <button
              onClick={() => setNewTaskOpen(true)}
              className="pill-btn pill-btn-primary text-sm flex items-center gap-2"
            >
              <Plus size={14} /> New Task
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: tasks.length, color: '#f6e336' },
            { label: 'To Do', value: tasks.filter((t) => t.status === 'todo').length, color: '#f5a623' },
            { label: 'In Progress', value: tasks.filter((t) => t.status === 'inprogress').length, color: '#7cf0bd' },
            { label: 'Done', value: tasks.filter((t) => t.status === 'done').length, color: '#22c55e' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <p className="text-2xl font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* New Task Form */}
        <AnimatePresence>
          {newTaskOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-5 mb-6"
            >
              <h3 className="text-sm font-bold mb-3">New Task</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="text-sm px-4 py-2.5 rounded-2xl outline-none"
                  style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}
                />
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="text-sm px-4 py-2.5 rounded-2xl outline-none"
                  style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}
                />
              </div>
              <textarea
                placeholder="Description (optional)..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full text-sm px-4 py-2.5 rounded-2xl outline-none resize-none h-20 mb-3"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}
              />
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium">Priority:</span>
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setNewTask({ ...newTask, priority: p })}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${
                      newTask.priority === p ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    style={newTask.priority === p ? { background: PRIORITY_COLORS[p] } : {}}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={addTask} className="pill-btn pill-btn-primary text-xs">Add Task</button>
                <button onClick={() => setNewTaskOpen(false)} className="pill-btn pill-btn-ghost text-xs">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <div key={col.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">{col.label}</h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white">
                  {tasks.filter((t) => t.status === col.id).length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {tasks
                  .filter((t) => t.status === col.id)
                  .sort((a, b) => {
                    const prio = { high: 3, medium: 2, low: 1 }
                    return prio[b.priority] - prio[a.priority]
                  })
                  .map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      className="glass-card p-4 group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <button
                            onClick={() => moveTask(task.id, task.status === 'done' ? 'todo' : 'done')}
                            className="flex-shrink-0"
                          >
                            {task.status === 'done' ? (
                              <CheckCircle2 size={16} className="text-green-600" />
                            ) : (
                              <Circle size={16} className="text-gray-300 hover:text-gray-500 transition-colors" />
                            )}
                          </button>
                          <span className={`text-sm font-semibold truncate ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                            {task.title}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      {task.description && (
                        <p className="text-xs mb-2 pl-6" style={{ color: 'var(--text-secondary)' }}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 pl-6">
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full text-white"
                          style={{ background: PRIORITY_COLORS[task.priority] }}
                        >
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className={`text-[9px] flex items-center gap-0.5 ${isOverdue(task.dueDate) ? 'text-red-500' : 'text-gray-400'}`}>
                            <Calendar size={8} />
                            {task.dueDate}
                          </span>
                        )}
                      </div>
                      {/* Move buttons */}
                      {task.status !== 'done' && (
                        <div className="flex gap-1 mt-2 pl-6">
                          {task.status === 'todo' && (
                            <button
                              onClick={() => moveTask(task.id, 'inprogress')}
                              className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
                            >
                              Start
                            </button>
                          )}
                          {task.status === 'inprogress' && (
                            <>
                              <button
                                onClick={() => moveTask(task.id, 'todo')}
                                className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                              >
                                Back
                              </button>
                              <button
                                onClick={() => moveTask(task.id, 'done')}
                                className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                              >
                                Complete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
