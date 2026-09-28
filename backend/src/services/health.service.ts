import { checkDatabaseConnection } from '../models/prisma';
import { HealthResponseDTO } from '../types/dto/health.dto';
import { env } from '../config/env';

export class HealthService {
  public async getHealthStatus(): Promise<HealthResponseDTO> {
    const isDbConnected = await checkDatabaseConnection();

    return {
      status: isDbConnected ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: env.NODE_ENV,
      service: 'kidssafe-backend',
      database: {
        connected: isDbConnected,
        message: isDbConnected ? 'PostgreSQL verbunden' : 'PostgreSQL nicht erreichbar (noch nicht gestartet)',
      },
    };
  }
}

export const healthService = new HealthService();
