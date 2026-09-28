# Kidssafe 🛡️

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React PWA](https://img.shields.io/badge/Frontend-React_18_PWA-61DAFB?logo=react&logoColor=black)](https://vitejs.dev/)
[![Node.js MVC](https://img.shields.io/badge/Backend-Node.js_Express_MVC-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_%26_Prisma-336791?logo=postgresql&logoColor=white)](https://www.prisma.io/)
[![Prototype Fund Bewerbung](https://img.shields.io/badge/Konzept--Prototyp-Prototype_Fund_Bewerbung-blueviolet)](https://prototypefund.de/)

> **Modulare Open-Source-Webapp für IT-Sicherheitskompetenz an Schulen**  
> Konzept- & Architektur-Prototyp zur Bewerbung beim Prototype Fund (BMBF) • Zielgruppe: Kinder ab der 4. Klasse

[🇬🇧 Switch to English README](README.en.md)

---

> [!IMPORTANT]
> **Transparenzhinweis zum Projektstatus & Prototyp:**  
> Dieses Projekt befindet sich im **Bewerbungsstadium für den Prototype Fund** und wird zum aktuellen Zeitpunkt **noch nicht gefördert**.  
> Der vorliegende Code ist ein **mithilfe von generativer KI erstellter, grober Architektur- und Funktions-Prototyp**. Er dient dazu, die Vision, die didaktische Leitidee und die technische Machbarkeit greifbar und interaktiv zu visualisieren. Ein vollwertiger, feingliedrig ausgearbeiteter und mit Schulen validierter Prototyp soll im Rahmen einer anschließenden Förderung realisiert werden.

---

## 🎯 Vision & Zielsetzung

Kinder wachsen in einer digitalisierten Lebenswelt auf, in der generative KI neue Risiken wie Social Engineering, Desinformation und Betrugsmaschen rasant beschleunigt. Klassische Arbeitsblätter oder statische Lernportale veralten schnell und spiegeln die Realität der Kinder nicht wider.

**Kidssafe** setzt hier an mit einer erweiterbaren, quelloffenen Lernplattform:
- **Didaktisch geführte Simulationen:** Kinder erleben Gefahren im geschützten Raum – begleitet von Maskottchen *Löwe Leo*, der Fehler positiv als Lernchance nutzt und konkrete Schutztipps vermittelt.
- **Dynamische KI-Pipeline mit Ausfallgarantie:** Dialoge und Szenarien können über moderne Sprachmodelle (Google Gemini Flash oder lokale Open-Source-Modelle wie Gemma 2 / Qwen via Ollama) generiert werden. Fällt das Internet aus, greift nahtlos eine kuratierte Offline-Bibliothek.
- **Entlastung für Lehrkräfte:** Niedrigschwelliger Rollout für iPad-Klassensätze im Schulalltag ohne bürokratische Registrierungshürden und mit Live-Fortschrittsmonitor.
- **Modulare Plugin-Bauweise:** Beliebige Lerneinheiten (Phishing, Fake News, Datenschutz) können unabhängig voneinander aktiviert, deaktiviert oder durch die Community ergänzt werden.

---

## 🔒 Security by Design & Datenschutz

Der Schutz sensibler Kinderdaten steht im Zentrum der technischen Architektur (*Privacy by Design & Datenminimierung*):

- **Keine Klarnamen:** Schüler:innen nutzen die Plattform ausschließlich über temporäre oder von Lehrkräften vergebene **pseudonymisierte Einladungscodes** (z. B. `SAFE-4A-89`, iPad-Labels oder Tier-Codes). Es werden serverseitig keine Klarnamen oder personenbezogenen Schülerdaten gespeichert.
- **Anonymisierte KI-Schnittstelle:** Durch strikte Prompt-Filter gelangen systembedingt keinerlei personenbezogene Daten in externe LLM-Aufrufe.
- **Strikte Rollentrennung (RBAC):** Getrennte Bereiche für Lehrkräfte (Schul-Kontext mit Klassenverwaltung und KI-Management), Eltern (Familien-Kontext) und Kinder.
- **Self-Hosting & Docker:** Das gesamte System ist containerisiert und kann unabhängig auf Schulservern oder lokalen Rechnern ohne Cloud-Zwang betrieben werden.

---

## 🛠️ Technologie-Stack

| Bereich | Technologie | Beschreibung |
| :--- | :--- | :--- |
| **Monorepo** | [pnpm Workspaces](https://pnpm.io/) | Saubere Trennung in `/frontend` und `/backend` |
| **Frontend** | React 18, TypeScript, [Vite](https://vitejs.dev/) | Schnelle, moderne PWA optimiert für Tablets & iPad-Klassensätze |
| **Architektur Frontend** | Atomic Design | Strukturierung in Atoms, Molecules, Organisms, Templates, Pages |
| **Styling** | Zentrales Theme-System ([`theme.ts`](frontend/src/styles/theme.ts)) | Konsistentes Design gemäß `AGENTS.md` ohne hardcodierte Werte |
| **Backend** | Node.js, Express, TypeScript | Klassisches **MVC-Muster** (Routes $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Models) |
| **Datenbank & ORM** | PostgreSQL 16 & [Prisma ORM](https://www.prisma.io/) | Relationales Schema, strikte Typsicherheit ohne `any` |
| **Modulare Plugins** | Registry-Pattern & Feature Toggles | Lerneinheiten (z. B. Phishing-Simulator) sind vollständig entkoppelt |
| **KI-Pipeline** | Multi-Provider (Gemini / Ollama / Mock) | Strategy Pattern mit automatischer Failover-Kaskade für 100% Schulstunden-Garantie |
| **Containerisierung** | [Docker](https://www.docker.com/) & Docker Compose | Multi-Stage Builds für Frontend (Nginx) & Backend |

---

## 🗺️ Aktueller Entwicklungsstand & Meilensteine

Die Entwicklung erfolgt entlang strukturierter Meilensteine (Details in [`docs/milestones.md`](docs/milestones.md)):

- [x] **Meilenstein 1: Projekt-Fundament & Infrastruktur**
  - Monorepo mit pnpm Workspaces, TypeScript strict mode (kein `any`).
  - Containerisierung via Docker & Docker Compose (PostgreSQL, Backend, Frontend).
  - PWA-Setup mit Service Worker und Web-App-Manifest für iPad-Klassensätze.
- [x] **Meilenstein 2: Backend-Architektur & Identitätsmanagement**
  - Salt & Pepper Passwort-Hashing mit Scrypt und zeitkonstanter Verifikation.
  - Rollenbasierte Zugriffskontrolle (RBAC) für Lehrkräfte (`TEACHER`), Eltern (`PARENT`) und Admins.
  - Pseudonymisierter Code-Service (Klassen-, Familien- und Gastcodes mit Ablauflogik).
- [x] **Meilenstein 3: Frontend-Zugänge & Dashboards**
  - Barrierearmer iPad-Code-Login für Kinder und 1-Klick-Gastzugang.
  - Schüler-Dashboard mit dynamischer Modul-Übersicht.
  - Eltern- und Lehrkräfte-Dashboards mit druckbarer Code-Karten-Übersicht.
- [x] **Meilenstein 4: Lehrer-Backend & Live-Klassensitzung**
  - Klassenverwaltung mit flexiblem Label-Schema (iPads, Tiere, Nummern).
  - Heartbeat-basiertes Live-Monitoring im Klassenzimmer (Echtzeit-Fortschritt der Schüler:innen).
- [x] **Meilenstein 5: Modulare Plugin-Architektur & Phishing-Simulator**
  - Vollständig entkoppeltes Plugin-Framework (Client & Server Registry, Feature-Toggles zur Laufzeit).
  - Phishing-Simulator für Klasse 4: Interaktiver Chat mit Angreifer-Persona, 4 kindgerechten Reaktionshaltungen (`VULNERABLE` bis `DEFENSIVE`), Eskalationserkennung, Löwe Leo Detektiv-Auswertung und Diplom-Druck.
- [x] **KI-Pipeline & Administrator-Management**
  - Multi-Provider-Engine: Google Gemini Flash (REST), lokales Ollama (Gemma 2 / Qwen) und deterministischer Fallback.
  - 100 % ausfallsichere Kaskade (`Gemini` ➡️ `Ollama` ➡️ `Offline-Bibliothek mit 5 kuratierten Szenarien`).
  - Administrator-UI im Lehrkräfte-Dashboard: Status aller Provider, Latenzanzeige, 1-Klick-Aktivierung, Verbindungs-Modal und Live-Test-Konsole.
- [ ] **Geplant für den Förderzeitraum (Feinausarbeitung):**
  - Weiteres Modul: Fake News & Desinformations-Detektor.
  - Didaktische Co-Creation mit Pädagog:innen und Pilotschulen.
  - Ausarbeitung barrierefreier Interaktionsmuster und Vorlesefunktionen.

---

## 📁 Projektstruktur

```text
kidssafe/
├── AGENTS.md                  # Verbindliche Entwicklungsrichtlinien für KI-Agenten
├── docker-compose.yml         # Container-Setup (PostgreSQL, Backend, Frontend)
├── docs/                      # Projektdokumentation
│   ├── dev-guidelines.md      # Detaillierte Software Development Guidelines
│   ├── project-description.md # Konzept, Vision & Didaktik (Bewerbung Prototype Fund)
│   └── milestones.md          # Meilensteine mit Fortschrittstracking
├── frontend/                  # React PWA (Vite + TypeScript)
│   ├── src/
│   │   ├── components/        # Atomic Design (atoms, molecules, organisms, templates, pages)
│   │   ├── hooks/             # Custom Hooks (useAdultAuth, useChildSession, useAiAdmin, ...)
│   │   ├── modules/           # Entkoppelte Lerneinheiten (Phishing-Simulator Plugin)
│   │   ├── services/          # API-Clients (apiClient, authApi, codeApi, aiAdminApi, ...)
│   │   ├── styles/            # Zentrales Design-System (theme.ts, global.css)
│   │   └── types/             # Frontend-DTOs und Typdefinitionen
│   └── vite.config.ts         # PWA-Konfiguration (Service Worker, Web Manifest)
└── backend/                   # Node.js Express Backend (TypeScript + MVC)
    ├── prisma/                # Prisma-Datenbankschema (PostgreSQL)
    └── src/
        ├── config/            # Konfiguration (env.ts via Zod, ai.config.ts)
        ├── controllers/       # Request-Handler (auth, code, tracking, adminAi, ...)
        ├── middleware/        # Zentrales Error-Handling & RBAC Auth-Guards
        ├── modules/           # Backend-Plugins (phishing module, promptLibrary, registry)
        ├── routes/            # REST-Endpunkte (/auth, /codes, /tracking, /modules, /admin/ai)
        ├── services/          # Geschäftslogik (aiService, providers, passwordService, ...)
        └── types/             # Typsichere Data Transfer Objects (DTOs)
```

---

## 🚀 Schnellstart (Quickstart)

### Voraussetzungen
- **Node.js:** $\ge$ 20.0.0 ([Download](https://nodejs.org/))
- **pnpm:** $\ge$ 9.0.0 (`npm install -g pnpm`)
- **Docker & Docker Compose:** *(optional für lokale PostgreSQL-Datenbank)*

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
Die Standard-Konfiguration ist vorkonfiguriert:
```bash
cp .env.example .env
cp .env.example backend/.env
```

### 4. Datenbank starten & Prisma Client generieren
```bash
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate
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

Das Gesamtsystem (PostgreSQL, Backend und Frontend) kann vollständig containerisiert gestartet werden:

```bash
docker compose up -d
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:4000/api/health](http://localhost:4000/api/health)
- **PostgreSQL:** Port 5432

---

## 📜 Skripte & Befehle

Im Root-Verzeichnis stehen folgende Befehle zur Verfügung:

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

## 🤝 Mitwirken & Richtlinien

Beiträge aus der Open-Source-Community und dem Bildungsbereich sind herzlich willkommen!  
Bitte beachte vor dem Erstellen von Code-Änderungen unsere verbindlichen Richtlinien:
- **Development Guidelines:** [`docs/dev-guidelines.md`](docs/dev-guidelines.md)
- **Architekturvorgaben für Mitwirkende & KI-Tools:** [`AGENTS.md`](AGENTS.md)
  - Maximale Dateilänge: 200–300 Zeilen (strikte Modularisierung)
  - Strikte Typisierung: Kein `any`
  - Atomic Design & zentrales Theme-System ([`theme.ts`](frontend/src/styles/theme.ts))

---

## 📄 Lizenz & Zuordnung

Dieses Projekt ist unter der **[Apache License 2.0](LICENSE)** lizenziert – siehe die [LICENSE](LICENSE)-Datei für Details.

*Projektinitiative & Konzeptnachweis zur Einreichung beim **[Prototype Fund](https://prototypefund.de/)** (Bundesministerium für Bildung und Forschung).*
