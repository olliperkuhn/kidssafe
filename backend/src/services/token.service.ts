import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { env } from '../config/env';

export interface AdultTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  tokenType: 'ADULT';
}

export interface ChildTokenPayload {
  sessionId: string;
  codeId: string;
  code: string;
  classroomId?: string;
  role: 'CHILD';
  tokenType: 'CHILD';
}

export class TokenService {
  private readonly jwtSecret = env.JWT_SECRET;
  public readonly adultTokenExpiry = '24h';
  public readonly childTokenExpiry = '8h';

  public signAdultToken(payload: Omit<AdultTokenPayload, 'tokenType'>): string {
    const fullPayload: AdultTokenPayload = { ...payload, tokenType: 'ADULT' };
    return jwt.sign(fullPayload, this.jwtSecret, { expiresIn: this.adultTokenExpiry });
  }

  public signChildToken(payload: Omit<ChildTokenPayload, 'tokenType' | 'role'>): string {
    const fullPayload: ChildTokenPayload = {
      ...payload,
      role: 'CHILD',
      tokenType: 'CHILD',
    };
    return jwt.sign(fullPayload, this.jwtSecret, { expiresIn: this.childTokenExpiry });
  }

  public verifyAdultToken(token: string): AdultTokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as AdultTokenPayload;
      if (decoded.tokenType !== 'ADULT') return null;
      return decoded;
    } catch {
      return null;
    }
  }

  public verifyChildToken(token: string): ChildTokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as ChildTokenPayload;
      if (decoded.tokenType !== 'CHILD') return null;
      return decoded;
    } catch {
      return null;
    }
  }
}

export const tokenService = new TokenService();
