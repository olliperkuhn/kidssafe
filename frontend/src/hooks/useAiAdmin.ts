import { useState, useEffect, useCallback } from 'react';
import {
  AiStatusResponseDTO,
  AIProviderId,
  UpdateAiConfigDTO,
  TestAiPromptDTO,
  TestAiPromptResponseDTO,
} from '../types';
import { fetchAiStatus, updateAiConfig, testAiPrompt } from '../services/aiAdminApi';

export function useAiAdmin(token: string) {
  const [status, setStatus] = useState<AiStatusResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<TestAiPromptResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAiStatus(token);
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden des KI-Status');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const setActiveProvider = async (providerId: AIProviderId): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);
      await updateAiConfig(token, { activeProvider: providerId });
      setSuccessMessage(`Aktiver Provider auf "${providerId}" gewechselt.`);
      await loadStatus();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Provider-Wechsel fehlgeschlagen');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveConfig = async (payload: UpdateAiConfigDTO): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);
      await updateAiConfig(token, payload);
      setSuccessMessage('KI-Einstellungen erfolgreich gespeichert.');
      await loadStatus();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const executeTest = async (payload: TestAiPromptDTO): Promise<TestAiPromptResponseDTO | null> => {
    try {
      setIsTesting(true);
      setError(null);
      const result = await testAiPrompt(token, payload);
      setTestResult(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test-Prompt fehlgeschlagen');
      return null;
    } finally {
      setIsTesting(false);
    }
  };

  const clearTestResult = () => setTestResult(null);
  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    status,
    isLoading,
    isSaving,
    isTesting,
    testResult,
    error,
    successMessage,
    loadStatus,
    setActiveProvider,
    saveConfig,
    executeTest,
    clearTestResult,
    clearMessages,
  };
}
