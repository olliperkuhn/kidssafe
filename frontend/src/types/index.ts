export interface HealthStatusDTO {
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

export type UserRole = 'PARENT' | 'TEACHER' | 'ADMIN';

export type UserMode = 'CHILD' | 'PARENT' | 'TEACHER';
