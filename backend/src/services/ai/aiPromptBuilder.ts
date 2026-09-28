import {
  PhishingOptionDTO,
  PhishingReviewDTO,
  ChatStatus,
  WarningSignalReviewDTO,
} from '../../types/dto/phishing.dto';

export interface AttackerTurnDTO {
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
Deine Aufgabe ist es, den absolvierten Phishing-Chat fehlerfreundlich und ermutigend auszuwerten.
Egal ob das Kind in die Falle getappt ist oder den Angriff abgewehrt hat: Du lobst den Lerneffekt und erklärst die Tricks.

Antworte zwingend als valides JSON-Objekt ohne weiteren Text:
{
  "scenarioTitle": "${scenarioTitle}",
  "signals": [
    {
      "quote": "Zitiertes Warnsignal aus der Angreifernachricht",
      "type": "Kategorie (z. B. Künstlicher Zeitdruck, Schmeichelei, Passwort-Falle)",
      "explanation": "Kindgerechte Erklärung, warum das verdächtig ist",
      "protectionTip": "Konkreter Tipp, was man tun sollte"
    }
  ],
  "goldenRule": "Ein prägnanter, merkfähiger Leitsatz für Kinder",
  "leoSummary": "Ermutigende Zusammenfassung aus Sicht von Löwe Leo"
}`;

    const historyFormatted = history
      .map((m) => `${m.sender === 'ATTACKER' ? 'Angreifer' : 'Schüler'}: "${m.text}"`)
      .join('\n');

    const userPrompt = `Ausgang der Simulation: ${outcome === 'DEFENDED' ? 'Erfolgreich abgewehrt 🛡️' : 'In die Falle getappt 🚨'}
Chatverlauf:
${historyFormatted}

Erstelle die detektivische Nachbesprechung als JSON.`;

    return { systemPrompt, userPrompt };
  }

  /**
   * Parst und bereinigt eine LLM-Ausgabe für den Angreifer-Zug sicher.
   */
  public static parseAttackerResponse(raw: string): AttackerTurnDTO | null {
    try {
      const cleanJson = this.extractJsonString(raw);
      const parsed = JSON.parse(cleanJson) as {
        attackerMessage?: string;
        escalationReached?: boolean;
        options?: Array<{ id?: string; text?: string; attitude?: string }>;
      };

      if (!parsed.attackerMessage || !Array.isArray(parsed.options) || parsed.options.length < 2) {
        return null;
      }

      const validAttitudes = ['VULNERABLE', 'HESITANT', 'CAUTIOUS', 'DEFENSIVE'] as const;
      type ValidAttitude = (typeof validAttitudes)[number];
      const isAttitude = (val: unknown): val is ValidAttitude =>
        typeof val === 'string' && (validAttitudes as readonly string[]).includes(val);

      const options: PhishingOptionDTO[] = parsed.options.map((opt, idx) => {
        const attitude: ValidAttitude = isAttitude(opt.attitude)
          ? opt.attitude
          : validAttitudes[idx % validAttitudes.length]!;
        return {
          id: opt.id || `ai-opt-${idx + 1}`,
          text: opt.text || `Option ${idx + 1}`,
          attitude,
        };
      });

      return {
        attackerMessage: parsed.attackerMessage,
        escalationReached: Boolean(parsed.escalationReached),
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
      const parsed = JSON.parse(cleanJson) as {
        scenarioTitle?: string;
        signals?: WarningSignalReviewDTO[];
        goldenRule?: string;
        leoSummary?: string;
      };

      if (!parsed.goldenRule || !parsed.leoSummary) {
        return null;
      }

      return {
        chatId,
        scenarioTitle: parsed.scenarioTitle || 'Phishing-Detektiv Fall',
        outcome,
        signals: Array.isArray(parsed.signals) ? parsed.signals : [],
        goldenRule: parsed.goldenRule,
        leoSummary: parsed.leoSummary,
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
