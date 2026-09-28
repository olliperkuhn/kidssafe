export type FakeNewsDifficulty = 'JUNIOR' | 'SENIOR';
export type NewsVerdict = 'REAL' | 'FAKE';
export type FactCheckToolType = 'SOURCE_CHECK' | 'PLAUSIBILITY_CHECK' | 'LANGUAGE_CHECK';

export interface RedFlagItemDTO {
  clue: string;
  explanation: string;
  toolType: FactCheckToolType;
}

export interface StudentNewsArticleDTO {
  id: string;
  headline: string;
  teaserText: string;
  sourceName: string;
  sourceUrl?: string;
  category: string;
  publishDate: string;
  difficulty: FakeNewsDifficulty;
  factCheckTips: string;
  realBackground?: string;
}

export interface InspectToolResultDTO {
  toolType: FactCheckToolType;
  title: string;
  hint: string;
  suspiciousRating: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface StartFakeNewsResponseDTO {
  sessionId: string;
  currentArticle: StudentNewsArticleDTO;
  totalRounds: number;
}

export interface VerdictResultDTO {
  isCorrect: boolean;
  isFake: boolean;
  userVerdict: NewsVerdict;
  scoreEarned: number;
  totalScore: number;
  currentRound: number;
  totalRounds: number;
  isGameOver: boolean;
  leoExplanation: string;
  redFlags: RedFlagItemDTO[];
  goldenRule: string;
  realBackground?: string;
  nextArticle?: StudentNewsArticleDTO;
}

export interface FakeNewsSummaryDTO {
  sessionId: string;
  totalArticles: number;
  correctCount: number;
  scorePercent: number;
  title: string;
  badge: string;
  difficulty: FakeNewsDifficulty;
  completedAt: string;
}
