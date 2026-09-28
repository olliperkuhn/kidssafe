# Entwicklungs-Meilensteine (Software Development Plan)

> **Projekt:** Kidssafe – Modulare Open-Source-Webapp für IT-Sicherheitskompetenz an Schulen  
> **Status:** Initialisiert / In Vorbereitung

---

## Meilenstein 1: Projekt-Fundament und Infrastruktur
- [x] **1.1 Projektstruktur:** Aufsetzen einer sauberen, getrennten Projektstruktur für `/frontend` (React + PWA) und `/backend` (Node.js).
- [x] **1.2 Technologie-Stack & Typisierung:** Durchgängige TypeScript-Konfiguration (`tsconfig.json`) für Client und Server ohne `any`.
- [x] **1.3 Datenbank & ORM:** Einrichtung der relationalen Datenbank (PostgreSQL) und Anbindung des ORMs/Query-Builders (Prisma) inklusive Schema-Definition.
- [x] **1.4 Versionskontrolle & Docker:** Initialisierung der Versionskontrolle, Docker-Containerisierung (Docker Compose für App & DB) und Grund-Abhängigkeiten.

---

## Meilenstein 2: Backend-Architektur und Identitätsmanagement
- [x] **2.1 Datenmodelle & Schemata:** Relationale PostgreSQL-Schemata für Nutzer, Einladungscodes, Klassen und persistierte Kindersitzungen (`ChildSession`).
- [x] **2.2 Rollenbasierte Zugriffskontrolle (RBAC):** Strikte Trennung von Rollen:
  - **Eltern:** Standard-User (privater Kontext).
  - **Lehrkräfte:** Schul-User mit Rechten zur Klassen- und Code-Verwaltung.
- [x] **2.3 Authentifizierung Erwachsene:** Sicheres Auth-System für Erwachsene (E-Mail, Nutzername, Passwort-Hashing mit Salt & Pepper via scrypt + timingSafeEqual, 24h JWT).
- [x] **2.4 Zugangslogik für Kinder (Security by Design):**
  - Anmeldung **ausschließlich** über pseudonymisierte Einladungscodes oder 8h-Gastzugänge.
  - Vollständige Pseudonymisierung (keine Speicherung von Klarnamen oder PII).
  - Persistierte 8h-Sitzungen mit HTTP-Only-Cookie zur nahtlosen Rückkehr auf dem iPad.
  - Vorbereitung für spätere Avatar-Auswahl.

---

## Meilenstein 3: Frontend-Zugänge und Nutzer-Dashboards
- [ ] **3.1 Login-Portale für Erwachsene:** Klassische Login-/Registrierungs-Ansichten für Eltern und Lehrkräfte.
- [ ] **3.2 Niederschwelliger Kinder-Zugang:** Schneller Code-Eingabe-Dialog für Kinder ohne klassische Login-Hürden (iPad-optimiert).
- [ ] **3.3 Schüler-Dashboard:** Zentraler Hub zur Auswahl, Übersicht und Navigation der freigeschalteten Lernmodule.
- [ ] **3.4 Administrative Dashboards:**
  - Basis-Dashboard für Eltern (Verknüpfung von Codes).
  - Basis-Dashboard für Lehrkräfte (Übersicht der Klassen).

---

## Meilenstein 4: Lehrer-Backend und Code-Verwaltung
- [ ] **4.1 Pseudonymisierte Klassenlisten:** Administrativer Bereich zur Anlage von Klassen und Gruppen ohne personenbezogene Daten.
- [ ] **4.2 Code-Generator:** Generierung konfigurierbarer Kontingente an Einladungscodes für Schüler:innen (z. B. 25 Codes für einen iPad-Klassensatz).
- [ ] **4.3 Live Session-Tracking:**
  - Echtzeit-Status: Anzeige, ob ein Code im Modul aktiv ist oder passiv bleibt.
  - Schrittweiser Fortschritt (Szenarien abgehakt).
  - **Datenschutz:** Ausschließlich Tracking von Aktivität & Fortschritt – keine inhaltliche Bewertung oder Speicherung der Schülerantworten.

---

## Meilenstein 5: Basis-Strukturen und Modulentwicklung
- [ ] **5.1 Modul-Framework (Templates & Interfaces):** Definition standardisierter TypeScript-Interfaces und UI-Templates zur nahtlosen Einbindung neuer Lernmodule.
- [ ] **5.2 Modul 1 – Phishing-Simulator:**
  - Interaktives Erkennen gefälschter E-Mails, Nachrichten und Webseiten.
  - Feedback-Mechanismen und didaktische Aufbereitung.
- [ ] **5.3 Modul 2 – Fake News Generator & Detektor:**
  - Spielerische Analyse von Schlagzeilen, Bildmanipulationen und Quellenprüfung.

---

## Meilenstein 6: KI-Integration und dynamische Konfiguration
- [ ] **6.1 Lokales Testmodell (Ollama):** Initiale Backend-Anbindung an lokal laufende LLMs via Ollama für isolierte, performante Entwicklungstests.
- [ ] **6.2 Dynamische Provider-Abstraktion:**
  - Entkoppelte API-Schnittstelle im Backend zur providerunabhängigen LLM-Kommunikation.
  - Nahtloser Wechsel zwischen lokalem Ollama und externen/gesponserten Open-Source-LLM-Endpunkten (z. B. Gemma, Qwen) ohne Code-Änderungen an der Kernlogik.
- [ ] **6.3 Anonymisierte Prompt-Pipeline:** Sicherstellung, dass keinerlei personenbezogene Daten in die KI-Prompts gelangen.
