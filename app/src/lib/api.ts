const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function fetchApi(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Scholarships
  getScholarships: () => fetchApi('/scholarships'),

  // Universities
  getUniversities: () => fetchApi('/ph-universities'),
  searchGlobalUniversities: (country?: string, name?: string) => {
    const params = new URLSearchParams();
    if (country) params.append('country', country);
    if (name) params.append('name', name);
    return fetchApi(`/universities?${params.toString()}`);
  },

  // Careers
  getCareers: (course: string) => fetchApi(`/careers/${encodeURIComponent(course)}`),

  // Dictionary
  getDefinition: (word: string) => fetchApi(`/dictionary/${encodeURIComponent(word)}`),

  // Trivia
  getTrivia: (amount = 10, category?: string, difficulty?: string, type?: string) => {
    const params = new URLSearchParams({ amount: String(amount) });
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    if (type) params.append('type', type);
    return fetchApi(`/trivia?${params.toString()}`);
  },

  // Exchange rates
  getExchangeRates: (base = 'PHP') => fetchApi(`/exchange-rates?base=${base}`),

  // Numbers fact
  getNumberFact: (number: number | string, type: 'trivia' | 'math' | 'year' | 'date' = 'trivia') =>
    fetchApi(`/numbers/${type}/${number}`),

  // Wikipedia
  getWikiSummary: (title: string) => fetchApi(`/wiki/${encodeURIComponent(title)}`),

  // PDF Generation
  generatePdf: (title: string, content: string) =>
    fetch(`${API_BASE}/generate-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    }),

  // Word Generation
  generateWord: (title: string, content: string) =>
    fetch(`${API_BASE}/generate-word`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    }),

  // GWA PDF
  generateGwaPdf: (data: {
    studentName: string;
    university: string;
    courses: { name: string; units: number; grade: number }[];
    gwa: string;
    honors: string;
    semester: string;
  }) =>
    fetch(`${API_BASE}/gwa-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
};

// Helper to download blob
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
