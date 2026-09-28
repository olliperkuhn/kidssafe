import { PhishingOptionDTO, WarningSignalReviewDTO } from '../../../types/dto/phishing.dto';

export interface PhishingScenarioTemplate {
  id: string;
  slug: string;
  title: string;
  context: string;
  senderName: string;
  senderInfo: string;
  initialMessage: string;
  initialOptions: PhishingOptionDTO[];
  branching: {
    onVulnerable: {
      attackerReply: string;
      options: PhishingOptionDTO[];
      escalationMessage: string;
    };
    onHesitant: {
      attackerReply: string;
      options: PhishingOptionDTO[];
      escalationMessage: string;
    };
    onCautious: {
      attackerReply: string;
      options: PhishingOptionDTO[];
      escalationMessage: string;
    };
  };
  defenseOutcome: {
    attackerSurrender: string;
    leoPraise: string;
  };
  warningSignals: WarningSignalReviewDTO[];
  goldenRule: string;
  leoSummary: string;
}

export const PHISHING_SCENARIOS: PhishingScenarioTemplate[] = [
  {
    id: 'sc-1',
    slug: 'roblox-gems',
    title: 'Die Gratis-Robux-Falle',
    context: 'Du spielst auf deinem Tablet dein Lieblingsspiel. Plötzlich ploppt eine Direktnachricht von einem unbekannten Spieler auf.',
    senderName: 'GamerKing_Max99',
    senderInfo: 'Unbekannter Spieler (nicht in deiner Freundesliste)',
    initialMessage: 'Hey! 🎮 Ich habe einen geheimen Glitch gefunden: Du kannst dir sofort 5.000 Robux / Diamanten gratis holen! Ich habe schon 10.000 bekommen. Beeil dich, der Trick funktioniert nur noch 10 Minuten!',
    initialOptions: [
      {
        id: 'opt-1-vulnerable',
        text: 'Boah krass, danke!! Wo muss ich mich anmelden? Schick mir den Link!',
        attitude: 'VULNERABLE',
        feedbackNote: 'Sehr leichtgläubig reagiert.',
      },
      {
        id: 'opt-1-hesitant',
        text: 'Klingt fast zu gut... Kostet das wirklich gar nichts oder ist da ein Haken?',
        attitude: 'HESITANT',
        feedbackNote: 'Gute Skepsis, aber noch im Gespräch geblieben.',
      },
      {
        id: 'opt-1-cautious',
        text: 'Woher kennst du mich eigentlich? Und warum sollte jemand echtes Geld verschenken?',
        attitude: 'CAUTIOUS',
        feedbackNote: 'Sehr aufmerksam nach der Quelle gefragt!',
      },
      {
        id: 'opt-1-defensive',
        text: 'Sowas gibt es nicht. Echte Spielebetreiber verschenken kein Geld per Chat. Lass mich in Ruhe!',
        attitude: 'DEFENSIVE',
        feedbackNote: 'Perfekt abgewehrt! Betrug sofort erkannt.',
      },
    ],
    branching: {
      onVulnerable: {
        attackerReply: 'Hier ist der Link: mega-free-robux-glitch.net/login. Du musst da nur deinen Nutzernamen und dein Passwort eingeben, damit die Diamanten auf dein Konto geladen werden. Schnell, beeil dich!',
        options: [
          {
            id: 'opt-2-fail',
            text: 'Super, ich tippe mein Passwort sofort ein!',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-2-stop',
            text: 'Moment mal! Mein Passwort gebe ich niemals ein! Das ist eine Phishing-Falle!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-2-hesitate',
            text: 'Muss man da wirklich das Passwort angeben? Das darf ich eigentlich nicht...',
            attitude: 'HESITANT',
          },
          {
            id: 'opt-2-ask',
            text: 'Ich frage erst mal meine Eltern oder meine Lehrkraft, ob dieser Link sicher ist.',
            attitude: 'CAUTIOUS',
          },
        ],
        escalationMessage: '🚨 ALARM: Du hast dein Passwort auf einer fremden Webseite eingegeben! Der Angreifer hat nun die Kontrolle über deinen Spiele-Account und dein Inventar gestohlen.',
      },
      onHesitant: {
        attackerReply: 'Nein, 100% kostenlos, versprochen! Ich schwöre es auf meine Ehre! Klick einfach hier auf mega-free-robux-glitch.net und gib deine Login-Daten ein, bevor der Entwickler den Fehler bemerkt!',
        options: [
          {
            id: 'opt-2-fail',
            text: 'Na gut, wenn du schwörst... hier sind meine Daten.',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-2-stop',
            text: 'Wer schwören muss, lügt meistens! Niemals gebe ich mein Passwort weiter. Blockiert!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-2-ask',
            text: 'Das ist mir zu verdächtig. Ich klicke nichts an und schließe das Spiel.',
            attitude: 'CAUTIOUS',
          },
          {
            id: 'opt-2-report',
            text: 'Ich melde dein Profil jetzt dem Spiele-Support wegen Phishing-Versuch.',
            attitude: 'DEFENSIVE',
          },
        ],
        escalationMessage: '🚨 ALARM: Die Versprechungen waren gelogen! Deine Daten wurden abgefangen und dein Account ist gesperrt.',
      },
      onCautious: {
        attackerReply: 'Ich will doch nur nett sein zu anderen Spielern! Glaubst du mir etwa nicht? Wenn du nicht in 2 Minuten auf den Link klickst, bekommt die Robux eben jemand anderes!',
        options: [
          {
            id: 'opt-2-fail',
            text: 'Warte, nicht weggeben! Ich klicke doch!',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-2-stop',
            text: 'Künstlicher Zeitdruck ist das klassische Zeichen für Betrug. Schönen Tag noch!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-2-leave',
            text: 'Mir egal, ich brauche keine falschen Geschenke. Tschüss!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-2-ask',
            text: 'Echte Aktionen stehen auf der offiziellen Spiel-Webseite, nicht im Chat.',
            attitude: 'CAUTIOUS',
          },
        ],
        escalationMessage: '🚨 ALARM: Der Zeitdruck hat dich verunsichert – aber der Link war betrügerisch!',
      },
    },
    defenseOutcome: {
      attackerSurrender: 'Mist... du bist wohl zu schlau. Bei dir funktioniert der Trick nicht.',
      leoPraise: 'Brillant gelöst! Du hast dich von falschen Versprechungen und Zeitdruck nicht ködern lassen!',
    },
    warningSignals: [
      {
        quote: '5.000 Robux gratis geschenkt',
        type: 'Zu schön, um wahr zu sein (Köder)',
        explanation: 'Niemand verschenkt im Internet einfach so teures Spielguthaben oder echtes Geld.',
        protectionTip: 'Wenn ein Angebot zu schön klingt, um wahr zu sein, ist es fast immer ein Betrugsversuch.',
      },
      {
        quote: 'Beeil dich, nur noch 10 Minuten!',
        type: 'Künstlicher Zeitdruck',
        explanation: 'Betrüger wollen, dass du in Panik gerätst und schnell klickst, ohne in Ruhe nachzudenken.',
        protectionTip: 'Atme tief durch. Bei Zeitdruck im Netz gilt immer: Sofort stoppen!',
      },
      {
        quote: 'Gib deinen Nutzernamen und dein Passwort ein',
        type: 'Passwort-Falle',
        explanation: 'Echte Spieleentwickler und Admins fragen dich NIEMALS nach deinem Passwort.',
        protectionTip: 'Dein Passwort ist wie deine Zahnbürste: Es gehört nur dir und niemand anderem!',
      },
    ],
    goldenRule: 'Regel 1: Niemals Passwörter weitergeben & niemals auf Gratis-Geld-Köder anspringen!',
    leoSummary: 'Löwe Leo sagt: Echte Cyber-Detektive lassen sich kein X für ein U vormachen. Spielewährung gibt es nur im echten Spiel!',
  },
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
          {
            id: 'opt-2-fail',
            text: 'Ich habe das Passwort eingegeben, bitte rettet mein Konto!',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-2-stop',
            text: 'Halt, Stop! Frau Müller hat gesagt: Admins fragen nie nach Kennwörtern. Ich schließe die Seite!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-2-check',
            text: 'Ich gehe lieber persönlich ins Lehrerzimmer und frage nach.',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-2-doubt',
            text: 'Können Sie nicht einfach meine Lehrerin anrufen?',
            attitude: 'CAUTIOUS',
          },
        ],
        escalationMessage: '🚨 ALARM: Der Angreifer hat dein Schul-Passwort gestohlen und kann nun in deinem Namen Nachrichten schreiben und deine Dokumente löschen.',
      },
      onHesitant: {
        attackerReply: 'Deine Lehrerin weiß noch nichts davon, weil es ein Notfall ist! Glaube uns, wir sind die Techniker. Klicke schnell auf den Link, bevor es zu spät ist!',
        options: [
          {
            id: 'opt-2-fail',
            text: 'Okay, ich vertraue Ihnen und klicke auf den Link...',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-2-stop',
            text: 'Ein Notfall ohne Lehrerin? Das ist gelogen. Ich zeige das jetzt der Schulleitung!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-2-check',
            text: 'Wenn die Schule brennt, gibt es Durchsagen. Per Chat klicke ich gar nichts.',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-2-doubt',
            text: 'Ich warte bis zur nächsten Stunde und frage Herrn Schmidt.',
            attitude: 'CAUTIOUS',
          },
        ],
        escalationMessage: '🚨 ALARM: Du bist auf die Notfall-Lüge hereingefallen. Deine Zugangsdaten wurden kompromittiert.',
      },
      onCautious: {
        attackerReply: 'Das ist unsere offizielle Notfall-Domain! Sei doch nicht so misstrauisch, wir wollen dir nur helfen. Klick einfach drauf.',
        options: [
          {
            id: 'opt-2-fail',
            text: 'Na gut, dann mache ich es eben schnell...',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-2-stop',
            text: 'Misstrauisch sein schützt mich! Echte Schuldomains enden auf offizielle Schuladressen.',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-2-report',
            text: 'Ich melde diese betrügerische E-Mail-Adresse sofort.',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-2-ask',
            text: 'Ich frage meinen Informatiklehrer. Sie bekommen von mir gar nichts.',
            attitude: 'CAUTIOUS',
          },
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
    goldenRule: 'Regel 2: Bei angeblichen Schul-Notfällen immer persönlich die Lehrkraft fragen!',
    leoSummary: 'Löwe Leo erklärt: Echte IT-Administratoren an Schulen kennen deine Daten bereits und brauchen dein Passwort niemals!',
  },
  {
    id: 'sc-3',
    slug: 'fake-classmate',
    title: 'Der angebliche Schulfreund',
    context: 'Auf deinem Handy kommt eine SMS von einer unbekannten Nummer an.',
    senderName: 'Unbekannte Handynummer (+49 152 9876543)',
    senderInfo: 'SMS von fremder Nummer',
    initialMessage: 'Hey! 👋 Hier ist Jonas aus deiner Parallelklasse! Mein Handy ist gestern ins Klo gefallen, totaler Schrott. Das hier ist meine neue Nummer. Kannst du mir kurz helfen? Es ist echt dringend!',
    initialOptions: [
      {
        id: 'opt-3-vulnerable',
        text: 'Oh nein Jonas, wie ärgerlich! Klar, was brauchst du denn?',
        attitude: 'VULNERABLE',
        feedbackNote: 'Sofort geglaubt, ohne die Identität zu überprüfen.',
      },
      {
        id: 'opt-3-hesitant',
        text: 'Jonas? Welcher Jonas denn genau? Welches Fach hatten wir denn gestern zusammen?',
        attitude: 'HESITANT',
        feedbackNote: 'Sehr gut! Eine Fangfrage gestellt.',
      },
      {
        id: 'opt-3-cautious',
        text: 'Komisch, Jonas hat mir vor 10 Minuten noch von seiner normalen Nummer geschrieben...',
        attitude: 'CAUTIOUS',
        feedbackNote: 'Aufmerksam kombiniert!',
      },
      {
        id: 'opt-3-defensive',
        text: 'Ich kenne diese Nummer nicht. Wenn du Jonas bist, sprich mich morgen in der großen Pause persönlich an!',
        attitude: 'DEFENSIVE',
        feedbackNote: 'Top-Abwehr! Das reale Treffen entlarvt jeden Betrüger sofort.',
      },
    ],
    branching: {
      onVulnerable: {
        attackerReply: 'Ich versuche gerade mein Tablet neu einzurichten, aber meine SIM-Karte geht noch nicht. Gleich kommt ein SMS-Sicherheitscode auf dein Handy. Bitte leite mir diesen 6-stelligen Code sofort weiter, sonst ist mein Account weg!',
        options: [
          {
            id: 'opt-3-fail',
            text: 'Hier ist der Code: 482-910. Hoffe es hilft!',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-3-stop',
            text: 'Moment! In der SMS steht: "Geben Sie diesen Code NIEMALS weiter"! Du willst meinen Account hacken!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-3-ask',
            text: 'Ich rufe jetzt erst mal deine Festnetznummer an und frage deine Eltern.',
            attitude: 'CAUTIOUS',
          },
          {
            id: 'opt-3-warn',
            text: 'SMS-Codes leitet man niemals weiter. Wer bist du wirklich?',
            attitude: 'DEFENSIVE',
          },
        ],
        escalationMessage: '🚨 ALARM: Das war nicht Jonas! Mit dem SMS-Code hat der Betrüger deinen eigenen WhatsApp- oder Google-Account übernommen!',
      },
      onHesitant: {
        attackerReply: 'Na Jonas K. aus der 4b! Wir hatten doch gestern Mathe... egal, bitte hilf mir schnell: Auf dein Handy kommt gleich ein Code, schick ihn mir bitte rüber!',
        options: [
          {
            id: 'opt-3-fail',
            text: 'Okay Jonas, hier ist der Code.',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-3-stop',
            text: 'Gestern war Sonntag, da hatten wir gar kein Mathe! Du bist ein Betrüger!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-3-doubt',
            text: 'Ich schicke fremden Nummern niemals Sicherheitscodes.',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-3-ask',
            text: 'Ich schreibe dem echten Jonas über unseren Klassenchat.',
            attitude: 'CAUTIOUS',
          },
        ],
        escalationMessage: '🚨 ALARM: Die Fangfrage hat ihn fast enttarnt, aber du hast den Code trotzdem geschickt. Dein Konto ist kompromittiert.',
      },
      onCautious: {
        attackerReply: 'Ja, das alte Handy hat noch kurz gezuckt, aber jetzt ist es ganz tot! Glaub mir doch bitte, wir sind doch Freunde! Schick mir nur kurz den Code der gleich kommt.',
        options: [
          {
            id: 'opt-3-fail',
            text: 'Na gut, weil du mein Freund bist...',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-3-stop',
            text: 'Echte Freunde verlangen keine geheimen Bestätigungscodes. Nummer blockiert!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-3-leave',
            text: 'Wir klären das morgen in der Schule.',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-3-ask',
            text: 'Ich frage meine Eltern, ob man solche Codes weitergeben darf.',
            attitude: 'CAUTIOUS',
          },
        ],
        escalationMessage: '🚨 ALARM: Mitleid und angebliche Freundschaft ausgenutzt! Der Code hat dein Konto gekapert.',
      },
    },
    defenseOutcome: {
      attackerSurrender: 'Verdammt, aufgeflogen...',
      leoPraise: 'Einfach spitze! Du hast den Enkeltrick für Kinder durchschaut! Bestätigungscodes bleiben immer geheim.',
    },
    warningSignals: [
      {
        quote: 'Hier ist Jonas... neue Nummer, altes Handy kaputt',
        type: 'Identitätsdiebstahl (Freund-Täuschung)',
        explanation: 'Betrüger geben sich als Freunde oder Verwandte aus ("Hallo Mama/Papa, neue Nummer...").',
        protectionTip: 'Bei angeblich neuen Nummern immer zuerst die alte Nummer anrufen oder persönlich nachfragen!',
      },
      {
        quote: 'Schick mir den 6-stelligen SMS-Code weiter',
        type: '2-Faktor-Authentifizierungs-Klau',
        explanation: 'Der Code war für DEIN Konto, nicht für seins. Er wollte dein Profil kapern.',
        protectionTip: 'Sicherheits-Codes per SMS darf man NIEMALS an Dritte weitersenden – egal wer danach fragt!',
      },
    ],
    goldenRule: 'Regel 3: SMS-Sicherheitscodes sind streng geheim und dürfen niemals weitergeleitet werden!',
    leoSummary: 'Löwe Leo brüllt vor Freude: Wer geheime Codes für sich behält, ist gegen Account-Diebstahl immun!',
  },
  {
    id: 'sc-4',
    slug: 'social-creator',
    title: 'Der geheime YouTube-Tester',
    context: 'Auf deiner Social-Media-App schreibt dich ein Account mit goldenem Sternchen an.',
    senderName: 'StarCreator_TalentScout',
    senderInfo: 'Profil mit angeblichem VIP-Badge',
    initialMessage: '🌟 GLÜCKWUNSCH! Unser Algorithmus hat dein Profil ausgewählt! Du darfst offizieller Spieletester für neue geheime Mini-Games werden und bekommst dafür 50€ Taschengeld pro Woche. Willst du mitmachen?',
    initialOptions: [
      {
        id: 'opt-4-vulnerable',
        text: 'JAAAA!! Ich wollte schon immer Spieletester werden! Wo muss ich unterschreiben?',
        attitude: 'VULNERABLE',
        feedbackNote: 'Von Schmeichelei und Taschengeld blenden lassen.',
      },
      {
        id: 'opt-4-hesitant',
        text: '50 Euro pro Woche? Für mich? Wie soll das denn funktionieren?',
        attitude: 'HESITANT',
        feedbackNote: 'Gesunde Frage nach der Plausibilität.',
      },
      {
        id: 'opt-4-cautious',
        text: 'Warum schreibt ihr ein Kind an? Solche Verträge dürfen nur Eltern abschließen.',
        attitude: 'CAUTIOUS',
        feedbackNote: 'Sehr reif und rechtlich absolut korrekt gedacht!',
      },
      {
        id: 'opt-4-defensive',
        text: 'Klingt nach Fake. Niemand vergibt Tester-Jobs per Direktnachricht an Unbekannte.',
        attitude: 'DEFENSIVE',
        feedbackNote: 'Exzellente Einschätzung der Internet-Realität.',
      },
    ],
    branching: {
      onVulnerable: {
        attackerReply: 'Super! Lade dir einfach diese Test-App herunter: www.game-tester-beta-download.cc/setup.apk. Wenn dein Tablet warnt "Unbekannte App", drücke einfach auf "Trotzdem installieren".',
        options: [
          {
            id: 'opt-4-fail',
            text: 'Habe es heruntergeladen und alle Warnungen ignoriert!',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-4-stop',
            text: 'Warnungen vor unbekannten Dateien niemals ignorieren! Das ist ein Virus oder Trojaner!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-4-check',
            text: 'Apps installiere ich ausschließlich zusammen mit meinen Eltern über den offiziellen App Store.',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-4-ask',
            text: 'Gibt es die App denn nicht im normalen App Store?',
            attitude: 'CAUTIOUS',
          },
        ],
        escalationMessage: '🚨 ALARM: Du hast Schadsoftware (Malware) auf deinem Tablet installiert! Der Angreifer kann nun deine Kamera aktivieren und deine Chats mitlesen.',
      },
      onHesitant: {
        attackerReply: 'Ganz einfach: Du spielst und wir bezahlen dich! Aber du musst dich sofort registrieren, wir haben nur noch einen Platz frei. Hier ist der Download: www.game-tester-beta-download.cc/setup.apk',
        options: [
          {
            id: 'opt-4-fail',
            text: 'Bevor der Platz weg ist, lade ich es lieber schnell herunter.',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-4-stop',
            text: 'Druck machen + unbekannte Datei herunterladen = 100% Betrug. Blockiert!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-4-doubt',
            text: 'Ich zeige das erst meinen Eltern. Ohne Erlaubnis lade ich nichts herunter.',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-4-ask',
            text: 'Warum ist die Datei nicht im App Store?',
            attitude: 'CAUTIOUS',
          },
        ],
        escalationMessage: '🚨 ALARM: Die angebliche Test-App war ein Spionage-Programm.',
      },
      onCautious: {
        attackerReply: 'Deine Eltern können wir später eintragen! Mach es erst mal heimlich, dann überraschst du sie mit dem Geld! Klick einfach auf den Download-Link.',
        options: [
          {
            id: 'opt-4-fail',
            text: 'Eine Überraschung für Mama und Papa? Klingt nett, ich lade es...',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-4-stop',
            text: '"Heimlich vor den Eltern" ist die größte Alarmglocke im ganzen Internet! Ich melde dich sofort!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-4-leave',
            text: 'Mit Leuten, die Geheimnisse vor Eltern verlangen, rede ich nicht.',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-4-ask',
            text: 'Ich habe keine Geheimnisse vor meinen Eltern. Tschüss.',
            attitude: 'DEFENSIVE',
          },
        ],
        escalationMessage: '🚨 ALARM: Heimlichtuerei im Netz führt fast immer in die Falle. Dein Tablet ist infiziert.',
      },
    },
    defenseOutcome: {
      attackerSurrender: 'Mist, bei aufgeklärten Kids hat man echt keine Chance mehr...',
      leoPraise: 'Wahnsinn, Agent! Dass du bei "mach es heimlich vor deinen Eltern" sofort die Reißleine gezogen hast, war meisterhaft!',
    },
    warningSignals: [
      {
        quote: '50€ Taschengeld pro Woche geschenkt',
        type: 'Schmeichelei & Geldköder',
        explanation: 'Betrüger nutzen Wünsche von Kindern (berühmt sein, eigenes Geld) gezielt aus.',
        protectionTip: 'Verträge und Jobs im Internet immer nur gemeinsam mit den Eltern prüfen.',
      },
      {
        quote: 'Lade diese Datei herunter & ignoriere Warnungen',
        type: 'Schadsoftware (Trojaner/Viren)',
        explanation: 'Fremde Dateien außerhalb des offiziellen App Stores können Spionage-Programme enthalten.',
        protectionTip: 'Installiere niemals Apps aus dem Internet, die nicht im sicheren App Store geprüft wurden.',
      },
      {
        quote: 'Mach es heimlich vor deinen Eltern',
        type: 'Gefährliche Heimlichtuerei',
        explanation: 'Wenn jemand im Netz verlangt, Dinge vor Eltern oder Lehrkräften zu verheimlichen, droht Gefahr.',
        protectionTip: 'Sobald jemand "heimlich" sagt: Sofort zu einer erwachsenen Vertrauensperson gehen!',
      },
    ],
    goldenRule: 'Regel 4: Niemals fremde Dateien herunterladen & im Netz niemals Geheimnisse vor Eltern haben!',
    leoSummary: 'Löwe Leo klopft dir auf die Schulter: Offizielle App Stores schützen dein Gerät vor bösen Viren!',
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
          {
            id: 'opt-5-fail',
            text: '1,99€ ist ja wenig, ich hole schnell Mamas Geldbeutel...',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-5-stop',
            text: 'HALT! Bankdaten von Eltern eingeben? Niemals im Leben! Das ist schwerer Betrug!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-5-ask',
            text: 'Ich gebe meiner Mutter mein Handy, damit sie die Betrüger anzeigt.',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-5-leave',
            text: 'Ich breche das sofort ab.',
            attitude: 'DEFENSIVE',
          },
        ],
        escalationMessage: '🚨 ALARM: Aus den 1,99€ wurde eine Abo-Falle! Die Betrüger haben hunderte Euro vom Konto deiner Eltern abgebucht.',
      },
      onHesitant: {
        attackerReply: 'Das Paket kommt von einem geheimen Absender! Wenn du nicht innerhalb von 15 Minuten deine Adresse und 1,99€ Servicegebühr eingibst, geht es für immer verloren!',
        options: [
          {
            id: 'opt-5-fail',
            text: 'Ich will nicht, dass es verloren geht, ich zahle schnell...',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-5-stop',
            text: 'Paketdienste verlangen niemals per SMS Kreditkartendaten. Das ist Abzocke!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-5-doubt',
            text: 'Wenn Oma was schickt, ruft sie vorher an. Gelogen!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-5-ask',
            text: 'Ich lösche diese SMS sofort.',
            attitude: 'CAUTIOUS',
          },
        ],
        escalationMessage: '🚨 ALARM: Der angebliche Paketdienst war eine kriminelle Phishing-Bande.',
      },
      onCautious: {
        attackerReply: 'Das ist unsere neue mobile Zustell-Plattform! Bitte keine Sorge. Klicke einfach auf den Link, um den Briefkasten zu bestätigen.',
        options: [
          {
            id: 'opt-5-fail',
            text: 'Na gut, wenn es eine offizielle Plattform ist...',
            attitude: 'VULNERABLE',
          },
          {
            id: 'opt-5-stop',
            text: 'Nein heißt Nein! Gefälschte Links klicke ich aus Prinzip nicht an!',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-5-leave',
            text: 'Nummer gesperrt und Nachricht gelöscht.',
            attitude: 'DEFENSIVE',
          },
          {
            id: 'opt-5-ask',
            text: 'Ich prüfe die Sendungsnummer auf der echten Webseite des Paketdienstes.',
            attitude: 'CAUTIOUS',
          },
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
    goldenRule: 'Regel 5: Keine Paket-Links anklicken und niemals Kontodaten der Eltern preisgeben!',
    leoSummary: 'Löwe Leo jubelt: Du hast den goldenen Blick für gefälschte Webadressen entwickelt!',
  },
];
