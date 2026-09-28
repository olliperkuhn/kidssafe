import { useEffect, useRef } from 'react';
import { sendStudentHeartbeat } from '../services/trackingApi';
import { HeartbeatPayload } from '../types';

export function useStudentHeartbeat(payload: HeartbeatPayload, sessionToken?: string) {
  const payloadRef = useRef(payload);
  payloadRef.current = payload;

  useEffect(() => {
    let isCancelled = false;

    const triggerHeartbeat = async () => {
      try {
        await sendStudentHeartbeat(payloadRef.current, sessionToken);
      } catch {
        // Ignoriere Netzwerk-Glitsches im Hintergrund leise
      }
    };

    // Sofortiger initialer Heartbeat
    triggerHeartbeat();

    // Periodischer Heartbeat alle 30 Sekunden
    const intervalId = setInterval(() => {
      if (!isCancelled) {
        triggerHeartbeat();
      }
    }, 30000);

    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [sessionToken]);
}
