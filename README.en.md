# Kidssafe 🛡️

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React PWA](https://img.shields.io/badge/Frontend-React_18_PWA-61DAFB?logo=react&logoColor=black)](https://vitejs.dev/)
[![Node.js MVC](https://img.shields.io/badge/Backend-Node.js_Express_MVC-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_%26_Prisma-336791?logo=postgresql&logoColor=white)](https://www.prisma.io/)
[![Prototype Fund](https://img.shields.io/badge/Supported_by-Prototype_Fund-FF6B6B)](https://prototypefund.de/)

> **Modular Open-Source Web App for Cyber Security & Media Literacy in Schools**  
> Supported by: Prototype Fund (BMBF) • Target audience: Children from 4th grade onwards

[🇩🇪 Zur deutschen Version wechseln](README.md)

---

## 🎯 Vision & Goals

Children grow up in an increasingly digital world where generative AI accelerates disinformation, deepfakes, and phishing attacks. Traditional educational materials are often static and quickly become outdated.

**Kidssafe** solves this challenge through an extensible, open-source learning platform:
- **Dynamic AI Scenarios:** Real-time generation of interactive training scenarios on phishing, fake news, privacy, and deepfakes using open-source LLMs (e.g. Gemma, Qwen).
- **Relief for Educators:** Low-barrier rollout for school iPad sets without bureaucratic registration hurdles.
- **Open Software Infrastructure:** A modular framework enabling the educational and open-source community to contribute their own learning modules.

---

## 🔒 Security by Design & Privacy

Protecting children's sensitive data is central to our architectural decisions (*Privacy by Design & Data Minimization*):

- **Zero Real Names:** Students access the platform exclusively via temporary or teacher-assigned **pseudonymized invite codes** (e.g. `SAFE-4A-89`). No real names or personal identifying information (PII) are stored on the server.
- **Anonymized AI Pipeline:** Strict validation layers ensure that no identifiable student data ever enters the LLM prompts.
- **Role-Based Access Control (RBAC):** Strict separation between teachers (classroom management) and parents (family context).
- **Self-Hosting:** The entire system is containerized via Docker and can be self-hosted on school servers or independent infrastructure.

---

## 🛠️ Tech Stack

| Area | Technology | Description |
| :--- | :--- | :--- |
| **Monorepo** | [pnpm Workspaces](https://pnpm.io/) | Clean separation into `/frontend` and `/backend` |
| **Frontend** | React 18, TypeScript, [Vite](https://vitejs.dev/) | Fast, modern PWA optimized for tablets & iPads |
| **Frontend Architecture** | Atomic Design | Structured into Atoms, Molecules, Organisms, Templates, Pages |
| **Styling** | Central Theme System ([`theme.ts`](frontend/src/styles/theme.ts)) | Consistent design with zero hardcoded values in components |
| **Backend** | Node.js, Express, TypeScript | Classical **MVC Pattern** (Routes $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Models) |
| **Database & ORM** | PostgreSQL 16 & [Prisma ORM](https://www.prisma.io/) | Declarative schema, strict typing without `any` |
| **Containerization** | [Docker](https://www.docker.com/) & Docker Compose | Multi-stage builds for Frontend (Nginx) & Backend |
| **AI Integration** | Local Ollama & Open-Source LLMs | Decoupled API layer ensuring provider independence |

---

## 📁 Project Structure

```text
kidssafe/
├── AGENTS.md                  # Mandatory development guidelines for AI agents
├── docker-compose.yml         # Container setup (PostgreSQL, Backend, Frontend)
├── docs/                      # Project documentation
│   ├── dev-guidelines.md      # Detailed software development guidelines
│   ├── project-description.md # Project vision & funding application
│   └── milestones.md          # 6 development milestones with progress tracking
├── frontend/                  # React PWA (Vite + TypeScript)
│   ├── src/
│   │   ├── components/        # Atomic Design (atoms, molecules, organisms, templates, pages)
│   │   ├── services/          # API clients (apiClient.ts)
│   │   ├── styles/            # Central design system (theme.ts, global.css)
│   │   └── types/             # Frontend DTOs and type definitions
│   └── vite.config.ts         # PWA configuration (Service Worker, Web Manifest)
└── backend/                   # Node.js Express backend (TypeScript + MVC)
    ├── prisma/                # Prisma database schema (PostgreSQL)
    └── src/
        ├── config/            # Environment variable validation (env.ts via Zod)
        ├── controllers/       # Request handlers (HealthController etc.)
        ├── middleware/        # Central error handling (errorHandler.ts)
        ├── models/            # Prisma client singleton
        ├── routes/            # REST endpoints (health.routes.ts)
        ├── services/          # Business logic (HealthService etc.)
        └── types/             # Type-safe Data Transfer Objects (DTOs)
```

---

## 🚀 Quickstart

### Prerequisites
- **Node.js:** $\ge$ 20.0.0 ([Download](https://nodejs.org/))
- **pnpm:** $\ge$ 9.0.0 (`npm install -g pnpm` or via Homebrew)
- **Docker & Docker Compose:** *(optional for local database)*

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
Default environment configurations are pre-configured:
```bash
cp .env.example .env
cp .env.example backend/.env
```

### 4. Generate Prisma Client
```bash
pnpm db:generate
```

### 5. Start Development Server
Starts both frontend and backend concurrently with a single command:
```bash
pnpm dev
```

- **Frontend (PWA):** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 🐳 Running with Docker Compose

The complete stack (PostgreSQL, backend, and frontend) can be launched using Docker Compose:

```bash
docker compose up -d
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:4000/api/health](http://localhost:4000/api/health)
- **PostgreSQL:** Port 5432

---

## 📜 Scripts & Commands

The following workspace commands are available in the root directory:

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts frontend and backend concurrently in dev mode |
| `pnpm dev:frontend` | Starts only the Vite dev server for the frontend |
| `pnpm dev:backend` | Starts only the Express backend (via `tsx watch`) |
| `pnpm build` | Builds production bundles for both frontend and backend |
| `pnpm typecheck` | Runs strict TypeScript type checking without `any` |
| `pnpm db:generate` | Generates the Prisma Client from the database schema |
| `pnpm db:migrate` | Runs database migrations |

---

## 🗺️ Roadmap & Milestones

Development follows 6 structured milestones (see [`docs/milestones.md`](docs/milestones.md)):

- [x] **Milestone 1:** Project Foundation & Infrastructure (Monorepo, PWA, MVC, Prisma, Docker)
- [ ] **Milestone 2:** Backend Architecture & Identity Management (Roles, Salt & Pepper Auth, Pseudonym Codes)
- [ ] **Milestone 3:** Frontend Portals & Dashboards (Direct student access, student & admin dashboards)
- [ ] **Milestone 4:** Teacher Backend & Code Management (Classroom lists, live session tracking)
- [ ] **Milestone 5:** Modular Framework & First Scenarios (Phishing Simulator, Fake News Generator)
- [ ] **Milestone 6:** AI Integration & Dynamic Configuration (Ollama, open interface for Open-Source LLMs)

---

## 🤝 Contributing

Contributions from the open-source community and educators are warmly welcome!  
Before submitting code, please review our mandatory guidelines:
- **Development Guidelines:** [`docs/dev-guidelines.md`](docs/dev-guidelines.md)
- **AI Agent Guidelines:** [`AGENTS.md`](AGENTS.md)
  - Maximum file length: 200–300 lines
  - Strict typing: No `any`
  - Atomic Design & central theme configuration

---

## 📄 License & Acknowledgments

This project is licensed under the **[Apache License 2.0](LICENSE)**.

Funded by the German Federal Ministry of Education and Research (BMBF) through the **[Prototype Fund](https://prototypefund.de/)**.
