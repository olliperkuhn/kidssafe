# Kidssafe 🛡️

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React PWA](https://img.shields.io/badge/Frontend-React_18_PWA-61DAFB?logo=react&logoColor=black)](https://vitejs.dev/)
[![Node.js MVC](https://img.shields.io/badge/Backend-Node.js_Express_MVC-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_%26_Prisma-336791?logo=postgresql&logoColor=white)](https://www.prisma.io/)
[![Prototype Fund](https://img.shields.io/badge/Supported_by-Prototype_Fund-FF6B6B)](https://prototypefund.de/)

> **Modulare Open-Source-Webapp für IT-Sicherheitskompetenz an Schulen**  
> Förderschwerpunkt: Prototype Fund (BMBF) • Zielgruppe: Kinder ab der 4. Klasse

[🇬🇧 Switch to English README](README.en.md)

---

## 🎯 Vision & Zielsetzung

Kinder wachsen in einer digitalisierten Welt auf, in der generative KI Desinformation, Deepfakes und Phishing rasant beschleunigt. Bestehende Lernangebote sind oft statisch und veralten schnell.

**Kidssafe** löst dieses Problem durch eine erweiterbare, quelloffene Lernplattform:
- **Dynamische KI-Szenarien:** In Echtzeit erzeugte Trainingsfälle zu Phishing, Fake News, Datenschutz und Deepfakes via Open-Source-LLMs (z. B. Gemma, Qwen).
- **Entlastung für Lehrkräfte:** Niederschwelliger Rollout für iPad-Klassensätze im Schulalltag ohne bürokratische Registrierungshürden.
- **Offene Software-Infrastruktur:** Modulares Framework, das es der Bildungs- und Open-Source-Community ermöglicht, eigene Lerneinheiten beizusteuern.

---

## 🔒 Security by Design & Datenschutz

Der Schutz sensibler Kinderdaten steht im Zentrum der Architektur (*Privacy by Design & Datenminimierung*):

- **Keine Klarnamen:** Schüler:innen nutzen die Plattform ausschließlich über temporäre oder von Lehrkräften vergebene **pseudonymisierte Einladungscodes** (z. B. `SAFE-4A-89`). Es werden serverseitig keine Klarnamen oder personenbezogenen Schülerdaten gespeichert.
- **Anonymisierte KI-Pipeline:** Durch strenge Validierungsschichten gelangen systembedingt keinerlei personenbezogene Daten in die LLM-Prompts.
- **Strikte Rollentrennung (RBAC):** Getrennte Bereiche für Lehrkräfte (Schul-Kontext mit Klassenverwaltung) und Eltern (privater Kontext).
- **Self-Hosting:** Das gesamte System ist via Docker containerisiert und kann unabhängig auf Schulservern oder gesponserten Servern betrieben werden.

---

## 🛠️ Technologie-Stack

| Bereich | Technologie | Beschreibung |
| :--- | :--- | :--- |
| **Monorepo** | [pnpm Workspaces](https://pnpm.io/) | Saubere Trennung in `/frontend` und `/backend` |
| **Frontend** | React 18, TypeScript, [Vite](https://vitejs.dev/) | Schnelle, moderne PWA optimiert für Tablets/iPads |
| **Architektur Frontend** | Atomic Design | Strukturierung in Atoms, Molecules, Organisms, Templates, Pages |
| **Styling** | Zentrales Theme-System ([`theme.ts`](frontend/src/styles/theme.ts)) | Konsistentes Design ohne hardcodierte Werte in Komponenten |
| **Backend** | Node.js, Express, TypeScript | Klassisches **MVC-Muster** (Routes $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Models) |
| **Datenbank & ORM** | PostgreSQL 16 & [Prisma ORM](https://www.prisma.io/) | Deklaratives Schema, strikte Typsicherheit ohne `any` |
| **Containerisierung** | [Docker](https://www.docker.com/) & Docker Compose | Multi-Stage Builds für Frontend (Nginx) & Backend |
| **KI-Anbindung** | Lokales Ollama & Open-Source LLMs | Entkoppelte API-Schnittstelle für Provider-Unabhängigkeit |

---

## 📁 Projektstruktur

```text
kidssafe/
├── AGENTS.md                  # Verbindliche Entwicklungsrichtlinien für KI-Agenten
├── docker-compose.yml         # Container-Setup (PostgreSQL, Backend, Frontend)
├── docs/                      # Projektdokumentation
│   ├── dev-guidelines.md      # Detaillierte Software Development Guidelines
│   ├── project-description.md # Förderantrag & Vision (Prototype Fund)
│   └── milestones.md          # 6 Entwicklungs-Meilensteine mit Fortschrittstracking
├── frontend/                  # React PWA (Vite + TypeScript)
│   ├── src/
│   │   ├── components/        # Atomic Design (atoms, molecules, organisms, templates, pages)
│   │   ├── services/          # API-Clients (apiClient.ts)
│   │   ├── styles/            # Zentrales Design-System (theme.ts, global.css)
│   │   └── types/             # Frontend-DTOs und Typdefinitionen
│   └── vite.config.ts         # PWA-Konfiguration (Service Worker, Web Manifest)
└── backend/                   # Node.js Express Backend (TypeScript + MVC)
    ├── prisma/                # Prisma-Datenbankschema (PostgreSQL)
    └── src/
        ├── config/            # Umgebungsvariablen-Validierung (env.ts via Zod)
        ├── controllers/       # Request-Handler (HealthController etc.)
        ├── middleware/        # Zentrales Error-Handling (errorHandler.ts)
        ├── models/            # Prisma-Client Singleton
        ├── routes/            # REST-Endpunkte (health.routes.ts)
        ├── services/          # Geschäftslogik (HealthService etc.)
        └── types/             # Typsichere Data Transfer Objects (DTOs)
```

---

## 🚀 Schnellstart (Quickstart)

### Voraussetzungen
- **Node.js:** $\ge$ 20.0.0 ([Download](https://nodejs.org/))
- **pnpm:** $\ge$ 9.0.0 (`npm install -g pnpm` oder via Homebrew)
- **Docker & Docker Compose:** *(optional für lokale Datenbank)*

### 1. Repository klonen
```bash
git clone https://github.com/olliperkuhn/kidssafe.git
cd kidssafe
```

### 2. Abhängigkeiten installieren
```bash
pnpm install
```

### 3. Umgebungsvariablen einrichten
Die Standard-Konfiguration ist bereits vorbereitet:
```bash
cp .env.example .env
cp .env.example backend/.env
```

### 4. Prisma Client generieren
```bash
pnpm db:generate
```

### 5. Entwicklungsumgebung starten
Startet Frontend und Backend parallel mit einem einzigen Befehl:
```bash
pnpm dev
```

- **Frontend (PWA):** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 🐳 Ausführung mit Docker Compose

Das gesamte System (PostgreSQL, Backend und Frontend) kann vollständig containerisiert gestartet werden:

```bash
docker compose up -d
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:4000/api/health](http://localhost:4000/api/health)
- **PostgreSQL:** Port 5432

---

## 📜 Skripte & Befehle

Im Root-Verzeichnis stehen folgende Workspaces-Befehle zur Verfügung:

| Befehl | Beschreibung |
| :--- | :--- |
| `pnpm dev` | Startet Frontend und Backend parallel im Entwicklungsmodus |
| `pnpm dev:frontend` | Startet nur den Vite-Dev-Server für das Frontend |
| `pnpm dev:backend` | Startet nur das Express-Backend (via `tsx watch`) |
| `pnpm build` | Erstellt optimierte Produktions-Builds für Frontend und Backend |
| `pnpm typecheck` | Führt eine strikte TypeScript-Typprüfung ohne `any` durch |
| `pnpm db:generate` | Generiert den Prisma-Client auf Basis des Datenbankschemas |
| `pnpm db:migrate` | Führt Datenbank-Migrationen aus |

---

## 🗺️ Roadmap & Meilensteine

Die Entwicklung erfolgt entlang von 6 strukturierten Meilensteinen (Details in [`docs/milestones.md`](docs/milestones.md)):

- [x] **Meilenstein 1:** Projekt-Fundament und Infrastruktur (Monorepo, PWA, MVC, Prisma, Docker)
- [ ] **Meilenstein 2:** Backend-Architektur und Identitätsmanagement (Rollen, Salt & Pepper Auth, Pseudonyme Codes)
- [ ] **Meilenstein 3:** Frontend-Zugänge und Dashboards (iPad-Zugang Kinder, Schüler- & Admin-Dashboards)
- [ ] **Meilenstein 4:** Lehrer-Backend und Code-Verwaltung (Klassenlisten, Live Session-Tracking)
- [ ] **Meilenstein 5:** Basis-Strukturen und Modulentwicklung (Phishing-Simulator, Fake News Generator)
- [ ] **Meilenstein 6:** KI-Integration und dynamische Konfiguration (Ollama, offene Schnittstelle für Open-Source LLMs)

---

## 🤝 Mitwirken & Richtlinien

Beiträge aus der Open-Source-Community und dem Bildungsbereich sind herzlich willkommen!  
Bitte beachte vor dem Erstellen von Code-Änderungen unsere verbindlichen Richtlinien:
- **Development Guidelines:** [`docs/dev-guidelines.md`](docs/dev-guidelines.md)
- **KI-Agenten & Architekturvorgaben:** [`AGENTS.md`](AGENTS.md)
  - Maximale Dateilänge: 200–300 Zeilen
  - Strikte Typisierung: Kein `any`
  - Atomic Design & zentrales Theme-System

---

## 📄 Lizenz & Förderung

Dieses Projekt ist unter der **[Apache License 2.0](LICENSE)** lizenziert – siehe die [LICENSE](LICENSE)-Datei für Details.

Gefördert durch das Bundesministerium für Bildung und Forschung (BMBF) im Rahmen des **[Prototype Fund](https://prototypefund.de/)**.
