import { Request, Response, NextFunction } from 'express';
import { codeService } from '../services/code.service';
import { sessionService } from '../services/session.service';
import {
  verifyCodeSchema,
  generateCodesSchema,
  createClassroomSchema,
  ChildSessionDTO,
  InviteCodeDTO,
  ClassroomDTO,
} from '../types/dto/code.dto';
import { AppError } from '../middleware/errorHandler';

export class CodeController {
  /**
   * Kind verifiziert einen Code und erhält ein Session-Token & Cookie.
   */
  public async verifyCode(req: Request, res: Response<ChildSessionDTO>, next: NextFunction): Promise<void> {
    try {
      const parseResult = verifyCodeSchema.safeParse(req.body);
      if (!parseResult.success) {
        const error: AppError = new Error(parseResult.error.errors[0]?.message ?? 'Ungültiger Code');
        error.statusCode = 400;
        return next(error);
      }

      const { sessionDto, cookieToken } = await codeService.verifyAndClaimCode(parseResult.data.code);

      // Setze Rückkehr-Cookie für das Kind auf dem iPad
      res.cookie(sessionService.cookieName, cookieToken, sessionService.getCookieOptions());

      res.status(200).json(sessionDto);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Stellt eine Kind-Sitzung aus dem Cookie wieder her.
   */
  public async resumeSession(req: Request, res: Response<ChildSessionDTO>, next: NextFunction): Promise<void> {
    try {
      const cookies = req.cookies as Record<string, string> | undefined;
      const cookieToken = cookies?.[sessionService.cookieName];

      if (!cookieToken) {
        const error: AppError = new Error('Keine aktive Sitzung im Browser gespeichert');
        error.statusCode = 404;
        return next(error);
      }

      const sessionDto = await codeService.resumeSession(cookieToken);
      if (!sessionDto) {
        res.clearCookie(sessionService.cookieName);
        const error: AppError = new Error('Die gespeicherte Sitzung ist abgelaufen');
        error.statusCode = 401;
        return next(error);
      }

      res.status(200).json(sessionDto);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Kind erstellt einen temporären 8h Gastzugang.
   */
  public async createGuest(_req: Request, res: Response<ChildSessionDTO>, next: NextFunction): Promise<void> {
    try {
      const { sessionDto, cookieToken } = await codeService.createGuestAccess();

      res.cookie(sessionService.cookieName, cookieToken, sessionService.getCookieOptions());

      res.status(201).json(sessionDto);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lehrkraft legt eine Klasse an.
   */
  public async createClassroom(req: Request, res: Response<ClassroomDTO>, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        const error: AppError = new Error('Nicht authentifiziert');
        error.statusCode = 401;
        return next(error);
      }

      const parseResult = createClassroomSchema.safeParse(req.body);
      if (!parseResult.success) {
        const error: AppError = new Error(parseResult.error.errors[0]?.message ?? 'Ungültige Klassenangaben');
        error.statusCode = 400;
        return next(error);
      }

      const classroom = await codeService.createClassroom(req.user.userId, parseResult.data);
      res.status(201).json(classroom);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lehrkraft ruft eigene Klassen ab.
   */
  public async listClassrooms(req: Request, res: Response<ClassroomDTO[]>, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        const error: AppError = new Error('Nicht authentifiziert');
        error.statusCode = 401;
        return next(error);
      }

      const classrooms = await codeService.listTeacherClassrooms(req.user.userId);
      res.status(200).json(classrooms);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lehrkraft generiert Codes für eine Klasse.
   */
  public async generateBatch(req: Request, res: Response<InviteCodeDTO[]>, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        const error: AppError = new Error('Nicht authentifiziert');
        error.statusCode = 401;
        return next(error);
      }

      const parseResult = generateCodesSchema.safeParse(req.body);
      if (!parseResult.success) {
        const error: AppError = new Error(parseResult.error.errors[0]?.message ?? 'Ungültige Generierungsangaben');
        error.statusCode = 400;
        return next(error);
      }

      const codes = await codeService.generateClassroomCodes(req.user.userId, parseResult.data);
      res.status(201).json(codes);
    } catch (error) {
      next(error);
    }
  }
}

export const codeController = new CodeController();
