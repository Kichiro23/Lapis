import { useEffect } from 'react'

const titles: Record<string, string> = {
  '/': 'LAPIS — All-in-One Student Command Center for Filipino Students',
  '/gwa-calculator': 'GWA Calculator Philippines | Compute Your Grade Free — Lapis',
  '/scholarships': 'Scholarships for Filipino Students 2026 | DOST, SM, CHED — Lapis',
  '/universities': 'Best Universities in Philippines | Compare Tuition & Courses — Lapis',
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
}

export function usePageTitle(pathname: string) {
  useEffect(() => {
    const title = titles[pathname] || 'LAPIS — All-in-One Student Command Center'
    document.title = title
  }, [pathname])
}
