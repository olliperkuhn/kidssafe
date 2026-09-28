# Projektbeschreibung: Modulare Open-Source-Webapp für IT-Sicherheitskompetenz an Schulen

## 1. Vision und Zielsetzung
Das Projekt ist eine vollständig quelloffene Webapp und erweiterbare Software-Infrastruktur, die Kindern ab der 4. Klasse zeitgemäße IT-Sicherheitskompetenzen vermittelt. Das Ziel ist es, statische Lernangebote durch interaktive, kontinuierlich aktualisierte Trainingsszenarien abzulösen. Durch die Anbindung von Open-Source-KI-Modellen (z. B. Gemma 4, Qwen3.5) generiert das System in Echtzeit dynamische Lektionen zu Themen wie Phishing, Fake News, Datenschutz und Deepfakes. Die Lösung entlastet Lehrkräfte durch ein niederschwelliges Zugangssystem, optimiert für ein einfaches iPad-Rollout im Schulalltag, und bietet Familien eine sichere Plattform zur Begleitung ihrer Kinder in die digitale Welt.

## 2. Gesellschaftliche Herausforderung
Kinder wachsen in einer rasant digitalisierten Welt auf, in der generative KI Desinformation und Phishing beschleunigt. Die aktuelle Medienkompetenzförderung scheitert häufig an fehlender Kontinuität – einmalige Lerneinheiten verpuffen – und an der Überlastung von Schulen und Familien. Lehrkräften fehlen sofort einsetzbare, sichere Lehrmaterialien. Das Projekt schließt diese Lücke durch ein Werkzeug, das digitale Mündigkeit nachhaltig, spielerisch und ohne hohe Einstiegshürden trainiert.

## 3. Förderschwerpunkte

### 3.1 Software-Infrastruktur
Das Projekt liefert nicht nur eine isolierte App, sondern ein standardisiertes Framework für Entwickler:innen. Die modulare Architektur (React/TypeScript) erlaubt es der Open-Source-Community, eigene pädagogische Module zu programmieren und diese über Repositorien auszutauschen. Das System fungiert als Fundament, an das neue Lerninhalte und KI-Szenarien nahtlos angedockt werden können.

### 3.2 Datensicherheit (Security by Design)
Um den Schutz sensibler Daten, insbesondere von Kindern, zu gewährleisten, ist das Prinzip der Datenminimierung architektonisch verankert:
- **Schulischer Kontext:** Zugänge werden von Lehrkräften vollständig pseudonymisiert über Einladungscodes generiert. Es werden serverseitig keine Klarnamen der Schüler:innen gespeichert.
- **Privater Kontext:** Lokale Gastkonten ermöglichen das Tracking des Lernfortschritts ohne Datenerhebung. Optionale Elternkonten können zur Begleitung per Code verknüpft werden.
- **KI-Interaktion:** Durch die Anonymisierungsschichten fließen systembedingt keine identifizierbaren Daten in den KI-Workflow.

## 4. Technische Umsetzung
- **Frontend:** Progressive Web App (PWA) basierend auf React und TypeScript für ein einfaches Browser-Rollout ohne App-Store-Abhängigkeiten. Nutzung von Atomic Design und einer zentralen Styling-Konfiguration.
- **Backend:** Klassische MVC-Architektur (Model-View-Controller) auf Basis von Node.js mit einer relationalen SQL-Datenbank zur strikten Mandantentrennung.
- **Infrastruktur & Deployment:** Das Gesamtsystem (Frontend, Backend, Datenbank) ist in einem Docker-Setup containerisiert, um einfaches Self-Hosting und Unabhängigkeit zu garantieren.
- **KI-Anbindung:** Entkoppelte Integration von KI-Modellen über eine konfigurierbare API-Schnittstelle. Dies ermöglicht die datenschutzkonforme Nutzung von Open-Source-LLMs auf eigenen oder gesponserten Servern.

## 5. Meilensteine (10 Monate inkl. Second Stage)
* **Monat 1–2:** Aufsetzen der Kernarchitektur (MVC, Docker, SQL) und Entwicklung der PWA-Basis.
* **Monat 3–4:** Entwicklung der ersten zwei Inhaltsmodule und Sicherstellung des KI-Workflows für dynamische Szenarien.
* **Monat 5–6:** Testing, Iteration und Bugfixing mit Lehrkräften und Schüler:innen an einer Test-Grundschule; Vorbereitung des Open-Source-Releases.
* **Monat 7 (Second Stage):** UX-Audit zur Barrierefreiheit, technische Optimierungen und Start der Lokalisierung (Mehrsprachigkeit).
* **Monat 8:** Akquise und Sicherstellung von Open-Source-Sponsorings zur nachhaltigen Finanzierung der KI-Serverinfrastruktur.
* **Monat 9:** Aufbau eines redaktionellen Workflows zur Kuration und didaktischen Überwachung hochwertiger Lerninhalte.
* **Monat 10:** Abschluss der Skalierung, Integration kuratierter Inhalte und Vorbereitung des flächendeckenden Rollouts für den Regelbetrieb.

## 6. Zielgruppe
- **Endnutzer:innen:** Kinder ab der 4. Klasse.
- **Multiplikatoren:** Lehrkräfte, Schulleitungen und Eltern.
- **Entwickler:innen:** Die Open-Source-Community, die das Framework für eigene IT-Sicherheitsmodule nutzt.

## 7. Status und Innovation
Das Projekt befindet sich in der detaillierten Konzeptphase (Architektur, UX/UI, didaktische Module) und erste technische Prototypen werden vorbereitet. Im Gegensatz zu bestehenden, oft statischen oder proprietären Plattformen (wie dem Internet-ABC oder der Anton App) differenziert sich das Projekt durch:
1. Dynamische KI-Generierung von Inhalten zur Vermeidung von Abnutzungseffekten.
2. Radikaler Fokus auf den Aufbau einer wiederverwendbaren Software-Infrastruktur.
3. Kompromisslose Datensicherheit durch pseudonymisierte Zugänge und Self-Hosting-Fähigkeit.
