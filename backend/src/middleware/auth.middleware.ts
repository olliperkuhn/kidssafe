import { Request, Response, NextFunction } from 'express';
import { tokenService, AdultTokenPayload, ChildTokenPayload } from '../services/token.service';
import { sessionService } from '../services/session.service';
import { UserRole } from '@prisma/client';
import { AppError } from './errorHandler';

// Typerweiterung für Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AdultTokenPayload;
      childSession?: ChildTokenPayload;
    }
  }
}

/**
 * Authentifiziert erwachsene Benutzer (Lehrkräfte & Eltern) via Bearer JWT.
 */
export function authenticateAdult(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error: AppError = new Error('Authentifizierung erforderlich (Bearer Token fehlt)');
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    const error: AppError = new Error('Ungültiges Token-Format');
    error.statusCode = 401;
    return next(error);
  }

  const payload = tokenService.verifyAdultToken(token);
  if (!payload) {
    const error: AppError = new Error('Sitzung abgelaufen oder ungültiges Token');
    error.statusCode = 401;
    return next(error);
  }

  req.user = payload;
  next();
}

/**
 * Stellt sicher, dass der authentifizierte Benutzer eine der geforderten Rollen besitzt.
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      const error: AppError = new Error('Nicht authentifiziert');
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error: AppError = new Error(`Zugriff verweigert: Diese Aktion erfordert eine der folgenden Rollen: ${roles.join(', ')}`);
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
}

/**
 * Authentifiziert Kinder über Bearer Token ODER gesetztes Cookie.
 */
export function authenticateChild(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (token) {
    const payload = tokenService.verifyChildToken(token);
    if (payload) {
      req.childSession = payload;
      return next();
    }
  }

  // Fallback: Prüfe auf gesetztes Cookie
  const cookies = req.cookies as Record<string, string> | undefined;
  const cookieToken = cookies?.[sessionService.cookieName];
  if (cookieToken) {
    // Session token aus DB asynchron prüfen
    sessionService.getActiveSession(cookieToken).then((session) => {
      if (session) {
        req.childSession = {
          sessionId: session.id,
          codeId: session.code.id,
          code: session.code.code,
          classroomId: session.code.classroomId ?? undefined,
          role: 'CHILD',
          tokenType: 'CHILD',
        };
        return next();
      }
      const error: AppError = new Error('Kindersitzung abgelaufen');
      error.statusCode = 401;
      return next(error);
    }).catch(next);
    return;
  }

  const error: AppError = new Error('Kein gültiger Kind-Zugang gefunden');
  error.statusCode = 401;
  next(error);
}
