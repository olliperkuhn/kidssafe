import {
  AiStatusResponseDTO,
  UpdateAiConfigDTO,
  TestAiPromptDTO,
  TestAiPromptResponseDTO,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Ruft den aktuellen Status aller KI-Provider, Modelle und Latenzen ab.
 */
export async function fetchAiStatus(token: string): Promise<AiStatusResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/admin/ai/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'KI-Status konnte nicht geladen werden');
  }

  return data.data as AiStatusResponseDTO;
}

/**
 * Aktualisiert die KI-Konfiguration zur Laufzeit (z. B. primärer Provider, Keys, Modelle).
 */
export async function updateAiConfig(
  token: string,
  payload: UpdateAiConfigDTO
): Promise<{ activeProvider: string }> {
  const response = await fetch(`${API_BASE_URL}/admin/ai/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'KI-Konfiguration konnte nicht aktualisiert werden');
  }

  return data.data as { activeProvider: string };
}

/**
 * Sendet einen interaktiven Test-Prompt an die KI-Pipeline und misst die Ausführungszeit.
 */
export async function testAiPrompt(
  token: string,
  payload: TestAiPromptDTO
): Promise<TestAiPromptResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/admin/ai/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Test-Prompt fehlgeschlagen');
  }

  return data.data as TestAiPromptResponseDTO;
}
