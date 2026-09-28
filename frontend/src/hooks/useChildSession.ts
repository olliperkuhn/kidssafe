import { useState, useEffect, useCallback } from 'react';
import { ChildSessionDTO } from '../types';
import { verifyChildCode, resumeChildSession, createGuestSession } from '../services/codeApi';

export function useChildSession() {
  const [session, setSession] = useState<ChildSessionDTO | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Automatischer Cookie-Check beim Laden der App
  useEffect(() => {
    let isMounted = true;

    async function checkCookieSession() {
      try {
        const resumedSession = await resumeChildSession();
        if (isMounted && resumedSession) {
          setSession(resumedSession);
        }
      } catch {
        // Kein aktives Cookie vorhanden oder abgelaufen -> Verbleibe auf Startseite
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    checkCookieSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginWithCode = useCallback(async (code: string): Promise<ChildSessionDTO> => {
    setIsLoading(true);
    setError(null);
    try {
      const newSession = await verifyChildCode(code);
      setSession(newSession);
      return newSession;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ungültiger Code';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startGuest = useCallback(async (): Promise<ChildSessionDTO> => {
    setIsLoading(true);
    setError(null);
    try {
      const guestSession = await createGuestSession();
      setSession(guestSession);
      return guestSession;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gastzugang konnte nicht gestartet werden';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const leaveSession = useCallback(() => {
    // Lösche Client-Zustand (Cookie verfällt nach 8h oder wird bei neuem Code überschrieben)
    setSession(null);
    setError(null);
  }, []);

  return {
    session,
    isCheckingSession,
    isLoading,
    error,
    loginWithCode,
    startGuest,
    leaveSession,
  };
}
