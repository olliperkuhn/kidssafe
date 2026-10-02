import { PhishingScenarioTemplate } from './types';

export const GAMING_SCENARIOS: PhishingScenarioTemplate[] = [
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
          { id: 'opt-2-fail', text: 'Super, ich tippe mein Passwort sofort ein!', attitude: 'VULNERABLE' },
          { id: 'opt-2-stop', text: 'Moment mal! Mein Passwort gebe ich niemals ein! Das ist eine Phishing-Falle!', attitude: 'DEFENSIVE' },
          { id: 'opt-2-hesitate', text: 'Muss man da wirklich das Passwort angeben? Das darf ich eigentlich nicht...', attitude: 'HESITANT' },
          { id: 'opt-2-ask', text: 'Ich frage erst mal meine Eltern oder meine Lehrkraft, ob dieser Link sicher ist.', attitude: 'CAUTIOUS' },
        ],
        escalationMessage: '🚨 ALARM: Du hast dein Passwort auf einer fremden Webseite eingegeben! Der Angreifer hat nun die Kontrolle über deinen Spiele-Account und dein Inventar gestohlen.',
      },
      onHesitant: {
        attackerReply: 'Nein, 100% kostenlos, versprochen! Ich schwöre es auf meine Ehre! Klick einfach hier auf mega-free-robux-glitch.net und gib deine Login-Daten ein, bevor der Entwickler den Fehler bemerkt!',
        options: [
          { id: 'opt-2-fail', text: 'Na gut, wenn du schwörst... hier sind meine Daten.', attitude: 'VULNERABLE' },
          { id: 'opt-2-stop', text: 'Wer schwören muss, lügt meistens! Niemals gebe ich mein Passwort weiter. Blockiert!', attitude: 'DEFENSIVE' },
          { id: 'opt-2-ask', text: 'Das ist mir zu verdächtig. Ich klicke nichts an und schließe das Spiel.', attitude: 'CAUTIOUS' },
          { id: 'opt-2-report', text: 'Ich melde dein Profil jetzt dem Spiele-Support wegen Phishing-Versuch.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Die Versprechungen waren gelogen! Deine Daten wurden abgefangen und dein Account ist gesperrt.',
      },
      onCautious: {
        attackerReply: 'Ich will doch nur nett sein zu anderen Spielern! Glaubst du mir etwa nicht? Wenn du nicht in 2 Minuten auf den Link klickst, bekommt die Robux eben jemand anderes!',
        options: [
          { id: 'opt-2-fail', text: 'Warte, nicht weggeben! Ich klicke doch!', attitude: 'VULNERABLE' },
          { id: 'opt-2-stop', text: 'Künstlicher Zeitdruck ist das klassische Zeichen für Betrug. Schönen Tag noch!', attitude: 'DEFENSIVE' },
          { id: 'opt-2-leave', text: 'Mir egal, ich brauche keine falschen Geschenke. Tschüss!', attitude: 'DEFENSIVE' },
          { id: 'opt-2-ask', text: 'Echte Aktionen stehen auf der offiziellen Spiel-Webseite, nicht im Chat.', attitude: 'CAUTIOUS' },
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
    goldenRule: 'Regel: Niemals Passwörter weitergeben & niemals auf Gratis-Geld-Köder anspringen!',
    leoSummary: 'Löwe Leo sagt: Echte Cyber-Detektive lassen sich kein X für ein U vormachen. Spielewährung gibt es nur im echten Spiel!',
  },
  {
    id: 'sc-6',
    slug: 'discord-nitro-fake',
    title: 'Das kostenlose Discord-Nitro-Geschenk',
    context: 'Auf einem großen Spiele-Discord-Server erhältst du plötzlich eine private Direktnachricht von einem offiziell wirkenden Bot.',
    senderName: 'Discord_Nitro_Gift_Bot',
    senderInfo: 'Angeblicher Geschenk-Bot (Unbekannte Direktnachricht)',
    initialMessage: '🎁 GLÜCKWUNSCH! Du wurdest als Gewinner für 3 Monate kostenloses Discord Nitro ausgewählt! Klicke hier, um dein Geschenk einzulösen: https://discoord-nitro-drop.ru/claim?gift=98412',
    initialOptions: [
      {
        id: 'opt-6-vulnerable',
        text: 'Hammer, 3 Monate Nitro geschenkt! Ich klicke sofort auf den Link!',
        attitude: 'VULNERABLE',
        feedbackNote: 'Sofort auf das Gratis-Abo angesprungen.',
      },
      {
        id: 'opt-6-hesitant',
        text: 'Nitro geschenkt von einem fremden Bot? Kostet das später Geld?',
        attitude: 'HESITANT',
        feedbackNote: 'Gute Skepsis vor versteckten Kosten.',
      },
      {
        id: 'opt-6-cautious',
        text: 'Moment: Die Domain heißt "discoord" mit zwei "o" und endet auf ".ru"? Das ist doch gefälscht!',
        attitude: 'CAUTIOUS',
        feedbackNote: 'Sensationell! Den Tippfehler in der Webadresse (Typosquatting) entlarvt.',
      },
      {
        id: 'opt-6-defensive',
        text: 'Fake-Bot und Phishing-Link! Echte Nitro-Geschenke laufen direkt in der App. Bot blockieren & melden!',
        attitude: 'DEFENSIVE',
        feedbackNote: 'Perfekt abgewehrt! Betrügerische Bots sofort gemeldet.',
      },
    ],
    branching: {
      onVulnerable: {
        attackerReply: 'Auf der Webseite öffnet sich ein Fenster: "Logge dich mit deinem Discord-Account und Passwort ein, um Nitro zu aktivieren. Nur noch 5 Geschenke verfügbar!"',
        options: [
          { id: 'opt-6-fail', text: 'Ich tippe schnell meine Discord-E-Mail und mein Passwort ein!', attitude: 'VULNERABLE' },
          { id: 'opt-6-stop', text: 'Stopp! Auf fremden Links tippe ich niemals meine Login-Daten ein!', attitude: 'DEFENSIVE' },
          { id: 'opt-6-ask', text: 'Ich frage einen Freund im Voice-Chat, ob dieser Bot echt ist.', attitude: 'CAUTIOUS' },
          { id: 'opt-6-report', text: 'Das ist ein Account-Klau! Ich schließe das Browserfenster sofort.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Der Angreifer hat deinen Discord-Account gekapert (Token-Stealer) und verschickt nun in deinem Namen Phishing-Nachrichten an deine Freunde!',
      },
      onHesitant: {
        attackerReply: 'Das Angebot ist 100% gratis von Discord gesponsert! Du musst dich nur beeilen, der Link verfällt in 3 Minuten!',
        options: [
          { id: 'opt-6-fail', text: 'Wenn es gleich verfällt, klicke ich lieber schnell.', attitude: 'VULNERABLE' },
          { id: 'opt-6-stop', text: 'Wieder künstlicher Zeitdruck! Das ist ein typischer Betrugsversuch.', attitude: 'DEFENSIVE' },
          { id: 'opt-6-leave', text: 'Ich brauche kein Nitro von dubiosen Bots. Bye!', attitude: 'DEFENSIVE' },
          { id: 'opt-6-report', text: 'Ich melde den Bot den Server-Moderatoren.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Trotz Bedenken geklickt – deine Zugangsdaten wurden gestohlen.',
      },
      onCautious: {
        attackerReply: 'Nein, das ist unser internationaler Server! Keine Sorge, alles ist sicher. Klick einfach drauf.',
        options: [
          { id: 'opt-6-fail', text: 'Na gut, wenn es ein internationaler Server ist...', attitude: 'VULNERABLE' },
          { id: 'opt-6-stop', text: 'Gefälschte Domains mit Tippfehlern bleiben Betrug. Abgelehnt!', attitude: 'DEFENSIVE' },
          { id: 'opt-6-report', text: 'Ich sperre Direktnachrichten von Nicht-Freunden.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Du hast dich überreden lassen. Dein Account wurde übernommen.',
      },
    },
    defenseOutcome: {
      attackerSurrender: 'Verflixt... der Trick mit der Fake-Domain hat nicht geklappt.',
      leoPraise: 'Scharfsinnig, Agent! Typosquatting (Domain-Fälschung mit Schreibfehlern) hast du sofort entlarvt!',
    },
    warningSignals: [
      {
        quote: 'discoord-nitro-drop.ru',
        type: 'Domain-Fälschung (Typosquatting)',
        explanation: 'Betrüger schmuggeln absichtlich kleine Tippfehler ein ("discoord" mit Doppel-O), um seriös zu wirken.',
        protectionTip: 'Prüfe jede Webadresse Buchstabe für Buchstabe. Das Original heißt discord.com!',
      },
      {
        quote: '3 Monate Nitro kostenlos geschenkt',
        type: 'Abonnement-Köder',
        explanation: 'Fremde Bots in DMs verschenken niemals kostenpflichtige Abos.',
        protectionTip: 'Misstraue unaufgeforderten Geschenken von Bots.',
      },
    ],
    goldenRule: 'Regel: Echte App-Geschenke erfordern niemals Logins auf fremden Webseiten mit Tippfehlern!',
    leoSummary: 'Löwe Leo schnurrt zufrieden: Wer auf die exakte Schreibweise von Internet-Links achtet, fällt nicht auf Phishing-Klone herein!',
  },
  {
    id: 'sc-7',
    slug: 'brawl-mod-apk',
    title: 'Der verbotene Brawl-Stars-Skin-Mod',
    context: 'Unter einem Spielevideo siehst du einen Link zu einem angeblichen Hack für dein Lieblingsspiel.',
    senderName: 'ModMaster_Hacks',
    senderInfo: 'Kommentar mit Link zu einer externen Download-Datei',
    initialMessage: '🔥 GEHEIM-LEAK: Mit dieser modifizierten App schaltest du ALLE legendären Brawler, Skins und 50.000 Edelsteine frei! Lade dir hier die Datei herunter: https://brawl-gems-mod.cc/brawl_hack_v3.apk',
    initialOptions: [
      {
        id: 'opt-7-vulnerable',
        text: 'Alle Skins und Edelsteine umsonst? Die APK lade ich mir sofort herunter!',
        attitude: 'VULNERABLE',
        feedbackNote: 'Leichtgläubig auf illegale Cheats reingefallen.',
      },
      {
        id: 'opt-7-hesitant',
        text: 'Wird mein Account nicht für immer gebannt, wenn die Entwickler merken, dass ich Cheats nutze?',
        attitude: 'HESITANT',
        feedbackNote: 'Sehr gut nachgedacht: Cheats verstoßen gegen die Spielregeln.',
      },
      {
        id: 'opt-7-cautious',
        text: 'Eine APK-Datei aus dem Internet? Mein Tablet warnt, dass fremde Installationsdateien gefährlich sind.',
        attitude: 'CAUTIOUS',
        feedbackNote: 'Exzellente Vorsicht vor dubiosen Dateidownloads.',
      },
      {
        id: 'opt-7-defensive',
        text: 'Solche "Mod-APKs" enthalten fast immer Viren und Trojaner! Ich spiele fair und lade Apps nur aus dem offiziellen Store.',
        attitude: 'DEFENSIVE',
        feedbackNote: 'Perfekt gelöst! Fairness und Malware-Schutz auf den Punkt gebracht.',
      },
    ],
    branching: {
      onVulnerable: {
        attackerReply: 'Dein Tablet zeigt eine Warnung: "Schädliche Datei: Möchtest du brawl_hack_v3.apk trotzdem installieren?" Der Download-Tipp sagt: "Einfach auf Trotzdem Installieren tippen, das ist ganz normal!"',
        options: [
          { id: 'opt-7-fail', text: 'Okay, ich ignoriere die Sicherheitswarnung und installiere es trotzdem!', attitude: 'VULNERABLE' },
          { id: 'opt-7-stop', text: 'Nein! Sicherheitswarnungen des Geräts ignoriert man niemals! Abbrechen & löschen!', attitude: 'DEFENSIVE' },
          { id: 'opt-7-ask', text: 'Ich zeige das erst meinen Eltern und lösche die Datei vorsichtshalber.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Du hast einen Trojaner installiert! Die Schadsoftware hat deine Kamera- und Mikrofonrechte gekapert und liest alle Passwörter mit.',
      },
      onHesitant: {
        attackerReply: 'Keine Sorge, das Tool ist 100% unbannbar! Es hat einen Anti-Ban-Schutz. Lade es schnell, bevor der Link gelöscht wird!',
        options: [
          { id: 'opt-7-fail', text: 'Wenn es unbannbar ist, probiere ich es mal aus.', attitude: 'VULNERABLE' },
          { id: 'opt-7-stop', text: '"Unbannbar" behaupten alle Betrüger. Ich riskiere meinen Account nicht!', attitude: 'DEFENSIVE' },
          { id: 'opt-7-report', text: 'Ich melde das Video und den schädlichen Download-Link.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Der Entwickler hat deinen Account sofort gesperrt und die Datei hat Viren auf dein Gerät geladen.',
      },
      onCautious: {
        attackerReply: 'Das System warnt nur, weil die App nicht im Store ist! Sei kein Angsthase, Millionen Spieler nutzen das!',
        options: [
          { id: 'opt-7-fail', text: 'Ich will kein Angsthase sein, also installiere ich es...', attitude: 'VULNERABLE' },
          { id: 'opt-7-stop', text: 'Vorsicht ist keine Feigheit, sondern Intelligenz! Ich installiere nichts!', attitude: 'DEFENSIVE' },
          { id: 'opt-7-leave', text: 'Lieber ehrlich spielen als sich das Smartphone mit Viren zu ruinieren.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Gruppendruck hat dich verleitet. Das Gerät ist mit Adware und Malware verseucht.',
      },
    },
    defenseOutcome: {
      attackerSurrender: 'Mist... du lässt dich durch kostenlose Cheats nicht reinlegen.',
      leoPraise: 'Richtig stark! Du hast verstanden, dass fremde APK-Dateien riesige Sicherheitsrisiken sind und faire Spieler keine Hacks brauchen!',
    },
    warningSignals: [
      {
        quote: 'brawl_hack_v3.apk / Unbekannte Datei',
        type: 'Schadsoftware (Trojaner/Malware)',
        explanation: 'Fremde .apk- oder .exe-Dateien außerhalb offizieller Stores enthalten fast immer Schadcode.',
        protectionTip: 'Installiere niemals Apps aus dubiosen Download-Links.',
      },
      {
        quote: 'Sicherheitswarnung einfach ignorieren',
        type: 'Aushebeln von Schutzmechanismen',
        explanation: 'Betrüger fordern Kinder auf, die Warnmeldungen des Betriebssystems wegzuklicken.',
        protectionTip: 'Wenn dein Gerät vor einer Datei warnt: Immer sofort abbrechen!',
      },
    ],
    goldenRule: 'Regel: Niemals fremde APK- oder Setup-Dateien installieren und Warnhinweise des Geräts niemals ignorieren!',
    leoSummary: 'Löwe Leo brüllt zustimmend: Ein echter Meisterspieler siegt durch Können und schützt sein Handy vor dubiosen Hacks!',
  },
];
