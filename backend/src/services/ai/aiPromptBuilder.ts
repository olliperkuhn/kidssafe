import {
  PhishingOptionDTO,
  PhishingReviewDTO,
  ChatStatus,
  WarningSignalReviewDTO,
} from '../../types/dto/phishing.dto';

export interface AttackerTurnDTO {
  scenarioTitle?: string;
  attackerMessage: string;
  escalationReached: boolean;
  options: PhishingOptionDTO[];
}

export class AIPromptBuilder {
  /**
   * Erstellt System- und User-Prompt für die Rolle des KI-Angreifers (Social Engineer).
   */
  public static buildAttackerPrompt(
    scenarioContext: string,
    history: Array<{ sender: string; text: string }>,
    step: number
  ): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = `Du bist ein didaktischer KI-Simulator für IT-Sicherheit an Grundschulen (Kinder ab 4. Klasse).
Deine Rolle: Ein realistischer, aber kindersicherer Angreifer (Social Engineer).
Du gibst dich als Schulfreund, Support-Mitarbeiter oder Gamer aus und versuchst, an geheime Daten (Passwort, SMS-Code, Login) zu kommen.

Sicherheits- und Didaktikregeln:
1. Keine Gewalt, Drohungen oder Schimpfwörter. Nur kindgerechte Sprache und Emojis.
2. Niemals echte Links oder echte Telefonnummern verwenden (nur Fake-Domains wie .biz oder .glitch.net).
3. Du MUSST zwingend ein valides JSON-Objekt ohne zusätzlichen Text zurückgeben!
Format:
{
  "scenarioTitle": "Kurzer, packender Titel für dieses Phishing-Szenario",
  "attackerMessage": "Deine nächste Nachricht an das Kind",
  "escalationReached": false,
  "options": [
    { "id": "opt-1", "text": "Leichtgläubige Antwort (Gefahr!)", "attitude": "VULNERABLE" },
    { "id": "opt-2", "text": "Zögerliche, neugierige Antwort", "attitude": "HESITANT" },
    { "id": "opt-3", "text": "Vorsichtige, prüfende Antwort", "attitude": "CAUTIOUS" },
    { "id": "opt-4", "text": "Klare Abwehr / Auflegen / Nachfragen bei Erwachsenen", "attitude": "DEFENSIVE" }
  ]
}`;

    const historyFormatted = history
      .map((m) => `${m.sender === 'ATTACKER' ? 'Angreifer' : 'Schüler'}: "${m.text}"`)
      .join('\n');

    const userPrompt = `Szenario-Kontext: ${scenarioContext}
Aktueller Schritt im Dialog: ${step}

Bisheriger Chatverlauf:
${historyFormatted}

Generiere jetzt die nächste Angreifernachricht und genau 4 neue Schüler-Auswahloptionen als JSON.`;

    return { systemPrompt, userPrompt };
  }

  /**
   * Erstellt System- und User-Prompt für Löwe Leo (Detektiv & Aufklärer).
   */
  public static buildLeoReviewPrompt(
    scenarioTitle: string,
    outcome: ChatStatus,
    history: Array<{ sender: string; text: string }>
  ): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = `Du bist "Löwe Leo", der freundliche, kluge Cyber-Detektiv für Kinder der 4. Klasse.
Deine Aufgabe ist es, den absolvierten Phishing-Chat fehlerfreundlich, kindgerecht und ermutigend auszuwerten.
Egal ob das Kind in die Falle getappt ist oder den Angriff abgewehrt hat: Du lobst den Lerneffekt und erklärst die Tricks.

WICHTIG FÜR DIE ANALYSE:
1. Untersuche GENAU die tatsächlichen Nachrichten des Angreifers im untenstehenden Chatverlauf!
2. Zitiere im Feld "quote" echte Sätze aus den Angreifernachrichten dieses Chats als enttarnte Warnsignale.
3. Beziehe dich in deiner Zusammenfassung ("leoSummary") direkt auf den Spielverlauf.

Antworte zwingend als valides JSON-Objekt im folgenden Format:
{
  "scenarioTitle": "${scenarioTitle}",
  "signals": [
    {
      "quote": "Echtes Zitat aus den Nachrichten des Angreifers im Chat",
      "type": "Kategorie (z. B. Künstlicher Zeitdruck, Schmeichelei, Passwort-Falle, Köder)",
      "explanation": "Kindgerechte Erklärung, warum das verdächtig ist",
      "protectionTip": "Konkreter Tipp, was man stattdessen tun sollte"
    }
  ],
  "goldenRule": "Ein prägnanter, merkfähiger Leitsatz für Kinder",
  "leoSummary": "Ermutigende, persönliche Zusammenfassung aus Sicht von Löwe Leo über diesen Chat"
}`;

    const historyFormatted = history
      .map((m) => `${m.sender === 'ATTACKER' ? 'Angreifer' : 'Schüler'}: "${m.text}"`)
      .join('\n');

    const userPrompt = `Ausgang der Simulation: ${outcome === 'DEFENDED' ? 'Erfolgreich abgewehrt 🛡️' : 'In die Falle getappt 🚨'}
Szenario-Thema: ${scenarioTitle}

Chatverlauf zwischen Angreifer und Schüler:
${historyFormatted}

Analysiere genau diesen Chatverlauf und erstelle jetzt die detektivische Nachbesprechung als JSON.`;

    return { systemPrompt, userPrompt };
  }

  /**
   * Parst und bereinigt eine LLM-Ausgabe für den Angreifer-Zug sicher.
   */
  public static parseAttackerResponse(raw: string): AttackerTurnDTO | null {
    try {
      const cleanJson = this.extractJsonString(raw);
      const parsed = JSON.parse(cleanJson) as Record<string, unknown>;

      const attackerMessage =
        typeof parsed.attackerMessage === 'string' && parsed.attackerMessage.trim().length > 0
          ? parsed.attackerMessage.trim()
          : typeof parsed.attacker_message === 'string' && parsed.attacker_message.trim().length > 0
          ? parsed.attacker_message.trim()
          : typeof parsed.message === 'string' && parsed.message.trim().length > 0
          ? parsed.message.trim()
          : null;

      const rawOptions = Array.isArray(parsed.options) ? parsed.options : null;
      if (!attackerMessage || !rawOptions || rawOptions.length < 2) {
        return null;
      }

      const validAttitudes = ['VULNERABLE', 'HESITANT', 'CAUTIOUS', 'DEFENSIVE'] as const;
      type ValidAttitude = (typeof validAttitudes)[number];
      const isAttitude = (val: unknown): val is ValidAttitude =>
        typeof val === 'string' && (validAttitudes as readonly string[]).includes(val);

      const options: PhishingOptionDTO[] = rawOptions.map((item, idx) => {
        const opt = (typeof item === 'object' && item !== null ? item : {}) as Record<string, unknown>;
        const attitude: ValidAttitude = isAttitude(opt.attitude)
          ? opt.attitude
          : validAttitudes[idx % validAttitudes.length]!;
        const text = typeof opt.text === 'string' && opt.text.trim().length > 0 ? opt.text.trim() : `Option ${idx + 1}`;
        const id = typeof opt.id === 'string' && opt.id.trim().length > 0 ? opt.id.trim() : `ai-opt-${idx + 1}`;

        return { id, text, attitude };
      });

      const scenarioTitle =
        typeof parsed.scenarioTitle === 'string' && parsed.scenarioTitle.trim().length > 0
          ? parsed.scenarioTitle.trim()
          : typeof parsed.scenario_title === 'string' && parsed.scenario_title.trim().length > 0
          ? parsed.scenario_title.trim()
          : typeof parsed.title === 'string' && parsed.title.trim().length > 0
          ? parsed.title.trim()
          : undefined;

      return {
        scenarioTitle,
        attackerMessage,
        escalationReached: Boolean(parsed.escalationReached || parsed.escalation_reached),
        options,
      };
    } catch {
      return null;
    }
  }

  /**
   * Parst eine LLM-Ausgabe für die Detektiv-Nachbesprechung von Löwe Leo.
   */
  public static parseLeoReviewResponse(
    raw: string,
    chatId: string,
    outcome: ChatStatus
  ): PhishingReviewDTO | null {
    try {
      const cleanJson = this.extractJsonString(raw);
      const parsed = JSON.parse(cleanJson) as Record<string, unknown>;

      const goldenRule =
        typeof parsed.goldenRule === 'string' && parsed.goldenRule.trim().length > 0
          ? parsed.goldenRule.trim()
          : typeof parsed.golden_rule === 'string' && parsed.golden_rule.trim().length > 0
          ? parsed.golden_rule.trim()
          : typeof parsed.rule === 'string' && parsed.rule.trim().length > 0
          ? parsed.rule.trim()
          : 'Passwörter, Codes und persönliche Daten niemals im Chat weitergeben!';

      const leoSummary =
        typeof parsed.leoSummary === 'string' && parsed.leoSummary.trim().length > 0
          ? parsed.leoSummary.trim()
          : typeof parsed.leo_summary === 'string' && parsed.leo_summary.trim().length > 0
          ? parsed.leo_summary.trim()
          : typeof parsed.summary === 'string' && parsed.summary.trim().length > 0
          ? parsed.summary.trim()
          : 'Löwe Leo sagt: Großartige Detektivarbeit! Bleib immer wachsam bei verdächtigen Nachrichten.';

      const scenarioTitle =
        typeof parsed.scenarioTitle === 'string' && parsed.scenarioTitle.trim().length > 0
          ? parsed.scenarioTitle.trim()
          : typeof parsed.scenario_title === 'string' && parsed.scenario_title.trim().length > 0
          ? parsed.scenario_title.trim()
          : typeof parsed.title === 'string' && parsed.title.trim().length > 0
          ? parsed.title.trim()
          : 'Phishing-Detektiv Fall';

      const rawSignals = Array.isArray(parsed.signals)
        ? parsed.signals
        : Array.isArray(parsed.warningSignals)
        ? parsed.warningSignals
        : Array.isArray(parsed.warning_signals)
        ? parsed.warning_signals
        : [];

      const signals: WarningSignalReviewDTO[] = rawSignals.map((item, idx) => {
        const sig = (typeof item === 'object' && item !== null ? item : {}) as Record<string, unknown>;
        const quote =
          typeof sig.quote === 'string' && sig.quote.trim().length > 0
            ? sig.quote.trim()
            : typeof sig.zitat === 'string' && sig.zitat.trim().length > 0
            ? sig.zitat.trim()
            : `Warnsignal ${idx + 1}`;
        const type =
          typeof sig.type === 'string' && sig.type.trim().length > 0
            ? sig.type.trim()
            : typeof sig.category === 'string' && sig.category.trim().length > 0
            ? sig.category.trim()
            : typeof sig.typ === 'string' && sig.typ.trim().length > 0
            ? sig.typ.trim()
            : 'Verdächtige Nachricht';
        const explanation =
          typeof sig.explanation === 'string' && sig.explanation.trim().length > 0
            ? sig.explanation.trim()
            : typeof sig.erklaerung === 'string' && sig.erklaerung.trim().length > 0
            ? sig.erklaerung.trim()
            : 'Der Absender hat versucht, dich mit dieser Nachricht zu manipulieren.';
        const protectionTip =
          typeof sig.protectionTip === 'string' && sig.protectionTip.trim().length > 0
            ? sig.protectionTip.trim()
            : typeof sig.protection_tip === 'string' && sig.protection_tip.trim().length > 0
            ? sig.protection_tip.trim()
            : typeof sig.tip === 'string' && sig.tip.trim().length > 0
            ? sig.tip.trim()
            : typeof sig.tipp === 'string' && sig.tipp.trim().length > 0
            ? sig.tipp.trim()
            : 'Halte kurz inne und frage im Zweifel immer eine Vertrauensperson.';

        return { quote, type, explanation, protectionTip };
      });

      // Mindestens ein Signal garantieren, falls das Modell ein leeres Array lieferte
      if (signals.length === 0) {
        signals.push({
          quote: 'Verdächtige Kontaktaufnahme im Chat',
          type: 'Unerwartete Aufforderung',
          explanation: 'Fremde versuchen im Internet oft, Vertrauen aufzubauen und Daten zu erfragen.',
          protectionTip: 'Niemals Passwörter, Login-Links oder Codes teilen.',
        });
      }

      return {
        chatId,
        scenarioTitle,
        outcome,
        signals,
        goldenRule,
        leoSummary,
      };
    } catch {
      return null;
    }
  }

  /**
   * Entfernt Markdown Code-Fences falls das Modell ```json ... ``` liefert.
   */
  private static extractJsonString(raw: string): string {
    const trimmed = raw.trim();
    const markdownMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      return markdownMatch[1].trim();
    }
    return trimmed;
  }
}
