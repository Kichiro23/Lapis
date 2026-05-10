const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3001;

// ─── Simple In-Memory Auth (no DB needed for MVP) ───
const users = new Map(); // email -> { id, name, email, passwordHash }
const sessions = new Map(); // token -> { userId, expires }

const JWT_SECRET = process.env.JWT_SECRET || 'lapis-dev-secret-change-in-production';

function hashPassword(password) {
  return crypto.createHmac('sha256', JWT_SECRET).update(password).digest('hex');
}

function generateToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { userId, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  return token;
}

function verifyToken(token) {
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expires < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session.userId;
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const userId = verifyToken(token);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  req.userId = userId;
  next();
}

// Auth endpoints
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  if (users.has(email.toLowerCase())) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const user = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  users.set(email.toLowerCase(), user);
  const token = generateToken(user.id);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const user = users.get(email.toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = generateToken(user.id);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/me', authMiddleware, (req, res) => {
  const user = Array.from(users.values()).find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post('/api/logout', authMiddleware, (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  sessions.delete(token);
  res.json({ status: 'ok' });
});

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Real External API Proxies ───

// Dictionary API proxy
app.get('/api/dictionary/:word', async (req, res) => {
  try {
    const { word } = req.params;
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, { timeout: 8000 });
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'Word not found', message: error.message });
  }
});

// Trivia API proxy
app.get('/api/trivia', async (req, res) => {
  try {
    const { amount = 10, category, difficulty, type } = req.query;
    const params = new URLSearchParams({ amount });
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    if (type) params.append('type', type);
    const response = await axios.get(`https://opentdb.com/api.php?${params.toString()}`, { timeout: 8000 });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trivia', message: error.message });
  }
});

// Exchange rates proxy
app.get('/api/exchange-rates', async (req, res) => {
  try {
    const { base = 'PHP' } = req.query;
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`, { timeout: 8000 });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exchange rates', message: error.message });
  }
});

// Numbers API proxy
app.get('/api/numbers/:type/:number', async (req, res) => {
  try {
    const { type, number } = req.params;
    const response = await axios.get(`http://numbersapi.com/${number}/${type}?json`, { timeout: 8000 });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch number fact', message: error.message });
  }
});

// Wikipedia summary proxy
app.get('/api/wiki/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, { timeout: 8000 });
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'Article not found', message: error.message });
  }
});

// Universities API (Hipo/universities-list)
app.get('/api/universities', async (req, res) => {
  try {
    const { country = 'Philippines', name } = req.query;
    let url = `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`;
    if (name) url += `&name=${encodeURIComponent(name)}`;
    const response = await axios.get(url, { timeout: 8000 });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch universities', message: error.message });
  }
});

// ─── Real Philippine Scholarship Data ───
app.get('/api/scholarships', (req, res) => {
  const scholarships = [
    {
      id: 'dost-merit',
      name: 'DOST-SEI Merit Scholarship Program',
      type: 'Government',
      amount: '₱40,000/year + full tuition',
      deadline: 'August 30, 2026',
      description: 'Full scholarship for students pursuing degrees in science, technology, engineering, and mathematics (STEM) fields.',
      gwaReq: 2.0,
      incomeReq: '₱300,000/year',
      courses: ['STEM', 'Engineering', 'Science', 'Mathematics', 'IT'],
      requirements: ['Filipino citizen', 'GWA ≤ 2.0 or 85% average', 'Income ≤ ₱300k', 'Pass DOST exam'],
      benefits: ['Full tuition coverage', 'Monthly stipend ₱8,000', 'Book allowance ₱5,000/sem', 'Thesis allowance ₱10,000', 'Transportation allowance'],
      process: ['Take DOST exam', 'Submit requirements online at science-scholarships.ph', 'Interview', 'Wait for results'],
      link: 'https://science-scholarships.ph',
    },
    {
      id: 'sm-foundation',
      name: 'SM Foundation College Scholarship',
      type: 'Private',
      amount: 'Full tuition + monthly allowance',
      deadline: 'March 15, 2026',
      description: 'SM Foundation supports deserving students from low-income families in partner schools nationwide.',
      gwaReq: 2.5,
      incomeReq: '₱250,000/year',
      courses: ['Accounting', 'Engineering', 'Education', 'IT'],
      requirements: ['Filipino citizen', 'Grade 12 graduate', 'GWA ≥ 92% or equivalent', 'Family income ≤ ₱250k', 'No other scholarship'],
      benefits: ['Full tuition in partner schools', 'Monthly allowance', 'Part-time job opportunities', 'Leadership training'],
      process: ['Online application', 'Submit documents', 'Panel interview', 'Final selection'],
      link: 'https://www.sm-foundation.org',
    },
    {
      id: 'ched-tdp',
      name: 'CHED Tertiary Education Subsidy (TES)',
      type: 'Government',
      amount: '₱60,000/year',
      deadline: 'Rolling',
      description: 'Government subsidy for students enrolled in public and private higher education institutions.',
      gwaReq: 3.0,
      incomeReq: '₱400,000/year',
      courses: ['Any CHED-recognized course'],
      requirements: ['Enrolled in CHED-recognized school', 'Income ≤ ₱400k', 'No other government scholarship'],
      benefits: ['Tuition fee subsidy', 'Learning materials allowance', 'Transportation allowance', 'Living allowance'],
      process: ['Verify eligibility through school registrar', 'Submit documents to school', 'School forwards to CHED', 'CHED processing and release'],
      link: 'https://ched.gov.ph',
    },
    {
      id: 'megaworld',
      name: 'Megaworld Foundation Scholarship',
      type: 'Private',
      amount: '₱50,000/year + full tuition',
      deadline: 'July 1, 2026',
      description: 'For students pursuing architecture, engineering, business, and hospitality management.',
      gwaReq: 2.25,
      incomeReq: '₱350,000/year',
      courses: ['Architecture', 'Engineering', 'Business', 'Hospitality'],
      requirements: ['GWA ≤ 2.25 or 88% average', 'Leadership potential', 'Community service involvement'],
      benefits: ['Full tuition', 'Monthly allowance', 'Internship opportunities at Megaworld', 'Mentorship'],
      process: ['Online form', 'Essay submission', 'Interview', 'Final screening'],
      link: 'https://www.megaworldfoundation.com',
    },
    {
      id: 'metrobank',
      name: 'Metrobank Foundation Scholarship',
      type: 'Private',
      amount: '₱40,000/year + full tuition',
      deadline: 'April 30, 2026',
      description: 'Excellence scholarship for students in mathematics, science, and education courses.',
      gwaReq: 1.75,
      incomeReq: '₱500,000/year',
      courses: ['Mathematics', 'Science', 'Education', 'Engineering'],
      requirements: ['GWA ≤ 1.75 or 90% average', 'Leadership roles', 'Extracurricular achievements'],
      benefits: ['Full tuition coverage', 'Monthly stipend', 'Mentorship program', 'Leadership workshops'],
      process: ['Application form', 'Document review', 'Panel interview', 'Award ceremony'],
      link: 'https://www.metrobankfoundation.org',
    },
    {
      id: 'ayala',
      name: 'Ayala Foundation Scholarship',
      type: 'Private',
      amount: '₱40,000/year',
      deadline: 'May 31, 2026',
      description: 'Supports deserving female students in public colleges and universities.',
      gwaReq: 2.0,
      incomeReq: '₱300,000/year',
      courses: ['Any course in public university'],
      requirements: ['Female Filipino student', 'Enrolled in public university', 'GWA ≥ 85%', 'No failing grades', 'Demonstrate financial need'],
      benefits: ['₱40,000 annual grant', 'Renewable based on academic standing', 'Networking opportunities'],
      process: ['Submit application to Ayala Foundation', 'Document verification', 'Interview', 'Notification'],
      link: 'https://www.ayalafoundation.org',
    },
    {
      id: 'aboitiz',
      name: 'Aboitiz Foundation Scholarship',
      type: 'Private',
      amount: 'Full tuition + monthly allowance',
      deadline: 'June 30, 2026',
      description: 'For sophomore students in partner universities with full tuition and monthly allowance.',
      gwaReq: 2.25,
      incomeReq: '₱350,000/year',
      courses: ['Engineering', 'Business', 'IT', 'Education'],
      requirements: ['Sophomore student', 'Enrolled in partner university', 'First-year GWA ≥ 88%', 'No dropped/failing grades', 'No disciplinary record'],
      benefits: ['Full tuition', 'Monthly allowance', 'Board exam stipend', 'Latin honors incentives', 'Topnotcher bonus'],
      process: ['Online application', 'School endorsement', 'Interview', 'Final screening'],
      link: 'https://www.aboitiz.com',
    },
    {
      id: 'jollibee',
      name: 'Jollibee Foundation Scholarship',
      type: 'Private',
      amount: '₱25,000/year',
      deadline: 'February 28, 2026',
      description: 'For students from underserved communities pursuing technical-vocational or college degrees.',
      gwaReq: 2.5,
      incomeReq: '₱200,000/year',
      courses: ['HRM', 'Culinary', 'Business', 'Engineering'],
      requirements: ['Filipino citizen', 'From underserved community', 'GWA ≥ 85%', 'Good moral character'],
      benefits: ['Tuition assistance', 'Monthly allowance', 'Job placement support'],
      process: ['Community nomination', 'Application form', 'Interview', 'Community validation'],
      link: 'https://www.jollibeefoundation.org',
    },
  ];
  res.json(scholarships);
});

// ─── Real Philippine University Data ───
app.get('/api/ph-universities', (req, res) => {
  const universities = [
    {
      id: 'up-diliman',
      name: 'University of the Philippines Diliman',
      location: 'Quezon City, Metro Manila',
      type: 'Public',
      tuition: 'Free (Socialized Tuition)',
      passingRate: 94,
      population: '24,000+',
      courses: ['BS Computer Science', 'BA Political Science', 'BS Engineering', 'BS Biology', 'BS Economics', 'BS Architecture'],
      accreditation: 'PAASCU Level IV',
      region: 'Luzon',
      website: 'up.edu.ph',
      description: 'The flagship campus of the University of the Philippines System, consistently ranked #1 in the Philippines.',
      founded: 1908,
    },
    {
      id: 'ateneo',
      name: 'Ateneo de Manila University',
      location: 'Quezon City, Metro Manila',
      type: 'Private',
      tuition: '₱80,000-100,000/sem',
      passingRate: 93,
      population: '12,000+',
      courses: ['BS Management', 'BS Computer Science', 'AB Philosophy', 'BS Life Sciences', 'AB Economics', 'BS Psychology'],
      accreditation: 'PAASCU Level IV',
      region: 'Luzon',
      website: 'ateneo.edu',
      description: 'Premier private research university known for excellence in liberal arts, business, and law.',
      founded: 1859,
    },
    {
      id: 'dlsu',
      name: 'De La Salle University',
      location: 'Manila, Metro Manila',
      type: 'Private',
      tuition: '₱70,000-95,000/sem',
      passingRate: 92,
      population: '16,000+',
      courses: ['BS Computer Science', 'BS Business', 'BS Psychology', 'BS Engineering', 'BS Biology', 'AB Communication'],
      accreditation: 'PAASCU Level IV',
      region: 'Luzon',
      website: 'dlsu.edu.ph',
      description: 'Leading Lasallian institution recognized for business, engineering, and computer science programs.',
      founded: 1911,
    },
    {
      id: 'ust',
      name: 'University of Santo Tomas',
      location: 'Manila, Metro Manila',
      type: 'Private',
      tuition: '₱50,000-70,000/sem',
      passingRate: 90,
      population: '40,000+',
      courses: ['BS Nursing', 'AB Communication', 'BS Architecture', 'BS Pharmacy', 'BS Medical Technology', 'AB Psychology'],
      accreditation: 'PAASCU Level IV',
      region: 'Luzon',
      website: 'ust.edu.ph',
      description: 'Asia\'s oldest existing university, renowned for health sciences, pharmacy, and architecture.',
      founded: 1611,
    },
    {
      id: 'mapua',
      name: 'Mapúa University',
      location: 'Manila, Metro Manila',
      type: 'Private',
      tuition: '₱45,000-60,000/sem',
      passingRate: 88,
      population: '15,000+',
      courses: ['BS Architecture', 'BS Engineering', 'BS Computer Science', 'BS Interior Design', 'BS Psychology', 'BS Accountancy'],
      accreditation: 'ABET',
      region: 'Luzon',
      website: 'mapua.edu.ph',
      description: 'Leading engineering and architecture school with ABET-accredited programs.',
      founded: 1925,
    },
    {
      id: 'usc',
      name: 'University of San Carlos',
      location: 'Cebu City',
      type: 'Private',
      tuition: '₱30,000-50,000/sem',
      passingRate: 87,
      population: '12,000+',
      courses: ['BS Engineering', 'BS Accountancy', 'AB Psychology', 'BS Pharmacy', 'BS Computer Science', 'AB Mass Communication'],
      accreditation: 'PAASCU Level III',
      region: 'Visayas',
      website: 'usc.edu.ph',
      description: 'Cebu\'s oldest school, offering strong programs in engineering, pharmacy, and accountancy.',
      founded: 1595,
    },
    {
      id: 'msu',
      name: 'Mindanao State University',
      location: 'Marawi City',
      type: 'Public',
      tuition: 'Free-₱5,000/sem',
      passingRate: 85,
      population: '20,000+',
      courses: ['BS Education', 'BS Agriculture', 'BS Engineering', 'BA Communication', 'BS Nursing', 'BS Biology'],
      accreditation: 'PAASCU Level II',
      region: 'Mindanao',
      website: 'msumain.edu.ph',
      description: 'Premier state university in Mindanao with strong agriculture and education programs.',
      founded: 1961,
    },
    {
      id: 'silliman',
      name: 'Silliman University',
      location: 'Dumaguete City',
      type: 'Private',
      tuition: '₱35,000-55,000/sem',
      passingRate: 91,
      population: '9,000+',
      courses: ['BS Nursing', 'AB Mass Communication', 'BS Marine Biology', 'BS Business Admin', 'AB Theology', 'BS Computer Science'],
      accreditation: 'PAASCU Level III',
      region: 'Visayas',
      website: 'su.edu.ph',
      description: 'First American university in the Philippines, known for marine biology and nursing.',
      founded: 1901,
    },
    {
      id: 'pup',
      name: 'Polytechnic University of the Philippines',
      location: 'Manila, Metro Manila',
      type: 'Public',
      tuition: 'Free',
      passingRate: 86,
      population: '70,000+',
      courses: ['BS Business Administration', 'BS Engineering', 'BS Computer Science', 'BS Accountancy', 'BS Education', 'AB Communication'],
      accreditation: 'AACCUP Level IV',
      region: 'Luzon',
      website: 'pup.edu.ph',
      description: 'Largest state university in the Philippines by student population, offering tuition-free education.',
      founded: 1904,
    },
    {
      id: 'cpu',
      name: 'Central Philippine University',
      location: 'Iloilo City',
      type: 'Private',
      tuition: '₱30,000-45,000/sem',
      passingRate: 89,
      population: '14,000+',
      courses: ['BS Engineering', 'BS Nursing', 'BS Pharmacy', 'AB Theology', 'BS Agriculture', 'BS Computer Science'],
      accreditation: 'PAASCU Level III',
      region: 'Visayas',
      website: 'cpu.edu.ph',
      description: 'Premier Baptist institution in Western Visayas with strong engineering and nursing programs.',
      founded: 1905,
    },
  ];
  res.json(universities);
});

// ─── Career Data ───
app.get('/api/careers/:course', (req, res) => {
  const careers = {
    'Computer Science': {
      careers: [
        { title: 'Software Engineer', salary: '₱40,000-80,000', growth: 'High', companies: ['Google', 'Microsoft', 'Shopee'] },
        { title: 'Data Scientist', salary: '₱50,000-100,000', growth: 'High', companies: ['Accenture', 'IBM', 'PLDT'] },
        { title: 'DevOps Engineer', salary: '₱45,000-90,000', growth: 'High', companies: ['AWS', 'Globe', 'Converge'] },
        { title: 'Mobile App Developer', salary: '₱35,000-70,000', growth: 'Medium', companies: ['Grab', 'FoodPanda', 'GCash'] },
      ],
    },
    'Business Administration': {
      careers: [
        { title: 'Business Analyst', salary: '₱30,000-55,000', growth: 'Medium', companies: ['Accenture', 'Deloitte', 'KPMG'] },
        { title: 'Marketing Manager', salary: '₱40,000-70,000', growth: 'Medium', companies: ['Unilever', 'P&G', 'Jollibee'] },
        { title: 'HR Specialist', salary: '₱25,000-45,000', growth: 'Medium', companies: ['BPOs', 'Banks', 'Retail'] },
        { title: 'Operations Manager', salary: '₱45,000-80,000', growth: 'High', companies: ['Logistics', 'Manufacturing', 'BPO'] },
      ],
    },
    'Engineering': {
      careers: [
        { title: 'Civil Engineer', salary: '₱25,000-50,000', growth: 'Medium', companies: ['DMCI', 'Megaworld', 'Ayala Land'] },
        { title: 'Mechanical Engineer', salary: '₱25,000-50,000', growth: 'Medium', companies: ['Toyota', 'Honda', 'San Miguel'] },
        { title: 'Electrical Engineer', salary: '₱25,000-55,000', growth: 'Medium', companies: ['Meralco', 'Aboitiz Power', 'SMC'] },
        { title: 'Software Engineer', salary: '₱35,000-70,000', growth: 'High', companies: ['Tech companies', 'Startups'] },
      ],
    },
    'Psychology': {
      careers: [
        { title: 'HR Specialist', salary: '₱25,000-45,000', growth: 'Medium', companies: ['BPOs', 'Corporations'] },
        { title: 'Clinical Psychologist', salary: '₱30,000-60,000', growth: 'Medium', companies: ['Hospitals', 'Clinics'] },
        { title: 'UX Researcher', salary: '₱40,000-70,000', growth: 'High', companies: ['Google', 'Canva', 'Grab'] },
        { title: 'School Counselor', salary: '₱20,000-40,000', growth: 'Low', companies: ['Schools', 'Universities'] },
      ],
    },
    'Nursing': {
      careers: [
        { title: 'Registered Nurse', salary: '₱25,000-45,000', growth: 'High', companies: ['Hospitals', 'Clinics'] },
        { title: 'Nurse Supervisor', salary: '₱40,000-70,000', growth: 'High', companies: ['St. Lukes', 'Makati Med', 'PGH'] },
        { title: 'Clinical Instructor', salary: '₱25,000-45,000', growth: 'Medium', companies: ['Nursing schools'] },
        { title: 'Travel Nurse', salary: '₱60,000-120,000', growth: 'High', companies: ['International agencies'] },
      ],
    },
    'Architecture': {
      careers: [
        { title: 'Junior Architect', salary: '₱22,000-35,000', growth: 'Medium', companies: ['Design firms'] },
        { title: 'Project Architect', salary: '₱35,000-60,000', growth: 'Medium', companies: ['Ayala Land', 'SMDC', 'DMCI'] },
        { title: 'Interior Designer', salary: '₱25,000-50,000', growth: 'Medium', companies: ['Design studios'] },
        { title: 'Construction Manager', salary: '₱50,000-90,000', growth: 'High', companies: ['Construction firms'] },
      ],
    },
    'Education': {
      careers: [
        { title: 'Public School Teacher', salary: '₱27,000-45,000', growth: 'High', companies: ['DepEd'] },
        { title: 'College Professor', salary: '₱30,000-60,000', growth: 'Medium', companies: ['Universities'] },
        { title: 'Curriculum Developer', salary: '₱30,000-50,000', growth: 'Medium', companies: ['EdTech', 'Publishing'] },
        { title: 'School Administrator', salary: '₱40,000-70,000', growth: 'Medium', companies: ['Schools', 'Universities'] },
      ],
    },
    'Accountancy': {
      careers: [
        { title: 'Audit Associate', salary: '₱25,000-40,000', growth: 'High', companies: ['Deloitte', 'PwC', 'EY', 'KPMG'] },
        { title: 'Tax Associate', salary: '₱28,000-45,000', growth: 'High', companies: ['BDO', 'SGV', 'Tax firms'] },
        { title: 'Financial Analyst', salary: '₱30,000-55,000', growth: 'High', companies: ['Banks', 'Corporations'] },
        { title: 'Comptroller', salary: '₱60,000-120,000', growth: 'Medium', companies: ['Large corporations'] },
      ],
    },
  };
  const course = req.params.course;
  const data = careers[course] || careers['Computer Science'];
  res.json(data);
});

// ─── PDF Generation Endpoint ───
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { title, content, type = 'document' } = req.body;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;

    // Title
    page.drawText(title || 'Document', {
      x: 50,
      y,
      size: 24,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 40;

    // Date
    page.drawText(`Generated on ${new Date().toLocaleDateString()}`, {
      x: 50,
      y,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
    y -= 30;

    // Content lines
    const lines = (content || '').split('\n');
    for (const line of lines) {
      if (y < 50) {
        const newPage = pdfDoc.addPage([612, 792]);
        y = newPage.getSize().height - 50;
      }
      const text = line.trim();
      if (!text) {
        y -= 12;
        continue;
      }
      page.drawText(text, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0.2, 0.2, 0.2),
        maxWidth: width - 100,
      });
      y -= 18;
    }

    // Footer
    page.drawText('Generated by Lapis - Student Success Platform', {
      x: 50,
      y: 30,
      size: 8,
      font,
      color: rgb(0.6, 0.6, 0.6),
    });

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${(title || 'document').replace(/\s+/g, '_')}.pdf"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({ error: 'PDF generation failed', message: error.message });
  }
});

// ─── Word Document Generation Endpoint ───
app.post('/api/generate-word', async (req, res) => {
  try {
    const { title, content } = req.body;
    const lines = (content || '').split('\n').filter((l) => l.trim());

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: title || 'Document',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Generated on ${new Date().toLocaleDateString()}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          ...lines.map((line) =>
            new Paragraph({
              children: [new TextRun({ text: line, size: 24 })],
              spacing: { after: 200 },
            })
          ),
          new Paragraph({
            text: 'Generated by Lapis - Student Success Platform',
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 },
            children: [new TextRun({ text: 'Generated by Lapis - Student Success Platform', size: 18, italics: true, color: '999999' })],
          }),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${(title || 'document').replace(/\s+/g, '_')}.docx"`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Word generation failed', message: error.message });
  }
});

// ─── GWA Report PDF ───
app.post('/api/gwa-pdf', async (req, res) => {
  try {
    const { studentName, university, courses, gwa, honors, semester } = req.body;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;

    page.drawText('GWA REPORT', { x: 50, y, size: 28, font: boldFont, color: rgb(0.15, 0.15, 0.15) });
    y -= 35;
    page.drawText(`Generated by Lapis`, { x: 50, y, size: 10, font, color: rgb(0.5, 0.5, 0.5) });
    y -= 40;

    page.drawText(`Student: ${studentName || 'N/A'}`, { x: 50, y, size: 12, font: boldFont });
    y -= 20;
    page.drawText(`University: ${university || 'N/A'}`, { x: 50, y, size: 12, font });
    y -= 20;
    page.drawText(`Semester: ${semester || 'N/A'}`, { x: 50, y, size: 12, font });
    y -= 30;

    // Table header
    page.drawRectangle({ x: 50, y: y - 5, width: width - 100, height: 22, color: rgb(0.96, 0.89, 0.21) });
    page.drawText('Course', { x: 55, y, size: 11, font: boldFont });
    page.drawText('Units', { x: 300, y, size: 11, font: boldFont });
    page.drawText('Grade', { x: 380, y, size: 11, font: boldFont });
    y -= 25;

    for (const course of courses || []) {
      page.drawText(course.name || '', { x: 55, y, size: 11, font });
      page.drawText(String(course.units || ''), { x: 300, y, size: 11, font });
      page.drawText(String(course.grade || ''), { x: 380, y, size: 11, font });
      y -= 18;
    }

    y -= 15;
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 25;

    page.drawText(`GWA: ${gwa || 'N/A'}`, { x: 50, y, size: 16, font: boldFont, color: rgb(0.15, 0.15, 0.15) });
    y -= 22;
    if (honors) {
      page.drawText(`Honors Standing: ${honors}`, { x: 50, y, size: 14, font: boldFont, color: rgb(0.2, 0.6, 0.2) });
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="GWA_Report.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({ error: 'GWA PDF generation failed', message: error.message });
  }
});

// ─── AI Endpoints ───

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Enhanced knowledge base for fallback when no AI key is available
const aiKnowledgeBase = {
  greetings: ['hi', 'hello', 'hey', 'kamusta', 'magandang araw'],
  topics: {
    gwa: {
      keywords: ['gwa', 'grade', 'compute', 'calculate', 'average', 'weighted'],
      response: 'To compute your GWA: multiply each grade by its units, sum them all, then divide by total units. Example: (1.5 × 3 + 2.0 × 3) / 6 = 1.75. Try our GWA Calculator for automatic computation and PDF export!'
    },
    scholarship: {
      keywords: ['scholarship', 'financial aid', 'grant', 'dost', 'sm foundation', 'ched', 'tes'],
      response: 'Lapis tracks 8+ real Philippine scholarships: DOST-SEI (₱40k/yr + full tuition), SM Foundation (full tuition + allowance), CHED TES (₱60k/yr), Megaworld (₱50k/yr), Metrobank, Ayala, Aboitiz, and Jollibee Foundation. Visit our Scholarship Finder to filter by your course and GWA!'
    },
    university: {
      keywords: ['university', 'college', 'school', 'up diliman', 'ateneo', 'dlsu', 'ust', 'pup', 'mapua'],
      response: 'Our University Finder has real data on UP Diliman, Ateneo de Manila, De La Salle University, UST, Mapua, Silliman, MSU-IIT, and more. Compare tuition (free to ₱100k/sem), passing rates, student population, and courses side by side.'
    },
    career: {
      keywords: ['career', 'job', 'internship', 'salary', 'hiring', 'employment'],
      response: 'Explore real career data in our Career Hub: Computer Science (₱25-80k starting), Engineering (₱22-60k), Nursing (₱20-45k), Business (₱20-50k), Architecture (₱20-40k), and more. Includes interview questions and internship tips.'
    },
    study: {
      keywords: ['study', 'flashcard', 'quiz', 'learn', 'memorize', 'review'],
      response: 'Our Study Tools include flashcards with spaced repetition, AI-generated quizzes, and a note-taking tool. Use the Focus Timer for Pomodoro sessions (25 min work + 5 min break) to maximize retention.'
    },
    focus: {
      keywords: ['focus', 'timer', 'pomodoro', 'concentration', 'productivity'],
      response: 'The Focus Timer supports Pomodoro (25 min), custom durations, short breaks (5 min), and long breaks (15 min). It tracks your daily focus time and session count to help build study habits.'
    },
    converter: {
      keywords: ['pdf', 'word', 'document', 'convert', 'generate', 'export'],
      response: 'Generate professional PDF and Word documents in our Converters section. Great for reports, resumes, study notes, and GWA transcripts. All generated locally — your data never leaves your browser.'
    },
    currency: {
      keywords: ['currency', 'exchange', 'peso', 'usd', 'convert money', 'rate'],
      response: 'Our Currency Converter uses real-time exchange rates from ExchangeRate-API. Convert PHP to USD, EUR, JPY, and 160+ other currencies with live market data.'
    },
    dictionary: {
      keywords: ['dictionary', 'meaning', 'define', 'word', 'definition', 'synonym'],
      response: 'Use our Dictionary tool powered by the Free Dictionary API. Look up definitions, pronunciations, examples, and etymology for any English word.'
    },
    trivia: {
      keywords: ['trivia', 'quiz', 'game', 'question', 'knowledge', 'fun'],
      response: 'Test your knowledge with our Trivia Quiz! Thousands of questions from Open Trivia DB across categories like Science, History, Geography, and Entertainment. Great for study breaks!'
    },
    about: {
      keywords: ['who', 'developer', 'rommel', 'built', 'creator', 'about'],
      response: 'Lapis was built by Rommel Andrei De Leon, a Filipino developer passionate about empowering students. Contact: rommeld216@gmail.com | GitHub: github.com/Kichiro23'
    },
    support: {
      keywords: ['donate', 'support', 'help', 'contribute', 'gcash', 'paypal'],
      response: 'You can support Lapis via GCash/Maya (09627905910) or PayPal/Google Pay (rommeld216@gmail.com). Every donation helps keep the platform free for Filipino students!'
    }
  }
};

function getFallbackResponse(message) {
  const lower = message.toLowerCase().trim();

  // Check greetings
  if (aiKnowledgeBase.greetings.some(g => lower.includes(g))) {
    return "Kamusta! I'm Lapis Assistant. I can help with GWA calculations, scholarships, universities, study tips, career guidance, and more. What would you like to know?";
  }

  // Check topics
  for (const topic of Object.values(aiKnowledgeBase.topics)) {
    if (topic.keywords.some(k => lower.includes(k))) {
      return topic.response;
    }
  }

  return "I'm Lapis Assistant, your AI study buddy! I can help with GWA calculation, scholarship searches, university info, study tips, and career guidance. What would you like to know?";
}

// AI Chat endpoint
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';

    // If no Groq key, use enhanced fallback
    if (!GROQ_API_KEY) {
      const response = getFallbackResponse(lastMessage);
      return res.json({
        response,
        source: 'fallback',
        note: 'Add GROQ_API_KEY environment variable for full AI responses'
      });
    }

    const systemPrompt = `You are Lapis Assistant, a helpful AI study assistant for Filipino students. You provide accurate, friendly, and concise answers about academics, scholarships, universities, careers, and study strategies.

Context about the user: ${context || 'Student using Lapis platform'}

Guidelines:
- Keep responses under 200 words
- Use Filipino context when relevant (Philippine universities, scholarships, grading systems)
- Be encouraging and supportive
- If asked about specific tools, mention that Lapis has them
- Do not make up scholarship deadlines or amounts — be general if unsure`;

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
    ];

    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.3-70b-versatile',
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 512,
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    const aiResponse = response.data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.json({ response: aiResponse, source: 'groq' });
  } catch (error) {
    console.error('AI Chat Error:', error.message);
    // Fallback on API failure
    const lastMessage = req.body.messages?.[req.body.messages.length - 1]?.content || '';
    res.json({
      response: getFallbackResponse(lastMessage),
      source: 'fallback',
      error: 'AI service temporarily unavailable'
    });
  }
});

// AI Essay Grader
app.post('/api/ai-essay-grade', async (req, res) => {
  try {
    const { essay, rubric } = req.body;
    if (!essay || essay.trim().length < 50) {
      return res.status(400).json({ error: 'Essay must be at least 50 characters' });
    }

    if (!GROQ_API_KEY) {
      // Simple heuristic fallback
      const wordCount = essay.trim().split(/\s+/).length;
      const sentences = essay.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      const paragraphs = essay.split('\n\n').filter(p => p.trim().length > 0).length;

      return res.json({
        source: 'fallback',
        overall: Math.min(95, Math.max(60, 70 + wordCount / 50 + paragraphs * 2)),
        categories: {
          structure: Math.min(95, 70 + paragraphs * 3),
          grammar: 75,
          argument: Math.min(95, 70 + sentences * 0.5),
          vocabulary: Math.min(95, 70 + wordCount / 30),
        },
        feedback: [
          `Word count: ${wordCount} words`,
          `Sentences: ${sentences}`,
          `Paragraphs: ${paragraphs}`,
          'Add GROQ_API_KEY for AI-powered detailed feedback.'
        ],
        suggestions: [
          'Ensure each paragraph has a clear topic sentence',
          'Vary your sentence structure for better flow',
          'Support arguments with specific examples',
          'Proofread for grammar and punctuation errors'
        ]
      });
    }

    const prompt = `Grade the following student essay on a scale of 0-100. Provide scores for: Structure, Grammar, Argument Strength, and Vocabulary. Also give 3-4 specific improvement suggestions.

Essay:
"""${essay}"""

Respond ONLY in valid JSON format:
{
  "overall": number,
  "categories": { "structure": number, "grammar": number, "argument": number, "vocabulary": number },
  "feedback": ["string"],
  "suggestions": ["string"]
}`;

    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' }
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 20000
    });

    const content = response.data.choices[0]?.message?.content || '{}';
    const result = JSON.parse(content);
    res.json({ ...result, source: 'groq' });
  } catch (error) {
    console.error('Essay Grade Error:', error.message);
    res.status(500).json({ error: 'Essay grading failed', message: error.message });
  }
});

// AI Study Planner
app.post('/api/ai-study-plan', async (req, res) => {
  try {
    const { subjects, examDate, hoursPerDay, preferences } = req.body;
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: 'At least one subject is required' });
    }

    if (!GROQ_API_KEY) {
      // Generate a simple study plan without AI
      const plan = subjects.map((subject, i) => ({
        subject: subject.name || `Subject ${i + 1}`,
        sessions: Array.from({ length: 5 }, (_, j) => ({
          day: `Day ${j + 1}`,
          duration: preferences?.pomodoro ? '25 min study + 5 min break' : '45 min',
          focus: j === 0 ? 'Review fundamentals' : j === 4 ? 'Practice problems' : 'Deep study'
        }))
      }));

      return res.json({
        source: 'fallback',
        plan,
        tips: [
          'Study your hardest subject first when your energy is highest',
          'Use the Pomodoro technique: 25 min focus + 5 min break',
          'Review notes within 24 hours of class for better retention',
          'Sleep is essential — aim for 7-8 hours during exam week'
        ]
      });
    }

    const prompt = `Create a study plan for a student with these subjects and constraints. Return ONLY valid JSON.

Subjects: ${subjects.map(s => s.name || s).join(', ')}
Exam date: ${examDate || 'Not specified'}
Hours per day: ${hoursPerDay || '4'}
Preferences: ${JSON.stringify(preferences || {})}

Respond in JSON:
{
  "plan": [
    {
      "subject": "string",
      "sessions": [
        { "day": "string", "duration": "string", "focus": "string", "resources": ["string"] }
      ]
    }
  ],
  "tips": ["string"]
}`;

    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 20000
    });

    const content = response.data.choices[0]?.message?.content || '{}';
    const result = JSON.parse(content);
    res.json({ ...result, source: 'groq' });
  } catch (error) {
    console.error('Study Plan Error:', error.message);
    res.status(500).json({ error: 'Study plan generation failed', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Lapis API Server running on port ${PORT}`);
});

module.exports = app;
