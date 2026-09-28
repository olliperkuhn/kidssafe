import { NewsArticleDTO } from '../../types/dto/fakenews.dto';
import { FAKE_NEWS_DATABASE } from './fakeNewsLibrary';

interface CachedNewsFeed {
  timestamp: number;
  articles: NewsArticleDTO[];
}

export class NewsFeedService {
  private cache: CachedNewsFeed | null = null;
  private readonly cacheDurationMs = 24 * 60 * 60 * 1000; // 24 Stunden Cache

  // Öffentliche kinder- und jugendgerechte RSS-Feed Quellen
  private readonly feedUrls = [
    'https://www.tagesschau.de/in-einfacher-sprache/index~rss2.xml',
  ];

  /**
   * Liefert echte, zeitaktuelle Nachrichten.
   * Bei Netzwerkverbindung via RSS, bei Offline-Betrieb via kuratiertem Pool.
   */
  public async getRealNews(difficulty: 'JUNIOR' | 'SENIOR'): Promise<NewsArticleDTO[]> {
    const offlineRealArticles = FAKE_NEWS_DATABASE.filter(
      (a) => !a.isFake && a.difficulty === difficulty
    );

    // Prüfen, ob noch ein gültiger Cache vorliegt
    if (this.cache && Date.now() - this.cache.timestamp < this.cacheDurationMs) {
      const cached = this.cache.articles.filter((a) => a.difficulty === difficulty);
      if (cached.length > 0) {
        return [...cached, ...offlineRealArticles];
      }
    }

    try {
      const fetchedArticles = await this.fetchRssNews(difficulty);
      if (fetchedArticles.length > 0) {
        this.cache = {
          timestamp: Date.now(),
          articles: fetchedArticles,
        };
        return [...fetchedArticles, ...offlineRealArticles];
      }
    } catch {
      // Bei Netzwerk-Timeout oder Offline-Betrieb stiller Fallback
    }

    return offlineRealArticles;
  }

  /**
   * Ruft einen RSS-Feed ab und parst Items ohne externe XML-Abhängigkeit.
   */
  private async fetchRssNews(difficulty: 'JUNIOR' | 'SENIOR'): Promise<NewsArticleDTO[]> {
    const targetUrl = this.feedUrls[0];
    if (!targetUrl) return [];

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Kidssafe-School-App/1.0' },
      signal: AbortSignal.timeout(3000), // Schneller 3s-Timeout für Schul-Latenzen
    });

    if (!res.ok) {
      return [];
    }

    const xml = await res.text();
    return this.parseRssItems(xml, difficulty);
  }

  /**
   * Schlanker XML/RSS-Parser für <item>-Elemente.
   */
  private parseRssItems(xml: string, difficulty: 'JUNIOR' | 'SENIOR'): NewsArticleDTO[] {
    const items: NewsArticleDTO[] = [];
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g);

    if (!itemMatches) return [];

    for (let i = 0; i < Math.min(itemMatches.length, 5); i++) {
      const itemXml = itemMatches[i];
      if (!itemXml) continue;

      const title = this.extractTag(itemXml, 'title');
      const description = this.extractTag(itemXml, 'description');
      const link = this.extractTag(itemXml, 'link');

      if (title && description) {
        items.push({
          id: `rss-real-${difficulty.toLowerCase()}-${i + 1}`,
          headline: this.sanitizeHtml(title),
          teaserText: this.sanitizeHtml(description),
          sourceName: 'Tagesschau in einfacher Sprache',
          sourceUrl: link || 'https://www.tagesschau.de',
          category: difficulty === 'JUNIOR' ? 'Nachrichten & Welt' : 'Aktuelles Zeitgeschehen',
          publishDate: 'Heute aktuell',
          isFake: false,
          difficulty,
          redFlags: [],
          factCheckTips: 'Seriöse öffentlich-rechtliche Nachrichten prüfen Fakten nach dem Vier-Augen-Prinzip.',
          realBackground: 'Tagesaktuelle Nachricht aus dem redaktionellen Angebot der Tagesschau.',
        });
      }
    }

    return items;
  }

  private extractTag(xml: string, tag: string): string {
    const match = xml.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'));
    return match && match[1] ? match[1].trim() : '';
  }

  private sanitizeHtml(text: string): string {
    return text
      .replace(/<[^>]*>?/gm, '')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }
}

export const newsFeedService = new NewsFeedService();
