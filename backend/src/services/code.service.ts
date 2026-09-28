import crypto from 'crypto';
import { prisma } from '../models/prisma';
import { sessionService } from './session.service';
import { tokenService } from './token.service';
import {
  ChildSessionDTO,
  GenerateCodesRequestDTO,
  InviteCodeDTO,
  CreateClassroomRequestDTO,
  ClassroomDTO,
} from '../types/dto/code.dto';
import { AppError } from '../middleware/errorHandler';
import { CodeStatus, CodeType } from '@prisma/client';

export class CodeService {
  // Zeichensatz ohne verwechslungsanfällige Zeichen (kein O, 0, I, 1, L)
  private readonly charset = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

  /**
   * Validiert einen Zugangscode eines Kindes und erstellt eine persistierte 8-Stunden-Sitzung.
   */
  public async verifyAndClaimCode(codeString: string): Promise<{ sessionDto: ChildSessionDTO; cookieToken: string }> {
    const cleanCode = codeString.trim().toUpperCase();

    const inviteCode = await prisma.inviteCode.findUnique({
      where: { code: cleanCode },
    });

    if (!inviteCode) {
      const error: AppError = new Error('Dieser Zugangscode existiert nicht. Bitte prüfe deine Eingabe.');
      error.statusCode = 404;
      throw error;
    }

    if (inviteCode.status !== CodeStatus.ACTIVE) {
      const error: AppError = new Error('Dieser Code ist nicht mehr aktiv oder wurde bereits beendet.');
      error.statusCode = 400;
      throw error;
    }

    if (inviteCode.expiresAt && new Date() > inviteCode.expiresAt) {
      await prisma.inviteCode.update({
        where: { id: inviteCode.id },
        data: { status: CodeStatus.EXPIRED },
      });
      const error: AppError = new Error('Dieser Code ist abgelaufen. Bitte frage nach einem neuen Code.');
      error.statusCode = 400;
      throw error;
    }

    // Persistierte Sitzung erstellen
    const session = await sessionService.createSession(inviteCode.id);

    // JWT-Token für Client-Header signieren
    const token = tokenService.signChildToken({
      sessionId: session.id,
      codeId: inviteCode.id,
      code: inviteCode.code,
      classroomId: inviteCode.classroomId ?? undefined,
    });

    return {
      sessionDto: {
        sessionToken: token,
        code: inviteCode.code,
        type: inviteCode.type,
        classroomId: inviteCode.classroomId ?? undefined,
        avatarId: inviteCode.avatarId ?? undefined,
        expiresAt: session.expiresAt.toISOString(),
      },
      cookieToken: session.sessionToken,
    };
  }

  /**
   * Stellt eine existierende Sitzung anhand des Cookies wieder her.
   */
  public async resumeSession(cookieToken: string): Promise<ChildSessionDTO | null> {
    const session = await sessionService.getActiveSession(cookieToken);
    if (!session) return null;

    const token = tokenService.signChildToken({
      sessionId: session.id,
      codeId: session.code.id,
      code: session.code.code,
      classroomId: session.code.classroomId ?? undefined,
    });

    return {
      sessionDto: {
        sessionToken: token,
        code: session.code.code,
        type: session.code.type,
        classroomId: session.code.classroomId ?? undefined,
        avatarId: session.code.avatarId ?? undefined,
        expiresAt: session.expiresAt.toISOString(),
      },
    }.sessionDto;
  }

  /**
   * Erstellt einen temporären Gastzugang für 8 Stunden.
   */
  public async createGuestAccess(): Promise<{ sessionDto: ChildSessionDTO; cookieToken: string }> {
    const guestCodeStr = `GAST-${this.generateRandomCodePart(4)}`;
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

    const inviteCode = await prisma.inviteCode.create({
      data: {
        code: guestCodeStr,
        type: CodeType.GUEST,
        status: CodeStatus.ACTIVE,
        expiresAt,
      },
    });

    const session = await sessionService.createSession(inviteCode.id);
    const token = tokenService.signChildToken({
      sessionId: session.id,
      codeId: inviteCode.id,
      code: inviteCode.code,
    });

    return {
      sessionDto: {
        sessionToken: token,
        code: inviteCode.code,
        type: inviteCode.type,
        expiresAt: session.expiresAt.toISOString(),
      },
      cookieToken: session.sessionToken,
    };
  }

  /**
   * Generiert ein Kontingent an Codes für eine Schulklasse (nur für Lehrkräfte).
   */
  public async generateClassroomCodes(teacherId: string, dto: GenerateCodesRequestDTO): Promise<InviteCodeDTO[]> {
    const classroom = await prisma.classroom.findFirst({
      where: { id: dto.classroomId, teacherId },
    });

    if (!classroom) {
      const error: AppError = new Error('Klasse nicht gefunden oder keine Zugriffsberechtigung');
      error.statusCode = 404;
      throw error;
    }

    const prefix = dto.prefix ? dto.prefix.trim().toUpperCase() : 'SAFE';
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 Tage gültig
    const createdCodes: InviteCodeDTO[] = [];

    for (let i = 0; i < dto.count; i++) {
      const codeStr = `${prefix}-${this.generateRandomCodePart(3)}-${this.generateRandomCodePart(2)}`;
      
      const created = await prisma.inviteCode.create({
        data: {
          code: codeStr,
          type: CodeType.STUDENT_CLASS,
          status: CodeStatus.ACTIVE,
          classroomId: classroom.id,
          creatorId: teacherId,
          expiresAt,
        },
      });

      createdCodes.push({
        id: created.id,
        code: created.code,
        type: created.type,
        status: created.status,
        classroomId: created.classroomId ?? undefined,
        createdAt: created.createdAt.toISOString(),
        expiresAt: created.expiresAt ? created.expiresAt.toISOString() : undefined,
      });
    }

    return createdCodes;
  }

  /**
   * Legt eine pseudonymisierte Klasse für eine Lehrkraft an.
   */
  public async createClassroom(teacherId: string, dto: CreateClassroomRequestDTO): Promise<ClassroomDTO> {
    const classroom = await prisma.classroom.create({
      data: {
        name: dto.name.trim(),
        teacherId,
      },
      include: {
        _count: {
          select: { codes: true },
        },
      },
    });

    return {
      id: classroom.id,
      name: classroom.name,
      teacherId: classroom.teacherId,
      codeCount: classroom._count.codes,
      createdAt: classroom.createdAt.toISOString(),
    };
  }

  /**
   * Listet alle Klassen einer Lehrkraft auf.
   */
  public async listTeacherClassrooms(teacherId: string): Promise<ClassroomDTO[]> {
    const classrooms = await prisma.classroom.findMany({
      where: { teacherId },
      include: {
        _count: { select: { codes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return classrooms.map((c) => ({
      id: c.id,
      name: c.name,
      teacherId: c.teacherId,
      codeCount: c._count.codes,
      createdAt: c.createdAt.toISOString(),
    }));
  }

  private generateRandomCodePart(length: number): string {
    const bytes = crypto.randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
      const byte = bytes[i];
      if (byte !== undefined) {
        result += this.charset[byte % this.charset.length];
      }
    }
    return result;
  }
}

export const codeService = new CodeService();
