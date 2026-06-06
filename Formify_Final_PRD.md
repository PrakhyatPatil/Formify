# Formify — Final Product Requirements Document

> **Hackathon:** AI for Impact 2025 · Acropolis Institute of Technology & Research, Indore
> **Theme:** PS-03 — AI for Indian Multilingual Users
> **Status:** Built & Deployed ✅

---

## 1. Problem Statement

**Theme:** AI for Indian Multilingual Users (PS-03)

Millions of Indian college students — especially first-generation learners from MP, UP, and rural areas — communicate naturally in **Hinglish (Hindi + English code-mixed)** but are locked out of campus systems that demand formal English. The result: complaints go unfiled, scholarships are lost, and rights go unknown.

**Core pain:** A student who can say *"mera hostel ka pani nahi aa rha 3 din se"* cannot convert that into a formal English complaint — so the issue is never resolved.

---

## 2. Solution — Formify

Formify is a **voice-to-formal-letter AI web app** that accepts Hinglish speech or text and generates structured, legally clear, priority-coded complaint letters — ready to download as PDF or print — in under 3 seconds.

**What makes it non-trivial (per judging criteria):**

| Requirement | How Formify delivers |
|---|---|
| Specific user persona | First-gen Hinglish-only student from MP/UP |
| Multi-step workflow | Voice/Text → STT → Gemini NLU → Letter Draft → PDF Export |
| Useful output | Downloadable formal PDF complaint letter with priority tag |
| Technical depth | Gemini 2.5 Flash API + FastAPI backend + FPDF2 PDF engine + Web Speech API |
| Product depth | 3 pages (Write, Dashboard, About), priority filter, complaint history, print/copy/download |

---

## 3. Live Application — Pages

### 3.1 Landing Page (`/`)
- Hero: *"Transform Raw Audio complaints into Professional Formal Letters"*
- Three feature cards: Speech Transcription · Gemini AI Drafting · PDF Export & Printing
- CTAs: **Draft Your Complaint →** / **View Dashboard**

### 3.2 Write Complaint (`/write`)
- Large textarea with inline **mic button** (Web Speech API — no install needed)
- Quick Templates: `[Delivery] Delayed package delivery` · `[Support] Broadband internet outages` · `[Billing] Incorrect credit card charge`
- Category dropdown (Product/Device, Billing, Support, Delivery, Other)
- Priority selector: **Low / Medium / High**
- **Generate Formal Complaint Letter** CTA → calls Gemini 2.5 Flash

### 3.3 Result Page
- Shows: Document Title · Original Transcript · Priority Badge (HIGH/MEDIUM/LOW)
- Generated Letter Preview rendered as a white document card
- Actions: **Copy Text** · **Print** · **Download PDF**

### 3.4 Dashboard (`/dashboard`)
- Grid of all past complaint cards
- Each card: title · Hinglish transcript snippet · date · category tag · priority badge
- Filter by: **All · High · Medium · Low**
- Search bar across all complaints
- **New Complaint** button top-right
- Per card: delete · **View Letter →**

### 3.5 About (`/about`)
- Product description + Key Features & Stack section listing all technologies

---

## 4. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React + Vite + Vanilla CSS | Glassmorphism dark UI, HSL custom color spaces |
| Voice Input | Web Speech API (`webkitSpeechRecognition`) | Browser-native, no recording delays |
| Backend | FastAPI (Python) + Uvicorn | REST API, CORS, AI pipeline |
| Primary AI | **Gemini 2.5 Flash** (`gemini-2.5-flash`) | Hinglish NLU, classification, letter drafting |
| PDF Generation | FPDF2 | High-res PDFs with visual headers + priority-colored tags |
| Deployment | Vercel (frontend) + Railway (backend) | Free tier, live public URL |

---

## 5. AI Integration — Gemini 2.5 Flash

**Why Gemini 2.5 Flash:**
- Native Hinglish comprehension — no pre-processing required
- 1M token context — handles full policy PDFs if extended
- ~1–2s latency — suitable for live demos
- Free via Google AI Studio — zero billing friction during hackathon

### Prompt 1 — Complaint Classifier + Letter Drafter

```python
SYSTEM_PROMPT = """
You are Formify, an AI assistant that converts informal Hinglish complaints
into professional formal English complaint letters.

Given a user's raw complaint (may be in Hindi, English, or Hinglish), you must:
1. Understand the full intent, even if phrased casually or informally
2. Classify into one category: HOSTEL | ACADEMICS | FEES | INFRASTRUCTURE
   | HARASSMENT | FOOD | PRODUCT | BILLING | SUPPORT | DELIVERY | OTHER
3. Assign a priority: HIGH | MEDIUM | LOW
4. Draft a complete formal English complaint letter

Respond ONLY in this JSON format — no preamble, no markdown fences:
{
  "title": "Complaint regarding [topic]",
  "category": "HOSTEL",
  "priority": "HIGH",
  "summary": "One-sentence English summary of the complaint",
  "department": "Hostel Warden Office",
  "formal_letter": "Respected Sir/Ma'am,\\n\\nI am writing to formally bring to your attention..."
}
"""

def analyze_complaint(text: str, category: str, priority: str) -> dict:
    response = model.generate_content(
        SYSTEM_PROMPT + f"\n\nCategory hint: {category}\nPriority hint: {priority}\nStudent input: {text}",
        generation_config={"temperature": 0.2, "max_output_tokens": 1000}
    )
    return json.loads(response.text)
```

### Prompt 2 — PDF Letter Formatter (FPDF2)

```python
LETTER_FORMAT_PROMPT = """
You are a professional document formatter. Given a raw formal complaint letter,
reformat it into a clean, structured document body with:
- Proper salutation
- 3–4 numbered points or clear paragraphs describing the issue
- A specific resolution request with a reasonable deadline
- Professional closing (Yours sincerely / Respectfully yours)
- Placeholder lines: [Your Name], [Your Address], [Contact], [Date]

Return ONLY the formatted letter text. No JSON. No extra commentary.
Input letter: {raw_letter}
"""
```

---

## 6. Folder Structure

```
formify/
├── backend/
│   ├── main.py            ← FastAPI app + CORS + all routes
│   ├── ai_engine.py       ← Gemini 2.5 Flash calls (Prompts 1 & 2)
│   ├── pdf_gen.py         ← FPDF2 letter → PDF
│   ├── models.py          ← Complaint schema / storage
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx        ← Landing page
│   │   │   ├── Write.jsx       ← Complaint form + mic
│   │   │   ├── Result.jsx      ← Generated letter + download
│   │   │   ├── Dashboard.jsx   ← Complaint history grid
│   │   │   └── About.jsx       ← Stack + features
│   │   └── components/
│   │       ├── PriorityBadge.jsx
│   │       └── ComplaintCard.jsx
│   └── package.json
└── README.md
```

---

## 7. API Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/complaints` | Hinglish text + category + priority → runs AI → returns letter JSON |
| `GET` | `/api/complaints` | Returns all stored complaints (dashboard) |
| `GET` | `/api/complaints/{id}` | Returns single complaint letter |
| `DELETE` | `/api/complaints/{id}` | Delete a complaint from dashboard |
| `POST` | `/api/pdf/{id}` | Generates and returns downloadable PDF for complaint |

---

## 8. Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Google AI Studio account → `GEMINI_API_KEY` (free)
- Git

### Backend
```bash
cd backend
pip install fastapi uvicorn google-generativeai fpdf2 python-dotenv python-multipart
echo "GEMINI_API_KEY=your_key_here" > .env
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev
```

### Deploy
```bash
# Backend → Railway.app
# 1. Push to GitHub
# 2. Connect repo on railway.app
# 3. Add env var: GEMINI_API_KEY=your_key
# 4. Deploy — Railway auto-detects FastAPI

# Frontend → Vercel
vercel --prod
# Set VITE_API_URL=https://your-railway-backend-url.railway.app
```

---

## 9. Demo Script (3 minutes)

| Time | What to show |
|---|---|
| 0:00–0:30 | Open landing page. Read the headline. "This is Formify." |
| 0:30–1:00 | Click mic. Speak: *"Sar mera ISI waqt nahin kar raha hai"* → show transcript appears |
| 1:00–1:45 | Hit **Generate**. Show the letter appear — title, priority badge HIGH, full formal letter |
| 1:45–2:15 | Click **Download PDF** → show clean PDF. Click **Print**. |
| 2:15–2:45 | Go to **Dashboard** → show complaint history, filter by HIGH |
| 2:45–3:00 | "Zero English typing. One Hinglish sentence. One official letter. That is Formify." |

---

## 10. Submission Checklist

- [x] Source code on GitHub
- [x] README with problem, solution, tech stack, setup, demo instructions
- [x] Live working demo (deployed)
- [x] Demo video (3 min max)
- [x] Presentation deck / PRD in PDF
- [x] Note on AI usage (Gemini 2.5 Flash — Prompt 1 & 2 above)
- [ ] Architecture diagram *(optional — recommended)*
- [ ] Prompt engineering notes *(this PRD covers it)*

---

## 11. Sample Hinglish Inputs

```
1. "Sar Mera ISI Waqt nahin kar raha hai"                         → Product · HIGH
2. "mera hostel room ka AC nahi chal raha, 3 din ho gaye"         → Hostel · HIGH
3. "sir ne mujhe fail kar diya without reason"                     → Academics · HIGH
4. "canteen ka khana bahut kharab hai, 2 students sick ho gaye"   → Food · MEDIUM
5. "meri fees payment successful hua but portal showing pending"   → Fees · HIGH
```

---

*Formify — Built at AI for Impact 2025 · Acropolis, Indore · June 6, 2026*
