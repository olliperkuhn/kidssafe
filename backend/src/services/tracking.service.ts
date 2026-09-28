import { prisma } from '../models/prisma';
import {
  HeartbeatRequestDTO,
  ClassroomTrackingResponseDTO,
  StudentTrackingItemDTO,
  StudentActivityStatus,
} from '../types/dto/tracking.dto';
import { AppError } from '../middleware/errorHandler';

export class TrackingService {
  private readonly onlineThresholdSeconds = 300; // 5 Minuten Inaktivitätsschwelle

  /**
   * Zeichnet den Heartbeat eines Schüler-iPads auf.
   * Streng datenschutzkonform: Speichert ausschließlich Modul-ID und Zählerstand.
   */
  public async recordHeartbeat(sessionId: string, dto: HeartbeatRequestDTO): Promise<void> {
    const session = await prisma.childSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      const error: AppError = new Error('Sitzung nicht gefunden');
      error.statusCode = 404;
      throw error;
    }

    await prisma.childSession.update({
      where: { id: sessionId },
      data: {
        lastActiveAt: new Date(),
        ...(dto.activeModule !== undefined ? { activeModule: dto.activeModule } : {}),
        ...(dto.completedScenarios !== undefined ? { completedScenarios: dto.completedScenarios } : {}),
        ...(dto.totalScenarios !== undefined ? { totalScenarios: dto.totalScenarios } : {}),
      },
    });
  }

  /**
   * Liefert das Live-Tracking für eine Schulklasse an die Lehrkraft.
   */
  public async getClassroomLiveTracking(
    classroomId: string,
    teacherId: string
  ): Promise<ClassroomTrackingResponseDTO> {
    const classroom = await prisma.classroom.findFirst({
      where: { id: classroomId, teacherId },
      include: {
        codes: {
          include: {
            sessions: {
              orderBy: { lastActiveAt: 'desc' },
              take: 1, // Letzte Sitzung
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!classroom) {
      const error: AppError = new Error('Klasse nicht gefunden oder keine Zugriffsberechtigung');
      error.statusCode = 404;
      throw error;
    }

    const now = Date.now();
    let activeCodes = 0;
    let completedCodes = 0;

    const students: StudentTrackingItemDTO[] = classroom.codes.map((codeItem) => {
      const latestSession = codeItem.sessions[0];
      const hasSession = Boolean(latestSession);

      const lastActiveMs = latestSession ? latestSession.lastActiveAt.getTime() : 0;
      const secondsAgo = hasSession ? Math.max(0, Math.floor((now - lastActiveMs) / 1000)) : 999999;

      const completed = latestSession?.completedScenarios ?? 0;
      const total = latestSession?.totalScenarios ?? 0;
      const progressPercent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

      let status: StudentActivityStatus = 'OFFLINE';
      if (total > 0 && completed >= total) {
        status = 'COMPLETED';
        completedCodes++;
      } else if (hasSession && secondsAgo <= this.onlineThresholdSeconds) {
        status = 'ONLINE';
        activeCodes++;
      }

      return {
        codeId: codeItem.id,
        code: codeItem.code,
        label: codeItem.label || codeItem.code,
        status,
        lastActiveSecondsAgo: secondsAgo,
        activeModule: latestSession?.activeModule ?? undefined,
        completedScenarios: completed,
        totalScenarios: total,
        progressPercent,
      };
    });

    return {
      classroomId: classroom.id,
      classroomName: classroom.name,
      totalCodes: classroom.codes.length,
      activeCodes,
      completedCodes,
      students,
    };
  }
}

export const trackingService = new TrackingService();
