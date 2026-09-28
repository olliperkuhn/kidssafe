import { randomUUID } from 'crypto';
import {
  NewsArticleDTO,
  FakeNewsDifficulty,
  NewsVerdict,
  FactCheckToolType,
  InspectToolResultDTO,
  VerdictResultDTO,
  FakeNewsSummaryDTO,
} from '../../types/dto/fakenews.dto';
import { newsFeedService } from './newsFeedService';
import { fakeNewsGeneratorService } from './fakeNewsGenerator.service';
import { FAKE_NEWS_DATABASE } from './fakeNewsLibrary';

interface ActiveFakeNewsSession {
  sessionId: string;
  difficulty: FakeNewsDifficulty;
  totalArticles: number;
  currentArticleIndex: number;
  articles: NewsArticleDTO[];
  scores: boolean[]; // true = richtig getippt
  totalScore: number;
  createdAt: number;
}

export class FakeNewsService {
  private sessions = new Map<string, ActiveFakeNewsSession>();

  public async startSession(
    count: 4 | 6,
    difficulty: FakeNewsDifficulty
  ): Promise<{ sessionId: string; currentArticle: Omit<NewsArticleDTO, 'isFake' | 'redFlags'>; totalRounds: number }> {
    this.cleanExpiredSessions();

    const sessionId = randomUUID();
    const halfCount = count / 2;

    // 1. Echte Nachrichten beschaffen
    const realCandidates = await newsFeedService.getRealNews(difficulty);
    const shuffledReal = [...realCandidates].sort(() => Math.random() - 0.5);
    const selectedReal = shuffledReal.slice(0, halfCount);

    // 2. Fake Nachrichten beschaffen (aus Generator oder Bibliothek)
    const offlineFakes = FAKE_NEWS_DATABASE.filter((a) => a.isFake && a.difficulty === difficulty);
    const shuffledFakes = [...offlineFakes].sort(() => Math.random() - 0.5);
    const selectedFakes = shuffledFakes.slice(0, halfCount);

    // Falls weniger Fakes vorhanden, generiere dynamisch
    while (selectedFakes.length < halfCount) {
      const generated = await fakeNewsGeneratorService.generateFakeArticle(difficulty);
      selectedFakes.push(generated);
    }

    // 3. Ausbalanciert mischen
    const combined = [...selectedReal, ...selectedFakes].sort(() => Math.random() - 0.5);

    const session: ActiveFakeNewsSession = {
      sessionId,
      difficulty,
      totalArticles: count,
      currentArticleIndex: 0,
      articles: combined,
      scores: [],
      totalScore: 0,
      createdAt: Date.now(),
    };

    this.sessions.set(sessionId, session);

    const firstArticle = combined[0]!;
    return {
      sessionId,
      currentArticle: this.sanitizeForStudent(firstArticle),
      totalRounds: count,
    };
  }

  public inspectArticle(
    sessionId: string,
    articleId: string,
    toolType: FactCheckToolType
  ): InspectToolResultDTO {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Sitzung nicht gefunden oder abgelaufen');

    const article = session.articles.find((a) => a.id === articleId);
    if (!article) throw new Error('Artikel nicht gefunden');

    if (toolType === 'SOURCE_CHECK') {
      const isDubious = article.sourceName.includes('.biz') || article.sourceName.includes('viral');
      return {
        toolType,
        title: 'Quellen-Inspektion',
        hint: isDubious
          ? `Achtung: Die Quelle "${article.sourceName}" besitzt kein anerkanntes Impressum und ist kein redaktionelles Nachrichtenmedium.`
          : `Die Quelle "${article.sourceName}" ist ein bekanntes, redaktionell geführtes Informationsportal.`,
        suspiciousRating: isDubious ? 'HIGH' : 'LOW',
      };
    }

    if (toolType === 'PLAUSIBILITY_CHECK') {
      return {
        toolType,
        title: 'Plausibilitäts-Prüfung',
        hint: article.isFake
          ? 'Frage dich: Klingt diese Meldung wissenschaftlich möglich oder viel zu verrückt/spektakulär?'
          : 'Die Schilderung entspricht bekannten wissenschaftlichen oder alltäglichen Tatsachen.',
        suspiciousRating: article.isFake ? 'HIGH' : 'LOW',
      };
    }

    return {
      toolType,
      title: 'Sprach- & Emotionsanalyse',
      hint: article.isFake
        ? 'Achte auf Signalwörter: Werden reißerische Wörter ("Sensation", "Geheimnis") oder viele Ausrufezeichen verwendet?'
        : 'Der Text ist sachlich formuliert und versucht nicht, Panik oder übermäßige Aufregung zu schüren.',
      suspiciousRating: article.isFake ? 'MEDIUM' : 'LOW',
    };
  }

  public submitVerdict(
    sessionId: string,
    articleId: string,
    userVerdict: NewsVerdict
  ): VerdictResultDTO & { nextArticle?: Omit<NewsArticleDTO, 'isFake' | 'redFlags'> } {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Sitzung nicht gefunden oder abgelaufen');

    const article = session.articles[session.currentArticleIndex];
    if (!article || article.id !== articleId) {
      throw new Error('Ungültiger Artikel für diese Spielrunde');
    }

    const actualVerdict: NewsVerdict = article.isFake ? 'FAKE' : 'REAL';
    const isCorrect = userVerdict === actualVerdict;
    const scoreEarned = isCorrect ? 100 : 25;

    session.scores.push(isCorrect);
    session.totalScore += scoreEarned;
    session.currentArticleIndex += 1;

    const isGameOver = session.currentArticleIndex >= session.totalArticles;
    const nextArticle = !isGameOver ? session.articles[session.currentArticleIndex] : undefined;

    const goldenRule = article.isFake
      ? 'Faktencheck-Regel: Skurrile Behauptungen ohne seriöse Quelle sind fast immer Fake News!'
      : 'Faktencheck-Regel: Auch unglaubliche echte Nachrichten werden durch renommierte Institute belegt.';

    const leoExplanation = isCorrect
      ? `Hervorragend entlarvt! Du hast richtig erkannt: Diese Nachricht ist ${article.isFake ? 'eine Fälschung (Fake)' : 'echt'}.`
      : `Knapp daneben! Diese Nachricht war in Wahrheit ${article.isFake ? 'eine Fälschung (Fake)' : 'echt'}. Aber kein Problem, genau dafür trainieren wir!`;

    return {
      isCorrect,
      isFake: article.isFake,
      userVerdict,
      scoreEarned,
      totalScore: session.totalScore,
      currentRound: session.currentArticleIndex,
      totalRounds: session.totalArticles,
      isGameOver,
      leoExplanation,
      redFlags: article.redFlags,
      goldenRule,
      realBackground: article.realBackground,
      nextArticle: nextArticle ? this.sanitizeForStudent(nextArticle) : undefined,
    };
  }

  public getSessionSummary(sessionId: string): FakeNewsSummaryDTO {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Sitzung nicht gefunden');

    const correctCount = session.scores.filter(Boolean).length;
    const scorePercent = Math.round((correctCount / session.totalArticles) * 100);

    const title =
      scorePercent >= 75
        ? 'Meister-Faktenchecker 🥇'
        : scorePercent >= 50
        ? 'Aufmerksamer Detektiv 🥈'
        : 'Nachwuchs-Rechercheur 🥉';

    const badge = scorePercent >= 75 ? 'GOLD' : scorePercent >= 50 ? 'SILVER' : 'BRONZE';

    return {
      sessionId,
      totalArticles: session.totalArticles,
      correctCount,
      scorePercent,
      title,
      badge,
      difficulty: session.difficulty,
      completedAt: new Date().toLocaleDateString('de-DE'),
    };
  }

  private sanitizeForStudent(article: NewsArticleDTO): Omit<NewsArticleDTO, 'isFake' | 'redFlags'> {
    const { isFake: _f, redFlags: _r, ...safeArticle } = article;
    return safeArticle;
  }

  private cleanExpiredSessions(): void {
    const ONE_HOUR = 3600 * 1000;
    const now = Date.now();
    for (const [key, value] of this.sessions.entries()) {
      if (now - value.createdAt > ONE_HOUR) {
        this.sessions.delete(key);
      }
    }
  }
}

export const fakeNewsService = new FakeNewsService();
