import { Request, Response, NextFunction } from 'express';
import { trackingService } from '../services/tracking.service';
import { heartbeatSchema, ClassroomTrackingResponseDTO } from '../types/dto/tracking.dto';
import { AppError } from '../middleware/errorHandler';

export class TrackingController {
  /**
   * Empfängt den periodischen Heartbeat von Schüler-iPads.
   */
  public async heartbeat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.childSession) {
        const error: AppError = new Error('Keine aktive Kindersitzung');
        error.statusCode = 401;
        return next(error);
      }

      const parseResult = heartbeatSchema.safeParse(req.body);
      if (!parseResult.success) {
        const error: AppError = new Error('Ungültiges Heartbeat-Format');
        error.statusCode = 400;
        return next(error);
      }

      await trackingService.recordHeartbeat(req.childSession.sessionId, parseResult.data);
      res.status(200).json({ acknowledged: true, timestamp: new Date().toISOString() });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Liefert Live-Tracking-Daten einer Klasse an die Lehrkraft.
   */
  public async getLiveStatus(
    req: Request,
    res: Response<ClassroomTrackingResponseDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        const error: AppError = new Error('Nicht authentifiziert');
        error.statusCode = 401;
        return next(error);
      }

      const rawId = req.params.classroomId;
      const classroomId = Array.isArray(rawId) ? rawId[0] : rawId;
      if (!classroomId) {
        const error: AppError = new Error('Klassen-ID erforderlich');
        error.statusCode = 400;
        return next(error);
      }

      const liveData = await trackingService.getClassroomLiveTracking(classroomId, req.user.userId);
      res.status(200).json(liveData);
    } catch (error) {
      next(error);
    }
  }
}

export const trackingController = new TrackingController();
