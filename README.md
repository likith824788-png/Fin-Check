# FINCHECK AI

> **"Financial Intelligence for the Modern Auditor"**
>
> An AI-powered Financial Statement Consistency Review and Discrepancy Detection platform.

---

## 📌 Executive Architecture Overview

FINCHECK AI implements a dual-layer artificial intelligence and deterministic arithmetic pipeline designed to eliminate hallucinations and detect cross-document reporting discrepancies across statutory filings:

```
                          USER / AUDITOR
                                ↓
                     REACT FRONTEND (Vite + Tailwind)
                                ↓
                      FASTAPI BACKEND (Python 3.13)
                                ↓
                   FIREBASE / FIRESTORE STORAGE
                                ↓
                     1. GOOGLE GEMINI 1.5 / 2.0
               (Multi-page fact and table extraction)
                                ↓
                   2. NVIDIA NEMOTRON-4-340B
             (Independent fact corroboration layer)
                                ↓
                3. PYTHON NORMALIZATION ENGINE
             (Standardizes units, currency, periods, scopes)
                                ↓
             4. DETERMINISTIC COMPARISON ENGINE
           (Absolute & percentage discrepancy calculations)
                                ↓
                   5. STRUCTURED FINDINGS (F-024)
                 (Linked verbatim evidence & page #s)
                                ↓
                     6. GROQ CLOUD REASONING
              (Llama-3.3 70B grounded audit assistant)
```

---

## 🎨 Visual Design System

- **Base Theme:** Soft warm off-white (`#F7F9F8`) with pure white (`#FFFFFF`) card surfaces.
- **Primary Accent:** Deep Emerald Green (`#087F5B`, `#12A878`, `#E9F8F2` mint background).
- **Secondary Accent:** Soft Blush Pink (`#FCECEF`, `#FFF4F6`, `#D6336C`).
- **Typography:** Modern clean SaaS typography powered by **Inter** and **JetBrains Mono** for financial figures.
- **Evidence Highlight:** High-visibility yellow document highlighting (`.doc-evidence-highlight`) on verified page quotes.

---

## 🚀 Key Functional Modules (Phase 1)

1. **Split-Screen Authentication (`/login`, `/register`)**
   - Architectural workflow diagram and 1-Click Access for Lead Senior Auditor.
2. **Executive Audit Dashboard (`/dashboard`)**
   - KPI Cards: Ingested Documents (12), Financial Facts (486), Consistency Checks (328), Findings (41).
   - Interactive Consistency Overview Donut Chart and horizontal severity distributions.
   - Live audit activity timeline and `RUN FULL AUDIT` pipeline trigger.
3. **Document Ingestion Hub (`/upload`)**
   - Drag-and-drop file uploader supporting `.pdf`, `.docx`, and `.xlsx`.
   - Real-time ingestion queue with progress bars and status indicators.
4. **5-Stage AI Pipeline (`/analysis`)**
   - Visual architectural demonstration of the multi-agent pipeline from Gemini extraction to Groq explanation.
5. **Document Management (`/documents`)**
   - Searchable document registry with type, period, and status filters, plus slideout inspection drawer.
6. **Financial Facts Registry (`/facts`)**
   - Searchable table of all 486 extracted and normalized facts with Nemotron verification badges.
   - Slideout fact inspector with verbatim evidence and page numbers.
7. **Consistency Review Matrix (`/consistency`)**
   - Side-by-side comparison cards (e.g. Annual Report 2026 vs Management Commentary).
   - Deterministic difference display: `₹500 Cr (5.0%)`, context checks, and `Explain Difference` CTA.
8. **Findings Hub (`/findings`)**
   - Multi-tab severity filter: All (41), High Priority (5), Medium (11), Explained (21), Consistent (286).
9. **3-Column Investigation Studio (`/findings/F-024`)**
   - **Column 1:** Discrepancy metrics, scope, and status resolution actions.
   - **Column 2:** Evidence Document Viewer with interactive page switcher and yellow citation highlight.
   - **Column 3:** Groq AI Audit Reasoning and specific management recommendation.
10. **Grounded AI Auditor Console (`/ai-auditor`)**
    - Enterprise investigation console strictly grounded in retrieved Firestore facts (no arithmetic hallucinations).
    - Quick inquiry chips (`Show Revenue Issues`, `Explain Profit Changes`, `Compare FY25 vs FY26`).
11. **Regulatory Audit Reports (`/reports`)**
    - Configurable dossier types (Executive Summary, Detailed Consistency, Complete Audit).
    - Live Certificate Cover Preview with print and PDF export capabilities.
12. **Audit Settings (`/settings`)**
    - Materiality threshold percentage controls, base reporting currency, and AI service health monitors.

---

## 📂 Project Structure

```
FINCHECK AI/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entrypoint, CORS, static routes
│   │   ├── ai/
│   │   │   ├── gemini.py               # Google Gemini document extraction
│   │   │   ├── nemotron.py             # NVIDIA Nemotron corroboration
│   │   │   └── groq.py                 # Groq grounded reasoning & explanations
│   │   ├── engines/
│   │   │   ├── extraction.py           # Document parser orchestrator
│   │   │   ├── normalization.py        # Deterministic currency & unit normalizer
│   │   │   ├── comparison.py           # Deterministic Python comparison engine
│   │   │   └── finding_engine.py       # Discrepancy detector & finding generator
│   │   ├── database/
│   │   │   ├── firebase.py             # Firebase Admin & Storage initialization
│   │   │   ├── firestore.py            # Persistence repository (with local fallback)
│   │   │   └── demo_data.py            # Acme Industries realistic showcase dataset
│   │   ├── routes/
│   │   │   ├── auth.py                 # Authentication and session tokens
│   │   │   ├── documents.py            # Upload, metadata, and document analysis
│   │   │   ├── facts.py                # Financial facts endpoints
│   │   │   ├── findings.py             # Inconsistency findings endpoints
│   │   │   ├── analysis.py             # Full analysis pipeline and dashboard stats
│   │   │   ├── evidence.py             # Evidence citations
│   │   │   ├── chat.py                 # Grounded AI Auditor chat endpoint
│   │   │   └── reports.py              # Audit report generation
│   │   └── schemas/
│   │       ├── financial_fact.py       # Fact and verification Pydantic schemas
│   │       ├── finding.py              # Finding and Evidence schemas
│   │       ├── document.py             # Document metadata schema
│   │       ├── chat.py                 # Chat request/response schemas
│   │       └── report.py               # Report schemas
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/AppLayout.jsx     # Master layout with persistent sidebar
│   │   │   ├── sidebar/Sidebar.jsx      # Navigation sidebar with brand styling
│   │   │   └── header/Header.jsx        # Company selector & search header
│   │   ├── pages/
│   │   │   ├── Login/Login.jsx          # Split-screen login with demo 1-click
│   │   │   ├── Register/Register.jsx    # Registration page
│   │   │   ├── Dashboard/Dashboard.jsx  # KPI cards, Donut chart, timeline
│   │   │   ├── Upload/Upload.jsx        # Document drag & drop uploader
│   │   │   ├── Analysis/Analysis.jsx    # 5-stage vertical AI pipeline
│   │   │   ├── Documents/Documents.jsx  # Document library and preview drawer
│   │   │   ├── FinancialFacts/FinancialFacts.jsx # 486 facts registry
│   │   │   ├── Consistency/Consistency.jsx # Side-by-side comparison screen
│   │   │   ├── Findings/Findings.jsx    # Findings cards and priority tabs
│   │   │   ├── FindingDetails/FindingDetails.jsx # 3-column investigation studio
│   │   │   ├── AIAuditor/AIAuditor.jsx  # Grounded investigation console
│   │   │   ├── Reports/Reports.jsx      # Audit report generation & cover preview
│   │   │   ├── Settings/Settings.jsx    # Materiality & AI service status
│   │   │   └── Evidence/Evidence.jsx    # Evidence citation screen
│   │   ├── services/
│   │   │   ├── api.js                   # Axios client with proxy & base URL
│   │   │   └── auth.js                  # User session persistence
│   │   ├── utils/
│   │   │   ├── formatting.js            # Currency & number formatting
│   │   │   └── status.js                # Status & priority styling rules
│   │   ├── App.jsx                      # React Router configuration
│   │   ├── index.css                    # Tailwind directives & custom CSS
│   │   └── main.jsx
│   ├── tailwind.config.js               # Brand color tokens & shadows
│   ├── vite.config.js                   # Vite config with backend proxy
│   └── package.json
├── firestore.rules                      # Multi-tenant Firestore security rules
├── storage.rules                        # Firebase Storage security rules
└── README.md
```

---

## ⚙️ Quick Start & Local Execution

### Prerequisites
- Node.js (v18+)
- Python (3.11+)

### 1. Start the FastAPI Backend
```bash
cd backend
# Optional: create and activate virtualenv
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend will start at `http://localhost:8000`. You can test health by visiting `http://localhost:8000/api/health` or view interactive OpenAPI docs at `http://localhost:8000/docs`.

### 2. Start the Vite React Frontend
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`. Click **⚡ 1-Click Access (Lead Senior Auditor)** to sign in immediately.

---

## 🔑 Environment Configuration

### Backend (`backend/.env`)
```ini
# AI Models (Optional - High-fidelity mock adapters run automatically if empty)
GEMINI_API_KEY=your_gemini_api_key_here
NVIDIA_API_KEY=your_nvidia_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Firebase (Optional - Built-in local persistence runs automatically if empty)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development
```

### Frontend (`frontend/.env`)
```ini
VITE_API_URL=http://localhost:8000
```

---

## 🛡️ Enterprise Security & Integrity Guarantees

1. **Deterministic Financial Arithmetic:**
   All discrepancy percentages and absolute variances are computed in Python with zero floating-point ambiguities. No LLM performs financial arithmetic.
2. **Dual-Layer Corroboration:**
   Every fact proposed by Gemini is cross-checked by NVIDIA Nemotron for document support, reporting period alignment, and scope validity.
3. **No Vector RAG Hallucinations:**
   The AI Auditor queries structured Firestore facts directly based on validated entity metadata (`metric`, `company`, `period`, `scope`).
4. **Data Isolation:**
   All records are partitioned under `/companies/{companyId}/` and enforced via `firestore.rules`.
