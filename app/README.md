# Lapis - Student Success Platform

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

**Lapis** is an all-in-one student success platform built for Filipino students. It provides real-world tools for academic planning, scholarship discovery, university research, career guidance, and productivity — all powered by real APIs and data.

---

## Features

### Academic Tools
- **GWA Calculator** — Calculate your General Weighted Average with honors prediction, grade distribution charts, and PDF report export
- **Study Tools** — Flashcards with study mode, mind maps, and AI quiz generator
- **Focus Timer** — Pomodoro timer with session tracking and analytics

### Discovery & Research
- **Scholarship Finder** — Real Philippine scholarship data from DOST, SM Foundation, CHED, Megaworld, Metrobank, and more with smart filtering
- **University Finder** — Real Philippine university database with comparison tables, tuition info, and accreditation data
- **Career Hub** — Career explorer with real salary data, internships, jobs, resume builder, and interview prep

### Utilities
- **PDF Generator** — Create professional PDF documents from text
- **Word Document Generator** — Generate DOCX files instantly
- **Dictionary** — Look up definitions, pronunciations, and examples via Free Dictionary API
- **Trivia Quiz** — Test your knowledge with real questions from Open Trivia Database
- **Currency Converter** — Real-time exchange rates via ExchangeRate-API

### Dashboard
- Personalized dashboard with quick actions, upcoming deadlines, and recent activity
- Sidebar navigation with collapsible menu

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Three.js (R3F) |
| Backend | Node.js, Express, CORS |
| PDF/Word | pdf-lib, docx |
| APIs | Dictionary API, Open Trivia DB, ExchangeRate-API, Wikipedia REST, Numbers API, Universities API |

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/Kichiro23/Lapis.git
cd Lapis/app

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Start the development server (frontend only)
npm run dev

# Start the API server (in another terminal)
npm run server:dev
```

The frontend runs on `http://localhost:3000` and the backend API on `http://localhost:3001`.

### Build for Production

```bash
# Build frontend
npm run build

# Start production server
npm start
```

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/scholarships` | Real Philippine scholarship data |
| `GET /api/ph-universities` | Real Philippine university data |
| `GET /api/careers/:course` | Career paths with salaries |
| `GET /api/dictionary/:word` | Word definitions (Free Dictionary API) |
| `GET /api/trivia` | Trivia questions (Open Trivia DB) |
| `GET /api/exchange-rates` | Currency exchange rates |
| `GET /api/numbers/:type/:number` | Number facts |
| `GET /api/wiki/:title` | Wikipedia summaries |
| `GET /api/universities` | Global university search |
| `POST /api/generate-pdf` | Generate PDF document |
| `POST /api/generate-word` | Generate Word document |
| `POST /api/gwa-pdf` | Generate GWA report PDF |

---

## Project Structure

```
app/
├── public/                  # Static assets
├── server/                  # Express backend
│   ├── index.js             # API routes & document generation
│   └── package.json
├── src/
│   ├── components/          # UI components (Navbar, Footer, ChatWidget, etc.)
│   ├── components/ui/       # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── utils.ts         # Utility functions
│   │   └── api.ts           # Frontend API client
│   ├── pages/               # Route pages
│   │   ├── HomePage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── GWACalculator.tsx
│   │   ├── ScholarshipFinder.tsx
│   │   ├── UniversityFinder.tsx
│   │   ├── StudyTools.tsx
│   │   ├── StudyTimer.tsx
│   │   ├── CareerHub.tsx
│   │   ├── ConverterTools.tsx
│   │   └── SettingsPage.tsx
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Real Data Sources

- **Scholarships** — Data compiled from official sources: DOST-SEI, SM Foundation, CHED, Megaworld Foundation, Metrobank Foundation, Ayala Foundation, Aboitiz Foundation, Jollibee Foundation
- **Universities** — Data from Philippine universities including UP, Ateneo, DLSU, UST, Mapua, USC, MSU, Silliman, PUP, CPU
- **Exchange Rates** — [ExchangeRate-API](https://www.exchangerate-api.com)
- **Dictionary** — [Free Dictionary API](https://dictionaryapi.dev)
- **Trivia** — [Open Trivia Database](https://opentdb.com)
- **Wikipedia** — [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1)
- **Universities (Global)** — [HipoLabs Universities API](http://universities.hipolabs.com)

---

## Deployment

### Vercel
1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-api.vercel.app/api`
6. Deploy!

### Backend Deployment
The backend is located in `app/server/` and can be deployed as a separate Vercel serverless function or on any Node.js hosting platform.

---

## Developer

**Rommel Andrei De Leon**  
Email: rommeld216@gmail.com  
GitHub: [@Kichiro23](https://github.com/Kichiro23)

---

## License

MIT License — Free for all Filipino students. Built with love in the Philippines.

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve Lapis for students everywhere.
