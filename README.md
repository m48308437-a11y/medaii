<p align="center">
  <h1 align="center">🩺 MedAI</h1>
  <p align="center">
    <em>Intelligent Health Assistant Platform</em>
  </p>
</p>

<p align="center">
  <strong>Next.js 16 · TypeScript · Tailwind · PostgreSQL · Drizzle ORM · Framer Motion</strong>
</p>

---

## ⚠️ Important Medical Disclaimer

MedAI is an **informational AI assistant**, not a replacement for a doctor. It does **not** provide:

- ❌ Definitive diagnosis
- ❌ Medication prescriptions
- ❌ Emergency medical advice

If the safety engine detects symptoms of a potentially urgent condition (chest pain, difficulty breathing, stroke symptoms, severe bleeding, etc.), the system will **immediately** route the user to emergency services instead of producing a normal AI response.

---

## ✨ Features

| Area | Features |
|------|----------|
| **AI Chat** | Conversational health assistant, follow-up questions, typing indicator, quick prompts, mobile-friendly |
| **Symptom Checker** | 7-step wizard (age → symptom → duration → severity → associated → context → result), urgency tiers (routine / consult / urgent) |
| **Lab Analyzer** | Paste lab values, get plain-language explanation + questions to ask your doctor |
| **Medication DB** | Searchable medication info: uses, warnings, side effects, interactions, when to talk to a provider |
| **Safety Engine** | Independent rule-based safety layer (runs *before* the AI) detecting critical/high-risk patterns in Persian, English, and German |
| **Auth** | Email/password (bcrypt), JWT sessions, httpOnly cookies, register/login/logout |
| **User Dashboard** | Greeting, stats, recent consultations, quick actions |
| **Consultation History** | Full history, risk tags, per-conversation resume |
| **User Profile** | Personal info, health data, notification/privacy/security settings |
| **Admin Panel** | Dashboard, user management, consultation browser, AI monitoring, safety events review, medical sources, content, feature flags, audit logs |
| **RBAC** | 6 roles: `user`, `analyst`, `support`, `medical_content_manager`, `admin`, `super_admin` |
| **i18n** | Persian (fa, RTL default), English (en), German (de) |
| **Design** | Premium dark/health-tech theme, glassmorphism, subtle glow, micro-interactions, fully responsive |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Then edit DATABASE_URL and JWT_SECRET

# Run database migrations (push schema)
npx drizzle-kit push

# Seed database (roles, demo admin, demo user, medications, FAQs)
set -a && source .env && set +a && npx tsx src/lib/seed.ts

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts (after seeding)

| Email | Password | Role |
|-------|----------|------|
| `admin@medai.app` | `Admin@1234` | Super Admin |
| `demo@medai.app` | `Demo@1234` | Regular User |

---

## 🏗 Architecture

### AI Service Layer

```
User Input
    ↓
Safety Engine (rule-based, independent of LLM)
    ├── Critical → emergency guidance (blocks normal AI flow)
    ├── High     → warning added to response
    └── Low      → normal flow
    ↓
Medical Context Retrieval (RAG / knowledge base)
    ↓
AI Provider (Mock Medical AI in demo; swap for OpenAI / Claude / Gemini)
    ↓
Response Validation + disclaimer injection
    ↓
Final Response
```

Provider interface is pluggable: implement `AIProvider.generate()` to connect a real model.

### Safety Engine (src/lib/safety.ts)

- Rule-based, runs **before** every AI call — independent of any LLM
- Detects: chest pain, stroke symptoms, difficulty breathing, severe bleeding, unconsciousness, anaphylaxis, poisoning, suicidal ideation, worst-headache-ever, and more
- Multi-lingual patterns (Persian / English / German)
- Returns risk level + localized emergency referral message

### Database (PostgreSQL + Drizzle)

Tables: `users`, `roles`, `sessions`, `consultations`, `messages`, `symptoms`, `lab_results`, `medications`, `medical_sources`, `knowledge_documents`, `safety_events`, `audit_logs`, `notifications`, `articles`, `faqs`.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public pages)/
│   │   ├── page.tsx                  # Landing
│   │   ├── about/ privacy/ terms/
│   │   ├── ai/                       # AI chat
│   │   ├── symptom-checker/
│   │   ├── lab-analyzer/
│   │   └── medications/ [id]/
│   ├── (auth)/
│   │   ├── login/ register/
│   │   └── api/auth/                 # login, register, logout
│   ├── (app)/                        # requires login
│   │   ├── dashboard/
│   │   ├── history/
│   │   ├── profile/
│   │   └── settings/
│   ├── admin/                        # admin panel (RBAC) + subpages
│   └── api/
│       └── chat/ route.ts            # AI chat + safety + persistence
├── components/
│   ├── ui/                           # Button etc.
│   ├── layout/                       # Navbar, Footer
│   └── landing/                      # Hero, Features
├── db/
│   ├── index.ts                      # drizzle client
│   └── schema.ts                     # all tables
└── lib/
    ├── ai/service.ts                 # AI service + mock medical AI + lab/med/symptom logic
    ├── auth.ts                       # bcrypt, JWT, session helpers
    ├── i18n.ts                       # translations for fa/en/de
    ├── safety.ts                     # independent safety engine
    └── seed.ts                       # demo data seeder
```

---

## 🔐 Security

- Passwords hashed with **bcrypt** (12 rounds)
- Sessions via signed **JWT** in httpOnly, secure, SameSite=Lax cookies
- Server-side auth checks on every protected route/API
- **RBAC** with role-based permissions
- **Audit logs** for all sensitive actions
- All inputs validated with Zod on APIs
- SQL injection protection via Drizzle ORM parameterized queries
- No API keys ever exposed to the frontend

---

## 🎨 Design System

See `src/app/globals.css` for the full palette. Highlights:

- Background: `#05070A` / Cards: `#101820`
- Primary: `#16D9C5` (turquoise)
- Secondary: `#5B8CFF`
- Danger: `#FF4D5A` / Warning: `#FFB84D` / Success: `#35D07F`
- Typography: Vazirmatn (Persian) + Inter (Latin)
- Subtle glassmorphism, gradient borders, glow effects, smooth Framer Motion transitions
- Mobile-first; sidebar becomes bottom navigation on small screens
- Full RTL support for Persian

---

## 🛣 Roadmap (already architected for)

- Pluggable real LLM providers (OpenAI / Claude / Gemini) via a single provider interface
- Vector DB for real RAG (embeddings column + chunked docs already in schema)
- File/image upload for lab results
- Voice input
- Doctor connection module
- Real-time WebSocket chat
- Email verification & password reset flows
- Google/Apple OAuth

---

## 📜 License

This project is provided as a reference implementation. Before real-world deployment in any jurisdiction, ensure compliance with local medical-device regulations, data-protection laws (HIPAA/GDPR/etc.), and obtain proper legal review.
