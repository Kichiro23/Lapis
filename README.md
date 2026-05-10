# Lapis — Student Success Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs" alt="Node.js" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel" alt="Vercel" />
</p>

**Lapis** is a comprehensive, all-in-one student success platform built specifically for **Filipino students**. It combines academic tools, scholarship discovery, university research, career guidance, productivity utilities, and document generators — all powered by real-world data and public APIs.

> **Mission**: To democratize access to educational opportunities and academic tools for every Filipino student, completely free.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
  - [Academic Tools](#academic-tools)
  - [Discovery & Research](#discovery--research)
  - [Career Guidance](#career-guidance)
  - [Productivity & Utilities](#productivity--utilities)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Real Data Sources](#real-data-sources)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Developer](#developer)
- [License](#license)

---

## Live Demo

🌐 **https://lapis-2026.vercel.app**

---

## Features

### Academic Tools

#### 1. GWA Calculator
A precision-grade General Weighted Average calculator with honors prediction.

- **Multi-university support**: Pre-configured grading systems for UP (1.00-5.00), Ateneo (4.00), DLSU (4.00), UST (1.00-5.00), PUP, and custom systems
- **Honors prediction**: Automatically determines if you qualify for Cum Laude, Magna Cum Laude, or Summa Cum Laude based on your university's standards
- **Grade distribution chart**: Visual pie chart showing how your grades are distributed across ranges (A, B, C, D, F)
- **What-if scenarios**: See how a future grade would affect your overall GWA before you even take the exam
- **PDF report export**: Generate a professional GWA report PDF with your name, university, course list, and honors standing
- **Keyboard shortcuts**: Press `Ctrl+Enter` to calculate instantly
- **Scholarship matching**: If your GWA ≤ 2.5, the calculator automatically shows scholarship opportunities you're eligible for

#### 2. Study Tools
Interactive learning utilities to help you study smarter.

- **Flashcards**: Create unlimited flashcard decks with front/back cards. Study mode features a 3D flip animation and tracks your progress through the deck
- **Trivia Quiz**: Real multiple-choice trivia questions powered by the [Open Trivia Database](https://opentdb.com). Choose from 24 categories including Science, Mathematics, History, and Technology. Features instant answer checking and score tracking
- **Dictionary**: Look up English word definitions, phonetics, pronunciations, example sentences, synonyms, and antonyms — powered by the [Free Dictionary API](https://dictionaryapi.dev)

#### 3. Focus Timer (Pomodoro)
A distraction-free focus timer with dark mode aesthetics.

- **Preset modes**: Pomodoro (25 min), Short Break (5 min), Long Break (15 min), and Custom duration
- **Circular progress indicator**: Animated SVG ring that visually counts down your session
- **Session tracking**: Counts completed sessions, total focus time, and pomodoro count for the day
- **Task labeling**: Name what you're working on to stay accountable
- **Ambient background**: Subtle animated dust vignette effect for immersion

---

### Discovery & Research

#### 4. Scholarship Finder
The most comprehensive Philippine scholarship database available for free.

**Real scholarship programs included:**

| Scholarship | Type | Amount | Deadline |
|-------------|------|--------|----------|
| DOST-SEI Merit Scholarship | Government | ₱40,000/yr + full tuition | Aug 30 |
| SM Foundation College Scholarship | Private | Full tuition + monthly allowance | Mar 15 |
| CHED Tertiary Education Subsidy (TES) | Government | ₱60,000/yr | Rolling |
| Megaworld Foundation Scholarship | Private | ₱50,000/yr + full tuition | Jul 1 |
| Metrobank Foundation Scholarship | Private | ₱40,000/yr + full tuition | Apr 30 |
| Ayala Foundation Scholarship | Private | ₱40,000/yr | May 31 |
| Aboitiz Foundation Scholarship | Private | Full tuition + allowance | Jun 30 |
| Jollibee Foundation Scholarship | Private | ₱25,000/yr | Feb 28 |

**Features:**
- Smart filters by type (Government, Private, University, International)
- Course-based filtering (STEM, Business, Engineering, Education, Arts)
- Real-time search across scholarship names and descriptions
- Save/bookmark scholarships with heart toggle
- Detailed modal view with full eligibility requirements, benefits, and step-by-step application process
- Direct "Apply Now" links to official scholarship portals
- Match score indicators showing how well each scholarship fits your profile

#### 5. University Finder
Research Philippine universities with real comparison data.

**Universities in database:**

| University | Location | Type | Tuition | Students |
|------------|----------|------|---------|----------|
| UP Diliman | Quezon City | Public | Free | 24,000+ |
| Ateneo de Manila | Quezon City | Private | ₱80-100k/sem | 12,000+ |
| De La Salle University | Manila | Private | ₱70-95k/sem | 16,000+ |
| University of Santo Tomas | Manila | Private | ₱50-70k/sem | 40,000+ |
| Mapúa University | Manila | Private | ₱45-60k/sem | 15,000+ |
| University of San Carlos | Cebu City | Private | ₱30-50k/sem | 12,000+ |
| Mindanao State University | Marawi City | Public | Free-₱5k/sem | 20,000+ |
| Silliman University | Dumaguete | Private | ₱35-55k/sem | 9,000+ |
| Polytechnic University of the Philippines | Manila | Public | Free | 70,000+ |
| Central Philippine University | Iloilo City | Private | ₱30-45k/sem | 14,000+ |

**Features:**
- Filter by region (Luzon, Visayas, Mindanao) and type (Public/Private)
- Search by university name or city
- **Side-by-side comparison table**: Compare up to 3 universities across tuition, passing rate, student population, accreditation, and location
- Real accreditation data (PAASCU Level IV, ABET, AACCUP)
- Course offerings preview with "+X more" expansion

#### 6. Global University Search
Search universities worldwide via the [HipoLabs Universities API](http://universities.hipolabs.com).

- Query by country or university name
- Returns domain names and official websites
- Integrated into the homepage stats counter

---

### Career Guidance

#### 7. Career Hub
Explore career paths tied to your course of study.

**Career Explorer:**
Select your course and see real career options with Philippine salary ranges:

| Course | Sample Careers | Salary Range |
|--------|---------------|--------------|
| Computer Science | Software Engineer, Data Scientist, DevOps Engineer | ₱40k-100k/mo |
| Business Administration | Business Analyst, Marketing Manager, Operations Manager | ₱30k-80k/mo |
| Engineering | Civil Engineer, Mechanical Engineer, Electrical Engineer | ₱25k-65k/mo |
| Nursing | Registered Nurse, Nurse Supervisor, Travel Nurse | ₱25k-120k/mo |
| Psychology | HR Specialist, Clinical Psychologist, UX Researcher | ₱25k-70k/mo |
| Architecture | Junior Architect, Project Architect, Interior Designer | ₱22k-90k/mo |
| Education | Public School Teacher, College Professor, Curriculum Developer | ₱20k-70k/mo |
| Accountancy | Audit Associate, Financial Analyst, Comptroller | ₱25k-120k/mo |

**Additional Career Tools:**
- **Internship listings**: Real internship opportunities from Google Philippines, Unilever, DOST-ASTI, Canva Manila, J.P. Morgan, and Rappler
- **Entry-level jobs**: Curated job listings with salary ranges for fresh graduates
- **Resume Builder**: Template selector (Modern, Classic, Creative) — full builder coming soon
- **Interview Prep**: Categorized interview questions (General, Behavioral, Technical)

---

### Productivity & Utilities

#### 8. PDF Generator
Create professional PDF documents directly in your browser.

- Clean, formatted output with title, date, and content
- Automatic page breaks for long documents
- Footer branding: "Generated by Lapis"
- Instant download — no server upload required

#### 9. Word Document Generator
Generate `.docx` files for reports, assignments, and resumes.

- Formatted headings and body text
- Professional document structure
- Compatible with Microsoft Word, Google Docs, and LibreOffice

#### 10. Currency Converter
Real-time currency conversion for students planning to study or travel abroad.

- Powered by [ExchangeRate-API](https://www.exchangerate-api.com)
- 10 major currencies: PHP, USD, EUR, JPY, GBP, KRW, CNY, SGD, AUD, CAD
- Live rates updated daily
- No API key required

#### 11. Numbers Trivia
Get fun facts about any number — perfect for icebreakers and trivia night.

- Powered by [Numbers API](http://numbersapi.com)
- Categories: Trivia, Math, Year, Date

---

### Platform Features

#### 12. AI Study Assistant (Chat Widget)
A contextual chatbot that lives in the bottom-right corner of every page.

- Smart quick-replies for common student questions
- Context-aware responses about scholarships, universities, GWA calculation, and study tips
- Animated typing indicator
- Fully responsive mobile design

#### 13. Personalized Dashboard
Your academic command center.

- Dynamic greeting based on time of day
- Quick stats: Current GWA, available scholarships, focus time, upcoming deadlines
- Quick action tiles for instant navigation to any tool
- Recent activity timeline
- Collapsible sidebar navigation

#### 14. Authentication Modal
Optional account creation with email/password.

- Login and Signup modes
- Continue without account — all tools remain free
- Animated modal transitions

#### 15. Settings
Customize your Lapis experience.

- Profile: Name, school, course, year level
- Preferences: Light/Dark theme toggle, English/Filipino language, notification settings
- Academic: Default university and grading system
- Privacy: Anonymous mode, data export (JSON/CSV), delete all data

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite 7 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion | Page transitions & animations |
| React Router 6 | Client-side routing |
| Recharts | Data visualization (GWA charts) |
| Three.js + React Three Fiber | 3D hero background |
| GSAP + ScrollTrigger | Text reveal animations |
| shadcn/ui | Base UI component primitives |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js 20 | Runtime |
| Express 4 | API framework |
| pdf-lib | PDF generation |
| docx | Word document generation |
| CORS | Cross-origin request handling |

### External APIs
| API | Data Provided |
|-----|--------------|
| Free Dictionary API | Word definitions, phonetics, examples |
| Open Trivia Database | Trivia questions by category |
| ExchangeRate-API | Real-time currency conversion rates |
| Numbers API | Number facts and trivia |
| Wikipedia REST API | Article summaries |
| HipoLabs Universities API | Global university search |

---

## Architecture

```
Lapis/
├── app/                          # Frontend application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/               # shadcn/ui primitives (40+)
│   │   │   ├── Navbar.tsx        # Top navigation bar
│   │   │   ├── Footer.tsx        # Site footer
│   │   │   ├── ChatWidget.tsx    # AI assistant chat
│   │   │   ├── AuthModal.tsx     # Login/signup modal
│   │   │   ├── NeonCoordinateCanvas.tsx  # 3D hero scene
│   │   │   ├── SafeCanvas.tsx    # Error-boundary wrapper for 3D
│   │   │   ├── SafeDust.tsx      # Error-boundary wrapper for vignette
│   │   │   └── ErrorBoundary.tsx # Global error catcher
│   │   ├── pages/                # Route-level page components
│   │   │   ├── HomePage.tsx      # Landing page
│   │   │   ├── Dashboard.tsx     # User dashboard
│   │   │   ├── GWACalculator.tsx # GWA calculator + PDF export
│   │   │   ├── ScholarshipFinder.tsx  # Scholarship database
│   │   │   ├── UniversityFinder.tsx   # University database
│   │   │   ├── StudyTools.tsx    # Flashcards, trivia, dictionary
│   │   │   ├── StudyTimer.tsx    # Pomodoro focus timer
│   │   │   ├── CareerHub.tsx     # Careers, internships, interviews
│   │   │   ├── ConverterTools.tsx # PDF, Word, currency, dictionary
│   │   │   └── SettingsPage.tsx  # User preferences
│   │   ├── lib/
│   │   │   ├── api.ts            # Frontend API client
│   │   │   └── utils.ts          # Utility functions
│   │   ├── hooks/                # Custom React hooks
│   │   ├── App.tsx               # Root component with routing
│   │   └── main.tsx              # Application entry point
│   ├── server/                   # Express backend
│   │   ├── index.js              # API routes & document generation
│   │   └── package.json          # Backend dependencies
│   ├── index.html                # HTML entry point (SEO-optimized)
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.ts            # Vite configuration
│   ├── tailwind.config.js        # Tailwind theme customization
│   └── vercel.json               # Vercel deployment config
│
├── .github/workflows/ci.yml      # GitHub Actions CI pipeline
├── vercel.json                   # Root Vercel configuration
└── package.json                  # Root workspace scripts
```

---

## API Reference

All API endpoints are prefixed with `/api` and return JSON unless otherwise specified.

### Health Check
```
GET /api/health
Response: { "status": "ok", "timestamp": "2026-05-10T..." }
```

### Scholarships
```
GET /api/scholarships
Returns: Array of scholarship objects with name, type, amount, deadline,
         gwaReq, incomeReq, courses, requirements, benefits, process, link
```

### Universities
```
GET /api/ph-universities
Returns: Array of Philippine university objects

GET /api/universities?country=Philippines&name=Mapua
Returns: Array of global university objects from HipoLabs API
```

### Careers
```
GET /api/careers/:course
Params: Computer Science, Business Administration, Engineering, Psychology,
        Nursing, Architecture, Education, Accountancy
Returns: { careers: [{ title, salary, growth, companies }] }
```

### Dictionary
```
GET /api/dictionary/:word
Proxy: Free Dictionary API
Returns: Array of entries with phonetics, meanings, definitions, examples
```

### Trivia
```
GET /api/trivia?amount=10&category=17&difficulty=medium&type=multiple
Proxy: Open Trivia Database
Returns: { response_code: 0, results: [...] }
```

### Exchange Rates
```
GET /api/exchange-rates?base=PHP
Proxy: ExchangeRate-API
Returns: { base: "PHP", date: "2026-05-10", rates: { USD: 0.017, ... } }
```

### Numbers
```
GET /api/numbers/trivia/42
Types: trivia, math, year, date
Returns: { text: "42 is the answer to life...", number: 42, found: true }
```

### Wikipedia
```
GET /api/wiki/University_of_the_Philippines
Returns: { title, extract, thumbnail, description }
```

### Document Generation
```
POST /api/generate-pdf
Body: { title: string, content: string }
Response: application/pdf (download)

POST /api/generate-word
Body: { title: string, content: string }
Response: application/vnd.openxmlformats-officedocument.wordprocessingml.document

POST /api/gwa-pdf
Body: { studentName, university, courses[], gwa, honors, semester }
Response: application/pdf (formatted GWA report)
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 20 or higher
- [npm](https://npmjs.com/) 10 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Kichiro23/Lapis.git
cd Lapis

# Install frontend dependencies
cd app
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Development

Run the frontend and backend in separate terminals:

```bash
# Terminal 1 — Frontend (port 3000)
npm run dev

# Terminal 2 — Backend API (port 3001)
npm run server:dev
```

The frontend will be available at `http://localhost:3000` and the API at `http://localhost:3001`.

### Production Build

```bash
# Build optimized frontend assets
npm run build

# Start production server
npm start
```

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**
3. Import `Kichiro23/Lapis`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL` → `/api` (or your custom API domain)
6. Click **Deploy**

The included `vercel.json` automatically configures:
- Static asset hosting from `dist/`
- Serverless API functions from `server/index.js`
- Route rewrites for `/api/*` to the Express backend

### Manual Server Deployment

```bash
cd app
npm run build
cd server
npm install
npm start
```

Serve the `app/dist` folder with any static file server (Nginx, Apache, etc.) and proxy `/api/*` to the Node.js backend.

---

## Real Data Sources

Lapis does not use fake placeholder data. Every scholarship, university, and career statistic is sourced from real-world information:

### Philippine Scholarships
Compiled from official sources:
- [DOST-SEI Science Scholarships](https://science-scholarships.ph)
- [SM Foundation](https://www.sm-foundation.org)
- [CHED Philippines](https://ched.gov.ph)
- [Megaworld Foundation](https://www.megaworldfoundation.com)
- [Metrobank Foundation](https://www.metrobankfoundation.org)
- [Ayala Foundation](https://www.ayalafoundation.org)
- [Aboitiz Foundation](https://www.aboitiz.com)
- [Jollibee Foundation](https://www.jollibeefoundation.org)

### Philippine Universities
Data sourced from official university websites and CHED accreditation records:
- University of the Philippines System
- Ateneo de Manila University
- De La Salle University
- University of Santo Tomas
- Mapúa University
- University of San Carlos
- Mindanao State University
- Silliman University
- Polytechnic University of the Philippines
- Central Philippine University

### Career Salaries
Based on 2024-2025 Philippine job market data from JobStreet, Glassdoor, and PayScale PH.

### External APIs
- **Dictionary**: [Free Dictionary API](https://dictionaryapi.dev) — No API key required
- **Trivia**: [Open Trivia Database](https://opentdb.com) — Free, 4,000+ verified questions
- **Exchange Rates**: [ExchangeRate-API](https://www.exchangerate-api.com) — Free tier, no key required
- **Universities**: [HipoLabs Universities API](http://universities.hipolabs.com) — 9,000+ universities worldwide
- **Wikipedia**: [MediaWiki REST API](https://en.wikipedia.org/api/rest_v1) — Free, no authentication

---

## Screenshots

> *Screenshots will be added here. To generate them, visit each page of the live demo and capture at 1440×900 resolution.*

| Page | Description |
|------|-------------|
| **Home** | Hero section with 3D background, feature grid, how-it-works steps, stats, testimonials, pricing |
| **Dashboard** | Personalized sidebar layout with quick stats, actions, deadlines, and activity feed |
| **GWA Calculator** | Course input table, university selector, animated counter, pie chart, PDF export |
| **Scholarships** | Filterable grid with detail modals showing requirements and application steps |
| **Universities** | Searchable cards with compare functionality and side-by-side table |
| **Study Tools** | Flashcard editor, trivia quiz, dictionary lookup |
| **Focus Timer** | Dark-mode circular timer with session tracking |
| **Career Hub** | Tabbed interface: internships, jobs, resume builder, interview questions, career explorer |
| **Converters** | PDF generator, Word generator, dictionary, trivia, currency converter |

---

## Contributing

Contributions are welcome! Filipino students know best what Filipino students need.

### How to Contribute
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Areas We Need Help With
- 🎨 More university data (Visayas and Mindanao schools)
- 💰 Updated scholarship deadlines and amounts
- 🌐 Tagalog/Filipino language translation
- 📱 Mobile app (React Native or PWA)
- 🧪 Unit and integration tests
- 📊 More career paths and salary data

---

## Developer

**Rommel Andrei De Leon**
- 📧 rommeld216@gmail.com
- 🐙 [github.com/Kichiro23](https://github.com/Kichiro23)

Built with love in the Philippines 🇵🇭

---

## License

MIT License — Free for all students. 

```
Copyright (c) 2026 Rommel Andrei De Leon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<p align="center">
  <strong>⭐ Star this repo if it helped you!</strong><br>
  <em>Every star helps more Filipino students discover free academic tools.</em>
</p>
