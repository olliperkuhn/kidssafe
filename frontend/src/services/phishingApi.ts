import { PhishingReviewDTO, PhishingStepResponseDTO } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Startet eine Phishing-Sitzung mit 3 oder 5 Szenarien.
 */
export async function startPhishingSession(scenarioCount: 3 | 5): Promise<PhishingStepResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/modules/phishing/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenarioCount }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Phishing-Sitzung konnte nicht gestartet werden');
  }

  return data as PhishingStepResponseDTO;
}

/**
 * Sendet die ausgewählte Antwort des Schülers.
 */
export async function replyToPhishing(
  chatId: string,
  selectedOptionId: string
): Promise<PhishingStepResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/modules/phishing/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, selectedOptionId }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Antwort konnte nicht gesendet werden');
  }

  return data as PhishingStepResponseDTO;
}

/**
 * Schaltet zum nächsten Szenario weiter.
 */
export async function nextPhishingScenario(chatId: string): Promise<PhishingStepResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/modules/phishing/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Nächstes Szenario konnte nicht geladen werden');
  }

  return data as PhishingStepResponseDTO;
}

/**
 * Ruft Löwe Leos strukturierte Aufklärung der Warnsignale ab.
 */
export async function fetchLeoReview(chatId: string): Promise<PhishingReviewDTO> {
  const response = await fetch(`${API_BASE_URL}/modules/phishing/review/${chatId}`);

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Löwe Leos Analyse konnte nicht geladen werden');
  }

  return data as PhishingReviewDTO;
}
