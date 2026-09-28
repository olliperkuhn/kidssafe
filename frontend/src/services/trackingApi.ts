import { ClassroomTrackingResponseDTO, HeartbeatPayload } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Sendet periodischen Heartbeat vom Schüler-iPad an den Server.
 */
export async function sendStudentHeartbeat(payload: HeartbeatPayload, token?: string): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/tracking/heartbeat`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Heartbeat fehlgeschlagen');
  }
}

/**
 * Fragt die Live-Tracking-Daten einer Klasse für die Lehrkraft ab.
 */
export async function fetchClassroomTracking(
  token: string,
  classroomId: string
): Promise<ClassroomTrackingResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/tracking/classroom/${classroomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Live-Daten konnten nicht geladen werden');
  }

  return data as ClassroomTrackingResponseDTO;
}
