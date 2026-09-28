import { AIProvider, LLMGenerateOptions, ProviderHealthStatus } from './aiProvider.interface';

export class MockProvider implements AIProvider {
  public readonly id = 'mock';
  public readonly name = 'Didaktischer Fallback (Deterministisch)';

  public async isAvailable(): Promise<boolean> {
    return true;
  }

  public async checkHealth(): Promise<ProviderHealthStatus> {
    const start = Date.now();
    return {
      id: this.id,
      name: this.name,
      isConfigured: true,
      isAvailable: true,
      latencyMs: Date.now() - start,
    };
  }

  public async generateCompletion(options: LLMGenerateOptions): Promise<string | null> {
    if (!options.responseJson) {
      return 'Hallo! Ich bin dein digitaler Sicherheitsassistent. Pass gut auf deine Daten auf!';
    }

    const promptLower = `${options.systemPrompt} ${options.userPrompt}`.toLowerCase();

    // Löwe Leo Review Schema
    if (promptLower.includes('löwe leo') || promptLower.includes('warnsignale') || promptLower.includes('goldenrule')) {
      return JSON.stringify({
        scenarioTitle: 'Phishing-Detektiv Analyse',
        signals: [
          {
            quote: 'Gib schnell deinen Code ein!',
            category: 'Künstlicher Zeitdruck',
            explanation: 'Betrüger setzen dich oft unter Zeitdruck, damit du unüberlegt handelst.',
          },
          {
            quote: 'Kostenlose Robux & Geschenke',
            category: 'Falsche Versprechen',
            explanation: 'Niemand verschenkt im Internet einfach so wertvolles Spielguthaben oder Geschenke.',
          },
        ],
        goldenRule: 'Passwörter und Sicherheitscodes sind wie deine Zahnbürste – sie gehören nur dir!',
        leoSummary: 'Super detektivische Arbeit! Du hast die Masche erkannt und deine Daten geschützt.',
      });
    }

    // Angreifer Persona Schema (Standard)
    return JSON.stringify({
      attackerMessage: 'Hey! Klick doch einfach auf den Link und gib deinen Code ein, damit wir weiterspielen können!',
      escalationReached: false,
      options: [
        {
          id: 'opt-mock-vuln',
          text: 'Klar, hier ist mein Code!',
          attitude: 'VULNERABLE',
        },
        {
          id: 'opt-mock-hes',
          text: 'Brauchst du den wirklich? Klingt irgendwie seltsam...',
          attitude: 'HESITANT',
        },
        {
          id: 'opt-mock-caut',
          text: 'Ich frage erst mal meine Eltern oder die Lehrerin.',
          attitude: 'CAUTIOUS',
        },
        {
          id: 'opt-mock-def',
          text: 'Auf keinen Fall! Solche Codes gebe ich niemals weiter. Blockiert!',
          attitude: 'DEFENSIVE',
        },
      ],
    });
  }
}

export const mockProvider = new MockProvider();
