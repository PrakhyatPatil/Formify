# Formify — Hinglish to Official Document Generator

> **Hackathon:** AI for Impact 2025 · Acropolis Institute of Technology & Research, Indore  
> **Theme:** PS-03 — AI for Indian Multilingual Users  
> **Status:** Built & Deployed ✅

---

## 🎯 Problem Statement

Millions of Indian college students — especially first-generation learners from MP, UP, and rural areas — communicate naturally in **Hinglish (Hindi + English code-mixed)** but are locked out of campus systems that demand formal English.

**Core pain:** A student who can say *"mera hostel ka pani nahi aa rha 3 din se"* cannot convert that into a formal English complaint — so the issue is never resolved.

---

## 💡 Solution

Formify is a **voice-to-formal-letter AI web app** that accepts Hinglish speech or text and generates structured, professionally formatted, priority-coded complaint letters — ready to download as PDF or print — in under 3 seconds.

### Key Workflow
```
Voice/Text → Speech-to-Text → Gemini AI NLU → Formal Letter Draft → PDF Export
```

---

## 🖥️ Pages

| Page | Route | Description |
|---|---|---|
| **Landing** | `/` | Hero section, feature showcase, pipeline demo |
| **Write Complaint** | `/generate` | Textarea + mic, category dropdown, priority selector, quick templates |
| **Result** | `/result` | Generated letter preview, copy/print/download PDF |
| **Dashboard** | `/dashboard` | All past complaints with search and priority filter |
| **About** | `/about` | 3-step pipeline, tech stack, stats |
| **Profile** | `/login` | Student ID configuration for document signing |

---

## 🛠️ Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 19 + Vite + Vanilla CSS | Glassmorphism dark UI, HSL custom color spaces |
| Voice Input | Web Speech API (`webkitSpeechRecognition`) | Browser-native, no recording delays |
| Backend | Express.js (TypeScript) + Vite Middleware | REST API, CORS, AI pipeline |
| Primary AI | **Gemini 2.5 Flash** | Hinglish NLU, classification, letter drafting |
| PDF Generation | PDFKit | High-res PDFs with visual headers + priority-colored tags |
| State Management | React Context + useReducer | Client-side complaint CRUD |
| Icons | Lucide React | Consistent icon set |
| Notifications | react-hot-toast | Real-time feedback |

---

## 🤖 AI Integration — Gemini 2.5 Flash

**Why Gemini:**
- Native Hinglish comprehension — no pre-processing required
- 1M token context — handles complex inputs
- ~1–2s latency — suitable for live demos
- Structured JSON output via response schema

### Prompt Architecture

**Prompt 1 — Complaint Classifier + Letter Drafter:** Takes raw Hinglish text with category/priority hints, classifies into departments (Hostel, IT, Academic, Security, Mess, Admin), assigns priority (HIGH/MEDIUM/LOW), and generates a complete formal English complaint letter body.

**Prompt 2 — PDF Letter Formatter:** Reformats the letter into a clean A4 document with proper headers, authority mapping, subject lines, and professional closing.

---

## 📁 Folder Structure

```
formify/
├── server.ts              ← Express backend + Gemini AI + PDF generation
├── src/
│   ├── App.tsx             ← Router + layout
│   ├── main.tsx            ← Entry point
│   ├── index.css           ← Complete Vanilla CSS design system
│   ├── pages/
│   │   ├── Landing.tsx     ← Landing page
│   │   ├── Home.tsx        ← Write complaint form + mic
│   │   ├── Result.tsx      ← Generated letter + download
│   │   ├── Dashboard.tsx   ← Complaint history + search
│   │   ├── About.tsx       ← Stack + features
│   │   └── Login.tsx       ← Student profile setup
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ComplaintCard.tsx
│   │   ├── LetterPreview.tsx
│   │   ├── MicButton.tsx
│   │   ├── PriorityBadge.tsx
│   │   └── ExampleChip.tsx
│   ├── context/
│   │   └── ComplaintContext.tsx
│   └── services/
│       └── api.ts
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- Google AI Studio account → `GEMINI_API_KEY` (free)

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/formify.git
cd formify

# 2. Install dependencies
npm install

# 3. Set your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`

> **Note:** The app works without a Gemini API key using a built-in fallback that generates structural letters based on keyword matching. Add your API key for full AI-powered generation.

---

## 🎥 Demo Script (3 minutes)

| Time | What to show |
|---|---|
| 0:00–0:30 | Open landing page. "This is Formify." Show the pipeline showcase. |
| 0:30–1:00 | Click Write. Tap mic, speak: *"Sar mera hostel ka AC nahi chal raha"* → show transcript |
| 1:00–1:45 | Hit **Generate**. Show the letter — title, priority badge HIGH, full formal letter |
| 1:45–2:15 | Click **Download PDF** → show clean PDF. Click **Print**. Click **Copy**. |
| 2:15–2:45 | Go to **Dashboard** → show complaint history, filter by HIGH, search |
| 2:45–3:00 | "Zero English typing. One Hinglish sentence. One official letter. That is Formify." |

---

## 📝 Sample Hinglish Inputs

```
1. "sir mera hostel ka AC kharab hai 3 din se room 204 mein"      → Hostel · HIGH
2. "library mein mera laptop chori ho gaya aaj subah"             → Security · HIGH
3. "College website pe result nahi dikh raha server down hai"      → IT Support · HIGH
4. "canteen ka khana bahut kharab hai, 2 students sick ho gaye"   → Food · MEDIUM
5. "meri fees payment successful hua but portal showing pending"   → Fees · HIGH
6. "internship NOC chahiye next week tak"                          → Academic · MEDIUM
```

---

## 🏗️ API Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/complaint` | Hinglish text + category + priority → AI → returns letter JSON |
| `POST` | `/api/voice` | Upload audio file → Gemini transcription → returns transcript |
| `GET` | `/api/pdf/:id` | Generates and returns downloadable PDF for complaint |

---

*Formify — Built at AI for Impact 2025 · Acropolis, Indore · June 2026*
