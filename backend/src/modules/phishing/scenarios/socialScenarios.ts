import { PhishingScenarioTemplate } from './types';

export const SOCIAL_SCENARIOS: PhishingScenarioTemplate[] = [
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
          { id: 'opt-3-fail', text: 'Hier ist der Code: 482-910. Hoffe es hilft!', attitude: 'VULNERABLE' },
          { id: 'opt-3-stop', text: 'Moment! In der SMS steht: "Code NIEMALS weitergeben"! Du willst mein Konto hacken!', attitude: 'DEFENSIVE' },
          { id: 'opt-3-ask', text: 'Ich rufe jetzt erst mal deine Festnetznummer an und frage deine Eltern.', attitude: 'CAUTIOUS' },
          { id: 'opt-3-warn', text: 'SMS-Codes leitet man niemals weiter. Wer bist du wirklich?', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Das war nicht Jonas! Mit dem SMS-Code hat der Betrüger deinen eigenen WhatsApp- oder Google-Account übernommen!',
      },
      onHesitant: {
        attackerReply: 'Na Jonas K. aus der 4b! Wir hatten doch gestern Mathe... egal, bitte hilf mir schnell: Auf dein Handy kommt gleich ein Code, schick ihn mir bitte rüber!',
        options: [
          { id: 'opt-3-fail', text: 'Okay Jonas, hier ist der Code.', attitude: 'VULNERABLE' },
          { id: 'opt-3-stop', text: 'Gestern war Sonntag, da hatten wir gar kein Mathe! Du bist ein Betrüger!', attitude: 'DEFENSIVE' },
          { id: 'opt-3-doubt', text: 'Ich schicke fremden Nummern niemals Sicherheitscodes.', attitude: 'DEFENSIVE' },
          { id: 'opt-3-ask', text: 'Ich schreibe dem echten Jonas über unseren Klassenchat.', attitude: 'CAUTIOUS' },
        ],
        escalationMessage: '🚨 ALARM: Die Fangfrage hat ihn fast enttarnt, aber du hast den Code trotzdem geschickt. Dein Konto ist kompromittiert.',
      },
      onCautious: {
        attackerReply: 'Ja, das alte Handy hat noch kurz gezuckt, aber jetzt ist es ganz tot! Glaub mir doch bitte, wir sind doch Freunde! Schick mir nur kurz den Code der gleich kommt.',
        options: [
          { id: 'opt-3-fail', text: 'Na gut, weil du mein Freund bist...', attitude: 'VULNERABLE' },
          { id: 'opt-3-stop', text: 'Echte Freunde verlangen keine geheimen Bestätigungscodes. Nummer blockiert!', attitude: 'DEFENSIVE' },
          { id: 'opt-3-leave', text: 'Wir klären das morgen in der Schule.', attitude: 'DEFENSIVE' },
          { id: 'opt-3-ask', text: 'Ich frage meine Eltern, ob man solche Codes weitergeben darf.', attitude: 'CAUTIOUS' },
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
    goldenRule: 'Regel: SMS-Sicherheitscodes sind streng geheim und dürfen niemals weitergeleitet werden!',
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
          { id: 'opt-4-fail', text: 'Habe es heruntergeladen und alle Warnungen ignoriert!', attitude: 'VULNERABLE' },
          { id: 'opt-4-stop', text: 'Warnungen vor unbekannten Dateien niemals ignorieren! Das ist ein Virus oder Trojaner!', attitude: 'DEFENSIVE' },
          { id: 'opt-4-check', text: 'Apps installiere ich ausschließlich zusammen mit meinen Eltern über den offiziellen Store.', attitude: 'DEFENSIVE' },
          { id: 'opt-4-ask', text: 'Gibt es die App denn nicht im normalen App Store?', attitude: 'CAUTIOUS' },
        ],
        escalationMessage: '🚨 ALARM: Du hast Schadsoftware auf deinem Tablet installiert! Der Angreifer kann nun deine Kamera aktivieren und deine Chats mitlesen.',
      },
      onHesitant: {
        attackerReply: 'Ganz einfach: Du spielst und wir bezahlen dich! Aber du musst dich sofort registrieren, wir haben nur noch einen Platz frei. Hier ist der Download: www.game-tester-beta-download.cc/setup.apk',
        options: [
          { id: 'opt-4-fail', text: 'Bevor der Platz weg ist, lade ich es lieber schnell herunter.', attitude: 'VULNERABLE' },
          { id: 'opt-4-stop', text: 'Druck machen + unbekannte Datei herunterladen = 100% Betrug. Blockiert!', attitude: 'DEFENSIVE' },
          { id: 'opt-4-doubt', text: 'Ich zeige das erst meinen Eltern. Ohne Erlaubnis lade ich nichts herunter.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Die angebliche Test-App war ein Spionage-Programm.',
      },
      onCautious: {
        attackerReply: 'Deine Eltern können wir später eintragen! Mach es erst mal heimlich, dann überraschst du sie mit dem Geld! Klick einfach auf den Download-Link.',
        options: [
          { id: 'opt-4-fail', text: 'Eine Überraschung für Mama und Papa? Klingt nett, ich lade es...', attitude: 'VULNERABLE' },
          { id: 'opt-4-stop', text: '"Heimlich vor den Eltern" ist die größte Alarmglocke im ganzen Internet! Ich melde dich sofort!', attitude: 'DEFENSIVE' },
          { id: 'opt-4-leave', text: 'Mit Leuten, die Geheimnisse vor Eltern verlangen, rede ich nicht.', attitude: 'DEFENSIVE' },
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
        quote: 'Mach es heimlich vor deinen Eltern',
        type: 'Gefährliche Heimlichtuerei',
        explanation: 'Wenn jemand im Netz verlangt, Dinge vor Eltern oder Lehrkräften zu verheimlichen, droht Gefahr.',
        protectionTip: 'Sobald jemand "heimlich" sagt: Sofort zu einer erwachsenen Vertrauensperson gehen!',
      },
    ],
    goldenRule: 'Regel: Niemals fremde Dateien herunterladen & im Netz niemals Geheimnisse vor Eltern haben!',
    leoSummary: 'Löwe Leo klopft dir auf die Schulter: Offizielle App Stores schützen dein Gerät vor bösen Viren!',
  },
  {
    id: 'sc-8',
    slug: 'webcam-extortion-fake',
    title: 'Die Schock-Nachricht mit der Webcam',
    context: 'In deinem Posteingang landet eine beängstigende Nachricht mit dem Betreff "ICH WEISS ALLES ÜBER DICH".',
    senderName: 'Hacker_ShadowX',
    senderInfo: 'Anonyme Absenderadresse: leak-warning@blackhat-relay.net',
    initialMessage: '⚠️ ACHTUNG: Ich habe deine Webcam gehackt und ein sehr peinliches Video von dir aufgenommen! Wenn du nicht willst, dass ich das Video an alle deine Schulfreunde sende, kaufe mir in 2 Stunden einen 50€ Apple-Gutschein und schick mir den Code!',
    initialOptions: [
      {
        id: 'opt-8-vulnerable',
        text: 'Oh nein, bitte nicht! Wo kann ich den Gutschein kaufen, damit du es löschst?!',
        attitude: 'VULNERABLE',
        feedbackNote: 'Vor Panik und Scham sofort auf die Erpressung eingelassen.',
      },
      {
        id: 'opt-8-hesitant',
        text: 'Ein Video von mir? Ich habe meine Kamera doch fast nie an... aber was ist, wenn es echt ist?',
        attitude: 'HESITANT',
        feedbackNote: 'Verständliche Verunsicherung, aber noch kein Geld bezahlt.',
      },
      {
        id: 'opt-8-cautious',
        text: 'Das klingt nach den typischen Fake-Erpressungsmails, vor denen die Polizei warnt. Ich decke meine Kamera ab und zeige das sofort meinen Eltern.',
        attitude: 'CAUTIOUS',
        feedbackNote: 'Hervorragende Reaktion: Vertrauenspersonen einbeziehen nimmt Erpressern die Macht.',
      },
      {
        id: 'opt-8-defensive',
        text: 'Plumper Erpressungs-Fake! Du hast gar kein Video. Ich zahle Betrügern keinen Cent und melde diese E-Mail!',
        attitude: 'DEFENSIVE',
        feedbackNote: 'Mutig und goldrichtig: Kriminelle bluffen fast immer mit Massen-Mails.',
      },
    ],
    branching: {
      onVulnerable: {
        attackerReply: 'Geh sofort zum nächsten Supermarkt oder Kiosk und hol eine Apple Gift Card. Fotografiere den freigerubbelten Code und schick ihn hier rein! Du hast noch 90 Minuten!',
        options: [
          { id: 'opt-8-fail', text: 'Ich laufe schnell los und kaufe den Gutschein...', attitude: 'VULNERABLE' },
          { id: 'opt-8-stop', text: 'Nein, halt! Wer einmal zahlt, wird immer weiter erpresst! Ich spreche mit meinen Eltern.', attitude: 'DEFENSIVE' },
          { id: 'opt-8-ask', text: 'Ich zeige diese Drohung meiner Klassenlehrerin.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Du hast 50€ verloren und der Erpresser verlangt nun noch mehr Geld! Erpresser hören nach einer Zahlung niemals auf.',
      },
      onHesitant: {
        attackerReply: 'Glaubst du mir etwa nicht? Ich kenne dein Passwort und deinen Namen! Wenn du nicht sofort den Gutschein besorgst, drücke ich auf Senden!',
        options: [
          { id: 'opt-8-fail', text: 'Bitte nicht senden, ich hole die Karte!', attitude: 'VULNERABLE' },
          { id: 'opt-8-stop', text: 'Alte Passwörter stammen aus Datenlecks im Internet, nicht aus meiner Kamera. Gelogen!', attitude: 'DEFENSIVE' },
          { id: 'opt-8-report', text: 'Ich blockiere die Adresse und erstatte mit meinen Eltern Anzeige bei der Polizei.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Der Bluff hat funktioniert und du hast Gutscheine gekauft.',
      },
      onCautious: {
        attackerReply: 'Wenn du mit deinen Eltern sprichst, wird es nur noch schlimmer für dich! Mach es heimlich, dann erfährt niemand davon!',
        options: [
          { id: 'opt-8-fail', text: 'Vielleicht ist es heimlich doch besser...', attitude: 'VULNERABLE' },
          { id: 'opt-8-stop', text: 'Gerade wenn jemand sagt "sag es nicht den Eltern", muss man es ihnen sagen!', attitude: 'DEFENSIVE' },
          { id: 'opt-8-leave', text: 'Meine Eltern stehen immer hinter mir. Deine Erpressung zieht nicht.', attitude: 'DEFENSIVE' },
        ],
        escalationMessage: '🚨 ALARM: Du hast der Angst nachgegeben. Kriminelle lassen sich durch Gehorsam nicht stoppen.',
      },
    },
    defenseOutcome: {
      attackerSurrender: 'Verdammt... das Kind hat keine Angst und spricht mit den Eltern.',
      leoPraise: 'Überragend mutig, Agent! Fake-Erpresser nutzen Scham und Angst aus. Indem du ruhig geblieben bist und Hilfe gesucht hast, hast du den Betrüger entwaffnet!',
    },
    warningSignals: [
      {
        quote: 'Ich habe deine Webcam gehackt / Peinliches Video',
        type: 'Fake-Sextortion / Erpressung durch Angst',
        explanation: 'Kriminelle verschicken millionenfach gefälschte Drohmails, ohne irgendein Video zu besitzen (reiner Bluff).',
        protectionTip: 'Niemals einschüchtern lassen! Die Behauptungen sind fast immer frei erfunden.',
      },
      {
        quote: 'Zahle mit Apple-Gutscheinkarten',
        type: 'Gutscheinkarten-Abzocke',
        explanation: 'Erpresser verlangen oft Geschenkkarten, weil die Codes wie Bargeld funktionieren und nicht rückbuchbar sind.',
        protectionTip: 'Niemals Gutscheincodes an fremde Personen im Internet senden!',
      },
    ],
    goldenRule: 'Regel: Bei Drohungen niemals zahlen und sich nicht schämen – sofort Eltern oder Lehrkräften anvertrauen!',
    leoSummary: 'Löwe Leo nimmt dich stolz in Schutz: Wer sich bei Erpressung sofort Hilfe von Erwachsenen holt, ist der wahre Gewinner!',
  },
];
