import { useState, useEffect, useCallback } from 'react';
import { ClassroomTrackingResponseDTO } from '../types';
import { fetchClassroomTracking } from '../services/trackingApi';

export function useClassroomTracking(token: string, classroomId: string | null) {
  const [liveData, setLiveData] = useState<ClassroomTrackingResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(true);

  const fetchTracking = useCallback(async () => {
    if (!classroomId || !token) return;

    try {
      const data = await fetchClassroomTracking(token, classroomId);
      setLiveData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tracking-Daten konnten nicht geladen werden');
    } finally {
      setIsLoading(false);
    }
  }, [token, classroomId]);

  useEffect(() => {
    if (!classroomId) {
      setLiveData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchTracking();

    if (!isPolling) return;

    // Polling alle 6 Sekunden
    const intervalId = setInterval(() => {
      fetchTracking();
    }, 6000);

    return () => {
      clearInterval(intervalId);
    };
  }, [classroomId, fetchTracking, isPolling]);

  return {
    liveData,
    isLoading,
    error,
    refresh: fetchTracking,
    isPolling,
    togglePolling: () => setIsPolling((prev) => !prev),
  };
}
