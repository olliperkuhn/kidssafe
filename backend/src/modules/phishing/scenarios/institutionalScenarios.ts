import { PhishingScenarioTemplate } from './types';

export const INSTITUTIONAL_SCENARIOS: PhishingScenarioTemplate[] = [
  {
    id: 'sc-2',
    slug: 'schulportal-alarm',
    title: 'Alarm im Schul-Portal',
    context: 'Auf deinem Schul-Tablet kommt eine Nachricht mit dem Absender "Schul-Support" an.',
    senderName: 'Schul-Support Administrator',
    senderInfo: 'Absenderadresse: admin@schul-server-update-portal24.de',
    initialMessage: '⚠️ WICHTIGE SICHERHEITSWARNUNG: Unser Schulserver wurde angegriffen. Alle Schülerkonten werden in 1 Stunde gelöscht, wenn du nicht sofort dein Passwort zur Bestätigung hier eingibst!',
    initialOptions: [
      {
        id: 'opt-2-vulnerable',
        text: 'Oh nein, meine ganzen Hausaufgaben! Wo muss ich das Passwort eingeben?!',
        attitude: 'VULNERABLE',
        feedbackNote: 'Panik bekommen und sofort kooperiert.',
      },
      {
        id: 'opt-2-hesitant',
        text: 'Löschen?! Warum erfahre ich das nicht von meiner Klassenlehrerin?',
        attitude: 'HESITANT',
        feedbackNote: 'Guter Instinkt: Offizielle Stellen informieren anders.',
      },
      {
        id: 'opt-2-cautious',
        text: 'Die E-Mail-Adresse sieht komisch aus: schul-server-update-portal24.de? Unsere Schule heißt ganz anders!',
        attitude: 'CAUTIOUS',
        feedbackNote: 'Scharfes Auge! Die Absender-Domain genau geprüft.',
      },
      {
        id: 'opt-2-defensive',
        text: 'Betrugsversuch! Unsere Schule würde niemals per Chat nach Passwörtern fragen. Ich zeige das sofort meiner Lehrkraft.',
        attitude: 'DEFENSIVE',
        feedbackNote: 'Vorbildlich! Direkter Gang zur Lehrkraft ist genau richtig.',
      },
    ],
    branching: {
      onVulnerable: {
        attackerReply: 'Klicke sofort auf www.login-schulportal-rettung.org und gib Benutzername und Kennwort ein. Wenn du zögerst, sind deine Noten und Dateien für immer weg!',
        options: [
          { id: 'opt-2-fail', text: 'Ich habe das Passwort eingegeben, bitte rettet mein Konto!', attitude: 'VULNERABLE' },
          { id: 'opt-2-stop', text: 'Halt, Stop! Frau Müller hat gesagt: Admins fragen nie nach Kennwörtern. Ich schließe die Seite!', attitude: 'DEFENSIVE' },
          { id: 'opt-2-check', text: 'Ich gehe lieber persönlich ins Lehrerzimmer und frage nach.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Der Angreifer hat dein Schul-Passwort gestohlen und kann nun in deinem Namen Nachrichten schreiben und deine Dokumente löschen.',
      },
      onHesitant: {
        attackerReply: 'Deine Lehrerin weiß noch nichts davon, weil es ein Notfall ist! Glaube uns, wir sind die Techniker. Klicke schnell auf den Link, bevor es zu spät ist!',
        options: [
          { id: 'opt-2-fail', text: 'Okay, ich vertraue Ihnen und klicke auf den Link...', attitude: 'VULNERABLE' },
          { id: 'opt-2-stop', text: 'Ein Notfall ohne Lehrerin? Das ist gelogen. Ich zeige das jetzt der Schulleitung!', attitude: 'DEFENSIVE' },
          { id: 'opt-2-check', text: 'Wenn die Schule brennt, gibt es Durchsagen. Per Chat klicke ich gar nichts.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Du bist auf die Notfall-Lüge hereingefallen. Deine Zugangsdaten wurden kompromittiert.',
      },
      onCautious: {
        attackerReply: 'Das ist unsere offizielle Notfall-Domain! Sei doch nicht so misstrauisch, wir wollen dir nur helfen. Klick einfach drauf.',
        options: [
          { id: 'opt-2-fail', text: 'Na gut, dann mache ich es eben schnell...', attitude: 'VULNERABLE' },
          { id: 'opt-2-stop', text: 'Misstrauisch sein schützt mich! Echte Schuldomains enden auf offizielle Schuladressen.', attitude: 'DEFENSIVE' },
          { id: 'opt-2-report', text: 'Ich melde diese betrügerische E-Mail-Adresse sofort.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Die gefälschte Domain hat deine Login-Daten abgefangen.',
      },
    },
    defenseOutcome: {
      attackerSurrender: 'Verflixt... diese Klasse hat im Unterricht zu gut aufgepasst.',
      leoPraise: 'Hervorragend, Agent! Du hast die Panikmache durchschaut und die gefälschte E-Mail-Adresse enttarnt!',
    },
    warningSignals: [
      {
        quote: 'Konten werden in 1 Stunde gelöscht!',
        type: 'Panikmache & Angst erzeugen',
        explanation: 'Betrüger drohen oft mit drastischen Konsequenzen, damit Kinder vor Schreck unüberlegt handeln.',
        protectionTip: 'Keine Schule löscht Konten innerhalb einer Stunde per unangekündigter E-Mail.',
      },
      {
        quote: 'admin@schul-server-update-portal24.de',
        type: 'Gefälschte Absenderadresse',
        explanation: 'Die Adresse sieht offiziell aus, gehört aber Betrügern (Zusätze wie "portal24" oder Fantasiewörter).',
        protectionTip: 'Immer die Endung der E-Mail genau ansehen! Klingt sie fremd, Finger weg.',
      },
    ],
    goldenRule: 'Regel: Bei angeblichen Schul-Notfällen immer persönlich die Lehrkraft fragen!',
    leoSummary: 'Löwe Leo erklärt: Echte IT-Administratoren an Schulen kennen deine Daten bereits und brauchen dein Passwort niemals!',
  },
  {
    id: 'sc-5',
    slug: 'surprise-package',
    title: 'Das rätselhafte Überraschungs-Paket',
    context: 'Auf deinem Smartphone erhältst du eine SMS mit Paketdienst-Logo.',
    senderName: 'Paket-Zustell-Service',
    senderInfo: 'Absender: Info-SMS ohne Rückrufnummer',
    initialMessage: '📦 Paket-Benachrichtigung: Ein Paket an deine Adresse konnte nicht zugestellt werden. Es fehlt die Hausnummer. Bestätige deine Daten innerhalb von 24h, sonst wird das Paket kostenpflichtig vernichtet: www.dhl-express-sendung-pruefen88.biz',
    initialOptions: [
      {
        id: 'opt-5-vulnerable',
        text: 'Oh, hat Oma mir was geschickt?! Ich gebe schnell meine Adresse und Daten ein!',
        attitude: 'VULNERABLE',
        feedbackNote: 'Sofort auf das angebliche Paket angesprungen.',
      },
      {
        id: 'opt-5-hesitant',
        text: 'Ich habe eigentlich gar nichts bestellt... aber vielleicht ist es eine Überraschung?',
        attitude: 'HESITANT',
        feedbackNote: 'Neugierig, aber noch nicht geklickt.',
      },
      {
        id: 'opt-5-cautious',
        text: 'Die Webadresse endet auf .biz und heißt "pruefen88" – echte Paketdienste haben ganz andere Webseiten!',
        attitude: 'CAUTIOUS',
        feedbackNote: 'Perfekt die dubiose Internetadresse entlarvt!',
      },
      {
        id: 'opt-5-defensive',
        text: 'Typische Paket-Phishing-SMS! Ich frage meine Eltern, ob sie ein Paket erwarten, und klicke keinen Link an.',
        attitude: 'DEFENSIVE',
        feedbackNote: 'Hervorragend reagiert! Erst zuhause nachfragen.',
      },
    ],
    branching: {
      onVulnerable: {
        attackerReply: 'Auf der Webseite steht: Zur Bestätigung der Zustellung wird eine Gebühr von 1,99€ fällig. Bitte gib hier die Kreditkartennummer oder das Online-Banking deiner Eltern ein.',
        options: [
          { id: 'opt-5-fail', text: '1,99€ ist ja wenig, ich hole schnell Mamas Geldbeutel...', attitude: 'VULNERABLE' },
          { id: 'opt-5-stop', text: 'HALT! Bankdaten von Eltern eingeben? Niemals im Leben! Das ist schwerer Betrug!', attitude: 'DEFENSIVE' },
          { id: 'opt-5-ask', text: 'Ich gebe meiner Mutter mein Handy, damit sie die Betrüger anzeigt.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Aus den 1,99€ wurde eine Abo-Falle! Die Betrüger haben hunderte Euro vom Konto deiner Eltern abgebucht.',
      },
      onHesitant: {
        attackerReply: 'Das Paket kommt von einem geheimen Absender! Wenn du nicht innerhalb von 15 Minuten deine Adresse und 1,99€ Servicegebühr eingibst, geht es für immer verloren!',
        options: [
          { id: 'opt-5-fail', text: 'Ich will nicht, dass es verloren geht, ich zahle schnell...', attitude: 'VULNERABLE' },
          { id: 'opt-5-stop', text: 'Paketdienste verlangen niemals per SMS Kreditkartendaten. Das ist Abzocke!', attitude: 'DEFENSIVE' },
          { id: 'opt-5-ask', text: 'Ich lösche diese SMS sofort.', attitude: 'CAUTIOUS' },
        ],
        escalationMessage: '🚨 ALARM: Der angebliche Paketdienst war eine kriminelle Phishing-Bande.',
      },
      onCautious: {
        attackerReply: 'Das ist unsere neue mobile Zustell-Plattform! Bitte keine Sorge. Klicke einfach auf den Link, um den Briefkasten zu bestätigen.',
        options: [
          { id: 'opt-5-fail', text: 'Na gut, wenn es eine offizielle Plattform ist...', attitude: 'VULNERABLE' },
          { id: 'opt-5-stop', text: 'Nein heißt Nein! Gefälschte Links klicke ich aus Prinzip nicht an!', attitude: 'DEFENSIVE' },
          { id: 'opt-5-ask', text: 'Ich prüfe die Sendungsnummer auf der echten Webseite des Paketdienstes.', attitude: 'CAUTIOUS' },
        ],
        escalationMessage: '🚨 ALARM: Die gefälschte Paket-Webseite hat deine Adresse und Telefonnummer weiterverkauft.',
      },
    },
    defenseOutcome: {
      attackerSurrender: 'Keine Chance bei diesem Kind... die wissen Bescheid.',
      leoPraise: 'Sensationell! Du hast die gefälschte Paket-SMS mit Bravour entlarvt!',
    },
    warningSignals: [
      {
        quote: 'www.dhl-express-sendung-pruefen88.biz',
        type: 'Gefälschte Web-Adresse (Domain-Phishing)',
        explanation: 'Betrüger bauen Namen bekannter Firmen in Fake-Domains ein (z. B. mit Bindestrichen oder Zahlen).',
        protectionTip: 'Niemals auf SMS-Links von Paketdiensten klicken! Lieber die Sendung direkt auf der echten Website suchen.',
      },
      {
        quote: 'Gebühr von 1,99€ / Bankdaten eingeben',
        type: 'Finanzdaten-Diebstahl / Abo-Falle',
        explanation: 'Hinter kleinen Beträgen verstecken sich oft teure automatische Monats-Abos.',
        protectionTip: 'Niemals Bankkarten oder Kontodaten der Eltern im Internet eingeben!',
      },
    ],
    goldenRule: 'Regel: Keine Paket-Links anklicken und niemals Kontodaten der Eltern preisgeben!',
    leoSummary: 'Löwe Leo jubelt: Du hast den goldenen Blick für gefälschte Webadressen entwickelt!',
  },
];
