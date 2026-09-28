import { useState, useCallback } from 'react';
import {
  StudentNewsArticleDTO,
  VerdictResultDTO,
  FakeNewsSummaryDTO,
  InspectToolResultDTO,
  FakeNewsDifficulty,
  NewsVerdict,
  FactCheckToolType,
} from '../types';
import {
  startFakeNewsSession,
  inspectArticle,
  submitVerdict,
  fetchSummary,
} from '../services/fakeNewsApi';
import { sendStudentHeartbeat } from '../../../services/trackingApi';

export function useFakeNewsSession(sessionToken?: string) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentArticle, setCurrentArticle] = useState<StudentNewsArticleDTO | null>(null);
  const [nextPendingArticle, setNextPendingArticle] = useState<StudentNewsArticleDTO | null>(null);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [totalRounds, setTotalRounds] = useState<number>(4);
  const [score, setScore] = useState<number>(0);

  const [lastVerdictResult, setLastVerdictResult] = useState<VerdictResultDTO | null>(null);
  const [isLeoModalOpen, setIsLeoModalOpen] = useState<boolean>(false);
  const [activeToolResult, setActiveToolResult] = useState<InspectToolResultDTO | null>(null);

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [summary, setSummary] = useState<FakeNewsSummaryDTO | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const triggerHeartbeat = useCallback(
    async (completed: number, total: number) => {
      try {
        await sendStudentHeartbeat(
          {
            activeModule: 'fake-news-detector',
            completedScenarios: completed,
            totalScenarios: total,
          },
          sessionToken
        );
      } catch {
        // Heartbeat Fehler ignorieren
      }
    },
    [sessionToken]
  );

  const start = async (count: 4 | 6, difficulty: FakeNewsDifficulty) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsGameOver(false);
      setSummary(null);
      setScore(0);
      setCurrentRound(1);
      setTotalRounds(count);
      setActiveToolResult(null);

      const res = await startFakeNewsSession(count, difficulty);
      setSessionId(res.sessionId);
      setCurrentArticle(res.currentArticle);
      setTotalRounds(res.totalRounds);

      await triggerHeartbeat(0, count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Starten der Runde');
    } finally {
      setIsLoading(false);
    }
  };

  const inspect = async (toolType: FactCheckToolType) => {
    if (!sessionId || !currentArticle) return;
    try {
      setIsInspecting(true);
      setError(null);
      const res = await inspectArticle(sessionId, currentArticle.id, toolType);
      setActiveToolResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Konnte Hinweis nicht abrufen');
    } finally {
      setIsInspecting(false);
    }
  };

  const vote = async (userVerdict: NewsVerdict) => {
    if (!sessionId || !currentArticle) return;
    try {
      setIsVoting(true);
      setError(null);
      const res = await submitVerdict(sessionId, currentArticle.id, userVerdict);
      setLastVerdictResult(res);
      setScore(res.totalScore);
      setIsLeoModalOpen(true);
      setNextPendingArticle(res.nextArticle || null);

      if (res.isGameOver) {
        setIsGameOver(true);
        const finalSummary = await fetchSummary(sessionId);
        setSummary(finalSummary);
        await triggerHeartbeat(res.totalRounds, res.totalRounds);
      } else {
        await triggerHeartbeat(res.currentRound, res.totalRounds);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler bei der Stimmabgabe');
    } finally {
      setIsVoting(false);
    }
  };

  const closeLeoModal = () => {
    setIsLeoModalOpen(false);
    setActiveToolResult(null);
    if (nextPendingArticle) {
      setCurrentArticle(nextPendingArticle);
      setCurrentRound((prev) => prev + 1);
      setNextPendingArticle(null);
    }
  };

  const reset = () => {
    setSessionId(null);
    setCurrentArticle(null);
    setNextPendingArticle(null);
    setLastVerdictResult(null);
    setIsLeoModalOpen(false);
    setIsGameOver(false);
    setSummary(null);
    setError(null);
  };

  return {
    sessionId,
    currentArticle,
    currentRound,
    totalRounds,
    score,
    lastVerdictResult,
    isLeoModalOpen,
    activeToolResult,
    isGameOver,
    summary,
    isLoading,
    isInspecting,
    isVoting,
    error,
    start,
    inspect,
    vote,
    closeLeoModal,
    reset,
  };
}
