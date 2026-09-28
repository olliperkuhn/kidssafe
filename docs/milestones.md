# Entwicklungs-Meilensteine (Software Development Plan)

> **Projekt:** Kidssafe – Modulare Open-Source-Webapp für IT-Sicherheitskompetenz an Schulen  
> **Status:** Konzept- und Architektur-Prototyp zur Bewerbung beim Prototype Fund (BMBF)

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
- [x] **3.1 Login-Portale für Erwachsene:** Modal mit Login/Registrierung, Rollenwahl (`TEACHER` vs `PARENT`), Token-Persistenz.
- [x] **3.2 Niederschwelliger Kinder-Zugang:** iPad-Code-Eingabe, Gastzugang auf Knopfdruck & automatischer Cookie-Wiedereinstieg.
- [x] **3.3 Schüler-Dashboard:** Missions-Zentrale mit Lernmodulen (Phishing-Simulator, Fake News Detektor) und Session-Status.
- [x] **3.4 Administrative Dashboards:**
  - Dashboard für Lehrkräfte: Klassen anlegen, Codes generieren, interaktive Kärtchen-Druckansicht für den Unterricht.
  - Dashboard für Eltern: Begleitung, Datenschutz und Familientipps.

---

## Meilenstein 4: Lehrer-Backend und Code-Verwaltung
- [x] **4.1 Pseudonymisierte Klassenlisten:** Administrativer Bereich zur Anlage von Klassen und Gruppen ohne personenbezogene Daten.
- [x] **4.2 Code-Generator:** Generierung konfigurierbarer Kontingente an Einladungscodes für Schüler:innen (z. B. 25 Codes für einen iPad-Klassensatz) mit flexiblen Pseudonym-Schemata (`iPad 01`, Tiernamen wie `Fuchs`/`Eule` oder Ziffern) und optimierter Kärtchen-Druckansicht.
- [x] **4.3 Live Session-Tracking:**
  - Echtzeit-Status: Anzeige, ob ein Code im Modul aktiv (`ONLINE`), inaktiv (`OFFLINE`) oder fertig (`COMPLETED`) ist.
  - Schrittweiser Fortschritt (Szenarien abgehakt, Prozentbalken).
  - Intervall-Polling (6 Sekunden) mit Pause/Play und manueller Aktualisierung.
  - **Datenschutz:** Ausschließlich Tracking von Aktivität & Fortschritt – keine inhaltliche Bewertung oder Speicherung der Schülerantworten.

---

## Meilenstein 5: Basis-Strukturen und Modulentwicklung
- [x] **5.1 Modul-Framework (Templates & Interfaces):** Standardisierte DTO-Interfaces, AI-Service-Abstraktion (mit lokaler LLM-Vorbereitung und resilienter Offline-Engine) und modulare UI-Komponenten (Messenger-Chat, Option-Selector, Review, Diplom).
- [x] **5.2 Modul 1 – Phishing-Simulator:**
  - Interaktives Chat-Rollenspiel: KI-Angreifer sendet Phishing-Nachrichten aus der Lebenswelt (Roblox/Gaming, Schulportal, Fake-Freund, Spieletester, Paket-SMS).
  - 4 kindgerechte Antwortoptionen je Schritt (naiv, zögerlich, skeptisch, abwehrend) mit dynamischen Eskalations- oder Abwehrpfaden.
  - Aufklärer-Rolle "Löwe Leo" (Avatar): Detaillierte Analyse aller Warnsignale (Zeitdruck, Datenfalle, falsche Links) und goldene Schutzregeln.
  - Flexible Fallauswahl (3 vs. 5 Szenarien) und feierliches Cyber-Detektiv-Diplom.
  - Vollständige Verzahnung mit dem Lehrer-Live-Tracking (Meilenstein 4).
- [ ] **5.3 Modul 2 – Fake News Generator & Detektor:**
  - Spielerische Analyse von Schlagzeilen, Bildmanipulationen und Quellenprüfung (separater Spielbereich).

---

## Meilenstein 6: KI-Integration und dynamische Konfiguration
- [x] **6.1 Lokales Testmodell (Ollama):** Backend-Anbindung an lokal laufende LLMs via Ollama für isolierte, performante Entwicklungstests.
- [x] **6.2 Dynamische Provider-Abstraktion & Kaskade:**
  - Entkoppelte Multi-Provider-Schnittstelle (Google Gemini Flash REST, lokales Ollama, deterministischer Fallback).
  - Nahtlose Failover-Kaskade für 100% Ausfallsicherheit im Unterricht.
  - Zweistufige Konfiguration (Code-Editor Config + Online-Admin-UI im Lehrer-Dashboard).
- [x] **6.3 Anonymisierte Prompt-Pipeline:** Didaktisches Prompt-Engineering für Angreifer-Persona und Löwe Leo Detektiv ohne PII.
