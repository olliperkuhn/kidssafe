import { Request, Response, NextFunction } from 'express';
import { healthService } from '../services/health.service';
import { HealthResponseDTO } from '../types/dto/health.dto';

export class HealthController {
  public async getHealth(_req: Request, res: Response<HealthResponseDTO>, next: NextFunction): Promise<void> {
    try {
      const status = await healthService.getHealthStatus();
      const httpCode = status.status === 'error' ? 503 : 200;
      res.status(httpCode).json(status);
    } catch (error) {
      next(error);
    }
  }
}

export const healthController = new HealthController();
