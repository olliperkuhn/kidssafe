# Kidssafe 🛡️

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React PWA](https://img.shields.io/badge/Frontend-React_18_PWA-61DAFB?logo=react&logoColor=black)](https://vitejs.dev/)
[![Node.js MVC](https://img.shields.io/badge/Backend-Node.js_Express_MVC-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_%26_Prisma-336791?logo=postgresql&logoColor=white)](https://www.prisma.io/)
[![Prototype Fund Application](https://img.shields.io/badge/Concept--Prototype-Prototype_Fund_Application-blueviolet)](https://prototypefund.de/)

> **Modular Open-Source Web App for Cyber Security & Media Literacy in Schools**  
> Concept & Architecture Prototype for application to the Prototype Fund (BMBF) • Target audience: Children from 4th grade onwards

[🇩🇪 Zur deutschen Version wechseln](README.md)

---

> [!IMPORTANT]
> **Transparency Note on Project Status & Prototype:**  
> This project is currently in the **application stage for the Prototype Fund** and is **not yet funded**.  
> The present codebase represents an **AI-assisted, high-level architectural and functional prototype** created to visualize the didactic concept, core mechanisms (pseudonymization, plugin architecture, multi-provider AI), and technical feasibility. A fully developed, fine-grained prototype tested with pilot schools will be built during the prospective funding period.

---

## 🎯 Vision & Goals

Children grow up in an increasingly digital world where generative AI accelerates social engineering, disinformation, and fraud schemes. Traditional worksheets or static learning portals quickly become obsolete and fail to reflect children's everyday reality.

**Kidssafe** tackles this challenge through an extensible, open-source learning platform:
- **Didactically Guided Simulations:** Children experience threats in a protected environment – accompanied by mascot *Löwe Leo*, who embraces mistakes as learning opportunities and delivers actionable safety rules.
- **Dynamic AI Pipeline with Offline Guarantee:** Scenarios and dialogs can be generated using modern language models (Google Gemini Flash or local open-source models like Gemma 2 / Qwen via Ollama). If network access drops, a curated deterministic library takes over seamlessly.
- **Relief for Educators:** Low-barrier rollout for school iPad sets without bureaucratic registration hurdles, accompanied by a live student progress monitor.
- **Modular Plugin Architecture:** Any learning unit (phishing, fake news, data privacy) can be independently enabled, disabled, or contributed by the open-source community.

---

## 🔒 Security by Design & Privacy

Protecting children's sensitive data is central to our architectural decisions (*Privacy by Design & Data Minimization*):

- **Zero Real Names:** Students access the platform exclusively via temporary or teacher-assigned **pseudonymized invite codes** (e.g. `SAFE-4A-89`, iPad labels, or animal codes). No real names or personally identifiable information (PII) are stored on the server.
- **Anonymized AI Interface:** Strict prompt sanitization ensures that no student data ever reaches external LLM endpoints.
- **Role-Based Access Control (RBAC):** Strict separation between teachers (classroom management and AI administration), parents (family context), and students.
- **Self-Hosting & Docker:** The entire stack is containerized and can run autonomously on school servers or local hardware without cloud lock-in.

---

## 🛠️ Tech Stack

| Area | Technology | Description |
| :--- | :--- | :--- |
| **Monorepo** | [pnpm Workspaces](https://pnpm.io/) | Clean separation into `/frontend` and `/backend` |
| **Frontend** | React 18, TypeScript, [Vite](https://vitejs.dev/) | Fast, modern PWA optimized for tablets & iPads |
| **Frontend Architecture** | Atomic Design | Structured into Atoms, Molecules, Organisms, Templates, Pages |
| **Styling** | Central Theme System ([`theme.ts`](frontend/src/styles/theme.ts)) | Consistent design adhering to `AGENTS.md` without hardcoded values |
| **Backend** | Node.js, Express, TypeScript | Classical **MVC Pattern** (Routes $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Models) |
| **Database & ORM** | PostgreSQL 16 & [Prisma ORM](https://www.prisma.io/) | Declarative schema, strict typing without `any` |
| **Modular Plugins** | Registry Pattern & Feature Toggles | Learning modules (e.g. Phishing Simulator) are completely decoupled |
| **AI Pipeline** | Multi-Provider (Gemini / Ollama / Mock) | Strategy Pattern with automatic failover cascade for 100% classroom uptime |
| **Containerization** | [Docker](https://www.docker.com/) & Docker Compose | Multi-stage builds for Frontend (Nginx) & Backend |

---

## 🗺️ Current Development Status & Milestones

Development follows structured milestones (see [`docs/milestones.md`](docs/milestones.md)):

- [x] **Milestone 1: Project Foundation & Infrastructure**
  - Monorepo with pnpm Workspaces, TypeScript strict mode (no `any`).
  - Containerization via Docker & Docker Compose (PostgreSQL, Backend, Frontend).
  - PWA setup with Service Worker and Web Manifest for iPad classroom sets.
- [x] **Milestone 2: Backend Architecture & Identity Management**
  - Salt & pepper password hashing via Scrypt with constant-time verification.
  - Role-based access control (RBAC) for teachers (`TEACHER`), parents (`PARENT`), and admins.
  - Pseudonymized invite code engine (classroom, family, and guest codes with expiration logic).
- [x] **Milestone 3: Frontend Portals & Dashboards**
  - Low-barrier iPad code login for children and 1-click guest access.
  - Student dashboard with dynamic module discovery.
  - Parent and teacher dashboards with printable code sheet views.
- [x] **Milestone 4: Teacher Backend & Live Classroom Session**
  - Classroom management with flexible labeling schemes (iPads, animals, numbers).
  - Heartbeat-based classroom live monitor (real-time student completion tracking).
- [x] **Milestone 5: Modular Framework & Phishing Simulator**
  - Decoupled plugin framework (client & server registries, runtime feature toggles).
  - 4th-grade Phishing Simulator: Interactive chat with attacker persona, 4 student attitudes (`VULNERABLE` to `DEFENSIVE`), escalation detection, Löwe Leo detective review, and diploma printing.
- [x] **AI Pipeline & Admin Management UI**
  - Multi-provider engine: Google Gemini Flash (REST), local Ollama (Gemma 2 / Qwen), and deterministic offline fallback.
  - 100% classroom failover cascade (`Gemini` ➡️ `Ollama` ➡️ `Offline library with 5 curated scenarios`).
  - Teacher dashboard AI management: Real-time provider health, latency indicator, 1-click activation, settings modal, and live test console.
- [ ] **Planned for the Funding Period (Fine-Grained Development):**
  - Additional learning module: Fake News & Disinformation Detector.
  - Didactic co-creation with educators and pilot schools.
  - Accessibility enhancements and text-to-speech support for younger pupils.

---

## 📁 Project Structure

```text
kidssafe/
├── AGENTS.md                  # Mandatory development guidelines for AI agents
├── docker-compose.yml         # Container setup (PostgreSQL, Backend, Frontend)
├── docs/                      # Project documentation
│   ├── dev-guidelines.md      # Detailed software development guidelines
│   ├── project-description.md # Concept, vision & didactics (Prototype Fund application)
│   └── milestones.md          # Milestones with progress tracking
├── frontend/                  # React PWA (Vite + TypeScript)
│   ├── src/
│   │   ├── components/        # Atomic Design (atoms, molecules, organisms, templates, pages)
│   │   ├── hooks/             # Custom hooks (useAdultAuth, useChildSession, useAiAdmin, ...)
│   │   ├── modules/           # Decoupled modules (Phishing Simulator plugin)
│   │   ├── services/          # API clients (apiClient, authApi, codeApi, aiAdminApi, ...)
│   │   ├── styles/            # Central design system (theme.ts, global.css)
│   │   └── types/             # Frontend DTOs and type definitions
│   └── vite.config.ts         # PWA configuration (Service Worker, Web Manifest)
└── backend/                   # Node.js Express backend (TypeScript + MVC)
    ├── prisma/                # Prisma database schema (PostgreSQL)
    └── src/
        ├── config/            # Configuration (env.ts via Zod, ai.config.ts)
        ├── controllers/       # Request handlers (auth, code, tracking, adminAi, ...)
        ├── middleware/        # Central error handling & RBAC auth guards
        ├── modules/           # Backend plugins (phishing module, promptLibrary, registry)
        ├── routes/            # REST endpoints (/auth, /codes, /tracking, /modules, /admin/ai)
        ├── services/          # Business logic (aiService, providers, passwordService, ...)
        └── types/             # Type-safe Data Transfer Objects (DTOs)
```

---

## 🚀 Quickstart

### Prerequisites
- **Node.js:** $\ge$ 20.0.0 ([Download](https://nodejs.org/))
- **pnpm:** $\ge$ 9.0.0 (`npm install -g pnpm`)
- **Docker & Docker Compose:** *(optional for local PostgreSQL database)*

### 1. Clone Repository
```bash
git clone https://github.com/olliperkuhn/kidssafe.git
cd kidssafe
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Setup Environment Variables
Default settings are pre-configured:
```bash
cp .env.example .env
cp .env.example backend/.env
```

### 4. Start Database & Generate Prisma Client
```bash
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate
```

### 5. Start Development Server
Starts frontend and backend concurrently with a single command:
```bash
pnpm dev
```

- **Frontend (PWA):** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 🐳 Running with Docker Compose

The complete system (PostgreSQL, Backend, and Frontend) can be launched containerized:

```bash
docker compose up -d
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:4000/api/health](http://localhost:4000/api/health)
- **PostgreSQL:** Port 5432

---

## 📜 Scripts & Commands

The root workspace provides the following scripts:

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts frontend and backend concurrently in dev mode |
| `pnpm dev:frontend` | Starts only the Vite dev server for the frontend |
| `pnpm dev:backend` | Starts only the Express backend (via `tsx watch`) |
| `pnpm build` | Compiles production builds for frontend and backend |
| `pnpm typecheck` | Executes strict TypeScript checks without `any` |
| `pnpm db:generate` | Generates Prisma Client from the schema |
| `pnpm db:migrate` | Runs database migrations |

---

## 🤝 Contributing

Contributions from the open-source community and educators are warmly welcome!  
Before submitting pull requests, please review our guidelines:
- **Development Guidelines:** [`docs/dev-guidelines.md`](docs/dev-guidelines.md)
- **Guidelines for Contributors & AI Agents:** [`AGENTS.md`](AGENTS.md)
  - Maximum file length: 200–300 lines
  - Strict typing: No `any`
  - Atomic Design & central theme configuration ([`theme.ts`](frontend/src/styles/theme.ts))

---

## 📄 License & Attribution

This project is licensed under the **[Apache License 2.0](LICENSE)**.

*Project initiative & proof of concept submitted for consideration to the **[Prototype Fund](https://prototypefund.de/)** (German Federal Ministry of Education and Research).*
