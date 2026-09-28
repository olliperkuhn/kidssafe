import { CookieOptions } from 'express';
import crypto from 'crypto';
import { prisma } from '../models/prisma';
import { env } from '../config/env';
import { ChildSession, InviteCode } from '@prisma/client';

export class SessionService {
  public static readonly COOKIE_NAME = 'kidssafe_child_session';
  public readonly cookieName = SessionService.COOKIE_NAME;
  public static readonly SESSION_DURATION_HOURS = 8;

  public getCookieOptions(): CookieOptions {
    const isProduction = env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: SessionService.SESSION_DURATION_HOURS * 60 * 60 * 1000, // 8 Stunden
      path: '/',
    };
  }

  /**
   * Erstellt eine persistierte Kindersitzung in der Datenbank.
   */
  public async createSession(codeId: string): Promise<ChildSession & { code: InviteCode }> {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SessionService.SESSION_DURATION_HOURS * 60 * 60 * 1000);

    return prisma.childSession.create({
      data: {
        codeId,
        sessionToken,
        expiresAt,
      },
      include: {
        code: true,
      },
    });
  }

  /**
   * Findet eine aktive, noch nicht abgelaufene Sitzung und aktualisiert den Aktivitätszeitstempel.
   */
  public async getActiveSession(sessionToken: string): Promise<(ChildSession & { code: InviteCode }) | null> {
    const session = await prisma.childSession.findUnique({
      where: { sessionToken },
      include: { code: true },
    });

    if (!session) return null;

    if (new Date() > session.expiresAt) {
      await prisma.childSession.delete({ where: { id: session.id } }).catch(() => null);
      return null;
    }

    // Aktualisiere lastActiveAt
    await prisma.childSession.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() },
    });

    return session;
  }
}

export const sessionService = new SessionService();
