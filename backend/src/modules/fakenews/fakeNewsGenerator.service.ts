import { aiService } from '../../services/ai/ai.service';
import { NewsArticleDTO, FakeNewsDifficulty } from '../../types/dto/fakenews.dto';
import { FAKE_NEWS_DATABASE } from './fakeNewsLibrary';
import { randomUUID } from 'crypto';

export class FakeNewsGeneratorService {
  /**
   * Generiert eine Fake-Meldung passend zur Altersstufe über die KI-Pipeline.
   */
  public async generateFakeArticle(
    difficulty: FakeNewsDifficulty,
    seedTopic?: string
  ): Promise<NewsArticleDTO> {
    const isJunior = difficulty === 'JUNIOR';

    const systemPrompt = `Du bist ein didaktischer Fake-News-Generator für IT- und Medienkompetenz an Schulen.
Zielgruppe: ${isJunior ? 'Kinder der 4. bis 5. Klasse (Grundschule)' : 'Jugendliche ab der 6. Klasse'}.
Deine Aufgabe ist es, eine didaktisch wertvolle Falschmeldung (Fake News) zu erzeugen, die Schüler:innen analysieren und enttarnen können.

Regeln:
${
  isJunior
    ? '- Erzeuge eine skurrile, humorvolle oder absurde Meldung (z. B. unmögliche Tierkreuzungen, absurde Schulregeln, verblüffende Fabelwesen).\n- Keine Angstmacherei, keine Gewalt.\n- Baue 2 klare "Red Flags" ein, die Kinder mit Plausibilitätsprüfung oder Quellen-Skepsis erkennen können.'
    : '- Erzeuge eine subtile Desinformations-Nachricht (z. B. Clickbait, emotionale Panikmache, angebliche Gesetzesänderungen oder Gaming-Gerüchte).\n- Baue 2-3 konkrete Merkmale unseriöser Quellen ein (reißerische Sprache, fehlendes Impressum, anonyme Zeugen).'
}

Du MUSST zwingend valides JSON ohne weiteren Text zurückgeben:
{
  "headline": "Schlagzeile",
  "teaserText": "2-3 Sätze Teaser",
  "sourceName": "Dubioser Quellenname (z. B. viral-fakt24.net)",
  "category": "Tiere & Natur / Schule / Technik / Gaming",
  "redFlags": [
    {
      "clue": "Kurzbeschreibung des Warnsignals",
      "explanation": "Kindgerechte Erklärung, warum das verdächtig ist",
      "toolType": "PLAUSIBILITY_CHECK" oder "SOURCE_CHECK" oder "LANGUAGE_CHECK"
    }
  ],
  "factCheckTips": "Konkreter Tipp von Löwe Leo für zukünftige Recherchen",
  "realBackground": "Was ist die echte Wahrheit dahinter?"
}`;

    const userPrompt = seedTopic
      ? `Erstelle eine Fake News zum Thema: "${seedTopic}". Schwierigkeitsgrad: ${difficulty}.`
      : `Erstelle eine neue, spannende Fake News für den Schwierigkeitsgrad ${difficulty}.`;

    try {
      const { text } = await aiService.generateWithCascade({
        systemPrompt,
        userPrompt,
        responseJson: true,
      });

      const parsed = this.parseAiArticle(text, difficulty);
      if (parsed) {
        return parsed;
      }
    } catch {
      // Stiller Fallback bei Timeouts
    }

    // Fallback: Wähle zufälligen Fake-Artikel aus der Offline-Bibliothek
    const offlineFakes = FAKE_NEWS_DATABASE.filter(
      (a) => a.isFake && a.difficulty === difficulty
    );
    const chosen = offlineFakes[Math.floor(Math.random() * offlineFakes.length)];
    return chosen || offlineFakes[0]!;
  }

  private parseAiArticle(raw: string, difficulty: FakeNewsDifficulty): NewsArticleDTO | null {
    try {
      const cleanJson = raw.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1').trim();
      const parsed = JSON.parse(cleanJson) as {
        headline?: string;
        teaserText?: string;
        sourceName?: string;
        category?: string;
        redFlags?: Array<{ clue?: string; explanation?: string; toolType?: string }>;
        factCheckTips?: string;
        realBackground?: string;
      };

      if (!parsed.headline || !parsed.teaserText) {
        return null;
      }

      const validTools = ['SOURCE_CHECK', 'PLAUSIBILITY_CHECK', 'LANGUAGE_CHECK'] as const;

      return {
        id: `ai-fake-${randomUUID().substring(0, 8)}`,
        headline: parsed.headline,
        teaserText: parsed.teaserText,
        sourceName: parsed.sourceName || 'viral-netzwerk.biz',
        sourceUrl: 'http://viral-netzwerk.biz/post',
        category: parsed.category || 'Meldungen des Tages',
        publishDate: 'Gerade eben',
        isFake: true,
        difficulty,
        redFlags: (parsed.redFlags || []).map((rf) => ({
          clue: rf.clue || 'Verdächtige Aussage',
          explanation: rf.explanation || 'Keine nachprüfbare Quelle angegeben.',
          toolType: (validTools.includes(rf.toolType as (typeof validTools)[number])
            ? rf.toolType
            : 'PLAUSIBILITY_CHECK') as (typeof validTools)[number],
        })),
        factCheckTips: parsed.factCheckTips || 'Löwe Leo rät: Prüfe immer mehrere unabhängige Quellen!',
        realBackground: parsed.realBackground,
      };
    } catch {
      return null;
    }
  }
}

export const fakeNewsGeneratorService = new FakeNewsGeneratorService();
