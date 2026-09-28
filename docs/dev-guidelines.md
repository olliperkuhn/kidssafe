# Software Development Guidelines: Prototype Fund Projekt

## 1. Code-Qualität und Struktur
- **Kompakte Klassen:** Klassen und Dateien sind auf maximal 200 bis 300 Zeilen zu begrenzen. Wo immer möglich, sind sie kürzer zu fassen. Logik, die diesen Rahmen sprengt, wird in spezifische Helper, Services oder Hooks ausgelagert.
- **Separation of Concerns (SoC):** Strikte Trennung von Präsentationslogik, Geschäftslogik und Datenzugriff. UI-Komponenten rendern ausschließlich, Controller steuern den Datenfluss, Services enthalten die isolierte Geschäftslogik.
- **Wiederverwendbarkeit:** Komponenten, Funktionen und Abfragen sind generisch zu konzipieren. Vor Neuentwicklungen ist der Bestand stets auf wiederverwendbare Module zu prüfen.

## 2. Typensicherheit (TypeScript)
- Das gesamte Projekt (Frontend und Backend) wird streng typisiert entwickelt. Der Einsatz von `any` ist serverseitig und clientseitig untersagt.
- **Collections und Datenstrukturen:** Konzeption nach gängiger Praxis unter Nutzung generischer Typen (z. B. `Array<InviteCode>`, `Record<string, User>`).
- Der Datenaustausch zwischen Client und Server erfolgt über klar definierte Data Transfer Objects (DTOs), um die erforderliche Datenminimierung (Security by Design) technisch zu garantieren.

## 3. Frontend-Architektur (React & PWA)

### 3.1 Atomic Design
Die UI-Komponenten werden nach dem Atomic Design Prinzip strukturiert, um eine klare und konzentrierte Komponentenstruktur zu pflegen:
- **Atoms:** Kleinste, unteilbare Bausteine (Buttons, Inputs, Typografie, Avatare).
- **Molecules:** Einfache Kombinationen aus Atoms (Eingabegruppen für Zugangscodes).
- **Organisms:** Komplexe, eigenständige UI-Blöcke (Login-Formulare, Phishing-Mockups, Header).
- **Templates:** Seitenlayouts ohne spezifische Daten (Wireframes für Module).
- **Pages:** Mit Daten und State befüllte Templates (z. B. Schüler-Dashboard, Lernmodul-Ansicht).

### 3.2 Zentrales Styling
- Alle Design-Parameter (Farben, Spacing, Typografie, Breakpoints) werden in einer **zentralen Styling-Klasse / Konfigurationsdatei** (z. B. `theme.ts` oder vergleichbar) festgelegt.
- UI-Komponenten importieren ausschließlich diese zentralen Parameter. Hardcodierte Design-Werte innerhalb der Komponenten sind nicht gestattet.

### 3.3 Verzeichnisstruktur Frontend
```text
/frontend
 ├── /src
 │    ├── /assets        # Statische Ressourcen (Bilder, Icons)
 │    ├── /components    # Atomic Design (atoms, molecules, organisms, templates, pages)
 │    ├── /hooks         # Eigene React Hooks (z.B. useAuth, useKIWorkflow)
 │    ├── /services      # API-Clients und externe Aufrufe
 │    ├── /store         # State Management
 │    ├── /styles        # Zentrale Styling-Klasse (theme.ts)
 │    ├── /types         # TypeScript Interfaces
 │    └── /utils         # Hilfsfunktionen
 └── package.json
```

## 4. Backend-Architektur (Node.js & MVC)

### 4.1 MVC-Muster
- **Routes:** Definieren lediglich die HTTP-Endpunkte und leiten Anfragen an den entsprechenden Controller weiter.
- **Controllers:** Übernehmen Request-Validierung und Response-Handling. Sie enthalten keine komplexe Geschäftslogik.
- **Services:** Enthalten die isolierte Geschäftslogik (z. B. KI-Szenario-Generierung, Verifizierung von Pseudonym-Codes).
- **Models/Repositories:** Kapselung der SQL-Datenbankabfragen und Entity-Definitionen.

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
