import { useEffect } from 'react'

const titles: Record<string, string> = {
  '/': 'LAPIS — All-in-One Student Command Center',
  '/gwa-calculator': 'GWA Calculator | Compute Your Grade — Lapis',
  '/scholarships': 'Scholarship Finder | Discover Funding for Your Studies — Lapis',
  '/universities': 'University Finder | Compare Schools Worldwide — Lapis',
  '/study': 'Study Tools | Flashcards, Quizzes & AI Learning — Lapis',
  '/focus': 'Focus Timer | Pomodoro & Productivity Tracker — Lapis',
  '/career': 'Career Hub | Jobs, Internships & Salary Guide — Lapis',
  '/dashboard': 'Dashboard | Track Your Academic Journey — Lapis',
  '/settings': 'Settings | Customize Your Lapis Experience',
  '/converters': 'PDF & Word Generator | Free Document Tools — Lapis',
  '/subscribe': 'Subscribe | Lapis Pro Plans for Students',
  '/support': 'Support Us | Help Keep Lapis Free for Students',
  '/about': 'About | Meet the Developer Behind Lapis',
  '/essay-grader': 'AI Essay Grader | Get Instant Writing Feedback — Lapis',
  '/study-planner': 'AI Study Planner | Generate Your Schedule — Lapis',
  '/tasks': 'Task Manager | Kanban Board for Students — Lapis',
  '/grades': 'Grade Tracker | Monitor Your Academic Progress — Lapis',
  '/resources': 'Resource Hub | Free Learning Resources — Lapis',
  '/resume': 'Resume Builder | Create Your CV — Lapis',
  '/humanizer': 'AI Humanizer | Make Text Sound Natural — Lapis',
  '/ai-detector': 'AI Detector | Analyze Text Authenticity — Lapis',
  '/corrector': 'Auto Corrector | Fix Grammar & Clarity — Lapis',
  '/tools': 'Tools Directory | All Student Tools in One Place — Lapis',
}

export function usePageTitle(pathname: string) {
  useEffect(() => {
    const title = titles[pathname] || 'LAPIS — All-in-One Student Command Center'
    document.title = title
  }, [pathname])
}
