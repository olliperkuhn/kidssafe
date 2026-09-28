export interface HealthResponseDTO {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  service: string;
  database: {
    connected: boolean;
    message?: string;
  };
}
