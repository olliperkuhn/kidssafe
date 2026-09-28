import { HealthStatusDTO } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function fetchHealthStatus(): Promise<HealthStatusDTO> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Healthcheck fehlgeschlagen mit Status: ${response.status}`);
  }

  const data: HealthStatusDTO = await response.json();
  return data;
}
