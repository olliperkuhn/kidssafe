import {
  StartFakeNewsResponseDTO,
  InspectToolResultDTO,
  VerdictResultDTO,
  FakeNewsSummaryDTO,
  FakeNewsDifficulty,
  NewsVerdict,
  FactCheckToolType,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function startFakeNewsSession(
  count: 4 | 6,
  difficulty: FakeNewsDifficulty
): Promise<StartFakeNewsResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/modules/fake-news-detector/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count, difficulty }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Konnte Faktencheck-Runde nicht starten');
  }

  return data as StartFakeNewsResponseDTO;
}

export async function inspectArticle(
  sessionId: string,
  articleId: string,
  toolType: FactCheckToolType
): Promise<InspectToolResultDTO> {
  const response = await fetch(`${API_BASE_URL}/modules/fake-news-detector/inspect/${articleId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, toolType }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Inspektion fehlgeschlagen');
  }

  return data as InspectToolResultDTO;
}

export async function submitVerdict(
  sessionId: string,
  articleId: string,
  userVerdict: NewsVerdict
): Promise<VerdictResultDTO> {
  const response = await fetch(`${API_BASE_URL}/modules/fake-news-detector/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, articleId, userVerdict }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Urteil konnte nicht übermittelt werden');
  }

  return data as VerdictResultDTO;
}

export async function fetchSummary(sessionId: string): Promise<FakeNewsSummaryDTO> {
  const response = await fetch(`${API_BASE_URL}/modules/fake-news-detector/summary/${sessionId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Zusammenfassung konnte nicht geladen werden');
  }

  return data as FakeNewsSummaryDTO;
}
