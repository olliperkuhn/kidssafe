# Kidssafe – AI Agent Instructions & Development Guidelines

> **Projekt:** *Kidssafe* – Modulare Open-Source-Webapp für IT-Sicherheitskompetenz an Schulen (Kinder ab 4. Klasse, Förderschwerpunkt Prototype Fund).  
> **Kernprinzipien:** Security by Design (Datenminimierung, pseudonymisierte Codes, keine Klarnamen), PWA für iPad-Klassensätze, dynamische Lektionen via Open-Source-LLMs (z. B. Gemma/Qwen), Docker-Self-Hosting.  
> **Verbindlichkeit:** Dieses Dokument definiert die verbindlichen Entwicklungsrichtlinien und Architekturvorgaben für die Implementierung. Sie werden bei jedem Schritt und jedem Prompt automatisch berücksichtigt.

---

## 1. Code-Qualität und Struktur
- **Kompakte Klassen & Dateien:** Dateien und Klassen sind strikt auf **maximal 200 bis 300 Zeilen** zu begrenzen. Wo immer möglich, kürzer fassen. Logik, die diesen Rahmen überschreitet, zwingend in spezifische Helper, Services oder Hooks auslagern.
- **Separation of Concerns (SoC):** Strikte Trennung von Präsentationslogik, Geschäftslogik und Datenzugriff:
  - UI-Komponenten rendern ausschließlich.
  - Controller steuern den Datenfluss.
  - Services enthalten die isolierte Geschäftslogik.
- **Wiederverwendbarkeit:** Komponenten, Funktionen und Abfragen sind generisch zu konzipieren. Vor jeder Neuentwicklung bestehende Module auf Wiederverwendbarkeit prüfen.

---

## 2. Typensicherheit (TypeScript)
- **Kein `any`:** Das gesamte Projekt (Frontend und Backend) wird streng typisiert entwickelt. Der Einsatz von `any` ist serverseitig und clientseitig strikt untersagt.
- **Collections & Datenstrukturen:** Konzeption nach gängiger Praxis mit generischen Typen (z. B. `Array<InviteCode>`, `Record<string, User>`).
- **Data Transfer Objects (DTOs):** Datenaustausch zwischen Client und Server erfolgt ausschließlich über klar definierte DTOs, um Datenminimierung (*Security by Design*) technisch zu garantieren.

---

## 3. Frontend-Architektur (React & PWA)

### 3.1 Atomic Design
Strukturierung aller UI-Komponenten nach dem Atomic Design Prinzip:
- **Atoms:** Kleinste, unteilbare Bausteine (Buttons, Inputs, Typografie, Avatare).
- **Molecules:** Einfache Kombinationen aus Atoms (z. B. Eingabegruppen für Zugangscodes).
- **Organisms:** Komplexe, eigenständige UI-Blöcke (Login-Formulare, Phishing-Mockups, Header).
- **Templates:** Seitenlayouts ohne spezifische Daten (Wireframes für Module).
- **Pages:** Mit Daten und State befüllte Templates (z. B. Schüler-Dashboard, Lernmodul-Ansicht).

### 3.2 Zentrales Styling
- Sämtliche Design-Parameter (Farben, Spacing, Typografie, Breakpoints) werden in einer **zentralen Styling-Klasse / Konfigurationsdatei** (z. B. `theme.ts` in `src/styles/`) definiert.
- UI-Komponenten importieren ausschließlich diese zentralen Parameter. **Hardcodierte Design-Werte innerhalb der Komponenten sind verboten.**

### 3.3 Verzeichnisstruktur Frontend
```text
/frontend
 ├── /src
 │    ├── /assets        # Statische Ressourcen (Bilder, Icons)
 │    ├── /components    # Atomic Design (atoms, molecules, organisms, templates, pages)
 │    ├── /hooks         # Eigene React Hooks (z. B. useAuth, useKIWorkflow)
 │    ├── /services      # API-Clients und externe Aufrufe
 │    ├── /store         # State Management
 │    ├── /styles        # Zentrale Styling-Klasse (theme.ts)
 │    ├── /types         # TypeScript Interfaces & DTOs
 │    └── /utils         # Hilfsfunktionen
 └── package.json
```

---

## 4. Backend-Architektur (Node.js & MVC)

### 4.1 MVC-Muster
- **Routes:** Definieren lediglich HTTP-Endpunkte und leiten Anfragen an Controller weiter.
- **Controllers:** Übernehmen Request-Validierung und Response-Handling (keine komplexe Geschäftslogik).
- **Services:** Enthalten die isolierte Geschäftslogik (z. B. KI-Szenario-Generierung, Verifizierung von Pseudonym-Codes).
- **Models / Repositories:** Kapselung der SQL-Datenbankabfragen und Entity-Definitionen.

### 4.2 Verzeichnisstruktur Backend
```text
/backend
 ├── /src
 │    ├── /api           # Externe API-Anbindungen (LLM-Endpunkte wie Gemma/Qwen)
 │    ├── /config        # Umgebungsvariablen und Konfigurationen
 │    ├── /controllers   # Request Handler
 │    ├── /middleware    # Auth, Validation, Error Handling
 │    ├── /models        # Datenbank-Entities
 │    ├── /routes        # API-Endpunkte
 │    ├── /services      # Kernlogik
 │    ├── /types         # DTOs und Typ-Definitionen
 │    └── /utils         # Logger und Helper
 ├── Dockerfile
 └── package.json
```

---

## 5. Dokumentation & Projektstatus
- **Projektbeschreibung:** [`docs/project-description.md`](docs/project-description.md)
- **Meilensteine & Roadmap:** [`docs/milestones.md`](docs/milestones.md)
- **Detaillierte Guidelines:** [`docs/dev-guidelines.md`](docs/dev-guidelines.md)
