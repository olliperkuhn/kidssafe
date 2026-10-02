import { PhishingScenarioTemplate } from './types';

export const WEB_SCENARIOS: PhishingScenarioTemplate[] = [
  {
    id: 'sc-9',
    slug: 'chain-letter-giveaway',
    title: 'Der Jubiläums-Kettenbrief mit der Konsole',
    context: 'In deinem Klassenchat leitet ein Mitschüler einen bunten Kettenbrief mit vielen Emojis weiter.',
    senderName: 'Klassenchat (Weitergeleitete Nachricht)',
    senderInfo: 'Weitergeleitete Kettenbrief-Nachricht',
    initialMessage: '🎉 WAHNSINN!! MediaMarkt feiert 45. Jubiläum und verschenkt heute 500 nagelneue Spielekonsolen! 🎮 Klicke auf den Link, beantworte 3 Kinderfragen und leite diese Nachricht an 5 Freunde weiter: http://mediamarkt-jubilaeum-gewinn2026.top',
    initialOptions: [
      {
        id: 'opt-9-vulnerable',
        text: '500 Konsolen umsonst?! Ich beantworte sofort die Fragen und leite es an meine Freunde weiter!',
        attitude: 'VULNERABLE',
        feedbackNote: 'Sofort zum Weitersenden verleiten lassen und Betrügern geholfen.',
      },
      {
        id: 'opt-9-hesitant',
        text: 'Warum sollte ein Elektronikmarkt einfach so teure Konsolen per WhatsApp verschenken?',
        attitude: 'HESITANT',
        feedbackNote: 'Guter Instinkt: Wirtschaftlich macht das für keinen echten Händler Sinn.',
      },
      {
        id: 'opt-9-cautious',
        text: 'Die Webadresse endet auf .top statt auf mediamarkt.de. Das ist ganz sicher kein echtes Gewinnspiel!',
        attitude: 'CAUTIOUS',
        feedbackNote: 'Exzellente Beobachtung der fremden Web-Endung.',
      },
      {
        id: 'opt-9-defensive',
        text: 'Das ist ein typischer Betrugs-Kettenbrief! Ich klicke nichts an und warne sofort die ganze Klasse davor.',
        attitude: 'DEFENSIVE',
        feedbackNote: 'Hervorragende Zivilcourage! Klassenkameraden vor Schaden bewahrt.',
      },
    ],
    branching: {
      onVulnerable: {
        attackerReply: 'Auf der Webseite dreht sich ein Glücksrad: "HERZLICHEN GLÜCKWUNSCH! Du hast gewonnen! Gib hier deine Handynummer ein, um den Bestätigungscode per SMS zu erhalten und die Konsole zu sichern!"',
        options: [
          { id: 'opt-9-fail', text: 'Ich tippe schnell meine Handynummer ein!', attitude: 'VULNERABLE' },
          { id: 'opt-9-stop', text: 'Stopp! Handynummer auf fremden Gewinnspiel-Seiten eingeben führt in teure Abofallen!', attitude: 'DEFENSIVE' },
          { id: 'opt-9-ask', text: 'Ich frage erst meine Eltern, bevor ich meine Handynummer irgendwo eintippe.', attitude: 'CAUTIOUS' },
        ],
        escalationMessage: '🚨 ALARM: Du bist in eine Drittanbieter-Abofalle getappt! Jeden Monat werden 9,99€ über die Handyrechnung deiner Eltern abgebucht.',
      },
      onHesitant: {
        attackerReply: 'Nur noch 3 Konsolen auf Lager! Wenn du es nicht in 5 Minuten an 5 Kontakte schickst, verfällt dein Anspruch für immer!',
        options: [
          { id: 'opt-9-fail', text: 'Bevor die Konsolen weg sind, schicke ich es schnell weiter!', attitude: 'VULNERABLE' },
          { id: 'opt-9-stop', text: 'Wer Zeitdruck macht und Kettenbriefe verlangt, will nur Daten abgreifen. Schluss damit!', attitude: 'DEFENSIVE' },
          { id: 'opt-9-report', text: 'Ich schreibe in die Klassengruppe: Bitte nicht anklicken, das ist ein Fake!', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Du hast den Betrugs-Link weiterverbreitet und Mitschüler in Gefahr gebracht.',
      },
      onCautious: {
        attackerReply: 'Das Gewinnspiel ist vom Marktchef persönlich bestätigt! Schau dir doch die Kommentare auf der Seite an, alle haben ihre Konsole bekommen!',
        options: [
          { id: 'opt-9-fail', text: 'Stimmt, die Kommentare sehen echt aus, ich mache doch mit...', attitude: 'VULNERABLE' },
          { id: 'opt-9-stop', text: 'Gefälschte Jubel-Kommentare kann jeder Betrüger in 5 Minuten basteln. Ich bleibe beim Nein!', attitude: 'DEFENSIVE' },
          { id: 'opt-9-leave', text: 'Kettenbriefe lösche ich grundsätzlich sofort.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Gefälschte Testimonials haben dich getäuscht.',
      },
    },
    defenseOutcome: {
      attackerSurrender: 'Mist... die Schüler fallen auf Kettenbriefe nicht mehr rein.',
      leoPraise: 'Vorbildlich, Agent! Kettenbriefe zu stoppen und Mitschüler zu warnen ist echte digitale Zivilcourage!',
    },
    warningSignals: [
      {
        quote: 'Leite diese Nachricht an 5 Freunde / Gruppen weiter',
        type: 'Schneeballsystem / Kettenbrief-Mechanismus',
        explanation: 'Kriminelle missbrauchen Schüler, um ihre Phishing-Links kostenlos massenhaft zu verbreiten.',
        protectionTip: 'Kettenbriefe niemals weiterleiten – die Kette immer sofort unterbrechen!',
      },
      {
        quote: 'Handynummer eingeben für Gewinncode',
        type: 'Drittanbieter-Abofalle (WAP-Billing)',
        explanation: 'Mit der Eingabe der Handynummer wird oft ein teures wöchentliches Abo im Hintergrund abgeschlossen.',
        protectionTip: 'Niemals deine Telefonnummer für angebliche Gewinne eingeben.',
      },
    ],
    goldenRule: 'Regel: Kettenbriefe niemals weitersenden und niemals Handynummern auf Gewinnspielseiten eintragen!',
    leoSummary: 'Löwe Leo verteilt die Tapferkeitsmedaille: Wer die Kette bricht, schützt die ganze Klasse vor Abzocke!',
  },
  {
    id: 'sc-10',
    slug: 'qr-quishing-hotspot',
    title: 'Der mysteriöse QR-Code an der Haltestelle',
    context: 'An der Bushaltestelle vor deiner Schule klebt ein bunter Sticker mit einem QR-Code.',
    senderName: 'Aufkleber an der Haltestelle',
    senderInfo: 'Physischer Sticker: "Schüler-WLAN Gratis"',
    initialMessage: '📶 FREIES SCHUL-WLAN! Dein Datenvolumen ist aufgebraucht? Scanne diesen QR-Code und surfe sofort mit Highspeed ohne Limit an allen Bushaltestellen!',
    initialOptions: [
      {
        id: 'opt-10-vulnerable',
        text: 'Cool, mein Datenvolumen ist fast leer! Ich scanne den QR-Code sofort mit der Kamera!',
        attitude: 'VULNERABLE',
        feedbackNote: 'Blind einen fremden QR-Code im öffentlichen Raum gescannt.',
      },
      {
        id: 'opt-10-hesitant',
        text: 'Kostenloses WLAN über einen Aufkleber an der Laterne? Wer betreibt das denn überhaupt?',
        attitude: 'HESITANT',
        feedbackNote: 'Sehr schlaue Frage nach dem echten Betreiber.',
      },
      {
        id: 'opt-10-cautious',
        text: 'QR-Codes können auf jede beliebige Betrugsseite führen. Ich scanne nur, wenn ich die Ziel-URL vorher genau prüfen kann.',
        attitude: 'CAUTIOUS',
        feedbackNote: 'Genau richtig: Quishing-Gefahr erkannt und URL-Vorschau verlangt.',
      },
      {
        id: 'opt-10-defensive',
        text: 'Vorsicht vor "Quishing"! Jeder kann Sticker mit Betrugs-Links überkleben. Ich nutze fremde QR-Codes an Haltestellen niemals!',
        attitude: 'DEFENSIVE',
        feedbackNote: 'Perfekter Cyber-Detektiv! Quishing an öffentlichen Orten sofort enttarnt.',
      },
    ],
    branching: {
      onVulnerable: {
        attackerReply: 'Der QR-Code öffnet eine Seite: "WLAN-Anmeldung: Bitte logge dich mit deinem Google- oder Apple-Konto und Passwort ein, um die Highspeed-Verbindung freizuschalten!"',
        options: [
          { id: 'opt-10-fail', text: 'Ich tippe meine Login-Daten schnell ein, damit das Internet geht.', attitude: 'VULNERABLE' },
          { id: 'opt-10-stop', text: 'Stopp! Echte öffentliche WLANs verlangen niemals Passwörter von Google oder Apple! Das ist Phishing!', attitude: 'DEFENSIVE' },
          { id: 'opt-10-leave', text: 'Ich schließe die Webseite sofort und trenne die Verbindung.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Quishing erfolgreich! Der Angreifer hat dein Hauptkonto gekapert und Zugriff auf alle deine Fotos, Mails und Notizen.',
      },
      onHesitant: {
        attackerReply: 'Auf dem Handy erscheint: "Verbindung wird hergestellt... Noch 1 Schritt: Bestätige deine Identität durch Klick auf wlan-schul-hotspot-free.ru"',
        options: [
          { id: 'opt-10-fail', text: 'Wenn es nur noch ein Schritt ist, klicke ich...', attitude: 'VULNERABLE' },
          { id: 'opt-10-stop', text: 'Eine russische .ru-Domain für unser Schul-WLAN? Absoluter Betrug!', attitude: 'DEFENSIVE' },
          { id: 'opt-10-ask', text: 'Ich frage meinen Informatiklehrer, ob die Stadt WLAN-Sticker verteilt.', attitude: 'CAUTIOUS' },
        ],
        escalationMessage: '🚨 ALARM: Die gefälschte Hotspot-Seite hat dein Gerät abgefangen.',
      },
      onCautious: {
        attackerReply: 'Der Sticker sieht doch ganz offiziell aus, da ist sogar das Stadt-Wappen draufgedruckt! Trau dich ruhig!',
        options: [
          { id: 'opt-10-fail', text: 'Mit Stadt-Wappen wird es wohl stimmen...', attitude: 'VULNERABLE' },
          { id: 'opt-10-stop', text: 'Ein Wappen aus dem Internet kann jeder auf einen Sticker drucken. Keine Chance!', attitude: 'DEFENSIVE' },
          { id: 'opt-10-report', text: 'Ich melde den manipulierten Sticker der Schulleitung.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Gefälschte Logos haben dich in Sicherheit gewogen.',
      },
    },
    defenseOutcome: {
      attackerSurrender: 'Unglaublich... selbst QR-Codes werden von diesen Kindern erst geprüft!',
      leoPraise: 'Grandios, Detektiv! "Quishing" (Phishing über QR-Codes) ist eine der raffiniertesten Methoden der Cyber-Kriminellen. Du hast sie eiskalt durchschaut!',
    },
    warningSignals: [
      {
        quote: 'QR-Code Sticker an Bushaltestelle / Laterne',
        type: 'Quishing (QR-Code Phishing)',
        explanation: 'QR-Codes verbergen das Ziel. Kriminelle kleben ihre eigenen QR-Codes über echte Schilder.',
        protectionTip: 'Scanne niemals ungeprüft QR-Code-Aufkleber im öffentlichen Raum.',
      },
      {
        quote: 'Google- oder Apple-Passwort für Gratis-WLAN eingeben',
        type: 'Account-Phishing über Fake-Hotspot',
        explanation: 'Öffentliche WLAN-Netze fragen niemals nach vertraulichen Kontopasswörtern.',
        protectionTip: 'Gib niemals Passwörter deiner Hauptkonten für angebliche Gratis-Dienste ein.',
      },
    ],
    goldenRule: 'Regel: Niemals fremde QR-Codes an öffentlichen Orten scannen und niemals Passwörter für Gratis-WLAN eingeben!',
    leoSummary: 'Löwe Leo setzt den Detektivhut auf: Ein QR-Code ist eine Blackbox. Prüfe die URL immer in der Vorschau, bevor du sie öffnest!',
  },
];
