import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

interface BackButtonProps {
  label?: string
  className?: string
}

export default function BackButton({ label = 'Back', className = '' }: BackButtonProps) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors ${className}`}
    >
      <ChevronLeft size={16} />
      {label}
    </button>
  )
}
