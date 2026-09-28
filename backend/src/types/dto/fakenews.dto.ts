import { z } from 'zod';

export const difficultySchema = z.enum(['JUNIOR', 'SENIOR']);
export type FakeNewsDifficulty = z.infer<typeof difficultySchema>;

export const verdictSchema = z.enum(['REAL', 'FAKE']);
export type NewsVerdict = z.infer<typeof verdictSchema>;

export const factCheckToolTypeSchema = z.enum(['SOURCE_CHECK', 'PLAUSIBILITY_CHECK', 'LANGUAGE_CHECK']);
export type FactCheckToolType = z.infer<typeof factCheckToolTypeSchema>;

export const redFlagItemSchema = z.object({
  clue: z.string(),
  explanation: z.string(),
  toolType: factCheckToolTypeSchema,
});
export type RedFlagItemDTO = z.infer<typeof redFlagItemSchema>;

export const newsArticleSchema = z.object({
  id: z.string(),
  headline: z.string(),
  teaserText: z.string(),
  sourceName: z.string(),
  sourceUrl: z.string().optional(),
  category: z.string(),
  publishDate: z.string(),
  isFake: z.boolean(),
  difficulty: difficultySchema,
  redFlags: z.array(redFlagItemSchema),
  factCheckTips: z.string(),
  realBackground: z.string().optional(),
});
export type NewsArticleDTO = z.infer<typeof newsArticleSchema>;

export const startFakeNewsRequestSchema = z.object({
  count: z.union([z.literal(4), z.literal(6)]).default(4),
  difficulty: difficultySchema.default('JUNIOR'),
});
export type StartFakeNewsRequestDTO = z.infer<typeof startFakeNewsRequestSchema>;

export const submitVerdictRequestSchema = z.object({
  sessionId: z.string().uuid(),
  articleId: z.string(),
  userVerdict: verdictSchema,
});
export type SubmitVerdictRequestDTO = z.infer<typeof submitVerdictRequestSchema>;

export const inspectToolResultSchema = z.object({
  toolType: factCheckToolTypeSchema,
  title: z.string(),
  hint: z.string(),
  suspiciousRating: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});
export type InspectToolResultDTO = z.infer<typeof inspectToolResultSchema>;

export const verdictResultSchema = z.object({
  isCorrect: z.boolean(),
  isFake: z.boolean(),
  userVerdict: verdictSchema,
  scoreEarned: z.number(),
  totalScore: z.number(),
  currentRound: z.number(),
  totalRounds: z.number(),
  isGameOver: z.boolean(),
  leoExplanation: z.string(),
  redFlags: z.array(redFlagItemSchema),
  goldenRule: z.string(),
  realBackground: z.string().optional(),
});
export type VerdictResultDTO = z.infer<typeof verdictResultSchema>;

export const fakeNewsSummarySchema = z.object({
  sessionId: z.string(),
  totalArticles: z.number(),
  correctCount: z.number(),
  scorePercent: z.number(),
  title: z.string(),
  badge: z.string(),
  difficulty: difficultySchema,
  completedAt: z.string(),
});
export type FakeNewsSummaryDTO = z.infer<typeof fakeNewsSummarySchema>;
